/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: ./app/components/ui/Legend.tsx
"use client";
import React from 'react';

// Configuration correspondant aux styles SLD de GeoServer
const LEGEND_CONFIG: any = {
    agriculture: {
        title: "Production Agricole",
        unit: "Tonnes",
        items: [
            { label: "Faible (< 1k)", color: "#6EE7B7" }, // Menthe pâle
            { label: "Moyenne (1k - 10k)", color: "#10B981" }, // Émeraude
            { label: "Forte (> 10k)", color: "#047857" }  // Vert forêt
        ]
    },
    elevage: {
        title: "Densité Élevage",
        unit: "Têtes",
        items: [
            { label: "Faible (< 1k)", color: "#FDE68A" }, // Vanille
            { label: "Moyenne (1k - 10k)", color: "#F59E0B" }, // Ambre
            { label: "Forte (> 10k)", color: "#B45309" }  // Bronze
        ]
    },
    peche: {
        title: "Production Halieutique",
        unit: "Tonnes",
        items: [
            { label: "Faible (< 1k)", color: "#93C5FD" }, // Bleu glacier
            { label: "Moyenne (1k - 10k)", color: "#3B82F6" }, // Bleu roi
            { label: "Forte (> 10k)", color: "#1E40AF" }  // Bleu abysse
        ]
    }
};

export default function Legend({ activeFilter }: { activeFilter: string }) {
    // Fallback sur agriculture si la clé n'existe pas
    const config = LEGEND_CONFIG[activeFilter] || LEGEND_CONFIG.agriculture;

    return (
        <div className="absolute bottom-8 right-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 w-56 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">
                {config.title}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium mb-3 text-right border-b border-slate-100 pb-2">
                Unité : {config.unit}
            </p>
            
            <div className="space-y-2">
                {config.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                        <span 
                            className="block w-4 h-4 rounded-full shadow-sm border border-black/5" 
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-bold text-slate-600">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}