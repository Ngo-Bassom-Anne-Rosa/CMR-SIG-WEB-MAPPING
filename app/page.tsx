"use client";
import React, { useState } from 'react';
import MapWrapper from "./components/map/MapWrapper";
import { MapPin, Leaf, Fish, Dog, Search, Menu, X, BarChart3, ChevronRight, Settings } from 'lucide-react';

export default function AgroSigDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('agriculture');

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">

            {/* SIDEBAR DYNAMIQUE */}
            <aside className={`
        ${isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0'} 
        fixed inset-y-0 left-0 z-50 bg-[#0f172a] text-white transition-all duration-300 ease-in-out lg:relative lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-400 rounded-lg shadow-lg shadow-amber-400/20">
                                <MapPin className="text-slate-900" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Agro-Sig <span className="text-amber-400">237</span></h1>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Intelligence Géographique [cite: 5]</p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-800 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation / Filtres [cite: 49, 53] */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-8">
                        <section>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4 block">Filières Économiques</label>
                            <div className="space-y-2">
                                {[
                                    { id: 'agriculture', icon: Leaf, label: 'Agriculture', color: 'bg-emerald-500', light: 'bg-emerald-500/10' },
                                    { id: 'elevage', icon: Dog, label: 'Élevage', color: 'bg-amber-500', light: 'bg-amber-500/10' },
                                    { id: 'peche', icon: Fish, label: 'Pêche', color: 'bg-blue-500', light: 'bg-blue-500/10' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${activeTab === item.id ? 'bg-slate-800 ring-1 ring-slate-700' : 'hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${activeTab === item.id ? item.color : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                                                <item.icon size={18} />
                                            </div>
                                            <span className={`text-sm font-medium ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
                                        </div>
                                        {activeTab === item.id && <ChevronRight size={14} className="text-slate-500" />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4 block">Divisions Admin [cite: 10]</label>
                            <div className="px-2 space-y-4">
                                <div className="flex items-center justify-between text-sm text-slate-400">
                                    <span>Régions (10)</span>
                                    <input type="checkbox" defaultChecked className="accent-amber-400 h-4 w-4" />
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-400">
                                    <span>Départements (58)</span>
                                    <input type="checkbox" className="accent-amber-400 h-4 w-4" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Sidebar Info [cite: 74] */}
                    <div className="p-4 bg-slate-900/50 m-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-amber-400">
                            <BarChart3 size={16} />
                            <span className="text-xs font-bold uppercase tracking-tighter">Livrable Public [cite: 73]</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                            "Cartographier les bassins pour visualiser les principaux producteurs." [cite: 7]
                        </p>
                    </div>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <main className="flex-1 flex flex-col relative min-w-0">

                {/* HEADER GLASSMORPHISM */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-8 justify-between z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setSidebarOpen(true)} className={`${isSidebarOpen ? 'hidden' : 'block'} p-2 hover:bg-slate-100 rounded-lg text-slate-600`}>
                            <Menu size={20} />
                        </button>
                        <div className="relative w-full max-w-lg hidden sm:block">
                            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher un bassin économique... [cite: 58]"
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase italic">Groupe de 5 Étudiants [cite: 3]</p>
                            <p className="text-xs font-semibold text-slate-700">SIG Web Cameroon 2025</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 border border-slate-300">
                            <Settings size={18} />
                        </div>
                    </div>
                </header>

                {/* ZONE DE CARTE AVEC WIDGETS FLOTTANTS */}
                <div className="flex-1 relative z-0">
                    <MapWrapper />

                    {/* Widget Légende [cite: 48] */}
                    <div className="absolute bottom-6 right-6 p-5 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl z-[1000] border border-white/20 w-56 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest border-b pb-2">Niveau de Production [cite: 36]</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Zone Majeure', color: 'bg-emerald-600' },
                                { label: 'Zone Active', color: 'bg-emerald-400' },
                                { label: 'Zone Émergente', color: 'bg-emerald-100' }
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className={`w-3.5 h-3.5 rounded-md ${item.color} shadow-sm`}></div>
                                    <span className="text-[11px] text-slate-600 font-bold uppercase tracking-tighter">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badge Statistique Rapide (Interessant/Attractif) */}
                    <div className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl z-[1000] border border-white/20 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <BarChart3 size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Bassin Dominant [cite: 7]</p>
                                <p className="text-sm font-black text-slate-800 tracking-tight">Zone Littorale (Pêche) [cite: 21]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}