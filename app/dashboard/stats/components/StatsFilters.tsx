"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { SECTEURS } from "../constants";
import { Secteur } from "../types";

interface StatsFiltersProps {
    currentSector: Secteur;
    setCurrentSector: (s: Secteur) => void;
    years: string[];
    selectedYear: string;
    setSelectedYear: (y: string) => void;
}

export default function StatsFilters({ currentSector, setCurrentSector, years, selectedYear, setSelectedYear }: StatsFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-6 p-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 w-full md:w-fit">
            <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto">
                {SECTEURS.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSector(s)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            currentSector.id === s.id 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <s.icon size={16} style={{ color: currentSector.id === s.id ? s.color : "currentColor" }} />
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Calendar size={18} />
                </div>
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)} 
                    className="bg-transparent font-black text-slate-700 outline-none cursor-pointer text-lg hover:text-amber-600 transition-colors"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>Saison {year}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}