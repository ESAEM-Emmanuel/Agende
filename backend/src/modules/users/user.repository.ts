import { prisma } from '../../config/prisma';
import { UserRole } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from './user.types';

export class UserRepository {
  async findAll(options?: { role?: UserRole; isActive?: boolean; search?: string }) {
    const where: any = {};
    if (options?.role) where.role = options.role;
    if (options?.isActive !== undefined) where.isActive = options.isActive;
    if (options?.search) {
      where.OR = [
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    return prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: this.publicSelect(),
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: this.publicSelect(),
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { ...this.publicSelect(), passwordHash: true },
    });
  }

  async create(data: CreateUserInput & { passwordHash: string }) {
    const { password, ...rest } = data;
    return prisma.user.create({
      data: { ...rest, passwordHash: data.passwordHash },
      select: this.publicSelect(),
    });
  }
  async update(id: string, data: UpdateUserInput & { passwordHash?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: this.publicSelect(),
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: this.publicSelect(),
    });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false, email: { set: undefined } }, // On garde l'email pour l'unicité mais on désactive
      select: this.publicSelect(),
    });
  }

  async count() {
    return prisma.user.count();
  }

  private publicSelect() {
    return {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}