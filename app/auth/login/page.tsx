'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }
     
    try {
      // API Next.js into proxy
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        
        router.push('/dashboard');
      } else {
        setError(data?.msg || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // close page
  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Connexion Card */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* LOGO */}
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400 rounded-lg">
                    <MapPin className="text-slate-900" size={24} />
                </div>
                <h1 className="text-xl font-bold text-white">Agro-Sig <span className="text-amber-400">237</span></h1>
            </div>
            <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition"
                aria-label="Fermer"
            >
                <X size={24} />
            </button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Bon retour !</h2>
          <p className="text-slate-400">Veuillez entrer vos coordonnées pour vous connecter.</p>
        </div>

        {/* Error msg */}
        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Adresse Email</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">Mot de passe</label>
                <Link href="/forgot-password"className="text-xs text-amber-400 hover:text-amber-300 hover:underline transition">
                    Mot de passe oublié ?
                </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-400 text-slate-900 font-bold py-3.5 rounded-xl hover:bg-amber-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Connexion en cours...
                </>
            ) : (
                "Se connecter"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-amber-400 font-semibold hover:text-amber-300 hover:underline transition">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}