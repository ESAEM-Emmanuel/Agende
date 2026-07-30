import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../shared/middlewares/auth';
import { CreateUserInput, UpdateUserInput, UpdatePasswordInput } from './user.types';

export class UserController {
  constructor(private readonly service: UserService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { role, isActive, search } = req.query as { role?: string; isActive?: string; search?: string };
      const data = await this.service.list(req.user!.id, {
        role: role as any,
        isActive: isActive ? isActive === 'true' : undefined,
        search,
      });
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getProfile(req.user!.id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body as CreateUserInput, req.user!.role as any);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(
        req.params.id,
        req.body as UpdateUserInput,
        req.user!.id,
        req.user!.role as any
      );
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  updatePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.updatePassword(req.user!.id, req.body as UpdatePasswordInput);
      res.json({ success: true, message: 'Mot de passe mis à jour' });
    } catch (err) { next(err); }
  };

  deactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.deactivate(req.params.id, req.user!.id, req.user!.role as any);
      res.json({ success: true, message: 'Utilisateur désactivé' });
    } catch (err) { next(err); }
  };

  listDirectors = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.list(req.user!.id, { role: 'DIRECTOR', isActive: true });
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
}