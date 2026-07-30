import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { LoginInput, RefreshInput } from './auth.types';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body as LoginInput);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.refresh((req.body as RefreshInput).refreshToken);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout(req.body.refreshToken);
      res.json({ success: true });
    } catch (err) { next(err); }
  };

  // Ajouter dans la classe AuthController :
  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
      // Récupérer via le repo user ou auth
      const { prisma } = await import('../../config/prisma');
      const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
      });
      if (!user) throw new AppError('Utilisateur introuvable', 404);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  };
}
