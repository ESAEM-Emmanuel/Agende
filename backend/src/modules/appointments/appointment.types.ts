import { z } from 'zod';
import { AppointmentType, AppointmentStatus, Priority } from '@prisma/client';

export const participantSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal('')),
  isExternal: z.boolean().optional(),
});

export const createAppointmentSchema = z.object({
  title: z.string().min(2).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  location: z.string().optional(),
  type: z.nativeEnum(AppointmentType),
  status: z.nativeEnum(AppointmentStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  notes: z.string().optional(),
  directorId: z.string().uuid(),
  participants: z.array(participantSchema).optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;