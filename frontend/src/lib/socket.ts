import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace('/api', '');
    
    socket = io(baseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'], // Fallback polling si websocket échoue
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    
    socket.on('connect_error', (err) => {
      console.warn('Socket connect_error:', err.message);
      if (err.message === 'Authentication error') {
        disconnectSocket();
      }
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinDirectorRoom = (directorId: string) => {
  if (!directorId) return;
  const s = getSocket();
  if (s.connected) {
    s.emit('join-director', directorId);
  } else {
    s.once('connect', () => {
      s.emit('join-director', directorId);
    });
  }
};