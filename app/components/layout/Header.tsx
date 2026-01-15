'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Search, User, LogOut, ChevronDown, Star, Home, Loader2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { API_BASE_URL, SECTOR_API_MAPPING } from '@/app/lib/config';

type UserProfileHeader = {
    email: string;
    first_name?: string;
};

interface HeaderProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    activeTab?: string;
    onSearchResult?: (result: any) => void;
}

export default function Header({ isSidebarOpen, setSidebarOpen, activeTab = 'agriculture', onSearchResult }: HeaderProps) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<UserProfileHeader | null>(null);

    // Search states
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close results if click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load profil info
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/profile/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setUser(await res.json());
            } catch (error) { console.error(error); }
        };
        fetchUser();
    }, []);

    // Search logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            const apiFiliere = SECTOR_API_MAPPING[activeTab] || 'agriculture';
            
            try {
                const res = await fetch(`${API_BASE_URL}/basins/${apiFiliere}/list?year=2021`); // default year
                if (res.ok) {
                    const data = await res.json();
                    
                    // Simple filtering
                    const filtered = data.filter((item: any) => 
                        item.entity_name?.toLowerCase().includes(query.toLowerCase()) ||
                        item.nom_zone?.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5); // Limit to 5 results

                    setResults(filtered);
                    setShowResults(true);
                }
            } catch (err) {
                console.error("Erreur recherche", err);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [query, activeTab]);

    const handleSelectResult = (item: any) => {
        setQuery(item.entity_name || item.nom_zone);
        setShowResults(false);
        if (onSearchResult) {
            onSearchResult(item);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    return (
        <header className="h-20 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 flex items-center px-4 sm:px-6 lg:px-8 justify-between z-2000 sticky top-0 shadow-sm">
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(true)} 
                    className={`${isSidebarOpen ? 'hidden lg:hidden' : 'block'} p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all shadow-sm`}
                >
                    <Menu size={20} />
                </button>
                <div className="hidden md:block">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Tableau de Bord</h1>
                    <p className="text-xs text-slate-500 capitalize">Filière : {activeTab}</p>
                </div>
            </div>

            {/* --- Search Bar --- */}
            <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                        {isSearching ? <Loader2 size={20} className="animate-spin"/> : <Search size={20} />}
                    </div>
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if(results.length > 0) setShowResults(true); }}
                        placeholder={`Rechercher un bassin dans ${activeTab}...`} 
                        className="w-full bg-slate-100/50 border border-slate-200 text-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium placeholder:text-slate-400"
                    />
                </div>

                {/* Results Dropdown */}
                {showResults && results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Résultats suggérés</p>
                            {results.map((item, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSelectResult(item)}
                                    className="w-full text-left flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl transition-colors group"
                                >
                                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{item.entity_name || item.nom_zone}</p>
                                        <p className="text-xs text-slate-400">{item.region_name || 'Cameroun'} • {item.admin_level === 'R' ? 'Région' : 'Département'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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
                                        <Home size={16} /> Page d&apos;accueil
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