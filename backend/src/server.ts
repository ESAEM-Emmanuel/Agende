import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { env } from './config/env';
import { initSocketServer, setIoInstance } from './socket/socket.server';
import { errorHandler } from './shared/middlewares/errorHandler';
import { apiLimiter } from './shared/middlewares/rateLimiter';
import { startAlertCron } from './cron/alert.cron';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import appointmentRoutes from './modules/appointments/appointment.routes';
import statsRoutes from './modules/stats/stats.routes';

const app = express();
const httpServer = createServer(app);
const io = initSocketServer(httpServer);

setIoInstance(io);

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

httpServer.listen(env.PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${env.PORT}`);
  startAlertCron(); // ← DÉMARRAGE DU CRON
});