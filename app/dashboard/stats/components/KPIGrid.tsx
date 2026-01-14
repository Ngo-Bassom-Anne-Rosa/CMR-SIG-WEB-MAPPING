"use client";
import React from "react";
import { Award, Activity, TrendingUp } from "lucide-react";
import { Secteur, KpiData } from "../types";

interface KPIGridProps {
    kpiData: KpiData;
    sector: Secteur;
    year: string;
}

export default function KPIGrid({ kpiData, sector, year }: KPIGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Bassin */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${sector.bg} rounded-bl-3xl text-white`}>
                    <Award size={40} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Bassin ({year})</p>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 truncate" title={kpiData.top_basins?.department || "N/A"}>
                        {kpiData.top_basins?.department || "N/A"}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                        Région : {kpiData.top_basins?.region || "N/A"}
                    </span>
                </div>
            </div>

            {/* Production Totale */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${sector.bg} rounded-bl-3xl text-white`}>
                    <Activity size={40} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Production Totale</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                        {kpiData.total_production?.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-500">{sector.unit}</span>
                </div>
            </div>

            {/* Rendement */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${sector.bg} rounded-bl-3xl text-white`}>
                    <TrendingUp size={40} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rendement Moyen</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                        {kpiData.average_yield ? kpiData.average_yield.toFixed(2) : '-'}
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                        {sector.id === 'elevage' ? 'Indice' : 'T/Ha'}
                    </span>
                </div>
            </div>
        </div>
    );
}