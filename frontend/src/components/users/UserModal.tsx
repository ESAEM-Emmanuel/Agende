'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

interface Props {
  user: User | null;
  onClose: () => void;
  onSave: (data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => void;
}

const roles = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'DIRECTOR', label: 'Directeur' },
  { value: 'ASSISTANT', label: 'Assistant(e)' },
];

export function UserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ASSISTANT',
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } else {
      setForm({ email: '', password: '', firstName: '', lastName: '', role: 'ASSISTANT' });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !form.password) {
      alert('Le mot de passe est obligatoire pour la création.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl w-10 h-10 flex items-center justify-center">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prénom *</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom *</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Mot de passe {user ? '(laisser vide pour ne pas changer)' : '*'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              {...(!user ? { required: true } : {})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rôle *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium min-h-[44px]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 min-h-[44px]"
            >
              {user ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}