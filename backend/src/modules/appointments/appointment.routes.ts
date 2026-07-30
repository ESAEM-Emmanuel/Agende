import { Router } from 'express';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentRepository } from './appointment.repository';
import { authenticate } from '../../shared/middlewares/auth';
import { validate } from '../../shared/middlewares/validate';
import { createAppointmentSchema, updateAppointmentSchema } from './appointment.types';

const repo = new AppointmentRepository();
const service = new AppointmentService(repo);
const controller = new AppointmentController(service);

const router = Router();

router.use(authenticate);
router.get('/', controller.list);
router.post('/', validate(createAppointmentSchema), controller.create);
router.put('/:id', validate(updateAppointmentSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;