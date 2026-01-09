"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Leaf,
  Fish,
  Dog,
  X,
  BarChart3,
  Map as MapIcon,
  Loader2,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/app/lib/config";

// Props reçues du parent (DashboardPage)
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeTab: string; // 'agriculture' | 'elevage' | 'peche'
  setActiveTab: (v: string) => void;
  selectedCulture: string; // Filtre spécifique (ex: 'Cacao')
  setSelectedCulture: (v: string) => void;
}

// Mapping pour traduire l'interface (FR) vers l'API (EN)
const SECTOR_MAPPING: Record<string, string> = {
  agriculture: "agriculture",
  elevage: "farming",
  peche: "fishing",
};

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  selectedCulture,
  setSelectedCulture,
}: SidebarProps) {
  const pathname = usePathname();
  const [filters, setFilters] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // --- EFFET : CHARGEMENT DES FILTRES DEPUIS L'API ---
  useEffect(() => {
    let isMounted = true;

    async function fetchFilters() {
      setLoadingFilters(true);
      const backendSector = SECTOR_MAPPING[activeTab] || "agriculture";

      try {
        // Appel vers ton API
        const res = await fetch(`${API_BASE_URL}/config/filters`);
        const data = await res.json();

        if (isMounted) {
          // On essaie de récupérer les options dynamiques si elles existent
          if (data?.filters?.[backendSector]?.options) {
            setFilters(["Tous", ...data.filters[backendSector].options]);
          } else {
            // FALLBACK : Si l'API est vide ou en erreur, on met des données par défaut
            if (activeTab === "agriculture")
              setFilters(["Tous", "Cacao", "Café", "Maïs", "Banane", "Coton"]);
            else if (activeTab === "elevage")
              setFilters(["Tous", "Bovins", "Porcins", "Volailles", "Caprins"]);
            else if (activeTab === "peche")
              setFilters(["Tous", "Maritime", "Continentale", "Artisanale"]);
            else setFilters(["Tous"]);
          }
        }
      } catch (error) {
        console.error("Erreur chargement filtres:", error);
        // En cas d'erreur réseau, on garde des filtres par défaut pour tester
        if (isMounted) {
          setFilters(["Tous", "Cacao", "Café", "Maïs"]);
        }
      } finally {
        if (isMounted) setLoadingFilters(false);
      }
    }

    fetchFilters();

    return () => {
      isMounted = false;
    };
  }, [activeTab]); // Se déclenche quand on change d'onglet principal

  // Gestion du clic sur un onglet principal
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCulture("Tous"); // On reset le sous-filtre
  };

  let activeFilter; // Variable déclarée mais non utilisée dans le code original, je la laisse au cas où

  return (
    // CHANGEMENT 1: Fond Vert Forêt (emerald-950) et bordure assortie
    <aside
      className={`
            ${isOpen ? "translate-x-0 w-80" : "-translate-x-full w-0"} 
            fixed inset-y-0 left-0 z-50 bg-emerald-950 text-white transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-emerald-900 shadow-xl overflow-hidden
        `}
    >
      {/* Ajout d'un fond subtil dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900/20 to-transparent pointer-events-none" />

      <div className="flex flex-col h-full w-80 relative z-10">
        {/* --- 1. LOGO SECTION --- */}
        <div className="p-6 flex items-center justify-between border-b border-emerald-900/50">
          <div className="flex items-center gap-3">
            {/* Logo sur fond blanc pour le contraste */}
            <div className="p-2 bg-white rounded-lg shadow-lg">
              <MapPin className="text-emerald-800" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-50">
                Agro-Sig <span className="text-amber-400">237</span>
              </h1>
              <p className="text-[10px] text-emerald-200/60 font-medium uppercase tracking-tighter">
                Intelligence Géographique
              </p>
            </div>
          </div>
          {/* Bouton fermer (Mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:text-white text-emerald-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- 2. CONTENU SCROLLABLE --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-emerald-800/50 custom-scrollbar">
          {/* NAVIGATION PAGE */}
          <section>
            <label className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest px-2 mb-4 block">
              Navigation
            </label>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                  pathname === "/dashboard"
                    ? "bg-amber-400 text-emerald-950 shadow-lg shadow-amber-400/20 font-bold"
                    : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <MapIcon size={18} /> Carte Interactive
              </Link>
              <Link
                href="/dashboard/stats"
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                  pathname === "/dashboard/stats"
                    ? "bg-amber-400 text-emerald-950 shadow-lg shadow-amber-400/20 font-bold"
                    : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <BarChart3 size={18} /> Statistiques
              </Link>
            </div>
          </section>

          {/* FILTRES METIERS (Seulement visible sur le Dashboard) */}
          {pathname === "/dashboard" && (
            <section className="animate-in fade-in duration-500">
              <label className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest px-2 mb-4 block">
                Filières Économiques
              </label>

              {/* Onglets Principaux */}
              <div className="space-y-2 mb-6">
                {[
                  {
                    id: "agriculture",
                    icon: Leaf,
                    label: "Agriculture",
                    color: "text-emerald-400",
                    activeBg: "bg-emerald-500/20 border-emerald-500/50",
                  },
                  {
                    id: "elevage",
                    icon: Dog,
                    label: "Élevage",
                    color: "text-amber-400",
                    activeBg: "bg-amber-500/20 border-amber-500/50",
                  },
                  {
                    id: "peche",
                    icon: Fish,
                    label: "Pêche",
                    color: "text-blue-400",
                    activeBg: "bg-blue-500/20 border-blue-500/50",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${
                      activeTab === item.id
                        ? `${item.activeBg} text-white shadow-sm`
                        : "border-transparent hover:bg-emerald-900/50 text-emerald-200/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={18}
                        className={
                          activeTab === item.id
                            ? item.color
                            : "text-emerald-200/50"
                        }
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {activeTab === item.id && (
                      <div
                        className={`h-2 w-2 rounded-full ${item.color.replace(
                          "text",
                          "bg"
                        )} shadow-[0_0_8px_currentColor]`}
                      ></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Sous-filtres Dynamiques */}
              <div className="px-2 pt-4 border-t border-emerald-900/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">
                    {activeTab === "agriculture"
                      ? "Cultures"
                      : activeTab === "elevage"
                      ? "Espèces"
                      : "Types de pêche"}
                  </label>
                  {loadingFilters && (
                    <Loader2
                      size={12}
                      className="animate-spin text-amber-400"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filterName) => (
                    <button
                      key={filterName}
                      onClick={() => setSelectedCulture(filterName)}
                      className={`
                                                px-3 py-2 rounded-lg text-xs font-semibold text-left truncate transition-all duration-200
                                                ${
                                                  selectedCulture === filterName
                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                    : "bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800 hover:text-white border border-transparent"
                                                }
                                            `}
                      title={filterName}
                    >
                      {filterName}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section Calques Admin */}
          <section>
            <label className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest px-2 mb-4 block">
              Calques Administratifs
            </label>
            <div className="px-2 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-emerald-900/50">
                <div className="flex items-center gap-3 text-emerald-200">
                  <Layers size={16} />
                  <span className="text-sm">Régions</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
              </div>
            </div>
          </section>
        </div>

        {/* --- 3. FOOTER INFO --- */}
        <div className="p-4 bg-emerald-900/30 m-4 rounded-2xl border border-emerald-900/50">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <BarChart3 size={16} />
            <span className="text-xs font-bold uppercase tracking-tighter">
              API Connectée
            </span>
          </div>
          <p className="text-[10px] text-emerald-200/60 leading-relaxed italic">
            Données synchronisées en temps réel avec le serveur WMS et la base
            de données centrale.
          </p>
        </div>
      </div>

      {/* Décoration de bas de page */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-emerald-950 to-transparent pointer-events-none z-0" />
    </aside>
  );
}
