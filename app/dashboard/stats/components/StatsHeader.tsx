"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Database } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";
import { Secteur } from "../types";

interface StatsHeaderProps {
    currentSector: Secteur;
    onExportCsv: () => void;
}

export default function StatsHeader({ currentSector, onExportCsv }: StatsHeaderProps) {
    
    // Fonction d'export SIG directe
    const handleExportSig = () => {
        // On utilise layerName défini dans constants.ts qui correspond exactement à la vue DB
        const url = `${API_BASE_URL}/data/export?layer=${currentSector.layerName}&format=shapefile`;
        window.location.href = url;
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-amber-500 transition-all shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Analyse <span className={`text-${currentSector.color.replace('#', '')}-500`} style={{ color: currentSector.color }}>Annuelle</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Statistiques officielles par filière</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={onExportCsv} 
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all text-slate-700"
                >
                    <FileSpreadsheet size={18} /> CSV
                </button>
                <button 
                    onClick={handleExportSig} 
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
                >
                    <Database size={18} /> Export SIG
                </button>
            </div>
        </div>
    );
}