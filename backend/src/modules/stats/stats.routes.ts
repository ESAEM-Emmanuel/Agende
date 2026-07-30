import { Router } from 'express';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';
import { authenticate } from '../../shared/middlewares/auth';

const repo = new StatsRepository();
const service = new StatsService(repo);
const controller = new StatsController(service);

const router = Router();

router.use(authenticate);
router.get('/', controller.getStats);

export default router;