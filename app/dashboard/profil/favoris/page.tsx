'use client';
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Trash2, Loader2, Info, ServerCrash } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";

type Favorite = {
    user_id: number;
    admin_level: 'R' | 'D' | 'A';
    entity_name: string;
    added_at: string;
};

export default function FavoritesPage() {
    const router = useRouter(); // On initialise le router de Next.js
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFavorites = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Session invalide. Veuillez vous reconnecter.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/profile/me/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Impossible de charger les favoris depuis le serveur.");
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
        if (!token) {
            setError("Votre session a expiré.");
            setFavorites(originalFavorites);
            return;
        }
        
        try {
            const res = await fetch(`${API_BASE_URL}/profile/me/favorites`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ entity_name: entityName }),
            });
            if (!res.ok) {
                throw new Error("Échec de la suppression côté serveur.");
            }
        } catch (err) {
            setFavorites(originalFavorites); // Rollback en cas d'erreur
            setError("Erreur réseau lors de la suppression.");
        }
    };

    const getLevelLabel = (level: 'R' | 'D' | 'A') => {
        if (level === 'R') return "Région";
        if (level === 'D') return "Département";
        if (level === 'A') return "Arrondissement";
        return "N/A";
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    {/* --- CORRECTION DU BOUTON RETOUR --- */}
                    <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-amber-500 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mes Favoris</h1>
                        <p className="text-slate-500 font-medium">Accès rapide à vos bassins de production préférés.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Star size={24} /></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Bassins Enregistrés</h2>
                            <p className="text-sm text-slate-500">Cliquez sur la corbeille pour supprimer un favori.</p>
                        </div>
                    </div>
                    
                    {isLoading ? (
                         <div className="text-center py-10"><Loader2 className="animate-spin text-amber-500 mx-auto" size={32}/></div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500 flex flex-col items-center gap-2"><ServerCrash size={24}/>{error}</div>
                    ) : favorites.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center gap-3">
                            <Info size={32} className="text-slate-300"/>
                            <p className="text-slate-500 font-medium">Vous n'avez pas encore de favoris.</p>
                            <p className="text-sm text-slate-400">Cliquez sur une zone sur la carte pour l'ajouter.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {favorites.map(fav => (
                                <div key={fav.entity_name} className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors group">
                                    <div>
                                        <p className="font-bold text-slate-800">{fav.entity_name}</p>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{getLevelLabel(fav.admin_level)}</span>
                                    </div>
                                    <button onClick={() => handleRemove(fav.entity_name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}