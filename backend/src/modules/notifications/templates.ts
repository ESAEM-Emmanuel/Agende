import { Appointment, User, Participant } from '@prisma/client';

const typeLabels: Record<string, string> = {
  REUNION: 'Réunion', DEJEUNER: 'Déjeuner', VISITE: 'Visite',
  VISIO: 'Visioconférence', PERSO: 'Personnel', AUTRE: 'Autre',
};

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmé', PENDING: 'En attente', CANCELLED: 'Annulé', DONE: 'Terminé',
};

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function createAppointmentTemplate(
  appointment: Appointment & { participants: Participant[]; director: User; createdBy: User }
) {
  const participantList = appointment.participants
    .map(p => `• ${p.name}${p.email ? ` (${p.email})` : ''}${p.isExternal ? ' — Externe' : ''}`)
    .join('<br>') || 'Aucun participant';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#1e3a5f;color:#fff;padding:20px 28px;">
        <h2 style="margin:0;font-size:20px;">📅 Nouveau rendez-vous</h2>
        <p style="margin:6px 0 0;opacity:0.9;font-size:14px;">Créé par ${appointment.createdBy.firstName} ${appointment.createdBy.lastName}</p>
      </div>
      <div style="padding:24px 28px;color:#1e293b;">
        <h3 style="margin-top:0;color:#1e3a5f;">${appointment.title}</h3>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#64748b;width:120px;">📆 Date</td><td style="padding:8px 0;font-weight:600;">${formatDate(appointment.date)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">🕐 Horaire</td><td style="padding:8px 0;font-weight:600;">${appointment.startTime} → ${appointment.endTime}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">📍 Lieu</td><td style="padding:8px 0;font-weight:600;">${appointment.location || 'Non précisé'}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">📋 Type</td><td style="padding:8px 0;font-weight:600;">${typeLabels[appointment.type] || appointment.type}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">🎯 Statut</td><td style="padding:8px 0;font-weight:600;">${statusLabels[appointment.status] || appointment.status}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">👔 Directeur</td><td style="padding:8px 0;font-weight:600;">${appointment.director.firstName} ${appointment.director.lastName}</td></tr>
        </table>

        <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;">
          <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:8px;">Participants</div>
          <div style="font-size:14px;line-height:1.6;">${participantList}</div>
        </div>

        ${appointment.notes ? `
        <div style="margin-top:20px;padding:16px;background:#fef3c7;border-radius:8px;">
          <div style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;margin-bottom:8px;">Notes / Briefing</div>
          <div style="font-size:14px;color:#78350f;">${appointment.notes.replace(/\n/g, '<br>')}</div>
        </div>
        ` : ''}

        <div style="margin-top:24px;text-align:center;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Voir l'agenda</a>
        </div>
      </div>
      <div style="background:#f8fafc;padding:16px 28px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;">
        Agenda Assistant de Direction — Ne pas répondre à cet email
      </div>
    </div>
  `;

  return { subject: `📅 Nouveau RDV : ${appointment.title}`, html };
}

export function statusChangeTemplate(
  appointment: Appointment & { participants: Participant[]; director: User },
  oldStatus: string,
  updatedBy: User
) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#f59e0b;color:#fff;padding:20px 28px;">
        <h2 style="margin:0;font-size:20px;">🔄 Modification de statut</h2>
        <p style="margin:6px 0 0;opacity:0.9;font-size:14px;">Mis à jour par ${updatedBy.firstName} ${updatedBy.lastName}</p>
      </div>
      <div style="padding:24px 28px;color:#1e293b;">
        <h3 style="margin-top:0;color:#1e3a5f;">${appointment.title}</h3>
        
        <div style="padding:16px;background:#f8fafc;border-radius:8px;margin:16px 0;text-align:center;">
          <div style="font-size:12px;color:#64748b;margin-bottom:8px;">Changement de statut</div>
          <div style="display:inline-flex;align-items:center;gap:12px;">
            <span style="padding:6px 16px;background:#e2e8f0;border-radius:20px;font-size:14px;font-weight:600;color:#475569;">${statusLabels[oldStatus] || oldStatus}</span>
            <span style="font-size:20px;">→</span>
            <span style="padding:6px 16px;background:#dbeafe;border-radius:20px;font-size:14px;font-weight:600;color:#1e40af;">${statusLabels[appointment.status] || appointment.status}</span>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#64748b;width:120px;">📆 Date</td><td style="padding:8px 0;font-weight:600;">${formatDate(appointment.date)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">🕐 Horaire</td><td style="padding:8px 0;font-weight:600;">${appointment.startTime} → ${appointment.endTime}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">📍 Lieu</td><td style="padding:8px 0;font-weight:600;">${appointment.location || 'Non précisé'}</td></tr>
        </table>

        <div style="margin-top:24px;text-align:center;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Voir l'agenda</a>
        </div>
      </div>
    </div>
  `;

  return { subject: `🔄 Statut modifié : ${appointment.title}`, html };
}

export function adminAlertTemplate(
  appointment: Appointment & { director: User; participants: Participant[] },
  hoursBefore: number
) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#dc2626;color:#fff;padding:20px 28px;">
        <h2 style="margin:0;font-size:20px;">⏰ Rappel : Rendez-vous imminent</h2>
        <p style="margin:6px 0 0;opacity:0.9;font-size:14px;">Dans moins de ${hoursBefore} heure(s)</p>
      </div>
      <div style="padding:24px 28px;color:#1e293b;">
        <h3 style="margin-top:0;color:#dc2626;">${appointment.title}</h3>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#64748b;width:120px;">📆 Date</td><td style="padding:8px 0;font-weight:600;">${formatDate(appointment.date)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">🕐 Horaire</td><td style="padding:8px 0;font-weight:600;">${appointment.startTime} → ${appointment.endTime}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">📍 Lieu</td><td style="padding:8px 0;font-weight:600;">${appointment.location || 'Non précisé'}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">👔 Directeur</td><td style="padding:8px 0;font-weight:600;">${appointment.director.firstName} ${appointment.director.lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">📋 Type</td><td style="padding:8px 0;font-weight:600;">${typeLabels[appointment.type] || appointment.type}</td></tr>
        </table>

        <div style="margin-top:24px;text-align:center;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Voir l'agenda</a>
        </div>
      </div>
    </div>
  `;

  return { subject: `⏰ Rappel RDV dans ${hoursBefore}h : ${appointment.title}`, html };
}