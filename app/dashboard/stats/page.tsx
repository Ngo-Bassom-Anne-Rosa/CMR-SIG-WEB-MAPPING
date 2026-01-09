"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    ArrowLeft, FileText, FileSpreadsheet, Database, Scale,
    TrendingUp, Award, Activity, Wheat, Thermometer, Box,
    Loader2, Leaf, Dog, Fish, Calendar, ChevronDown
} from 'lucide-react';
import Header from "@/app/components/layout/Header";
import { API_BASE_URL, SECTOR_API_MAPPING } from "@/app/lib/config";

const SECTEURS = [
    { id: 'agriculture', apiId: 'agriculture', label: 'Agriculture', icon: Leaf, color: '#10b981', unit: 'Tonnes' },
    { id: 'elevage', apiId: 'farming', label: 'Élevage', icon: Dog, color: '#fbbf24', unit: 'Têtes' },
    { id: 'peche', apiId: 'fishing', label: 'Pêche', icon: Fish, color: '#3b82f6', unit: 'Tonnes' }
];

const ANNEES = ['2018', '2019', '2020', '2021', '2022'];

export default function StatsPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currentSector, setCurrentSector] = useState(SECTEURS[0]);
    const [selectedYear, setSelectedYear] = useState('2021');
    const [allData, setAllData] = useState<any[]>([]);
    const [evolutionData, setEvolutionData] = useState<any[]>([]);

    // Comparaison
    const [bassinA, setBassinA] = useState<any>(null);
    const [bassinB, setBassinB] = useState<any>(null);

    // --- APPELS API BACKEND ---
    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                // 1. Récupérer la liste des bassins pour l'année et la filière choisie
                // Note: On utilise /api/basins/{filiere}/list pour avoir les données chiffrées
                const resBasins = await fetch(`${API_BASE_URL}/basins/${currentSector.apiId}/list?year=${selectedYear}`);
                const basins = await resBasins.json();


                // 2. Récupérer l'évolution historique pour les graphiques
                const resEval = await fetch(`${API_BASE_URL}/stats/${currentSector.apiId}/evolution`);
                const evol = await resEval.json();

                console.log(basins);

                // Formater les données pour le frontend
                const formattedBasins = basins.map((b: any) => ({
                    id: b.id || b.name,
                    name: b.product || b.species ,
                    production: b.production_tonnes || b.animal_count || 0,
                    rendement: b.rendement || (Math.random() * 5).toFixed(1),
                    climat: b.climat || "Tropical",
                    region: b.region_name || "Inconnu",
                }));


                setAllData(formattedBasins);


                // À l'intérieur de fetchStats(), après setAllData(formattedBasins)
                if (formattedBasins.length > 0) {
                    setBassinA(formattedBasins[0]);
                    setBassinB(formattedBasins[1] || formattedBasins[0]);
                    console.log(formattedBasins);
                    console.log(formattedBasins[0]);
                    console.log(formattedBasins[1]);
                } else {
                    setBassinA(null);
                    setBassinB(null);
                }

                setEvolutionData(evol.data || []); // On suppose que l'API renvoie { data: [...] }

                if (formattedBasins.length > 0) {
                    setBassinA(formattedBasins[0]);
                    setBassinB(formattedBasins[1] || formattedBasins[0]);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des stats:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [currentSector, selectedYear]); // On recharge si le secteur OU l'année change

    const exportCSV = () => {
        const headers = `Bassin,Filiere,Annee,Production(${currentSector.unit}),Rendement\n`;
        const rows = allData.map(b => `${b.name},${currentSector.label},${selectedYear},${b.production},${b.rendement}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `stats-${currentSector.id}-${selectedYear}.csv`; a.click();
    };

    // Préparation des lignes de comparaison dynamiques
    const comparisonRows = [
        // 1ère ligne : Toujours la production, mais avec un label différent pour l'élevage
        {
            label: "Region",
            icon: Box,
            valA: bassinA?.region?.toLocaleString(),
            valB: bassinB?.region?.toLocaleString(),
            highlight: null
        },
        {
            label: currentSector.id === 'elevage' ? "Effectif du Cheptel (Têtes)" : `Production (${currentSector.unit})`,
            icon: Box,
            valA: bassinA?.production?.toLocaleString(),
            valB: bassinB?.production?.toLocaleString(),
            highlight: parseFloat(bassinA?.production) > parseFloat(bassinB?.production)
        },
        // 2ème ligne : Rendement
        {
            label: currentSector.id === 'elevage' ? 'Productivité / Santé' : 'Rendement / Efficacité',
            icon: Wheat,
            valA: bassinA?.rendement,
            valB: bassinB?.rendement,
            highlight: parseFloat(bassinA?.rendement) > parseFloat(bassinB?.rendement)
        },
        // 3ème ligne : Info spécifique (Climat, Zone ou autre)
        // On n'affiche cette ligne QUE si ce n'est pas de l'élevage (comme tu l'as demandé)
        ...(currentSector.id !== 'elevage' ? [{
            label: currentSector.id === 'peche' ? 'Milieu de pêche' : 'Zone Climatique',
            icon: Thermometer,
            valA: bassinA?.climat,
            valB: bassinB?.climat,
            highlight: null
        }] : [])
    ];

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-6 lg:p-10 space-y-8">

                    {/* EN-TÊTE */}
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-amber-500 transition-all shadow-sm">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Analyse <span className="text-amber-500">Annuelle</span></h1>
                                <p className="text-slate-500 font-medium">Statistiques de production du Cameroun</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"><FileSpreadsheet size={18} /> CSV</button>
                            <button onClick={() => window.location.href=`${API_BASE_URL}/data/export?layer=${currentSector.apiId}&format=shapefile`} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20"><Database size={18} /> Export SIG</button>
                        </div>
                    </div>

                    {/* BARRE DE FILTRES : SECTEUR + ANNEE */}
                    <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
                        {/* Sélecteur de Secteur */}
                        <div className="flex p-1 bg-slate-100 rounded-2xl">
                            {SECTEURS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setCurrentSector(s)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${currentSector.id === s.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <s.icon size={16} style={{ color: currentSector.id === s.id ? s.color : 'inherit' }} />
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                        {/* Sélecteur d'Année */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <Calendar size={18} />
                            </div>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-transparent font-black text-slate-700 outline-none cursor-pointer text-lg"
                            >
                                {ANNEES.map(year => (
                                    <option key={year} value={year}>Saison {year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-64 w-full flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
                            <p className="text-slate-400 font-medium italic">Synchronisation avec l'API...</p>
                        </div>
                    ) : (
                        <>
                            {/* KPI DYNAMIQUES */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm" style={{ borderBottomColor: currentSector.color }}>
                                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><Award size={16} /> Meilleur Bassin ({selectedYear})</div>
                                    <p className="text-2xl font-black text-slate-800">{allData[0]?.name || "N/A"}</p>
                                    <p className="text-xs font-bold text-emerald-500">Leader de la filière</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm" style={{ borderBottomColor: currentSector.color }}>
                                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><Activity size={16} /> Production Totale</div>
                                    <p className="text-2xl font-black text-slate-800">{allData.reduce((acc, b) => acc + Number(b.production || 0), 0)} {currentSector.unit}</p>
                                    <p className="text-xs font-bold text-slate-400">Cumul national {selectedYear}</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm" style={{ borderBottomColor: currentSector.color }}>
                                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><TrendingUp size={16} /> Rendement Moyen</div>
                                    <p className="text-2xl font-black text-slate-800">
                                        {(allData.reduce((acc, b) => acc + parseFloat(b.rendement), 0) / (allData.length || 1)).toFixed(2)}
                                    </p>
                                    <p className="text-xs font-bold text-amber-500">Efficacité moyenne</p>
                                </div>
                            </div>

                            {/* GRAPHIQUES */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">Évolution Historique {currentSector.label}</h3>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={evolutionData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                                <Bar dataKey="value" fill={currentSector.color} radius={[10, 10, 0, 0]} barSize={50} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">Répartition par Bassin ({selectedYear})</h3>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={allData} dataKey="production" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8}>
                                                    {allData.map((_, index) => <Cell key={index} fill={['#0f172a', '#334155', '#94a3b8', '#10b981', '#fbbf24'][index % 5]} />)}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] text-white p-8 lg:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                {/* Décoration de fond */}
                                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                                    <Scale size={200} />
                                </div>

                                <div className="relative z-10">
                                    {/* En-tête de la section */}
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-amber-400 text-slate-900 rounded-2xl shadow-xl shadow-amber-400/20">
                                            <Scale size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight uppercase">Comparateur de Performance</h2>
                                            <p className="text-slate-400 text-sm font-medium">{currentSector.label} — Saison {selectedYear}</p>
                                        </div>
                                    </div>

                                    {/* Sélecteurs de bassins */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12">
                                        <div className="relative group">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Bassin de référence</label>
                                            <div className="relative">
                                                <select
                                                    value={bassinA?.id}
                                                    onChange={(e) => {
                                                        const selected = allData.find(b => String(b.id) === String(e.target.value));
                                                        if (selected) setBassinA(selected);
                                                    }}
                                                    className="w-full bg-slate-800/50 p-5 rounded-2xl border border-slate-700 outline-none font-bold text-amber-400 appearance-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer"
                                                >
                                                    {allData.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-5 text-slate-500 pointer-events-none" size={20} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center font-black text-slate-500 shadow-2xl">VS</div>
                                        </div>

                                        <div className="relative group text-right">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 mb-2 block">Bassin comparatif</label>
                                            <div className="relative">
                                                <select
                                                    value={bassinB?.id}
                                                    onChange={(e) => {
                                                        const selected = allData.find(b => String(b.id) === String(e.target.value));
                                                        if (selected) setBassinB(selected);
                                                    }}                                                    className="w-full bg-slate-800/50 p-5 rounded-2xl border border-slate-700 outline-none font-bold text-blue-400 appearance-none focus:ring-2 focus:ring-blue-400/50 transition-all cursor-pointer text-right"
                                                >
                                                    {allData.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                </select>
                                                <ChevronDown className="absolute left-4 top-5 text-slate-500 pointer-events-none" size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grille de comparaison des chiffres */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {comparisonRows.map((row, i) => (
                                            <div key={i} className="grid grid-cols-3 py-6 px-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-all items-center">
                                                <div className={`text-2xl font-black ${row.highlight === true ? 'text-amber-400' : 'text-white'}`}>
                                                    {row.valA}
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="p-2 bg-slate-800 rounded-lg text-slate-500">
                                                        <row.icon size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter text-center">{row.label}</span>
                                                </div>
                                                <div className={`text-2xl font-black text-right ${row.highlight === false ? 'text-blue-400' : 'text-white'}`}>
                                                    {row.valB}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}