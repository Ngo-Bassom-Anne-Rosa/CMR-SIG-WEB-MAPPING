"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, MapPin, BarChart3 } from 'lucide-react';
import { GeoJSONFeature, FeatureProperties } from "./types";
import { THEME_CONFIG } from "./constants";

interface SideDrawerProps {
    feature: GeoJSONFeature | null;
    activeFilter: string;
    onClose: () => void;
}

export default function SideDrawer({ feature, activeFilter, onClose }: SideDrawerProps) {
    const [details, setDetails] = useState<FeatureProperties | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const theme = THEME_CONFIG[activeFilter] || THEME_CONFIG.agriculture;
    const ThemeIcon = theme.icon;

    useEffect(() => {
        if (!feature) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                // Ici, on simule une récupération ou on utilise directement les propriétés du GeoJSON
                // Si vous avez besoin d'appeler votre API backend pour plus de détails, faites-le ici.
                setDetails(feature.properties);
            } catch (error) {
                console.error(error);
                setDetails(feature.properties);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [feature, activeFilter]);

    const handleGoToStats = () => {
        if (!details) return;
        const name = details.entity_name || details.nom_zone || details.name;
        if (name) {
            router.push(`/dashboard/stats?compare_with=${encodeURIComponent(name)}`);
        }
    };

    if (!feature) return null;

    const properties = details || feature.properties;
    const displayName = properties.entity_name || properties.nom_zone || properties.name || "Zone d'Intérêt";
    const regionName = properties.region_name || properties.adm1_name1 || "Cameroun";
    const production = properties.valeur_production ? parseFloat(properties.valeur_production.toString()).toLocaleString() : 'N/A';
    const unit = properties.unite_mesure || (activeFilter === 'elevage' ? 'Têtes' : 'Tonnes');

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 shadow-2xl overflow-hidden rounded-3xl border border-slate-100 relative">
            
            {/* --- HEADER --- */}
            <div className={`p-6 ${theme.bg} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <ThemeIcon size={120} className="text-white transform rotate-12 translate-x-4 -translate-y-4" />
                </div>
                
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10 backdrop-blur-sm">
                    <X size={18} />
                </button>

                <div className="relative z-10 text-white mt-4">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                        <MapPin size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">{regionName}</span>
                    </div>
                    <h2 className="text-3xl font-black leading-tight tracking-tight mb-1">{displayName}</h2>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
                        {properties.admin_level === 'R' ? 'Région' : 'Département'}
                    </span>
                </div>
            </div>

            {/* --- CONTENU --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className={`animate-spin ${theme.text}`} size={40}/>
                    </div>
                ) : (
                    <>
                        {/* KPI PRINCIPAUX */}
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

                        {/* LISTE DE DETAILS */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-sm text-slate-700">
                                Informations Détaillées
                            </div>
                            <div className="divide-y divide-slate-50">
                                {Object.entries(properties).map(([key, value]) => {
                                    // Exclusion des clés techniques
                                    if (['bbox', 'id', 'geom', 'geometry', 'user_id', 'admin_level', 'entity_name', 'nom_zone', 'valeur_production', 'rendement'].includes(key.toLowerCase()) || value === null) return null;
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

            {/* --- FOOTER --- */}
            <div className="p-6 bg-white border-t border-slate-100">
                <button 
                    onClick={handleGoToStats}
                    className={`w-full py-4 ${theme.bg} hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-${theme.color}-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95`}
                >
                    <BarChart3 size={20} />
                    Voir les statistiques complètes
                </button>
            </div>
        </div>
    );
}