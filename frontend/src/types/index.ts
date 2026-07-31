export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'DIRECTOR' | 'ASSISTANT' | 'ADMIN';
  isActive?: boolean;
}

export interface Participant {
  id?: string;
  name: string;
  email?: string;
  isExternal?: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'REUNION' | 'DEJEUNER' | 'VISITE' | 'VISIO' | 'PERSO' | 'AUTRE';
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'DONE';
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  notes?: string;
  directorId: string;
  createdById: string;
  participants: Participant[];
  createdAt: string;
}