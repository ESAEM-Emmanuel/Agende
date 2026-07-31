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
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    if (user.role === 'ASSISTANT' || user.role === 'ADMIN') {
      api.get('/users/directors')
        .then(({ data }) => {
          setDirectors(data);
          if (data.length > 0) setSelectedDirectorId(prev => prev || data[0].id);
        })
        .catch(() => {});
    }
  }, [user]);

  const loadAppointments = useCallback(async () => {
    if (!directorId) return;
    setLoading(true);
    try {
      const start = getMonthStart(selectedDate);
      const end = getMonthEnd(selectedDate);
      const { data } = await api.get(
        `/appointments?directorId=${encodeURIComponent(directorId)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
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
    const payload = { ...formData, directorId, date: formData.date || toDateStr(new Date()) };
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
      alert(err.message || 'Erreur');
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
      alert(err.message || 'Erreur');
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
    <div className="min-h-screen bg-slate-50 pb-4 sm:pb-8">
      {/* HEADER MOBILE-FIRST */}
      <header className="bg-blue-900 text-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-bold truncate">Agenda</h1>
            <p className="text-xs sm:text-sm opacity-80 truncate">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          
          {/* Menu hamburger mobile */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg bg-white/10 active:bg-white/20"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          {/* Actions desktop */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
            {user?.role === 'ADMIN' && (
              <>
                <button onClick={() => router.push('/admin/users')} className="text-xs lg:text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">⚙️ Utilisateurs</button>
                <button onClick={() => router.push('/admin/stats')} className="text-xs lg:text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">📊 Stats</button>
              </>
            )}
            {user?.role !== 'DIRECTOR' && (
              <select
                value={selectedDirectorId}
                onChange={(e) => setSelectedDirectorId(e.target.value)}
                className="bg-white/10 text-white border border-white/30 rounded-lg px-3 py-2 text-xs lg:text-sm outline-none focus:bg-white/20 max-w-[160px]"
              >
                <option value="" className="text-slate-800">Choisir...</option>
                {directors.map(d => (
                  <option key={d.id} value={d.id} className="text-slate-800">{d.firstName} {d.lastName}</option>
                ))}
              </select>
            )}
            <ExportExcel appointments={appointments} directors={directors} currentDirectorId={directorId} />
            <button
              onClick={() => { setEditingAppointment(null); setIsModalOpen(true); }}
              disabled={!directorId}
              className="bg-white text-blue-900 px-3 py-2 rounded-lg font-semibold text-xs lg:text-sm hover:bg-blue-50 disabled:opacity-50 active:scale-95 transition"
            >
              + RDV
            </button>
            <button onClick={logout} className="text-xs lg:text-sm opacity-80 hover:opacity-100 px-2 py-2">Déconnexion</button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="sm:hidden mt-3 space-y-2 pb-2 border-t border-white/20 pt-3">
            {user?.role === 'ADMIN' && (
              <div className="flex gap-2">
                <button onClick={() => { setMenuOpen(false); router.push('/admin/users'); }} className="flex-1 text-sm bg-white/10 px-3 py-2.5 rounded-lg">⚙️ Utilisateurs</button>
                <button onClick={() => { setMenuOpen(false); router.push('/admin/stats'); }} className="flex-1 text-sm bg-white/10 px-3 py-2.5 rounded-lg">📊 Stats</button>
              </div>
            )}
            {user?.role !== 'DIRECTOR' && (
              <select
                value={selectedDirectorId}
                onChange={(e) => { setSelectedDirectorId(e.target.value); setMenuOpen(false); }}
                className="w-full bg-white/10 text-white border border-white/30 rounded-lg px-3 py-2.5 text-sm outline-none"
              >
                <option value="" className="text-slate-800">Choisir un directeur...</option>
                {directors.map(d => (
                  <option key={d.id} value={d.id} className="text-slate-800">{d.firstName} {d.lastName}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <ExportExcel appointments={appointments} directors={directors} currentDirectorId={directorId} className="flex-1" />
              <button
                onClick={() => { setEditingAppointment(null); setIsModalOpen(true); setMenuOpen(false); }}
                disabled={!directorId}
                className="flex-1 bg-white text-blue-900 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50"
              >
                + Nouveau RDV
              </button>
            </div>
            <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-sm opacity-80 py-2 text-left">Déconnexion</button>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="px-3 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading && <div className="text-center text-slate-400 py-6 text-sm">Chargement...</div>}
        
        {!directorId && user?.role !== 'DIRECTOR' ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center text-slate-500 text-sm">
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

      {/* MODALS */}
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