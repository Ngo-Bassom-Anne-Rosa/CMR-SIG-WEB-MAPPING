"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";

// Imports Composants
import StatsHeader from "./components/StatsHeader";
import StatsFilters from "./components/StatsFilters";
import KPIGrid from "./components/KPIGrid";
import StatsCharts from "./components/StatsCharts";
import BasinComparator from "./components/BasinComparator";

// Imports Types & Constants
import { SECTEURS } from "./constants";
import { Basin } from "./types";

function StatsContent() {
  const searchParams = useSearchParams();
  const compareWith = searchParams.get('compare_with');

  // Etats
  const [loading, setLoading] = useState(true);
  const [currentSector, setCurrentSector] = useState(SECTEURS[0]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState(""); 
  
  // Données
  const [kpiData, setKpiData] = useState<any>(null);
  const [evolutionData, setEvolutionData] = useState<any[]>([]);
  const [basinsList, setBasinsList] = useState<Basin[]>([]);

  // Comparateur
  const [bassinA, setBassinA] = useState<Basin | null>(null);
  const [bassinB, setBassinB] = useState<Basin | null>(null);

  // 1. Initialisation Années
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/config/filters`);
        const data = await res.json();
        if (data.years && data.years.length > 0) {
            setYears(data.years.map(String));
            setSelectedYear(String(data.years[0]));
        } else {
            setYears(["2022", "2021"]);
            setSelectedYear("2022");
        }
      } catch (e) { console.error(e); }
    };
    fetchConfig();
  }, []);

  // 2. Fetch Global Data
  useEffect(() => {
    if (!selectedYear) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [resSummary, resEvol, resList] = await Promise.all([
            fetch(`${API_BASE_URL}/kpi/summary/${currentSector.apiId}?year=${selectedYear}`),
            fetch(`${API_BASE_URL}/kpi/evolution/${currentSector.apiId}`),
            fetch(`${API_BASE_URL}/basins/${currentSector.apiId}/list?year=${selectedYear}`)
        ]);

        const summary = await resSummary.json();
        const evol = await resEvol.json();
        const rawList = await resList.json();

        setKpiData(summary);
        setEvolutionData(evol.map((e: any) => ({ year: e.year, value: e.total_production })));

        // Mapping robuste pour les bassins
        const formattedList: Basin[] = rawList.map((b: any) => ({
            id: b.id || b.entity_name || b.nom_zone,
            name: b.entity_name || b.nom_zone,
            region: b.region_name || b.adm1_name1,
            production: Number(b.valeur_production || b.production_tonnes || 0),
            rendement: Number(b.rendement || 0),
            unit: b.unite_mesure || currentSector.unit,
            // Capture du niveau admin pour le groupement (R ou D)
            level: b.admin_level || (b.region_name ? 'D' : 'R') // Fallback si admin_level manquant
        })).sort((a: Basin, b: Basin) => b.production - a.production);

        setBasinsList(formattedList);

        // Auto-select Comparateur
        if (formattedList.length > 0) {
            if (compareWith) {
                const found = formattedList.find((b) => b.name.toLowerCase().includes(compareWith.toLowerCase()));
                setBassinA(found || formattedList[0]);
                setBassinB(formattedList.find((b) => b.id !== (found?.id || formattedList[0].id)) || formattedList[1] || formattedList[0]);
            } else {
                setBassinA(formattedList[0]);
                setBassinB(formattedList[1] || formattedList[0]);
            }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentSector, selectedYear, compareWith]);

  const exportCSV = () => {
    if (!basinsList.length) return;
    const headers = `Bassin,Region,Filiere,Annee,Production,Rendement\n`;
    const rows = basinsList.map(b => `${b.name},${b.region},${currentSector.label},${selectedYear},${b.production},${b.rendement}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats-${currentSector.id}-${selectedYear}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 space-y-10 pb-20">
      
      {/* HEADER */}
      <StatsHeader currentSector={currentSector} onExportCsv={exportCSV} />

      {/* FILTRES */}
      <StatsFilters 
        currentSector={currentSector} 
        setCurrentSector={setCurrentSector} 
        years={years} 
        selectedYear={selectedYear} 
        setSelectedYear={setSelectedYear} 
      />

      {loading || !kpiData ? (
        <div className="h-96 w-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
            <p className="text-slate-400 font-medium animate-pulse">Chargement des données en cours...</p>
        </div>
      ) : (
        <>
            {/* KPI GRID */}
            <KPIGrid kpiData={kpiData} sector={currentSector} year={selectedYear} />

            {/* CHARTS */}
            <StatsCharts evolutionData={evolutionData} repartitionData={kpiData.repartition} sector={currentSector} />

            {/* COMPARATOR */}
            <BasinComparator 
                basinsList={basinsList} 
                sector={currentSector} 
                bassinA={bassinA} 
                setBassinA={setBassinA} 
                bassinB={bassinB} 
                setBassinB={setBassinB} 
            />
        </>
      )}
    </div>
  );
}

// PAGE PRINCIPALE
export default function StatsPage() {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      <main className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>}>
          <StatsContent />
        </Suspense>
      </main>
    </div>
  );
}