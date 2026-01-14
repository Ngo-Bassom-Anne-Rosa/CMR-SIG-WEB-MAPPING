"use client";
import React from "react";
import { Scale, Box, Wheat, MapPin, ChevronDown } from "lucide-react";
import { Secteur, Basin } from "../types";

interface BasinComparatorProps {
    basinsList: Basin[];
    sector: Secteur;
    bassinA: Basin | null;
    setBassinA: (b: Basin) => void;
    bassinB: Basin | null;
    setBassinB: (b: Basin) => void;
}

// Fonction utilitaire pour grouper la liste
const getGroupedOptions = (list: Basin[]) => {
    const regions = list.filter(b => b.level === 'R').sort((a, b) => a.name.localeCompare(b.name));
    const departments = list.filter(b => b.level === 'D').sort((a, b) => a.name.localeCompare(b.name));
    
    return (
        <>
            {regions.length > 0 && (
                <optgroup label="Régions">
                    {regions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </optgroup>
            )}
            {departments.length > 0 && (
                <optgroup label="Départements">
                    {departments.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </optgroup>
            )}
        </>
    );
};

export default function BasinComparator({ basinsList, sector, bassinA, setBassinA, bassinB, setBassinB }: BasinComparatorProps) {
    
    const renderProgressBar = (valA: number, valB: number, color: string) => {
        const max = Math.max(valA, valB) || 1;
        const pctA = (valA / max) * 100;
        const pctB = (valB / max) * 100;
        return (
            <div className="flex items-center gap-2 w-full mt-2 opacity-80">
                <div className="flex-1 flex justify-end">
                    <div className="h-2 rounded-l-full bg-slate-200 w-full relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 transition-all duration-700" style={{ width: `${pctA}%`, backgroundColor: valA >= valB ? color : '#94a3b8' }} />
                    </div>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex-1">
                    <div className="h-2 rounded-r-full bg-slate-200 w-full relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 transition-all duration-700" style={{ width: `${pctB}%`, backgroundColor: valB > valA ? color : '#94a3b8' }} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="comparator" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${sector.bg} text-white shadow-lg shadow-${sector.color}/30`}>
                    <Scale size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Comparateur de Bassins</h2>
                    <p className="text-slate-500">Confrontez les performances par zone.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 opacity-5 blur-3xl rounded-full pointer-events-none" style={{ backgroundColor: sector.color }} />

                {/* --- SELECTEURS --- */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-8 bg-slate-50/50 border-b border-slate-100">
                    {/* Zone A */}
                    <div className="md:col-span-3 relative">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 block">Bassin A</label>
                        <div className="relative">
                            <select 
                                className={`w-full p-4 pl-12 rounded-2xl border-2 border-slate-200 bg-white font-bold text-lg text-slate-800 outline-none focus:${sector.ring} focus:border-${sector.color} transition-all appearance-none cursor-pointer`}
                                value={bassinA?.id || ''}
                                onChange={(e) => setBassinA(basinsList.find(b => String(b.id) === e.target.value) as Basin)}
                            >
                                {getGroupedOptions(basinsList)}
                            </select>
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="md:col-span-1 flex items-center justify-center py-4 md:py-0">
                        <div className="w-12 h-12 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center font-black text-slate-300">VS</div>
                    </div>

                    {/* Zone B */}
                    <div className="md:col-span-3 relative">
                        <label className="text-xs font-bold text-slate-400 uppercase text-right mr-1 mb-2 block">Bassin B</label>
                        <div className="relative">
                            <select 
                                className={`w-full p-4 pr-12 rounded-2xl border-2 border-slate-200 bg-white font-bold text-lg text-slate-800 outline-none focus:${sector.ring} focus:border-${sector.color} transition-all appearance-none cursor-pointer text-right`}
                                value={bassinB?.id || ''}
                                onChange={(e) => setBassinB(basinsList.find(b => String(b.id) === e.target.value) as Basin)}
                            >
                                {getGroupedOptions(basinsList)}
                            </select>
                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                </div>

                {/* --- STATS COMPARÉES --- */}
                <div className="p-8 space-y-8">
                    {/* Production */}
                    <div className="grid grid-cols-7 items-center gap-4">
                        <div className={`col-span-2 text-right text-2xl font-black ${bassinA && bassinB && bassinA.production >= bassinB.production ? 'text-' + sector.color : 'text-slate-800'}`} style={{ color: bassinA && bassinB && bassinA.production >= bassinB.production ? sector.color : '' }}>
                            {bassinA?.production.toLocaleString()}
                        </div>
                        <div className="col-span-3 flex flex-col items-center">
                            <div className={`p-2 rounded-lg ${sector.light} mb-1`} style={{ color: sector.color }}><Box size={20}/></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Production ({sector.unit})</span>
                        </div>
                        <div className={`col-span-2 text-left text-2xl font-black ${bassinA && bassinB && bassinB.production > bassinA.production ? 'text-' + sector.color : 'text-slate-800'}`} style={{ color: bassinA && bassinB && bassinB.production > bassinA.production ? sector.color : '' }}>
                            {bassinB?.production.toLocaleString()}
                        </div>
                        <div className="col-span-7">
                            {renderProgressBar(bassinA?.production || 0, bassinB?.production || 0, sector.color)}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 w-full my-4"></div>

                    {/* Rendement */}
                    <div className="grid grid-cols-7 items-center gap-4">
                        <div className="col-span-2 text-right text-xl font-bold text-slate-600">{bassinA?.rendement || '-'}</div>
                        <div className="col-span-3 flex flex-col items-center">
                            <div className="text-slate-300 mb-1"><Wheat size={20}/></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Rendement</span>
                        </div>
                        <div className="col-span-2 text-left text-xl font-bold text-slate-600">{bassinB?.rendement || '-'}</div>
                    </div>

                    {/* Region Info */}
                    <div className="grid grid-cols-7 items-center gap-4 bg-slate-50 p-4 rounded-xl">
                        <div className="col-span-3 text-right text-sm font-semibold text-slate-600 truncate">{bassinA?.region}</div>
                        <div className="col-span-1 text-center text-[10px] font-bold text-slate-400">RÉGION</div>
                        <div className="col-span-3 text-left text-sm font-semibold text-slate-600 truncate">{bassinB?.region}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}