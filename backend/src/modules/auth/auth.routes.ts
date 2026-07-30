import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { authenticate } from '../../shared/middlewares/auth';
import { validate } from '../../shared/middlewares/validate';
import { loginSchema, refreshSchema } from './auth.types';
import { authLimiter } from '../../shared/middlewares/rateLimiter';

const repo = new AuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me); // ← AJOUTÉ

export default router;