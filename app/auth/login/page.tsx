'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import pour la logique de redirection
import { MapPin, X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter(); // Initialisation du router

  // --- ÉTATS (STATES) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIQUE DE CONNEXION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');       
      return;
     }

     
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email, password }),
       });

       const data = await res.json();
       if (res.ok) {
         // In a real app, you would store the token in a cookie or local storage
         console.log('Login Success:', data);
         router.push('/dashboard');
       } else {
         setError(data.message || 'Une erreur est survenue.');
       }

      
      
      } catch (err) {
      // Gestion des erreurs (ex: mot de passe incorrect)
      setError('Impossible de se connecter au serveur.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logique pour fermer la page (retour accueil)
  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Effets de fond (Optionnel pour l'ambiance) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Carte de Connexion */}
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* --- LOGO (Ton code exact + Logique de fermeture) --- */}
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400 rounded-lg">
                    <MapPin className="text-slate-900" size={24} />
                </div>
                <h1 className="text-xl font-bold text-white">Agro-Sig <span className="text-amber-400">237</span></h1>
            </div>
            {/* J'ai ajouté l'onClick pour que la croix ramène à l'accueil */}
            <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition"
                aria-label="Fermer"
            >
                <X size={24} />
            </button>
        </div>
        {/* --------------------------------------------------- */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Bon retour !</h2>
          <p className="text-slate-400">Veuillez entrer vos coordonnées pour vous connecter.</p>
        </div>

        {/* Message d'erreur visuel si besoin */}
        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Email */}
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

          {/* Champ Mot de passe */}
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

          {/* Bouton de soumission */}
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

        {/* Footer du form : Lien vers Register */}
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




// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Veuillez remplir tous les champs.');
//       return;
//     }

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // In a real app, you would store the token in a cookie or local storage
//         console.log('Login Success:', data);
//         router.push('/dashboard');
//       } else {
//         setError(data.message || 'Une erreur est survenue.');
//       }
//     } catch (err) {
//       setError('Impossible de se connecter au serveur.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center text-gray-900">Se connecter</h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="text-sm font-medium text-gray-700"
//             >
//               Adresse e-mail
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="vous@example.com"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="text-sm font-medium text-gray-700"
//             >
//               Mot de passe
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="current-password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="********"
//             />
//           </div>
//           {error && <p className="text-sm text-red-600">{error}</p>}
//           <div>
//             <button
//               type="submit"
//               className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Se connecter
//             </button>
//           </div>
//         </form>
//         <p className="text-sm text-center text-gray-600">
//           Vous n&apos;avez pas de compte ?{' '}
//           <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//             S&apos;inscrire
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
