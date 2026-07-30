import { StatsRepository } from './stats.repository';

export class StatsService {
  constructor(private readonly repo: StatsRepository) {}

  async getStats(directorId?: string, year?: number) {
    const appointments = await this.repo.getAppointments({ directorId, year });
    const now = new Date();

    // ─── Vue d'ensemble ───
    const overview = {
      total: appointments.length,
      thisMonth: appointments.filter(a => {
        const d = new Date(a.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length,
      thisYear: appointments.filter(a => new Date(a.date).getFullYear() === now.getFullYear()).length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
      totalHours: Math.round(appointments.reduce((sum, a) => sum + this.getDuration(a), 0) * 10) / 10,
    };

    // ─── Par Directeur ───
    const directorMap = new Map();
    appointments.forEach(a => {
      const key = a.directorId;
      const name = `${a.director.firstName} ${a.director.lastName}`;
      if (!directorMap.has(key)) {
        directorMap.set(key, { directorId: key, directorName: name, count: 0, hours: 0 });
      }
      const entry = directorMap.get(key);
      entry.count++;
      entry.hours += this.getDuration(a);
    });
    const byDirector = Array.from(directorMap.values())
      .sort((a, b) => b.count - a.count)
      .map(d => ({ ...d, hours: Math.round(d.hours * 10) / 10 }));

    // ─── Par Année / Mois ───
    const timeMap = new Map();
    appointments.forEach(a => {
      const d = new Date(a.date);
      const key = year ? d.getMonth() : d.getFullYear();
      const label = year ? this.getMonthName(d.getMonth()) : d.getFullYear().toString();
      
      if (!timeMap.has(key)) {
        timeMap.set(key, { key, label, count: 0, hours: 0 });
      }
      const entry = timeMap.get(key);
      entry.count++;
      entry.hours += this.getDuration(a);
    });
    const byTimeline = Array.from(timeMap.values())
      .sort((a, b) => a.key - b.key)
      .map(t => ({ ...t, hours: Math.round(t.hours * 10) / 10 }));

    // ─── Par Acteur (Participant) ───
    const participantMap = new Map();
    appointments.forEach(a => {
      a.participants.forEach(p => {
        const key = p.name;
        if (!participantMap.has(key)) {
          participantMap.set(key, { 
            name: key, 
            email: p.email, 
            isExternal: p.isExternal, 
            count: 0,
            hours: 0,
          });
        }
        const entry = participantMap.get(key);
        entry.count++;
        entry.hours += this.getDuration(a);
      });
    });
    const byParticipant = Array.from(participantMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map(p => ({ ...p, hours: Math.round(p.hours * 10) / 10 }));

    // ─── Par Type ───
    const typeMap = new Map();
    appointments.forEach(a => {
      if (!typeMap.has(a.type)) {
        typeMap.set(a.type, { type: a.type, label: this.getTypeLabel(a.type), count: 0, hours: 0 });
      }
      const entry = typeMap.get(a.type);
      entry.count++;
      entry.hours += this.getDuration(a);
    });
    const byType = Array.from(typeMap.values())
      .map(t => ({ ...t, hours: Math.round(t.hours * 10) / 10 }));

    return { overview, byDirector, byTimeline, byParticipant, byType };
  }

  private getDuration(a: any): number {
    const [sh, sm] = a.startTime.split(':').map(Number);
    const [eh, em] = a.endTime.split(':').map(Number);
    return (eh * 60 + em - sh * 60 - sm) / 60;
  }

  private getMonthName(m: number): string {
    return ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'][m];
  }

  private getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      REUNION: 'Réunion', DEJEUNER: 'Déjeuner', VISITE: 'Visite',
      VISIO: 'Visioconférence', PERSO: 'Personnel', AUTRE: 'Autre',
    };
    return labels[type] || type;
  }
}