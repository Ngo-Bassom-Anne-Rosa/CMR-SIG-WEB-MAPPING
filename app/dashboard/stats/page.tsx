"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Legend as RechartsLegend,
} from "recharts";
import {
  ArrowLeft,
  FileText,
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
  ChevronRight,
} from "lucide-react";
import Header from "@/app/components/layout/Header";

// --- CONFIGURATION ---
const WFS_URL =
  "https://apodemal-kathern-semisentimentalized.ngrok-free.dev/geoserver/sig_cmr_web_mapping/ows";

const SECTEURS = [
  {
    id: "agriculture",
    label: "Agriculture",
    icon: Leaf,
    color: "#10b981",
    unit: "Tonnes",
  },
  {
    id: "elevage",
    label: "Élevage",
    icon: Dog,
    color: "#fbbf24",
    unit: "Têtes",
  },
  { id: "peche", label: "Pêche", icon: Fish, color: "#3b82f6", unit: "Tonnes" },
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
        service: "WFS",
        version: "1.0.0",
        request: "GetFeature",
        typeName: "sig_cmr_web_mapping:regions",
        outputFormat: "application/json",
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
          production: Math.floor(
            Math.random() * (currentSector.id === "elevage" ? 50000 : 8000) +
              2000
          ),
          rendement: (Math.random() * 5 + 1).toFixed(1),
          climat: f.properties.climat || "Tropical Humide",
          evolution: [
            { year: "2022", prod: Math.floor(Math.random() * 5000) },
            { year: "2023", prod: Math.floor(Math.random() * 6000) },
            { year: "2024", prod: Math.floor(Math.random() * 7000) },
          ],
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
    const rows = allData
      .map(
        (b) => `${b.name},${currentSector.label},${b.production},${b.rendement}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-${currentSector.id}.csv`;
    a.click();
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400 mb-4" size={40} />
        <p className="text-slate-500 font-bold italic tracking-widest">
          Chargement des données {currentSector.label}...
        </p>
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
              <Link
                href="/dashboard"
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-amber-500 transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  Analyse <span className="text-amber-500">Multifilière</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  Statistiques géo-référencées du Cameroun
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
              >
                <FileText size={18} /> PDF
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
              >
                <FileSpreadsheet size={18} /> CSV
              </button>
              <button
                onClick={() =>
                  (window.location.href = `${WFS_URL}?request=GetFeature&typeName=sig_cmr_web_mapping:regions&outputFormat=SHAPE-ZIP`)
                }
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20"
              >
                <Database size={18} /> Shapefile
              </button>
            </div>
          </div>

          {/* SÉLECTEUR DE FILIÈRE (Tâche 3.1) */}
          <div className="flex p-1.5 bg-slate-200/50 rounded-[2rem] w-fit shadow-inner">
            {SECTEURS.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentSector(s)}
                className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${
                  currentSector.id === s.id
                    ? "bg-white text-slate-900 shadow-xl"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <s.icon
                  size={18}
                  style={{
                    color: currentSector.id === s.id ? s.color : "inherit",
                  }}
                />
                {s.label}
              </button>
            ))}
          </div>

          {/* KPI DYNAMIQUES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm"
              style={{ borderBottomColor: currentSector.color }}
            >
              <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <Award size={16} /> Leader {currentSector.label}
              </div>
              <p className="text-2xl font-black text-slate-800">
                {allData[1]?.name}
              </p>
              <p className="text-xs font-bold text-emerald-500">
                +22% de croissance annuelle
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm"
              style={{ borderBottomColor: currentSector.color }}
            >
              <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <Activity size={16} /> Volume Total
              </div>
              <p className="text-2xl font-black text-slate-800">
                {allData
                  .reduce((acc, b) => acc + b.production, 0)
                  .toLocaleString()}{" "}
                {currentSector.unit}
              </p>
              <p className="text-xs font-bold text-slate-400">
                Données GeoServer 2025
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-[2rem] border-b-4 shadow-sm"
              style={{ borderBottomColor: currentSector.color }}
            >
              <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <TrendingUp size={16} /> Rendement Moyen
              </div>
              <p className="text-2xl font-black text-slate-800">3.4</p>
              <p className="text-xs font-bold text-amber-500">
                Efficacité Zone {currentSector.label}
              </p>
            </div>
          </div>

          {/* GRAPHIQUES (Tâche 3.1) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">
                Évolution {currentSector.label} (Annuelle)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bassinA?.evolution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
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
                      dataKey="prod"
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
                Part de Production par Bassin
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
                            ["#0f172a", "#334155", "#94a3b8", "#cbd5e1"][
                              index % 4
                            ]
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

          {/* COMPARATEUR (Tâche 3.2) */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden transition-all duration-500">
            {/* Décoration d'arrière-plan colorée et floue */}
            <div
              className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"
              style={{ backgroundColor: currentSector.color }}
            />

            <div className="p-8 lg:p-10 relative z-10">
              {/* Titre du bloc */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12">
                <div
                  className="p-3.5 rounded-2xl text-white shadow-lg shadow-slate-200"
                  style={{ backgroundColor: currentSector.color }}
                >
                  <Scale size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Comparateur de Bassins
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Analysez les écarts de performance entre deux zones
                  </p>
                </div>
              </div>

              {/* Sélecteurs VS */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                {/* Selecteur A */}
                <div className="w-full relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider pointer-events-none">
                    Zone A
                  </div>
                  <select
                    value={bassinA?.id}
                    onChange={(e) =>
                      setBassinA(allData.find((b) => b.id === e.target.value))
                    }
                    className="w-full appearance-none bg-white py-4 pl-20 pr-4 rounded-2xl border border-slate-200 text-slate-800 font-bold text-lg outline-none focus:ring-2 transition-all cursor-pointer shadow-sm group-hover:border-slate-300"
                    style={
                      {
                        "--tw-ring-color": currentSector.color,
                      } as React.CSSProperties
                    }
                  >
                    {allData.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Badge VS Central */}
                <div className="shrink-0 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-4 border-slate-100 shadow-sm text-slate-300 font-black italic text-lg">
                    VS
                  </div>
                </div>

                {/* Selecteur B */}
                <div className="w-full relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider pointer-events-none">
                    Zone B
                  </div>
                  <select
                    value={bassinB?.id}
                    onChange={(e) =>
                      setBassinB(allData.find((b) => b.id === e.target.value))
                    }
                    className="w-full appearance-none bg-white py-4 pl-20 pr-4 rounded-2xl border border-slate-200 text-slate-800 font-bold text-lg outline-none focus:ring-2 transition-all cursor-pointer shadow-sm group-hover:border-slate-300"
                    style={
                      {
                        "--tw-ring-color": currentSector.color,
                      } as React.CSSProperties
                    }
                  >
                    {allData.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tableau de Comparaison */}
              <div className="space-y-4">
                {[
                  {
                    label: `Production (${currentSector.unit})`,
                    icon: Box,
                    valA: bassinA?.production,
                    valB: bassinB?.production,
                    isNumber: true,
                  },
                  {
                    label: "Rendement / ha",
                    icon: Wheat,
                    valA: bassinA?.rendement,
                    valB: bassinB?.rendement,
                    isNumber: true,
                  },
                  {
                    label: "Zone Climatique",
                    icon: Thermometer,
                    valA: bassinA?.climat,
                    valB: bassinB?.climat,
                    isNumber: false,
                  },
                ].map((row, i) => {
                  // Logique simple pour mettre en valeur le "gagnant" si c'est un nombre
                  const isWinA =
                    row.isNumber && Number(row.valA) > Number(row.valB);
                  const isWinB =
                    row.isNumber && Number(row.valB) > Number(row.valA);

                  return (
                    <div
                      key={i}
                      className="grid grid-cols-3 py-6 px-6 rounded-2xl hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 items-center"
                    >
                      {/* Valeur A */}
                      <div
                        className={`text-xl lg:text-2xl font-black text-left transition-colors ${
                          isWinA ? "scale-105" : "text-slate-500"
                        }`}
                        style={{
                          color: isWinA ? currentSector.color : undefined,
                        }}
                      >
                        {typeof row.valA === "number"
                          ? row.valA.toLocaleString()
                          : row.valA}
                      </div>

                      {/* Label Central */}
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                          <row.icon size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                          {row.label}
                        </span>
                      </div>

                      {/* Valeur B */}
                      <div
                        className={`text-xl lg:text-2xl font-black text-right transition-colors ${
                          isWinB ? "scale-105" : "text-slate-500"
                        }`}
                        style={{
                          color: isWinB ? currentSector.color : undefined,
                        }}
                      >
                        {typeof row.valB === "number"
                          ? row.valB.toLocaleString()
                          : row.valB}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
