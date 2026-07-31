import { prisma } from '../../config/prisma';
import { CreateAppointmentInput, UpdateAppointmentInput } from './appointment.types';

export class AppointmentRepository {
  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { participants: true, createdBy: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findByDateRange(directorId: string, startStr: string, endStr: string) {
    return prisma.appointment.findMany({
      where: {
        directorId,
        date: {
          gte: new Date(startStr + 'T00:00:00.000Z'),
          lte: new Date(endStr + 'T23:59:59.999Z'),
        },
      },
      include: { participants: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async create(data: CreateAppointmentInput & { createdById: string }) {
    const { participants, date, ...rest } = data;
    return prisma.appointment.create({
      data: {
        ...rest,
        date: new Date(date + 'T00:00:00.000Z'),
        participants: participants ? { createMany: { data: participants } } : undefined,
      },
      include: { participants: true },
    });
  }

//   async update(id: string, data: UpdateAppointmentInput) {
//     // On isole les participants et on nettoie les champs interdits
//     const { participants, date, id: _id, createdAt, updatedAt, createdById, directorId, ...rest } = data as any;

//     const updateData: any = { ...rest };
    
//     // Conversion de la date string YYYY-MM-DD en DateTime
//     if (date) {
//       updateData.date = new Date(date + 'T00:00:00.000Z');
//     }

//     // Gestion des participants : on supprime les anciens et on recrée
//     if (participants) {
//       updateData.participants = { deleteMany: {}, createMany: { data: participants } };
//     }

//     return prisma.appointment.update({
//       where: { id },
//       data: updateData,
//       include: { participants: true },
//     });
//   }
  async update(id: string, data: UpdateAppointmentInput) {
    // On isole les participants et on nettoie les champs interdits
    const { participants, date, id: _id, createdAt, updatedAt, createdById, directorId, ...rest } = data as any;

    const updateData: any = { ...rest };
    
    // Conversion de la date string YYYY-MM-DD en DateTime
    if (date) {
        updateData.date = new Date(date + 'T00:00:00.000Z');
    }

    // Gestion des participants : on supprime les anciens et on recrée
    if (participants) {
        // ❌ Prisma n'attend PAS appointmentId dans un createMany imbriqué
        // ❌ On retire aussi l'id pour laisser Prisma générer de nouveaux UUID 
        //    (ou gardez-le si vous préférez préserver les mêmes IDs)
        const cleanedParticipants = participants.map((p: any) => {
        const { appointmentId, id: _pid, ...participantData } = p;
        return participantData;
        });

        updateData.participants = { deleteMany: {}, createMany: { data: cleanedParticipants } };
    }

    return prisma.appointment.update({
        where: { id },
        data: updateData,
        include: { participants: true },
    });
    }

  async delete(id: string) {
    return prisma.appointment.delete({ where: { id } });
  }

  async checkConflicts(directorId: string, dateStr: string, startTime: string, endTime: string, excludeId?: string) {
    const where: any = {
      directorId,
      date: new Date(dateStr + 'T00:00:00.000Z'),
      NOT: { id: excludeId },
      OR: [{ startTime: { lt: endTime }, endTime: { gt: startTime } }],
    };
    return prisma.appointment.count({ where });
  }
}