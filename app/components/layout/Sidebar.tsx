"use client";
import React from 'react';
import { MapPin, Leaf, Fish, Dog, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean; setIsOpen: (v: boolean) => void;
    activeTab: string; setActiveTab: (v: string) => void;
    selectedCulture: string; setSelectedCulture: (v: string) => void;
}

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab, selectedCulture, setSelectedCulture }: SidebarProps) {
    const cultures = ["Tous", "Cacao", "Café", "Maïs"];

    return (
        <aside className={`${isOpen ? 'w-80' : 'w-0'} fixed lg:relative z-50 h-full bg-[#0f172a] text-white transition-all duration-300 overflow-hidden`}>
            <div className="w-80 p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-400 rounded-lg"><MapPin className="text-slate-900" size={24} /></div>
                        <h1 className="text-xl font-bold">Agro-Sig <span className="text-amber-400">237</span></h1>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden"><X /></button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Secteurs</label>
                        {['agriculture', 'elevage', 'peche'].map((t) => (
                            <button key={t} onClick={() => setActiveTab(t)} className={`w-full flex items-center p-3 rounded-xl mb-2 transition-all ${activeTab === t ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}>
                                {t === 'agriculture' ? <Leaf size={18} className="mr-3 text-emerald-400" /> : t === 'elevage' ? <Dog size={18} className="mr-3 text-amber-400" /> : <Fish size={18} className="mr-3 text-blue-400" />}
                                <span className="capitalize">{t}</span>
                            </button>
                        ))}
                    </div>

                    {/* Sous-filtres Tâche 2.1 */}
                    {activeTab === 'agriculture' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Cultures</label>
                            <div className="grid grid-cols-2 gap-2">
                                {cultures.map(c => (
                                    <button key={c} onClick={() => setSelectedCulture(c)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedCulture === c ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}