"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { Secteur, EvolutionPoint, KpiData } from "../types";
import { COLORS } from "../constants";

interface StatsChartsProps {
    evolutionData: EvolutionPoint[];
    repartitionData: KpiData['repartition'];
    sector: Secteur;
}

export default function StatsCharts({ evolutionData, repartitionData, sector }: StatsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Area Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Évolution de la Production</h3>
                        <p className="text-sm text-slate-500">Historique récent</p>
                    </div>
                    <div className={`p-2 rounded-lg ${sector.light}`}>
                        <TrendingUp size={20} style={{ color: sector.color }} />
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={evolutionData}>
                            <defs>
                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={sector.color} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={sector.color} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="value" stroke={sector.color} strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-2">Répartition</h3>
                <p className="text-sm text-slate-500 mb-6">Par sous-catégorie</p>
                <div className="h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={repartitionData} 
                                dataKey="total" 
                                nameKey="item" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={50} 
                                outerRadius={70} 
                                paddingAngle={5}
                                cornerRadius={4}
                            >
                                {repartitionData?.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? sector.color : COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-800">{repartitionData?.length || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Items</span>
                    </div>
                </div>
                
                {/* Scrollable Mini Legend */}
                <div className="mt-6 space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {repartitionData?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: idx === 0 ? sector.color : COLORS[idx % COLORS.length] }}></div>
                                <span className="text-slate-600 font-medium truncate">{item.item}</span>
                            </div>
                            <span className="font-bold text-slate-800">{Number(item.total).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}