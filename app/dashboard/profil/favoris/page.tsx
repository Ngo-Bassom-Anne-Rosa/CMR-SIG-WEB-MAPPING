'use client';
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Trash2, Loader2, Info, ServerCrash, MapPin, Layers, Map as MapIcon, Search, Filter } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";

type Favorite = {
    user_id: number;
    admin_level: 'R' | 'D' | 'A';
    entity_name: string;
    added_at: string;
};

export default function FavoritesPage() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters stats
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'R' | 'D'>('ALL');

    const fetchFavorites = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Session expirée. Veuillez vous reconnecter.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/profile/me/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Impossible de charger les favoris.");
            const data = await res.json();
            setFavorites(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const handleRemove = async (entityName: string) => {
        const originalFavorites = [...favorites];
        setFavorites(favorites.filter(fav => fav.entity_name !== entityName));

        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/profile/me/favorites`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ entity_name: entityName }),
            });
            if (!res.ok) throw new Error();
        } catch (err) {
            setFavorites(originalFavorites);
            alert("Impossible de supprimer ce favori.");
        }
    };

    const handleGoToMap = (name: string) => {
        router.push(`/dashboard?target=${encodeURIComponent(name)}`);
    }

    // filter & groupment logic
    const filteredFavorites = favorites.filter(fav => {
        const matchesSearch = fav.entity_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || fav.admin_level === filterType;
        return matchesSearch && matchesType;
    });

    const regions = filteredFavorites.filter(f => f.admin_level === 'R');
    const departments = filteredFavorites.filter(f => f.admin_level === 'D');

    // Global Stats
    const stats = {
        total: favorites.length,
        regions: favorites.filter(f => f.admin_level === 'R').length,
        departments: favorites.filter(f => f.admin_level === 'D').length,
    };

    // Render list helper
    const RenderList = ({ items, label, icon: Icon, colorClass }: { items: Favorite[], label: string, icon: any, colorClass: string }) => (
        <div className="mb-6 last:mb-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                <Icon size={14}/> {label} ({items.length})
            </h3>
            <div className="space-y-3">
                {items.map(fav => (
                    <div 
                        key={fav.entity_name} 
                        className="flex justify-between items-center p-4 bg-slate-50 hover:bg-white hover:shadow-md rounded-xl border border-slate-100 transition-all group cursor-pointer" 
                        onClick={() => handleGoToMap(fav.entity_name)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg text-white transition-colors ${colorClass}`}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg">{fav.entity_name}</p>
                                <span className="text-xs font-medium text-slate-400">Ajouté le {new Date(fav.added_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleRemove(fav.entity_name); }} 
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Supprimer"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-amber-500 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mes Favoris</h1>
                        <p className="text-slate-500 font-medium">Accès rapide à vos zones clés.</p>
                    </div>
                </div>

                {/* Stats */}
                {!isLoading && !error && favorites.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Star size={20}/></div>
                            <div>
                                <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><MapIcon size={20}/></div>
                            <div>
                                <p className="text-2xl font-black text-slate-800">{stats.regions}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase">Régions</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Layers size={20}/></div>
                            <div>
                                <p className="text-2xl font-black text-slate-800">{stats.departments}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase">Départements</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100 min-h-[400px]">
                    {/* Filters bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-6 border-b border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Rechercher un favori..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setFilterType('ALL')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filterType === 'ALL' ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                Tous
                            </button>
                            <button 
                                onClick={() => setFilterType('R')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${filterType === 'R' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-500'}`}
                            >
                                <MapIcon size={16}/> <span className="hidden sm:inline">Régions</span>
                            </button>
                            <button 
                                onClick={() => setFilterType('D')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${filterType === 'D' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-500'}`}
                            >
                                <Layers size={16}/> <span className="hidden sm:inline">Départements</span>
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    {isLoading ? (
                         <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={32}/></div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500 flex flex-col items-center gap-2"><ServerCrash size={24}/>{error}</div>
                    ) : filteredFavorites.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center gap-3">
                            <Info size={32} className="text-slate-300"/>
                            <p className="text-slate-500 font-medium">Aucun résultat trouvé.</p>
                            {searchTerm && <p className="text-sm text-slate-400">Essayez une autre recherche.</p>}
                        </div>
                    ) : (
                        <div>
                            {regions.length > 0 && <RenderList items={regions} label="Régions" icon={MapIcon} colorClass="bg-blue-500" />}
                            {departments.length > 0 && <RenderList items={departments} label="Départements" icon={Layers} colorClass="bg-emerald-500" />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}