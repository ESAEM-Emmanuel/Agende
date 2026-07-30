import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { LoginInput } from './auth.types';
import { AppError } from '../../shared/errors/AppError';
import { env } from '../../config/env';

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async login(input: LoginInput) {
    const user = await this.repo.findUserByEmail(input.email);
    if (!user || !user.isActive) {
      throw new AppError('Identifiants invalides', 401);
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new AppError('Identifiants invalides', 401);

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.repo.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    const stored = await this.repo.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError('Session invalide', 401);
    }

    const accessToken = jwt.sign(
      { userId: stored.user.id, email: stored.user.email, role: stored.user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.repo.deleteRefreshToken(refreshToken);
  }
}