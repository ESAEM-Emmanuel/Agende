import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentInput, UpdateAppointmentInput } from './appointment.types';
import { AppError } from '../../shared/errors/AppError';
import { NotificationService } from '../notifications/notification.service';
import { EmailService } from '../notifications/email.service';
import { prisma } from '../../config/prisma';

export class AppointmentService {
  private notificationService: NotificationService;

  constructor(private readonly repo: AppointmentRepository) {
    this.notificationService = new NotificationService(new EmailService());
  }

  async listByRange(directorId: string, start: string, end: string) {
    return this.repo.findByDateRange(directorId, start, end);
  }

  async create(data: CreateAppointmentInput, createdById: string) {
    const conflicts = await this.repo.checkConflicts(data.directorId, data.date, data.startTime, data.endTime);
    if (conflicts > 0) throw new AppError('Conflit d\'horaire détecté', 409, 'SCHEDULE_CONFLICT');
    
    const appointment = await this.repo.create({ ...data, createdById });

    // Enrichir pour l'email
    const fullAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: { participants: true, director: true, createdBy: true },
    });

    if (fullAppointment) {
      this.notificationService.notifyNewAppointment(fullAppointment as any).catch(console.error);
    }

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentInput, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Rendez-vous introuvable', 404);
    if (existing.createdById !== userId) throw new AppError('Non autorisé', 403);

    const oldStatus = existing.status;

    const dateStr = data.date || existing.date.toISOString().split('T')[0];
    const startT = data.startTime || existing.startTime;
    const endT = data.endTime || existing.endTime;

    const conflicts = await this.repo.checkConflicts(
      existing.directorId,
      dateStr,
      startT,
      endT,
      id
    );
    if (conflicts > 0) throw new AppError('Conflit d\'horaire détecté', 409);

    const appointment = await this.repo.update(id, data);

    // Si le statut a changé, notifier
    if (data.status && data.status !== oldStatus) {
      const fullAppointment = await prisma.appointment.findUnique({
        where: { id: appointment.id },
        include: { participants: true, director: true },
      });

      if (fullAppointment) {
        const updater = await prisma.user.findUnique({ where: { id: userId } });
        this.notificationService.notifyStatusChange(
          fullAppointment as any,
          oldStatus,
          updater!
        ).catch(console.error);
      }
    }

    return appointment;
  }

  async delete(id: string, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError('Rendez-vous introuvable', 404);
    if (existing.createdById !== userId) throw new AppError('Non autorisé', 403);
    return this.repo.delete(id);
  }
}