'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, User, LogOut, ChevronDown, Calendar, Star, Home } from 'lucide-react';
import Image from 'next/image';
import { API_BASE_URL } from '@/app/lib/config';

// On garde un type simple pour le profil du header
type UserProfileHeader = {
    email: string;
    first_name?: string;
};

interface HeaderProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
}

export default function Header({ isSidebarOpen, setSidebarOpen }: HeaderProps) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [user, setUser] = useState<UserProfileHeader | null>(null);

    // --- EFFET POUR CHARGER LE PROFIL DE L'UTILISATEUR ---
    useEffect(() => {
        const fetchUser = async () => {
            // Dans une vraie application, on récupère le token du localStorage ou des cookies
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Si pas de token, on ne fait rien, l'utilisateur n'est pas connecté
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/profile/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    // Le token est peut-être invalide, on pourrait gérer la déconnexion ici
                    console.error("Token invalide ou expiré");
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error("Erreur de connexion au serveur de profil", error);
            }
        };

        fetchUser();
    }, []); // Se lance une seule fois au chargement du composant

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/'; // Redirection simple vers la page de login
    };

    return (
        <header className="h-20 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 flex items-center px-4 sm:px-6 lg:px-8 justify-between z-40 sticky top-0 shadow-sm">
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(true)} 
                    className={`${isSidebarOpen ? 'hidden lg:hidden' : 'block'} p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all shadow-sm`}
                >
                    <Menu size={20} />
                </button>
                <div className="hidden md:block">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Tableau de Bord</h1>
                    <p className="text-xs text-slate-500">Analyse Géospatiale</p>
                </div>
            </div>

            <div className="flex-1 flex justify-center items-center gap-4 px-4">
                {/* ... (La partie Recherche & Année ne change pas) ... */}
            </div>

            <div className="relative">
                <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm"
                >
                    <div className="h-9 w-9 bg-slate-200 rounded-full overflow-hidden">
                        <Image src="/avatar_placeholder.png" alt="Avatar" width={36} height={36} className="object-cover" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 hidden sm:block">{user?.first_name || 'Mon Compte'}</span>
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileMenuOpen && (
                    <div 
                        className="absolute top-14 right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-300"
                        onMouseLeave={() => setProfileMenuOpen(false)}
                    >
                        {user ? (
                            <>
                                <div className="p-4 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user.first_name ? `${user.first_name}` : 'Utilisateur'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link href="/dashboard/profil" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors">
                                        <User size={16} /> Mon Profil
                                    </Link>
                                    <Link href="/dashboard/profil/favoris" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors">
                                        <Star size={16} /> Mes Favoris
                                    </Link>
                                </div>
                                <div className="pt-2 border-t border-slate-100">
                                    <Link href="/" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors">
                                        <Home size={16} /> Page d'accueil
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                                        <LogOut size={16} /> Déconnexion
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-2">
                                <Link href="/auth/login" className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                                    Se Connecter
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}