'use client';

import Link from 'next/link';
import { MapPin, User, LogOut, Star, LayoutDashboard, Menu } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/lib/config';

interface NavbarProps {
    activeColorClass: string;
}

export default function Navbar({ activeColorClass }: NavbarProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            setIsLoggedIn(true);
            try {
                const res = await fetch(`${API_BASE_URL}/profile/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = await res.json();
                if (res.ok) setUserName(user.first_name ? `${user.first_name}` : 'Mon Compte');
            } catch (error) { console.error(error); }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUserName(null);
        setMenuOpen(false);
        window.location.href = '/';
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 py-4">
            <div className="mx-auto max-w-7xl">
                <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-2 px-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors duration-500 ${activeColorClass.replace('text-', 'bg-')}`}>
                            <MapPin className="text-slate-900" size={20} />
                        </div>
                        <h1 className="text-lg font-bold text-white">Agro-Sig <span className={`transition-colors duration-500 ${activeColorClass}`}>{new Date().getFullYear() % 100}</span></h1>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            // Connected user view
                            <div className="relative">
                                <button 
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 p-1 pr-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all text-white"
                                >
                                    <div className="h-8 w-8 bg-slate-200 rounded-full overflow-hidden">
                                        <Image src="/avatar_placeholder.png" alt="Avatar" width={32} height={32} />
                                    </div>
                                    <span className="text-sm font-semibold">{userName || 'Mon Compte'}</span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute top-12 right-0 w-56 bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Link href="/dashboard/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md">
                                            <User size={16} /> Mon Profil
                                        </Link>
                                        <Link href="/dashboard/profil/favoris" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md">
                                            <Star size={16} /> Mes Favoris
                                        </Link>
                                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 mt-1 border-t border-slate-700 text-slate-300 hover:bg-slate-700/50 rounded-md">
                                            <LayoutDashboard size={16} /> Accéder à la carte
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 mt-1 text-sm text-red-400 hover:bg-red-500/20 rounded-md">
                                            <LogOut size={16} /> Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Disconnected user view
                            <>
                                <Link href="/auth/login" className="px-5 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-white hover:bg-slate-700 transition-all font-medium text-sm">
                                    Connexion
                                </Link>
                                <Link href="/auth/register" className={`px-5 py-2 rounded-full text-slate-900 transition font-bold text-sm shadow-lg hover:shadow-xl ${activeColorClass}`}>
                                    Créer un compte
                                </Link>
                            </>
                        )}
                    </div>
                    
                    <div className="md:hidden text-white cursor-pointer p-2">
                        <div className="md:hidden text-white cursor-pointer p-2">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)} 
                            className="hover:text-amber-400 transition-colors p-1"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                {/* Drop-down mobile menu */}
                {menuOpen && (
                    <div className="absolute top-20 left-4 right-4 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-4 md:hidden z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-5">
                        {isLoggedIn ? (
                            <>
                                <div className="px-4 py-2 border-b border-slate-700 mb-2">
                                     <span className="text-sm font-bold text-white block">{userName}</span>
                                     <span className="text-xs text-slate-400">Connecté</span>
                                </div>
                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10 rounded-xl transition-all">
                                    <LayoutDashboard size={18} /> Accéder à la carte
                                </Link>
                                <Link href="/dashboard/profil" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10 rounded-xl transition-all">
                                     <User size={18} /> Mon Profil
                                </Link>
                                <Link href="/dashboard/profil/favoris" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/10 rounded-xl transition-all">
                                     <Star size={18} /> Mes Favoris
                                </Link>
                                 <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full text-left">
                                    <LogOut size={18} /> Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-slate-700 hover:bg-slate-600 rounded-xl transition-all">
                                    Connexion
                                </Link>
                                <Link href="/auth/register" className={`flex items-center justify-center px-4 py-3 text-sm font-bold text-slate-900 rounded-xl transition-all shadow-lg ${activeColorClass}`}>
                                    Créer un compte
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}