import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { authenticate, authorize } from '../../shared/middlewares/auth';
import { validate } from '../../shared/middlewares/validate';
import { createUserSchema, updateUserSchema, updatePasswordSchema } from './user.types';

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

const router = Router();

router.use(authenticate);

// Profil connecté
router.get('/me', controller.me);
router.put('/me/password', validate(updatePasswordSchema), controller.updatePassword);

// Listes (accessible aux assistants et admins)
router.get('/directors', controller.listDirectors);  // ← AJOUTEZ CELLE-CI
router.get('/', authorize('ADMIN', 'ASSISTANT'), controller.list);

// CRUD individuel
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN'), validate(createUserSchema), controller.create);
router.put('/:id', validate(updateUserSchema), controller.update);
router.delete('/:id', authorize('ADMIN'), controller.deactivate);

export default router;