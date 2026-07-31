'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/lib/api';
import { User } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const TYPE_COLORS: Record<string, string> = {
  REUNION: '#3b82f6', DEJEUNER: '#f59e0b', VISITE: '#10b981',
  VISIO: '#8b5cf6', PERSO: '#9ca3af', AUTRE: '#ec4899',
};

interface StatsData {
  overview: {
    total: number; thisMonth: number; thisYear: number;
    confirmed: number; pending: number; cancelled: number; totalHours: number;
  };
  byDirector: Array<{ directorId: string; directorName: string; count: number; hours: number }>;
  byTimeline: Array<{ key: number; label: string; count: number; hours: number }>;
  byParticipant: Array<{ name: string; email?: string; isExternal: boolean; count: number; hours: number }>;
  byType: Array<{ type: string; label: string; count: number; hours: number }>;
}

export default function AdminStatsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [directorId, setDirectorId] = useState('');
  const [directors, setDirectors] = useState<User[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/users/directors').then(({ data }) => setDirectors(data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;
    let url = `/stats?year=${year}`;
    if (directorId) url += `&directorId=${directorId}`;
    
    api.get(url).then(({ data }) => setStats(data)).catch(() => setStats(null));
  }, [user, year, directorId]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Chargement...</div>;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 text-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-bold truncate">Statistiques</h1>
            <p className="text-xs sm:text-sm opacity-80 truncate">Tableau de bord analytique</p>
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

          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => router.push('/admin/users')} className="text-xs lg:text-sm opacity-80 hover:opacity-100 px-3 py-2">
              ← Utilisateurs
            </button>
            <button onClick={() => router.push('/dashboard')} className="text-xs lg:text-sm opacity-80 hover:opacity-100 px-3 py-2">
              Agenda
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-3 space-y-2 pb-2 border-t border-white/20 pt-3 max-w-7xl mx-auto">
            <button onClick={() => { setMenuOpen(false); router.push('/admin/users'); }} className="w-full text-sm bg-white/10 px-3 py-2.5 rounded-lg text-left">
              ← Utilisateurs
            </button>
            <button onClick={() => { setMenuOpen(false); router.push('/dashboard'); }} className="w-full text-sm bg-white/10 px-3 py-2.5 rounded-lg text-left">
              Agenda
            </button>
          </div>
        )}
      </header>

      <main className="px-3 py-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Filtres */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 sm:items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Année</label>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="w-full sm:w-auto px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg text-sm outline-none min-h-[44px]">
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:flex-1 sm:max-w-xs">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Directeur</label>
            <select value={directorId} onChange={(e) => setDirectorId(e.target.value)} className="w-full px-3 py-2.5 sm:py-2 border border-slate-300 rounded-lg text-sm outline-none min-h-[44px]">
              <option value="">Tous les directeurs</option>
              {directors.map(d => (
                <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>
        </div>

        {!stats ? (
          <div className="bg-white p-12 rounded-xl text-center text-slate-400">Aucune donnée disponible.</div>
        ) : (
          <>
            {/* Cartes overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
              {[
                { label: 'Total RDV', value: stats.overview.total, color: 'text-blue-900' },
                { label: 'Ce mois', value: stats.overview.thisMonth, color: 'text-blue-700' },
                { label: 'Cette année', value: stats.overview.thisYear, color: 'text-blue-600' },
                { label: 'Confirmés', value: stats.overview.confirmed, color: 'text-green-600' },
                { label: 'En attente', value: stats.overview.pending, color: 'text-amber-600' },
                { label: 'Annulés', value: stats.overview.cancelled, color: 'text-red-600' },
                { label: 'Heures totales', value: `${stats.overview.totalHours}h`, color: 'text-slate-700' },
              ].map((card) => (
                <div key={card.label} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${card.color}`}>{card.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-1">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Graphique temporel */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
                {directorId ? 'Évolution mensuelle' : 'Évolution annuelle'}
              </h3>
              <div className="h-56 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="count" name="Nombre de RDV" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hours" name="Heures" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Graphique par type */}
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Répartition par type</h3>
                <div className="h-56 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="label"
                      >
                        {stats.byType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.type] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Graphique par directeur */}
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Par directeur</h3>
                <div className="h-56 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byDirector} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="directorName" type="category" width={80} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Bar dataKey="count" name="RDV" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="hours" name="Heures" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tableau des acteurs (participants) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-slate-200">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Top Acteurs (Participants)</h3>
                <p className="text-xs sm:text-sm text-slate-500">Les personnes les plus sollicitées dans les rendez-vous</p>
              </div>

              {/* Mobile : cartes */}
              <div className="md:hidden divide-y divide-slate-100">
                {stats.byParticipant.map((p, i) => (
                  <div key={p.name} className="p-4 flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-300 w-8">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">{p.name}</div>
                      {p.email && <div className="text-xs text-slate-500 truncate">{p.email}</div>}
                      <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${p.isExternal ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.isExternal ? 'Externe' : 'Interne'}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-slate-800">{p.count} RDV</div>
                      <div className="text-xs text-slate-500">{p.hours}h</div>
                    </div>
                  </div>
                ))}
                {stats.byParticipant.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">Aucun participant trouvé.</div>
                )}
              </div>

              {/* Desktop : tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                    <tr>
                      <th className="px-6 py-3">Rang</th>
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-right">RDV</th>
                      <th className="px-6 py-3 text-right">Heures</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.byParticipant.map((p, i) => (
                      <tr key={p.name} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-bold text-slate-400">#{i + 1}</td>
                        <td className="px-6 py-3 font-semibold text-slate-800">{p.name}</td>
                        <td className="px-6 py-3 text-slate-500">{p.email || '-'}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.isExternal ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {p.isExternal ? 'Externe' : 'Interne'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-slate-800">{p.count}</td>
                        <td className="px-6 py-3 text-right text-slate-600">{p.hours}h</td>
                      </tr>
                    ))}
                    {stats.byParticipant.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Aucun participant trouvé.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}