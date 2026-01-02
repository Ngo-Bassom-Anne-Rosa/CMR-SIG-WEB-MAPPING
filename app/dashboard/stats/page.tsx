"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend as RechartsLegend 
} from 'recharts';
import { 
    ArrowLeft, FileText, FileSpreadsheet, Database, Scale, 
    TrendingUp, Award, Activity, Wheat, Thermometer, Box, 
    Loader2, Leaf, Dog, Fish, ChevronRight
} from 'lucide-react';
import Header from "@/app/components/layout/Header";

// --- CONFIGURATION ---
const WFS_URL = "https://apodemal-kathern-semisentimentalized.ngrok-free.dev/geoserver/sig_cmr_web_mapping/ows";

const SECTEURS = [
    { id: 'agriculture', label: 'Agriculture', icon: Leaf, color: '#10b981', unit: 'Tonnes' },
    { id: 'elevage', label: 'Élevage', icon: Dog, color: '#fbbf24', unit: 'Têtes' },
    { id: 'peche', label: 'Pêche', icon: Fish, color: '#3b82f6', unit: 'Tonnes' }
];

export default function StatsPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currentSector, setCurrentSector] = useState(SECTEURS[0]);
    const [allData, setAllData] = useState<any[]>([]);

    // Comparaison (Tâche 3.2)
    const [bassinA, setBassinA] = useState<any>(null);
    const [bassinB, setBassinB] = useState<any>(null);

    // --- RÉCUPÉRATION GEOSERVER (WFS) ---
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const params = new URLSearchParams({
                service: 'WFS', version: '1.0.0', request: 'GetFeature',
                typeName: 'sig_cmr_web_mapping:regions', outputFormat: 'application/json',
                // Ici, on pourrait ajouter un CQL_FILTER pour filtrer par filière si GeoServer le permet
                // ex: CQL_FILTER: `filiere='${currentSector.id}'`
            });

            try {
                const response = await fetch(`${WFS_URL}?${params.toString()}`);
                const data = await response.json();
                
                const formatted = data.features.map((f: any) => ({
                    id: f.id,
                    name: f.properties.nom_reg || "Région",
                    // On simule des données différentes selon le secteur sélectionné
                    production: Math.floor(Math.random() * (currentSector.id === 'elevage' ? 50000 : 8000) + 2000),
                    rendement: (Math.random() * 5 + 1).toFixed(1),
                    climat: f.properties.climat || "Tropical Humide",
                    evolution: [
                        { year: '2022', prod: Math.floor(Math.random() * 5000) },
                        { year: '2023', prod: Math.floor(Math.random() * 6000) },
                        { year: '2024', prod: Math.floor(Math.random() * 7000) },
                    ]
                }));

                setAllData(formatted);
                setBassinA(formatted[0]);
                setBassinB(formatted[1] || formatted[0]);
            } catch (err) {
                console.error("Erreur WFS:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [currentSector]); // Recharge les données quand on change de filière

    // --- EXPORTS (Tâche 4.2) ---
    const exportCSV = () => {
        const headers = `Bassin,Filiere,Production(${currentSector.unit}),Rendement\n`;
        const rows = allData.map(b => `${b.name},${currentSector.label},${b.production},${b.rendement}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `stats-${currentSector.id}.csv`; a.click();
    };

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-slate-400 mb-4" size={40} />
            <p className="text-slate-500 font-bold italic tracking-widest">Chargement des données {currentSector.label}...</p>
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
            <main className="flex-1 flex flex-col overflow-y-auto">
                <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                <div className="p-6 lg:p-10 space-y-8">
                    
                    {/* EN-TÊTE & EXPORTS (Tâche 4.2) */}
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-amber-500 transition-all shadow-sm">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Analyse <span className="text-amber-500">Multifilière</span></h1>
                                <p className="text-slate-500 font-medium">Statistiques géo-référencées du Cameroun</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"><FileText size={18} /> PDF</button>
                            <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"><FileSpreadsheet size={18} /> CSV</button>
                            <button onClick={() => window.location.href=`${WFS_URL}?request=GetFeature&typeName=sig_cmr_web_mapping:regions&outputFormat=SHAPE-ZIP`} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20"><Database size={18} /> Shapefile</button>
                        </div>
                    </div>

                    {/* SÉLECTEUR DE FILIÈRE (Tâche 3.1) */}
                    <div className="flex p-1.5 bg-slate-200/50 rounded-[2rem] w-fit shadow-inner">
                        {SECTEURS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setCurrentSector(s)}
                                className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${currentSector.id === s.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <s.icon size={18} style={{ color: currentSector.id === s.id ? s.color : 'inherit' }} />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* KPI DYNAMIQUES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm" style={{ borderBottomColor: currentSector.color }}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><Award size={16} /> Leader {currentSector.label}</div>
                            <p className="text-2xl font-black text-slate-800">{allData[1]?.name}</p>
                            <p className="text-xs font-bold text-emerald-500">+22% de croissance annuelle</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm" style={{ borderBottomColor: currentSector.color }}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><Activity size={16} /> Volume Total</div>
                            <p className="text-2xl font-black text-slate-800">{allData.reduce((acc, b) => acc + b.production, 0).toLocaleString()} {currentSector.unit}</p>
                            <p className="text-xs font-bold text-slate-400">Données GeoServer 2025</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm" style={{ borderBottomColor: currentSector.color }}>
                            <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><TrendingUp size={16} /> Rendement Moyen</div>
                            <p className="text-2xl font-black text-slate-800">3.4</p>
                            <p className="text-xs font-bold text-amber-500">Efficacité Zone {currentSector.label}</p>
                        </div>
                    </div>

                    {/* GRAPHIQUES (Tâche 3.1) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">Évolution {currentSector.label} (Annuelle)</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bassinA?.evolution}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                        <Bar dataKey="prod" fill={currentSector.color} radius={[10, 10, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">Part de Production par Bassin</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={allData} dataKey="production" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8}>
                                            {allData.map((_, index) => <Cell key={index} fill={['#0f172a', '#334155', '#94a3b8', '#cbd5e1'][index % 4]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* COMPARATEUR (Tâche 3.2) */}
                    <div className="bg-[#0f172a] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5"><Scale size={180} /></div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-amber-400 rounded-2xl text-slate-900"><Scale size={24} /></div>
                            <h2 className="text-2xl font-black italic tracking-tight">Comparaison Directe {currentSector.label}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-10">
                            <select value={bassinA?.id} onChange={(e) => setBassinA(allData.find(b => b.id === e.target.value))} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 outline-none font-bold text-amber-400">
                                {allData.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            <div className="flex flex-col items-center"><div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center font-black text-slate-500">VS</div></div>
                            <select value={bassinB?.id} onChange={(e) => setBassinB(allData.find(b => b.id === e.target.value))} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 outline-none font-bold text-amber-400">
                                {allData.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: `Production (${currentSector.unit})`, icon: Box, valA: bassinA?.production, valB: bassinB?.production },
                                { label: 'Index Rendement', icon: Wheat, valA: bassinA?.rendement, valB: bassinB?.rendement },
                                { label: 'Zone Climatique', icon: Thermometer, valA: bassinA?.climat, valB: bassinB?.climat },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-3 py-6 border-b border-slate-800 items-center px-4 hover:bg-white/5 transition-all">
                                    <div className="text-xl font-black">{row.valA}</div>
                                    <div className="flex flex-col items-center gap-1">
                                        <row.icon size={16} className="text-slate-500" />
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter text-center">{row.label}</span>
                                    </div>
                                    <div className="text-xl font-black text-right">{row.valB}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}