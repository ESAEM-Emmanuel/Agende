// import { Request, Response, NextFunction } from 'express';
// import { AppointmentService } from './appointment.service';
// import { AuthRequest } from '../../shared/middlewares/auth';

// export class AppointmentController {
//   constructor(private readonly service: AppointmentService) {}

//   list = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       const { directorId, start, end } = req.query as { directorId: string; start: string; end: string };
//       if (!directorId) throw new AppError('directorId requis', 400);
//       const data = await this.service.listByRange(directorId, start, end);
//       res.json({ success: true, data });
//     } catch (err) { next(err); }
//   };

//   create = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       const data = await this.service.create(req.body, req.user!.id);
//       res.status(201).json({ success: true, data });
//     } catch (err) { next(err); }
//   };

//   update = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       const data = await this.service.update(req.params.id, req.body, req.user!.id);
//       res.json({ success: true, data });
//     } catch (err) { next(err); }
//   };

//   remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       await this.service.delete(req.params.id, req.user!.id);
//       res.json({ success: true });
//     } catch (err) { next(err); }
//   };
// }

import { Response, NextFunction } from 'express';
import { AppointmentService } from './appointment.service';
import { AuthRequest } from '../../shared/middlewares/auth';
import { AppError } from '../../shared/errors/AppError';

export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { directorId, start, end } = req.query as { directorId: string; start: string; end: string };
      if (!directorId) throw new AppError('directorId requis', 400);
      const data = await this.service.listByRange(directorId, start, end);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body, req.user!.id);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(req.params.id, req.body, req.user!);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id, req.user!);
      res.json({ success: true });
    } catch (err) { next(err); }
  };
}