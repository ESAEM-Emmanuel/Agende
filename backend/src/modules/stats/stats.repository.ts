import { prisma } from '../../config/prisma';

export class StatsRepository {
  async getAppointments(filters: { directorId?: string; year?: number }) {
    const where: any = {};
    
    if (filters.directorId) where.directorId = filters.directorId;
    
    if (filters.year) {
      where.date = {
        gte: new Date(filters.year, 0, 1),
        lte: new Date(filters.year, 11, 31),
      };
    }

    return prisma.appointment.findMany({
      where,
      include: {
        director: { select: { id: true, firstName: true, lastName: true } },
        participants: { select: { name: true, email: true, isExternal: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { date: 'asc' },
    });
  }
}