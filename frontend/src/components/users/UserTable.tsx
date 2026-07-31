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
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center text-slate-400 text-sm">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  return (
    <>
      {/* Mobile : cartes */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="font-semibold text-slate-800">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-slate-500 truncate mt-0.5">{user.email}</div>
              </div>
              <span
                className={`flex-shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {user.isActive ? 'Actif' : 'Désactivé'}
              </span>
            </div>
            <div className="mb-3">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(user)}
                className="flex-1 text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition min-h-[44px]"
              >
                Modifier
              </button>
              <button
                onClick={() => onToggleStatus(user)}
                className={`flex-1 font-medium text-sm px-3 py-2.5 rounded-lg transition min-h-[44px] ${
                  user.isActive
                    ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100'
                    : 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'
                }`}
              >
                {user.isActive ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop : tableau */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
