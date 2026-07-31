'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/api';
import { User } from '@/types';
import { UserTable } from '@/components/users/UserTable';
import { UserModal } from '@/components/users/UserModal';

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') loadUsers();
  }, [user]);

  const handleSave = async (formData: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    try {
      if (editingUser) {
        const payload: any = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        };
        if (formData.password) payload.password = formData.password;
        await api.put(`/users/${editingUser.id}`, payload);
      } else {
        await api.post('/users', formData);
      }
      await loadUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleToggleStatus = async (targetUser: User) => {
    const action = targetUser.isActive ? 'désactiver' : 'activer';
    if (!confirm(`Voulez-vous vraiment ${action} ${targetUser.firstName} ${targetUser.lastName} ?`)) return;

    try {
      if (targetUser.isActive) {
        await api.del(`/users/${targetUser.id}`);
      } else {
        await api.put(`/users/${targetUser.id}`, { isActive: true });
      }
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Chargement...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 text-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-bold truncate">Utilisateurs</h1>
            <p className="text-xs sm:text-sm opacity-80 truncate">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg bg-white/10 active:bg-white/20"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
            <button onClick={() => router.push('/dashboard')} className="text-xs lg:text-sm opacity-80 hover:opacity-100 px-3 py-2">
              ← Agenda
            </button>
            <button onClick={() => router.push('/admin/stats')} className="text-xs lg:text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">
              📊 Stats
            </button>
            <button
              onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
              className="bg-white text-blue-900 px-3 py-2 rounded-lg font-semibold text-xs lg:text-sm hover:bg-blue-50"
            >
              + Utilisateur
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-3 space-y-2 pb-2 border-t border-white/20 pt-3 max-w-6xl mx-auto">
            <button onClick={() => { setMenuOpen(false); router.push('/dashboard'); }} className="w-full text-sm bg-white/10 px-3 py-2.5 rounded-lg text-left">
              ← Retour à l&apos;agenda
            </button>
            <button onClick={() => { setMenuOpen(false); router.push('/admin/stats'); }} className="w-full text-sm bg-white/10 px-3 py-2.5 rounded-lg text-left">
              📊 Statistiques
            </button>
            <button
              onClick={() => { setEditingUser(null); setIsModalOpen(true); setMenuOpen(false); }}
              className="w-full bg-white text-blue-900 py-2.5 rounded-lg font-semibold text-sm"
            >
              + Nouvel utilisateur
            </button>
          </div>
        )}
      </header>

      <main className="px-3 py-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl w-full sm:w-80 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
            <span className="absolute left-3 top-3 text-slate-400">🔍</span>
          </div>
          <div className="text-sm text-slate-500 text-center sm:text-right">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          onEdit={(u) => {
            setEditingUser(u);
            setIsModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
