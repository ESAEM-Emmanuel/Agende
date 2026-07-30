import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const initSocketServer = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connecté: ${socket.data.user.userId}`);
    
    // Rejoindre la room du directeur pour recevoir les updates en temps réel
    socket.on('join-director', (directorId: string) => {
      socket.join(`director:${directorId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket déconnecté');
    });
  });

  return io;
};

export let ioInstance: SocketServer;

export const setIoInstance = (io: SocketServer) => { ioInstance = io; };
export const emitAppointmentChange = (directorId: string, event: string, data: any) => {
  ioInstance?.to(`director:${directorId}`).emit(event, data);
};