'use client';

import { useState, useEffect } from 'react';
import { Appointment, AppointmentType, AppointmentStatus, Priority, Participant } from '@/types';

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (data: Partial<Appointment>) => void;
  onDelete?: () => void;
}

export function AppointmentModal({ appointment, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<Partial<Appointment>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    type: 'REUNION',
    status: 'CONFIRMED',
    priority: 'NORMAL',
    notes: '',
    participants: [],
  });

  // Participant temporaire en cours de saisie
  const [newParticipant, setNewParticipant] = useState<Participant>({
    name: '',
    email: '',
    isExternal: false,
  });

  useEffect(() => {
    if (appointment) {
      setForm(appointment);
    } else {
      setForm({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        type: 'REUNION',
        status: 'CONFIRMED',
        priority: 'NORMAL',
        notes: '',
        participants: [],
      });
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const addParticipant = () => {
    if (!newParticipant.name.trim()) return;
    setForm(prev => ({
      ...prev,
      participants: [...(prev.participants || []), { ...newParticipant }],
    }));
    setNewParticipant({ name: '', email: '', isExternal: false });
  };

  const removeParticipant = (index: number) => {
    setForm(prev => ({
      ...prev,
      participants: (prev.participants || []).filter((_, i) => i !== index),
    }));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      participants: (prev.participants || []).map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 pr-4">
            {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titre *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none text-base sm:text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Début *</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none text-base sm:text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fin *</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none text-base sm:text-sm" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lieu</label>
            <input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" placeholder="Salle de réunion A" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as AppointmentType })} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none bg-white text-base sm:text-sm">
                <option value="REUNION">Réunion</option>
                <option value="DEJEUNER">Déjeuner</option>
                <option value="VISITE">Visite</option>
                <option value="VISIO">Visioconférence</option>
                <option value="PERSO">Personnel</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Statut</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AppointmentStatus })} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none bg-white text-base sm:text-sm">
                <option value="CONFIRMED">Confirmé</option>
                <option value="PENDING">En attente</option>
                <option value="CANCELLED">Annulé</option>
                <option value="DONE">Terminé</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priorité</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none bg-white text-base sm:text-sm">
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Haute</option>
                <option value="LOW">Basse</option>
              </select>
            </div>
          </div>

          {/* GESTION DES PARTICIPANTS */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase">Participants ({form.participants?.length || 0})</label>
            
            {/* Liste existante */}
            <div className="space-y-2">
              {(form.participants || []).map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-50 p-2 rounded-lg">
                  <input
                    value={p.name}
                    onChange={e => updateParticipant(i, 'name', e.target.value)}
                    className="flex-1 px-2 py-2 sm:py-1 text-sm border border-slate-200 rounded outline-none"
                    placeholder="Nom"
                  />
                  <input
                    value={p.email || ''}
                    onChange={e => updateParticipant(i, 'email', e.target.value)}
                    className="w-full sm:w-32 px-2 py-2 sm:py-1 text-sm border border-slate-200 rounded outline-none"
                    placeholder="Email"
                  />
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <label className="flex items-center gap-1 text-xs text-slate-600 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={p.isExternal}
                        onChange={e => updateParticipant(i, 'isExternal', e.target.checked)}
                        className="rounded"
                      />
                      Externe
                    </label>
                    <button
                      type="button"
                      onClick={() => removeParticipant(i)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold px-2 py-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ajout nouveau participant */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-100">
              <input
                value={newParticipant.name}
                onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                placeholder="Nom du participant"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              />
              <input
                value={newParticipant.email}
                onChange={e => setNewParticipant({ ...newParticipant, email: e.target.value })}
                className="w-full sm:w-32 px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none"
                placeholder="Email"
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-slate-600 whitespace-nowrap px-1">
                  <input
                    type="checkbox"
                    checked={newParticipant.isExternal}
                    onChange={e => setNewParticipant({ ...newParticipant, isExternal: e.target.checked })}
                    className="rounded"
                  />
                  Externe
                </label>
                <button
                  type="button"
                  onClick={addParticipant}
                  disabled={!newParticipant.name.trim()}
                  className="flex-1 sm:flex-none bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 min-h-[40px]"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes / Briefing</label>
            <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none resize-none" placeholder="Ordre du jour, documents à préparer..." />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2 pb-safe">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm"
              >
                Supprimer
              </button>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto w-full sm:w-auto">
              <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium min-h-[44px]">Annuler</button>
              <button type="submit" className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 min-h-[44px]">Enregistrer</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}