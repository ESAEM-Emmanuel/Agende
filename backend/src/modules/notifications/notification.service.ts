import { Appointment, User, Participant } from '@prisma/client';
import { EmailService } from './email.service';
import { createAppointmentTemplate, statusChangeTemplate, adminAlertTemplate } from './templates';
import { prisma } from '../../config/env';

type AppointmentWithRelations = Appointment & {
  participants: Participant[];
  director: User;
  createdBy: User;
};

export class NotificationService {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Notifie création d'un RDV : directeur + participants avec email
   */
  async notifyNewAppointment(appointment: AppointmentWithRelations) {
    const recipients: string[] = [];

    // Directeur
    if (appointment.director.email) {
      recipients.push(appointment.director.email);
    }

    // Participants avec email
    appointment.participants
      .filter(p => p.email && p.email.trim())
      .forEach(p => recipients.push(p.email!));

    if (recipients.length === 0) return;

    const { subject, html } = createAppointmentTemplate(appointment);
    await this.emailService.send(recipients, subject, html);
  }

  /**
   * Notifie changement de statut : directeur + participants avec email
   */
  async notifyStatusChange(
    appointment: AppointmentWithRelations,
    oldStatus: string,
    updatedBy: User
  ) {
    const recipients: string[] = [];

    if (appointment.director.email) recipients.push(appointment.director.email);
    appointment.participants
      .filter(p => p.email && p.email.trim())
      .forEach(p => recipients.push(p.email!));

    if (recipients.length === 0) return;

    const { subject, html } = statusChangeTemplate(appointment, oldStatus, updatedBy);
    await this.emailService.send(recipients, subject, html);
  }

  /**
   * Rappels aux admins pour les RDV à venir
   */
//   async sendAdminAlerts(hoursBefore: number = 24) {
//     const now = new Date();
//     const alertTime = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);

//     // RDV confirmés qui ont lieu dans [now, now + hoursBefore]
//     const upcomingAppointments = await prisma.appointment.findMany({
//       where: {
//         status: 'CONFIRMED',
//         date: {
//           gte: new Date(now.toISOString().split('T')[0] + 'T00:00:00.000Z'),
//           lte: new Date(alertTime.toISOString().split('T')[0] + 'T23:59:59.999Z'),
//         },
//       },
//       include: {
//         participants: true,
//         director: true,
//       },
//     });

//     // Filtrer ceux dont l'heure de début est dans la fenêtre d'alerte
//     const alertThreshold = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);
    
//     const toAlert = upcomingAppointments.filter(appt => {
//       const [h, m] = appt.startTime.split(':').map(Number);
//       const apptDateTime = new Date(appt.date);
//       apptDateTime.setHours(h, m, 0, 0);
//       return apptDateTime > now && apptDateTime <= alertThreshold;
//     });

//     if (toAlert.length === 0) return;

//     // Récupérer les admins
//     const admins = await prisma.user.findMany({
//       where: { role: 'ADMIN', isActive: true },
//       select: { email: true },
//     });

//     const adminEmails = admins.map(a => a.email).filter(Boolean) as string[];
//     if (adminEmails.length === 0) return;

//     for (const appointment of toAlert) {
//       const { subject, html } = adminAlertTemplate(appointment as any, hoursBefore);
//       await this.emailService.send(adminEmails, subject, html);
//     }

//     console.log(`⏰ ${toAlert.length} rappel(s) envoyé(s) aux admins`);
//   }
  /**
   * Rappels aux admins ET assistants pour les RDV à venir
   */
  async sendAdminAlerts(hoursBefore: number = 24) {
    const now = new Date();
    const alertTime = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        status: 'CONFIRMED',
        date: {
          gte: new Date(now.toISOString().split('T')[0] + 'T00:00:00.000Z'),
          lte: new Date(alertTime.toISOString().split('T')[0] + 'T23:59:59.999Z'),
        },
      },
      include: {
        participants: true,
        director: true,
      },
    });

    const alertThreshold = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);
    
    const toAlert = upcomingAppointments.filter(appt => {
      const [h, m] = appt.startTime.split(':').map(Number);
      const apptDateTime = new Date(appt.date);
      apptDateTime.setHours(h, m, 0, 0);
      return apptDateTime > now && apptDateTime <= alertThreshold;
    });

    if (toAlert.length === 0) return;

    // ← CORRECTION : récupère admins ET assistants
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'ASSISTANT'] },
        isActive: true,
      },
      select: { email: true, firstName: true, lastName: true, role: true },
    });

    const staffEmails = staff.map(s => s.email).filter(Boolean) as string[];
    if (staffEmails.length === 0) return;

    for (const appointment of toAlert) {
      const { subject, html } = adminAlertTemplate(appointment as any, hoursBefore);
      await this.emailService.send(staffEmails, subject, html);
    }

    console.log(`⏰ ${toAlert.length} rappel(s) envoyé(s) à ${staff.length} admin(s)/assistant(s)`);
  }
}