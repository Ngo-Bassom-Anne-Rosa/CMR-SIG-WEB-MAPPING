"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  FileSpreadsheet,
  Database,
  Scale,
  TrendingUp,
  Award,
  Activity,
  Wheat,
  Thermometer,
  Box,
  Loader2,
  Leaf,
  Dog,
  Fish,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";

const SECTEURS = [
  {
    id: "agriculture",
    apiId: "agriculture",
    label: "Agriculture",
    icon: Leaf,
    color: "#10b981",
    unit: "Tonnes",
  },
  {
    id: "elevage",
    apiId: "farming",
    label: "Élevage",
    icon: Dog,
    color: "#fbbf24",
    unit: "Têtes",
  },
  {
    id: "peche",
    apiId: "fishing",
    label: "Pêche",
    icon: Fish,
    color: "#3b82f6",
    unit: "Tonnes",
  },
];

const ANNEES = ["2018", "2019", "2020", "2021", "2022"];

export default function StatsPage() {
  // const [isSidebarOpen, setSidebarOpen] = useState(true); // Non utilisé dans cette page spécifique
  const [loading, setLoading] = useState(true);
  const [currentSector, setCurrentSector] = useState(SECTEURS[0]);
  const [selectedYear, setSelectedYear] = useState("2021");
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
        const resBasins = await fetch(
          `${API_BASE_URL}/basins/${currentSector.apiId}/list?year=${selectedYear}`
        );
        const basins = await resBasins.json();

        // 2. Récupérer l'évolution historique pour les graphiques
        const resEval = await fetch(
          `${API_BASE_URL}/stats/${currentSector.apiId}/evolution`
        );
        const evol = await resEval.json();

        // Formater les données pour le frontend
        const formattedBasins = basins.map((b: any) => ({
          id: b.id || b.name,
          name: b.product || b.species,
          production: b.production_tonnes || b.animal_count || 0,
          rendement: b.rendement || (Math.random() * 5).toFixed(1),
          climat: b.climat || "Tropical",
          region: b.region_name || "Inconnu",
        }));

        setAllData(formattedBasins);

        // Initialiser le comparateur
        if (formattedBasins.length > 0) {
          setBassinA(formattedBasins[0]);
          setBassinB(formattedBasins[1] || formattedBasins[0]);
        } else {
          setBassinA(null);
          setBassinB(null);
        }

        setEvolutionData(evol.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [currentSector, selectedYear]);

  const exportCSV = () => {
    const headers = `Bassin,Filiere,Annee,Production(${currentSector.unit}),Rendement\n`;
    const rows = allData
      .map(
        (b) =>
          `${b.name},${currentSector.label},${selectedYear},${b.production},${b.rendement}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-${currentSector.id}-${selectedYear}.csv`;
    a.click();
  };

  // Préparation des lignes de comparaison dynamiques
  const comparisonRows = [
    {
      label: "Région Administrative",
      icon: Box,
      valA: bassinA?.region?.toLocaleString(),
      valB: bassinB?.region?.toLocaleString(),
      highlight: null, // Pas de vainqueur pour du texte
    },
    {
      label:
        currentSector.id === "elevage"
          ? "Effectif du Cheptel"
          : `Production (${currentSector.unit})`,
      icon: Box,
      valA: bassinA?.production?.toLocaleString(),
      valB: bassinB?.production?.toLocaleString(),
      // Logique de surbrillance : True si A > B, False si B > A
      highlight:
        parseFloat(bassinA?.production) > parseFloat(bassinB?.production),
    },
    {
      label:
        currentSector.id === "elevage" ? "Indice de Santé" : "Rendement / Ha",
      icon: Wheat,
      valA: bassinA?.rendement,
      valB: bassinB?.rendement,
      highlight:
        parseFloat(bassinA?.rendement) > parseFloat(bassinB?.rendement),
    },
    ...(currentSector.id !== "elevage"
      ? [
          {
            label:
              currentSector.id === "peche" ? "Type d'eau" : "Zone Climatique",
            icon: Thermometer,
            valA: bassinA?.climat,
            valB: bassinB?.climat,
            highlight: null,
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 lg:p-10 space-y-8">
          {/* EN-TÊTE */}
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-amber-500 transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  Analyse <span className="text-amber-500">Annuelle</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Statistiques de production du Cameroun
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
              >
                <FileSpreadsheet size={18} /> CSV
              </button>
              <button
                onClick={() =>
                  (window.location.href = `${API_BASE_URL}/data/export?layer=${currentSector.apiId}&format=shapefile`)
                }
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20"
              >
                <Database size={18} /> Export SIG
              </button>
            </div>
          </div>

          {/* BARRE DE FILTRES */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              {SECTEURS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSector(s)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    currentSector.id === s.id
                      ? "bg-white text-slate-900 shadow-md"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <s.icon
                    size={16}
                    style={{
                      color: currentSector.id === s.id ? s.color : "inherit",
                    }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Calendar size={18} />
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-black text-slate-700 outline-none cursor-pointer text-lg"
              >
                {ANNEES.map((year) => (
                  <option key={year} value={year}>
                    Saison {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="h-64 w-full flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
              <p className="text-slate-400 font-medium italic">
                Synchronisation avec l'API...
              </p>
            </div>
          ) : (
            <>
              {/* KPI DYNAMIQUES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm"
                  style={{ borderBottomColor: currentSector.color }}
                >
                  <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <Award size={16} /> Meilleur Bassin ({selectedYear})
                  </div>
                  <p className="text-2xl font-black text-slate-800">
                    {allData[0]?.name || "N/A"}
                  </p>
                  <p className="text-xs font-bold text-emerald-500">
                    Leader de la filière
                  </p>
                </div>
                <div
                  className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm"
                  style={{ borderBottomColor: currentSector.color }}
                >
                  <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <Activity size={16} /> Production Totale
                  </div>
                  <p className="text-2xl font-black text-slate-800">
                    {allData
                      .reduce((acc, b) => acc + Number(b.production || 0), 0)
                      .toLocaleString()}{" "}
                    {currentSector.unit}
                  </p>
                  <p className="text-xs font-bold text-slate-400">
                    Cumul national {selectedYear}
                  </p>
                </div>
                <div
                  className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm"
                  style={{ borderBottomColor: currentSector.color }}
                >
                  <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <TrendingUp size={16} /> Rendement Moyen
                  </div>
                  <p className="text-2xl font-black text-slate-800">
                    {(
                      allData.reduce(
                        (acc, b) => acc + parseFloat(b.rendement),
                        0
                      ) / (allData.length || 1)
                    ).toFixed(2)}
                  </p>
                  <p className="text-xs font-bold text-amber-500">
                    Efficacité moyenne
                  </p>
                </div>
              </div>

              {/* GRAPHIQUES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">
                    Évolution Historique {currentSector.label}
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={evolutionData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="year"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill={currentSector.color}
                          radius={[10, 10, 0, 0]}
                          barSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">
                    Répartition par Bassin ({selectedYear})
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allData}
                          dataKey="production"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                        >
                          {allData.map((_, index) => (
                            <Cell
                              key={index}
                              fill={
                                [
                                  "#0f172a",
                                  "#334155",
                                  "#94a3b8",
                                  "#10b981",
                                  "#fbbf24",
                                ][index % 5]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 
                                ==================================================
                                NOUVEAU COMPARATEUR : STYLE BLANC & TEXTE NOIR
                                ==================================================
                            */}
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden transition-all duration-500">
                {/* Fond coloré flou dynamique selon le secteur */}
                <div
                  className="absolute -top-24 -right-24 w-96 h-96 opacity-10 blur-3xl rounded-full pointer-events-none transition-colors duration-500"
                  style={{ backgroundColor: currentSector.color }}
                />

                <div className="relative z-10">
                  {/* En-tête de la section */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                    <div
                      className="p-4 text-white rounded-2xl shadow-lg transition-colors duration-500"
                      style={{ backgroundColor: currentSector.color }}
                    >
                      <Scale size={32} />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-black tracking-tight uppercase text-slate-900">
                        Comparateur de Performance
                      </h2>
                      <p className="text-slate-500 font-bold mt-1">
                        Analyse détaillée : {currentSector.label} — Saison{" "}
                        {selectedYear}
                      </p>
                    </div>
                  </div>

                  {/* Sélecteurs de bassins */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="relative group w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Bassin A
                      </label>
                      <div className="relative">
                        <select
                          value={bassinA?.id}
                          onChange={(e) => {
                            const selected = allData.find(
                              (b) => String(b.id) === String(e.target.value)
                            );
                            if (selected) setBassinA(selected);
                          }}
                          className="w-full bg-white p-5 rounded-2xl border border-slate-200 outline-none font-black text-slate-900 text-lg appearance-none shadow-sm focus:ring-4 transition-all cursor-pointer"
                          style={
                            {
                              "--tw-ring-color": `${currentSector.color}30`,
                            } as React.CSSProperties
                          } // Ring color with opacity
                        >
                          {allData.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-6 top-6 text-slate-400 pointer-events-none"
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center -my-4 lg:my-0 z-10">
                      <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center font-black text-slate-300 italic text-xl shadow-lg">
                        VS
                      </div>
                    </div>

                    <div className="relative group w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-4 mb-2 block text-right">
                        Bassin B
                      </label>
                      <div className="relative">
                        <select
                          value={bassinB?.id}
                          onChange={(e) => {
                            const selected = allData.find(
                              (b) => String(b.id) === String(e.target.value)
                            );
                            if (selected) setBassinB(selected);
                          }}
                          className="w-full bg-white p-5 rounded-2xl border border-slate-200 outline-none font-black text-slate-900 text-lg appearance-none shadow-sm focus:ring-4 transition-all cursor-pointer text-right"
                          style={
                            {
                              "--tw-ring-color": `${currentSector.color}30`,
                            } as React.CSSProperties
                          }
                        >
                          {allData.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute left-6 top-6 text-slate-400 pointer-events-none"
                          size={20}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grille de comparaison des chiffres */}
                  <div className="space-y-3">
                    {comparisonRows.map((row, i) => {
                      // Détermine la couleur du texte : Couleur du secteur si gagnant, Noir si perdant ou égal
                      const colorA =
                        row.highlight === true
                          ? currentSector.color
                          : "#0f172a"; // #0f172a = slate-900 (Noir)
                      const colorB =
                        row.highlight === false
                          ? currentSector.color
                          : "#0f172a";

                      // Scale effect pour le gagnant
                      const scaleA =
                        row.highlight === true ? "scale-110 origin-left" : "";
                      const scaleB =
                        row.highlight === false ? "scale-110 origin-right" : "";

                      return (
                        <div
                          key={i}
                          className="grid grid-cols-3 py-6 px-8 rounded-3xl hover:bg-slate-50 transition-all items-center border-b border-slate-100 last:border-0"
                        >
                          {/* Valeur A */}
                          <div
                            className={`text-2xl lg:text-3xl font-black transition-transform duration-300 ${scaleA}`}
                            style={{ color: colorA }}
                          >
                            {row.valA || "-"}
                          </div>

                          {/* Label Central */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-slate-100 rounded-xl text-slate-400">
                              <row.icon size={20} />
                            </div>
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-center">
                              {row.label}
                            </span>
                          </div>

                          {/* Valeur B */}
                          <div
                            className={`text-2xl lg:text-3xl font-black text-right transition-transform duration-300 ${scaleB}`}
                            style={{ color: colorB }}
                          >
                            {row.valB || "-"}
                          </div>
                        </div>
                      );
                    })}
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
