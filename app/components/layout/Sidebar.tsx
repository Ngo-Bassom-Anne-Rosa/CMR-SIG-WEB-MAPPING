"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Leaf, Fish, Dog, X, BarChart3, Map as MapIcon, Layers, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/app/lib/config";
import { LoadingState } from "../ui/States"; // Import du composant

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  selectedCulture: string;
  setSelectedCulture: (v: string) => void;
}

const SECTOR_MAPPING: Record<string, string> = {
  agriculture: "agriculture",
  elevage: "farming",
  peche: "fishing",
};

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab, selectedCulture, setSelectedCulture }: SidebarProps) {
  const pathname = usePathname();
  const [filters, setFilters] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [errorFilters, setErrorFilters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchFilters() {
      setLoadingFilters(true);
      setErrorFilters(false);
      const backendSector = SECTOR_MAPPING[activeTab] || "agriculture";
      try {
        const res = await fetch(`${API_BASE_URL}/config/filters`);
        if(!res.ok) throw new Error();
        const data = await res.json();
        
        if (isMounted) {
          let options: string[] = [];
          if (backendSector === 'agriculture') options = data?.filters?.agriculture?.options || [];
          else if (backendSector === 'farming') options = data?.filters?.farming?.options || [];
          else if (backendSector === 'fishing') options = data?.filters?.fishing?.options || [];
          
          setFilters(["Tous", ...Array.from(new Set(options))]);
        }
      } catch (error) {
        if (isMounted) setErrorFilters(true);
      } finally {
        if (isMounted) setLoadingFilters(false);
      }
    }
    fetchFilters();
    return () => { isMounted = false; };
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCulture("Tous");
  };

  const getSubFilterLabel = () => {
    if (activeTab === 'agriculture') return "Cultures";
    if (activeTab === 'elevage') return "Espèces";
    return "Filtres";
  };

  // --- RESPONSIVE CLASS ---
  // Sur mobile : fixed, plein écran ou w-80 avec overlay. Ici w-80 + z-index élevé.
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[3000] bg-[#0f172a] text-white border-r border-slate-800 transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    w-[85vw] sm:w-80 lg:relative lg:translate-x-0 lg:z-0
  `;

  return (
    <>
      {/* Overlay mobile sombre quand sidebar ouverte */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-[2999] lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400 rounded-lg shadow-lg shadow-amber-400/20">
                <MapPin className="text-slate-900" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Agro-Sig <span className="text-amber-400">237</span></h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Intelligence Géographique</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-700">
            {/* Navigation */}
            <section>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4 block">Navigation</label>
              <div className="space-y-1">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${pathname === "/dashboard" ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                  <MapIcon size={18} /> Carte Interactive
                </Link>
                <Link href="/dashboard/stats" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${pathname === "/dashboard/stats" ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                  <BarChart3 size={18} /> Statistiques
                </Link>
              </div>
            </section>

            {/* Filtres contextuels (visible uniquement sur dashboard) */}
            {pathname === "/dashboard" && (
              <section className="animate-in fade-in duration-500">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4 block">Filières Économiques</label>
                <div className="space-y-2 mb-6">
                  {[
                    { id: "agriculture", icon: Leaf, label: "Agriculture", color: "text-emerald-400", activeBg: "bg-emerald-500/10 border-emerald-500/50" },
                    { id: "elevage", icon: Dog, label: "Élevage", color: "text-amber-400", activeBg: "bg-amber-500/10 border-amber-500/50" },
                    { id: "peche", icon: Fish, label: "Pêche", color: "text-blue-400", activeBg: "bg-blue-500/10 border-blue-500/50" },
                  ].map((item) => (
                    <button key={item.id} onClick={() => handleTabChange(item.id)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 border group ${activeTab === item.id ? `${item.activeBg} text-white ring-1 ring-inset ring-white/10` : "border-transparent hover:bg-slate-800/50 text-slate-400"}`}>
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={`${activeTab === item.id ? item.color : "text-slate-500 group-hover:text-slate-300"}`}/>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {activeTab === item.id && <ChevronRight size={14} className={item.color}/>}
                    </button>
                  ))}
                </div>

                <div className="px-2 pt-2 border-t border-slate-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{getSubFilterLabel()}</label>
                  </div>
                  
                  {loadingFilters ? (
                      <div className="flex justify-center py-4"><LoadingState message="" /></div>
                  ) : errorFilters ? (
                      <div className="text-xs text-red-400 text-center py-2 bg-red-900/20 rounded">Erreur de chargement</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {filters.map((filterName) => (
                        <button
                            key={filterName}
                            onClick={() => setSelectedCulture(filterName)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold text-left truncate transition-all duration-200 ${selectedCulture === filterName ? "bg-slate-700 text-white shadow-md border border-slate-600" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"}`}
                            title={filterName}
                        >
                            {filterName}
                        </button>
                        ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            <section>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4 block">Calques Administratifs</label>
              <div className="px-2 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 opacity-50 cursor-not-allowed" title="Bientôt disponible">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Layers size={16} />
                    <span className="text-sm">Régions</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </section>
          </div>

          <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Système Opérationnel</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              v1.0.2 • Dernière synchro : {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}