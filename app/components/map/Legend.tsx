'use client';
import React from 'react';
import { Leaf, Dog, Fish } from 'lucide-react';

// --- TYPES POUR UNE LÉGENDE ROBUSTE ---
type LegendColorItem = {
    type: 'color';
    color: string;
    label: string;
};

type LegendCircleItem = {
    type: 'circle';
    color: string;
    label: string;
    sizeFactor: number; // ex: 1 pour 100%, 0.7 pour 70%
};

type LegendPatternItem = {
    type: 'pattern';
    patternId: 'slash' | 'x' | 'dot';
    color: string;
    label: string;
};

type LegendItem = LegendColorItem | LegendCircleItem | LegendPatternItem;

interface LegendData {
    title: string;
    icon: React.ElementType;
    colorClass: string;
    items: LegendItem[];
}

// --- DÉFINITION DES DONNÉES DE LÉGENDE ---
const LEGENDS: Record<string, LegendData> = {
    agriculture: {
        title: 'Production Agricole',
        icon: Leaf,
        colorClass: 'text-emerald-500',
        items: [
            { type: 'color', color: '#059669', label: '> 250,000 Tonnes' },
            { type: 'color', color: '#34d399', label: '50k - 250k Tonnes' },
            { type: 'color', color: '#a7f3d0', label: '< 50,000 Tonnes' },
        ]
    },
    elevage: {
        title: 'Densité du Cheptel',
        icon: Dog,
        colorClass: 'text-amber-500',
        items: [
            { type: 'circle', color: '#FBBF24', label: 'Élevée', sizeFactor: 1 },
            { type: 'circle', color: '#FBBF24', label: 'Moyenne', sizeFactor: 0.7 },
            { type: 'circle', color: '#FBBF24', label: 'Faible', sizeFactor: 0.4 },
        ]
    },
    peche: {
        title: 'Types de Pêche',
        icon: Fish,
        colorClass: 'text-blue-500',
        items: [
            { type: 'pattern', patternId: 'slash', color: '#3B82F6', label: 'Maritime' },
            { type: 'pattern', patternId: 'x', color: '#10B981', label: 'Continentale' },
            { type: 'pattern', patternId: 'dot', color: '#8B5CF6', label: 'Aquaculture' },
        ]
    }
};

// --- LE COMPOSANT ---
interface LegendProps {
    activeFiliere: string;
}

export default function Legend({ activeFiliere }: LegendProps) {
    const data = LEGENDS[activeFiliere];

    if (!data) return null;

    const Icon = data.icon;

    return (
        <div className="absolute bottom-10 right-6 z-[1000] p-4 bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-lg w-56 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-200">
                <Icon className={data.colorClass} size={18} />
                <h3 className="font-bold text-sm text-slate-700">{data.title}</h3>
            </div>
            <ul className="space-y-2">
                {data.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                            {item.type === 'color' && (
                                <div className="w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: item.color }}></div>
                            )}
                            {item.type === 'circle' && (
                                <div className="rounded-full border-2 border-white/50 shadow-sm opacity-70" style={{ backgroundColor: item.color, width: `${item.sizeFactor * 16}px`, height: `${item.sizeFactor * 16}px` }}></div>
                            )}
                            {item.type === 'pattern' && (
                                <svg width="16" height="16" className="rounded-sm border" style={{ borderColor: item.color }}>
                                    <defs>
                                        <pattern id="slash" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: '#3B82F6', strokeWidth: 1.5 }} /></pattern>
                                        <pattern id="x" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2 M-1,3 l2,2 M0,0 l4,4 M3,-1 l2,2" style={{ stroke: '#10B981', strokeWidth: 1 }} /></pattern>
                                        <pattern id="dot" patternUnits="userSpaceOnUse" width="5" height="5"><circle cx="2.5" cy="2.5" r="1.2" style={{ fill: '#8B5CF6' }} /></pattern>
                                    </defs>
                                    <rect width="16" height="16" style={{ fill: `url(#${item.patternId})` }} />
                                </svg>
                            )}
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}