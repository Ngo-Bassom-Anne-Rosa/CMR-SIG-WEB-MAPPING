"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, MapPin, BarChart3, Star, Check } from 'lucide-react';
import { GeoJSONFeature, FeatureProperties } from "./types";
import { THEME_CONFIG } from "./constants";
import { API_BASE_URL } from "@/app/lib/config";
import { LoadingState } from "../ui/States"; // Import

interface SideDrawerProps {
    feature: GeoJSONFeature | null;
    activeFilter: string;
    onClose: () => void;
}

export default function SideDrawer({ feature, activeFilter, onClose }: SideDrawerProps) {
    const [details, setDetails] = useState<FeatureProperties | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // States
    const [isFavLoading, setIsFavLoading] = useState(false);
    const [isFavSuccess, setIsFavSuccess] = useState(false);

    const router = useRouter();
    const theme = THEME_CONFIG[activeFilter] || THEME_CONFIG.agriculture;
    const ThemeIcon = theme.icon;

    useEffect(() => {
        if (!feature) return;
        setIsFavSuccess(false);
        setIsLoading(true);
        setTimeout(() => {
            setDetails(feature.properties);
            setIsLoading(false);
        }, 300);
    }, [feature, activeFilter]);

    const handleGoToStats = () => {
        if (!details) return;
        const name = details.entity_name || details.nom_zone || details.name;
        if (name) router.push(`/dashboard/stats?compare_with=${encodeURIComponent(name)}`);
    };

    // add favoris logic
    const handleAddToFavorites = async () => {
        if (!details) return;
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Veuillez vous connecter pour ajouter des favoris.");
            return;
        }

        setIsFavLoading(true);
        try {
            const body = {
                admin_level: details.admin_level || 'D',
                entity_name: details.entity_name || details.nom_zone || details.name
            };

            const res = await fetch(`${API_BASE_URL}/profile/me/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setIsFavSuccess(true);
                setTimeout(() => setIsFavSuccess(false), 2000); // visual reset after 2s
            } else {
                const err = await res.json();
                if(res.status === 400 && err.msg.includes('déjà')) {
                    alert("Ce bassin est déjà dans vos favoris !");
                } else {
                    alert("Erreur lors de l'ajout.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erreur réseau.");
        } finally {
            setIsFavLoading(false);
        }
    };

    if (!feature) return null;

    const properties = details || feature.properties;
    const displayName = properties.entity_name || properties.nom_zone || properties.name || "Zone d'Intérêt";
    const regionName = properties.region_name || properties.adm1_name1 || "Cameroun";
    const production = properties.valeur_production ? parseFloat(properties.valeur_production.toString()).toLocaleString() : 'N/A';
    const unit = properties.unite_mesure || (activeFilter === 'elevage' ? 'Têtes' : 'Tonnes');

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 shadow-2xl overflow-hidden rounded-t-3xl md:rounded-3xl border border-slate-100 relative w-full md:w-96">
            
            {/* header */}
            <div className={`p-6 ${theme.bg} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <ThemeIcon size={120} className="text-white transform rotate-12 translate-x-4 -translate-y-4" />
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    {/* favoris */}
                    <button 
                        onClick={handleAddToFavorites}
                        disabled={isFavLoading || isFavSuccess}
                        className={`p-2 rounded-full transition-all backdrop-blur-sm ${isFavSuccess ? 'bg-white text-emerald-500' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                        title="Ajouter aux favoris"
                    >
                        {isFavLoading ? <Loader2 size={18} className="animate-spin"/> : isFavSuccess ? <Check size={18} /> : <Star size={18} />}
                    </button>

                    <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm">
                        <X size={18} />
                    </button>
                </div>

                <div className="relative z-10 text-white mt-4">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                        <MapPin size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">{regionName}</span>
                    </div>
                    <h2 className="text-3xl font-black leading-tight tracking-tight mb-1 truncate">{displayName}</h2>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
                        {properties.admin_level === 'R' ? 'Région' : 'Département'}
                    </span>
                </div>
            </div>

            {/* content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <LoadingState message="Récupération des données..." />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Production</p>
                                <p className={`text-xl font-black ${theme.text}`}>{production}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{unit}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Rendement</p>
                                <p className="text-xl font-black text-slate-800">{properties.rendement || '-'}</p>
                                <p className="text-[10px] text-slate-400 font-medium">T/Ha</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-sm text-slate-700">Données Brutes</div>
                            <div className="divide-y divide-slate-50">
                                {Object.entries(properties).map(([key, value]) => {
                                    if (['bbox', 'id', 'geom', 'geometry', 'user_id', 'admin_level', 'entity_name', 'nom_zone', 'valeur_production', 'rendement', 'unite_mesure'].includes(key.toLowerCase()) || value === null) return null;
                                    return (
                                        <div key={key} className="flex justify-between items-center p-4 text-sm hover:bg-slate-50 transition-colors">
                                            <span className="text-slate-500 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-slate-800 font-bold text-right max-w-[150px] truncate">{String(value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}