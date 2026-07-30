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

  // Rediriger si non-admin
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
        // Mise à jour : on n'envoie le password que s'il est renseigné
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
        // Réactivation via update
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
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Chargement...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-sm opacity-80">Administration — {user.firstName} {user.lastName}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm opacity-80 hover:opacity-100 px-3 py-2"
          >
            ← Retour à l'agenda
          </button>
          <button
            onClick={() => router.push('/admin/stats')}
            className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition"
            >
            📊 Statistiques
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50"
          >
            + Nouvel utilisateur
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl w-80 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          </div>
          <div className="text-sm text-slate-500">
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