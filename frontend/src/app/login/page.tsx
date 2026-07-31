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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-5"
      >
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Agenda Direction</h1>
          <p className="text-sm text-slate-500 mt-1">Connexion sécurisée</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base min-h-[48px]"
            required
            autoComplete="email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base min-h-[48px]"
            required
            autoComplete="current-password"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition active:scale-[0.98] text-base min-h-[48px]"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}