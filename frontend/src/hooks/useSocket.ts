'use client';

import { useEffect } from 'react';
import { getSocket, joinDirectorRoom, disconnectSocket } from '@/lib/socket';
import { useAuth } from '@/providers/AuthProvider';

export function useSocket(directorId?: string, onAppointmentChange?: (event: string, data: any) => void) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const socket = getSocket();
    
    if (directorId) {
      joinDirectorRoom(directorId);
    }

    if (onAppointmentChange) {
      socket.on('appointment:created', (data) => onAppointmentChange('created', data));
      socket.on('appointment:updated', (data) => onAppointmentChange('updated', data));
      socket.on('appointment:deleted', (data) => onAppointmentChange('deleted', data));
    }

    return () => {
      disconnectSocket();
    };
  }, [user, directorId, onAppointmentChange]);
}