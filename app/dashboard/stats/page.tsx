/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";
import { LoadingState, ErrorState } from "@/app/components/ui/States";

import StatsHeader from "./components/StatsHeader";
import StatsFilters from "./components/StatsFilters";
import KPIGrid from "./components/KPIGrid";
import StatsCharts from "./components/StatsCharts";
import BasinComparator from "./components/BasinComparator";

import { SECTEURS } from "./constants";
import { Basin } from "./types";

function StatsContent() {
  const searchParams = useSearchParams();
  const compareWith = searchParams.get('compare_with');
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [loading, setLoading] = useState(true);
  const [currentSector, setCurrentSector] = useState(SECTEURS[0]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState(""); 
  
  // Data
  const [kpiData, setKpiData] = useState<any>(null);
  const [evolutionData, setEvolutionData] = useState<any[]>([]);
  const [basinsList, setBasinsList] = useState<Basin[]>([]);

  // Comparator
  const [bassinA, setBassinA] = useState<Basin | null>(null);
  const [bassinB, setBassinB] = useState<Basin | null>(null);

  // 1. Year init
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
      setError(null); // Reset error
      try {
        const [resSummary, resEvol, resList] = await Promise.all([
            fetch(`${API_BASE_URL}/kpi/summary/${currentSector.apiId}?year=${selectedYear}`),
            fetch(`${API_BASE_URL}/kpi/evolution/${currentSector.apiId}`),
            fetch(`${API_BASE_URL}/basins/${currentSector.apiId}/list?year=${selectedYear}`)
        ]);

        if (!resSummary.ok || !resEvol.ok || !resList.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }

        const summary = await resSummary.json();
        const evol = await resEvol.json();
        const rawList = await resList.json();

        setKpiData(summary);
        setEvolutionData(evol.map((e: any) => ({ year: e.year, value: e.total_production })));

        // Basins Mapping
        const formattedList: Basin[] = rawList.map((b: any) => ({
            id: b.id || b.entity_name || b.nom_zone,
            name: b.entity_name || b.nom_zone,
            region: b.region_name || b.adm1_name1,
            production: Number(b.valeur_production || b.production_tonnes || 0),
            rendement: Number(b.rendement || 0),
            unit: b.unite_mesure || currentSector.unit,
            level: b.admin_level || (b.region_name ? 'D' : 'R') // with Fallback if admin_level absent
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

  if (loading && !kpiData) return <div className="h-96"><LoadingState message="Analyse des données en cours..." /></div>;
  
  if (error) return <div className="h-96 flex items-center justify-center"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>;

  if (!kpiData) return null;

  return (
    <div className="min-h-screen p-6 lg:p-10 space-y-10 pb-20">
      
      {/* Header */}
      <StatsHeader currentSector={currentSector} onExportCsv={exportCSV} show={kpiData?.total_production ?? false} />

      {/* Filters */}
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
            {kpiData?.total_production ? (
              <>
                {/* Grid KPI */}
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
            ) : (
              <div className="h-96 w-full flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-50 mb-4">
                  <Loader2 className="text-amber-500" size={32} />
                </div>

                <h3 className="text-slate-700 font-semibold text-lg mb-1">
                  Aucune donnée disponible
                </h3>

                <p className="text-slate-400 text-sm text-center max-w-md">
                  Aucune production n’a été enregistrée pour ce secteur et cette année.
                  Essayez de modifier les filtres ou sélectionnez une autre période.
                </p>
              </div>
            )
          }
        </>
      )}
    </div>
  );
}

// Principal page
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