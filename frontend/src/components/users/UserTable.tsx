'use client';

import { User } from '@/types';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const roleLabels: Record<string, string> = {
  DIRECTOR: 'Directeur',
  ASSISTANT: 'Assistant(e)',
  ADMIN: 'Administrateur',
};

const roleColors: Record<string, string> = {
  DIRECTOR: 'bg-emerald-100 text-emerald-800',
  ASSISTANT: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-purple-100 text-purple-800',
};

export function UserTable({ users, onEdit, onToggleStatus }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.isActive ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`font-medium text-xs px-3 py-1.5 rounded-lg transition ${
                      user.isActive
                        ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                    }`}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}