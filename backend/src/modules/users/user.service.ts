import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserInput, UpdateUserInput, UpdatePasswordInput } from './user.types';
import { AppError } from '../../shared/errors/AppError';
import { UserRole } from '@prisma/client';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async list(currentUserId: string, filters?: { role?: UserRole; isActive?: boolean; search?: string }) {
    // Un assistant ne voit que les directeurs actifs (pour pouvoir leur assigner des RDV)
    // Un admin voit tout
    // Un directeur ne voit que son propre profil et les assistants
    return this.repo.findAll(filters);
  }

  async getById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('Utilisateur introuvable', 404);
    return user;
  }

  async getProfile(userId: string) {
    return this.getById(userId);
  }

  async create(data: CreateUserInput, creatorRole: UserRole) {
    if (creatorRole !== UserRole.ADMIN) {
      throw new AppError('Seul un administrateur peut créer des utilisateurs', 403);
    }

    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new AppError('Cet email est déjà utilisé', 409);

    const passwordHash = await bcrypt.hash(data.password, 12);
    return this.repo.create({ ...data, passwordHash });
  }

  async update(id: string, data: UpdateUserInput, currentUserId: string, currentUserRole: UserRole) {
    const target = await this.repo.findById(id);
    if (!target) throw new AppError('Utilisateur introuvable', 404);

    if (currentUserRole !== UserRole.ADMIN && currentUserId !== id) {
      throw new AppError('Vous ne pouvez modifier que votre propre profil', 403);
    }

    if (data.role && currentUserRole !== UserRole.ADMIN) {
      throw new AppError('Seul un admin peut modifier les rôles', 403);
    }

    if (data.isActive !== undefined && currentUserRole !== UserRole.ADMIN) {
      throw new AppError('Seul un admin peut activer/désactiver un compte', 403);
    }

    if (data.email) {
      const existing = await this.repo.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new AppError('Cet email est déjà utilisé', 409);
      }
    }

    let updateData: any = { ...data };
    delete updateData.password; // On retire le password brut du payload

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    return this.repo.update(id, updateData); // ← CORRIGÉ
  }

  async updatePassword(userId: string, input: UpdatePasswordInput) {
    const user = await this.repo.findWithPassword(userId);
    if (!user) throw new AppError('Utilisateur introuvable', 404);

    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) throw new AppError('Mot de passe actuel incorrect', 401);

    const newHash = await bcrypt.hash(input.newPassword, 12);
    return this.repo.updatePassword(userId, newHash);
  }

  async deactivate(id: string, currentUserId: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new AppError('Seul un administrateur peut désactiver un compte', 403);
    }

    if (id === currentUserId) {
      throw new AppError('Vous ne pouvez pas désactiver votre propre compte', 403);
    }

    const target = await this.repo.findById(id);
    if (!target) throw new AppError('Utilisateur introuvable', 404);

    return this.repo.update(id, { isActive: false });
  }
}