import { Request, Response, NextFunction } from 'express';
import { StatsService } from './stats.service';
import { AuthRequest } from '../../shared/middlewares/auth';

export class StatsController {
  constructor(private readonly service: StatsService) {}

  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { directorId, year } = req.query as { directorId?: string; year?: string };
      const data = await this.service.getStats(
        directorId,
        year ? parseInt(year) : undefined
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}