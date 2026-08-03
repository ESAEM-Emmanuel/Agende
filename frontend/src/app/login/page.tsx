'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white shadow-lg lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Agenda Direction</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">Gérez vos rendez-vous avec une vue claire et rapide.</h1>
            <p className="mt-4 max-w-md text-sm text-blue-50/90">
              Planifiez, consultez et exportez vos réunions depuis un espace pensé pour le quotidien de la direction.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-blue-50">
            <p className="font-semibold">Expérience responsive</p>
            <p className="mt-1">Accessible du téléphone au bureau, avec des interactions adaptées au tactile.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8 lg:max-w-md lg:justify-self-end"
        >
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Connexion</h2>
            <p className="mt-1 text-sm text-slate-500">Accédez à votre espace de gestion</p>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-blue-900 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-blue-800 active:scale-[0.98]"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}