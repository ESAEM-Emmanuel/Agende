'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import { Appointment, User } from '@/types';
import { toDateStr, getMonthStart, getMonthEnd } from '@/lib/date';
import { CalendarView } from '@/components/calendar/CalendarView';
import { AppointmentModal } from '@/components/calendar/AppointmentModal';
import { AppointmentDetail } from '@/components/calendar/AppointmentDetail';
import { ExportExcel } from '@/components/calendar/ExportExcel';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [directors, setDirectors] = useState<User[]>([]);
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const directorId = user?.role === 'DIRECTOR' ? user.id : selectedDirectorId;

  useSocket(directorId, (event, data) => {
    if (event === 'deleted') {
      setAppointments(prev => prev.filter(a => a.id !== data.id));
    } else {
      setAppointments(prev => {
        const filtered = prev.filter(a => a.id !== data.id);
        return [...filtered, data];
      });
    }
  });

  // Charger la liste des directeurs (pour assistants/admins)
  useEffect(() => {
    if (!user) return;
    if (user.role === 'ASSISTANT' || user.role === 'ADMIN') {
      api.get('/users/directors')
        .then(({ data }) => {
          setDirectors(data);
          if (data.length > 0) {
            setSelectedDirectorId(prev => prev || data[0].id);
          }
        })
        .catch(err => console.error('Erreur chargement directeurs:', err));
    }
  }, [user]);

  // Charger les rendez-vous
  const loadAppointments = useCallback(async () => {
    if (!directorId) return;
    setLoading(true);
    try {
      const start = getMonthStart(selectedDate);
      const end = getMonthEnd(selectedDate);
      const { data } = await api.get(
        `/appointments?directorId=${encodeURIComponent(directorId)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );
      console.log('RDV chargés:', data?.length, data); // DEBUG
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Erreur chargement RDV:', err.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [directorId, selectedDate]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleSave = async (formData: Partial<Appointment>) => {
    if (!directorId) return;
    const payload = {
      ...formData,
      directorId,
      date: formData.date || toDateStr(new Date()),
    };

    try {
      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment.id}`, payload);
      } else {
        await api.post('/appointments', payload);
      }
      await loadAppointments();
      setIsModalOpen(false);
      setEditingAppointment(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await api.del(`/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
      setIsModalOpen(false);
      setEditingAppointment(null);
      setIsDetailOpen(false);
      setViewingAppointment(null);
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  const handleView = (appt: Appointment) => {
    setViewingAppointment(appt);
    setIsDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    if (!viewingAppointment) return;
    setEditingAppointment(viewingAppointment);
    setIsDetailOpen(false);
    setViewingAppointment(null);
    setIsModalOpen(true);
  };

  const directorName = directors.find(d => d.id === directorId)
    ? `${directors.find(d => d.id === directorId)?.firstName} ${directors.find(d => d.id === directorId)?.lastName}`
    : user?.role === 'DIRECTOR' ? `${user.firstName} ${user.lastName}` : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">Agenda du Directeur</h1>
          <p className="text-sm opacity-80">
            {user?.firstName} {user?.lastName} — {user?.role === 'DIRECTOR' ? 'Directeur' : user?.role === 'ADMIN' ? 'Administrateur' : 'Assistant(e)'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <>
              <button onClick={() => router.push('/admin/users')} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">⚙️ Utilisateurs</button>
              <button onClick={() => router.push('/admin/stats')} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">📊 Stats</button>
            </>
          )}
          
          {user?.role !== 'DIRECTOR' && (
            <select
              value={selectedDirectorId}
              onChange={(e) => setSelectedDirectorId(e.target.value)}
              className="bg-white/10 text-white border border-white/30 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/20"
            >
              <option value="" className="text-slate-800">Choisir un directeur...</option>
              {directors.map(d => (
                <option key={d.id} value={d.id} className="text-slate-800">
                  {d.firstName} {d.lastName}
                </option>
              ))}
            </select>
          )}
          
          <ExportExcel appointments={appointments} directors={directors} currentDirectorId={directorId} />
          
          <button
            onClick={() => { setEditingAppointment(null); setIsModalOpen(true); }}
            disabled={!directorId}
            className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Nouveau RDV
          </button>
          <button onClick={logout} className="text-sm opacity-80 hover:opacity-100 px-3 py-2">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {loading && <div className="text-center text-slate-400 py-4">Chargement...</div>}
        
        {!directorId && user?.role !== 'DIRECTOR' ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
            Veuillez sélectionner un directeur pour afficher son agenda.
          </div>
        ) : (
          <CalendarView
            appointments={appointments}
            currentDate={selectedDate}
            onDateChange={setSelectedDate}
            onEdit={handleView}
          />
        )}
      </main>

      {isModalOpen && directorId && (
        <AppointmentModal
          appointment={editingAppointment}
          onClose={() => { setIsModalOpen(false); setEditingAppointment(null); }}
          onSave={handleSave}
          onDelete={editingAppointment ? () => handleDelete(editingAppointment.id) : undefined}
        />
      )}

      {isDetailOpen && viewingAppointment && (
        <AppointmentDetail
          appointment={viewingAppointment}
          directorName={directorName}
          onClose={() => { setIsDetailOpen(false); setViewingAppointment(null); }}
          onEdit={handleEditFromDetail}
        />
      )}
    </div>
  );
}