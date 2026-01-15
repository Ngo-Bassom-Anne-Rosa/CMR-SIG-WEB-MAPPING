'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, X, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  // STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Inscription réussie ! Redirection en cours...');
        console.log('Success:', data);
        
        // Redirection after 1.5sec
        setTimeout(() => {
          
          router.push('/dashboard'); 
        }, 1500); 
      } else {
        setError(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur.');
    } finally {
      if (!success) setIsLoading(false);
    }
  };

  // close, redirect to home
  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* PRINCIPAL CARTE */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* HEADER : LOGO + CLOSE */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400 rounded-lg">
                    <MapPin className="text-slate-900" size={24} />
                </div>
                <h1 className="text-xl font-bold text-white">Agro-Sig <span className="text-amber-400">237</span></h1>
            </div>
            <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition"
            >
                <X size={24} />
            </button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Créer un compte</h2>
          <p className="text-slate-400">Rejoignez la plateforme pour accéder aux cartes.</p>
        </div>

        {/* FORMULAR */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">
              Adresse e-mail
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors">
                <Mail size={20} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300 ml-1">
              Mot de passe
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors">
                <Lock size={20} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-600"
              />
               {/* Bouton Toggle Password Visibility */}
               <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* ERROR / SUCCESS MSGS */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <AlertCircle size={18} />
                <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                <CheckCircle size={18} />
                <p>{success}</p>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              disabled={isLoading || success !== ''}
              className="w-full bg-amber-400 text-slate-900 font-bold py-3.5 rounded-xl hover:bg-amber-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Inscription...
                </>
            ) : (
                "S'inscrire"
            )}
            </button>
          </div>
        </form>

        {/* FOOTER */}
        <p className="mt-8 text-sm text-center text-slate-400">
            Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}