"use client";
import React from "react";
import {
  MapPin,
  Leaf,
  Fish,
  Dog,
  X,
  BarChart3,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (v: string) => void;
  selectedCulture: string;
  setSelectedCulture: (v: string) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  selectedCulture,
  setSelectedCulture,
}: SidebarProps) {
  const pathname = usePathname();
  const cultures = ["Tous", "Cacao", "Café", "Maïs"];

  return (
    // CHANGEMENT 1: Remplacement du fond noir par un vert émeraude très foncé
    <aside
      className={`${
        isOpen ? "w-80" : "w-0"
      } fixed lg:relative z-50 h-full bg-emerald-950 text-white transition-all duration-300 overflow-hidden shadow-xl border-r border-emerald-900`}
    >
      {/* Ajout d'un fond subtil pour éviter l'effet "plat" */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900/20 to-transparent pointer-events-none" />

      <div className="w-80 p-6 flex flex-col h-full relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            {/* CHANGEMENT 2: Logo sur fond blanc pour ressortir sur le vert */}
            <div className="p-2 bg-white rounded-lg shadow-lg">
              <MapPin className="text-emerald-800" size={24} />
            </div>
            <h1 className="text-xl font-bold text-emerald-50">
              Agro-Sig <span className="text-amber-400">237</span>
            </h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-emerald-200 hover:text-white"
          >
            <X />
          </button>
        </div>

        {/* NAVIGATION PRINCIPALE */}
        <div className="mb-8 space-y-2">
          <label className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest block mb-4 px-3">
            Menu Principal
          </label>

          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
              pathname === "/dashboard"
                ? "bg-amber-400 text-emerald-950 font-bold shadow-lg shadow-amber-400/20"
                : // CHANGEMENT 3: Hover en transparence blanche au lieu de gris
                  "hover:bg-white/10 text-emerald-100/80 hover:text-white"
            }`}
          >
            <MapIcon size={18} /> Carte SIG
          </Link>

          <Link
            href="/dashboard/stats"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
              pathname === "/dashboard/stats"
                ? "bg-amber-400 text-emerald-950 font-bold shadow-lg shadow-amber-400/20"
                : "hover:bg-white/10 text-emerald-100/80 hover:text-white"
            }`}
          >
            <BarChart3 size={18} /> Statistiques
          </Link>
        </div>

        {/* FILTRES (Affichez-les uniquement si on est sur la carte) */}
        {pathname === "/dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-500 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <label className="text-[11px] font-bold text-emerald-200/50 uppercase tracking-widest block mb-4 px-3">
                Secteurs
              </label>
              {["agriculture", "elevage", "peche"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`w-full flex items-center p-3 rounded-xl mb-2 transition-all border ${
                    activeTab === t
                      ? // CHANGEMENT 4: État actif du filtre plus subtil et intégré
                        "bg-emerald-900/60 border-emerald-700/50 text-white shadow-sm"
                      : "border-transparent hover:bg-emerald-900/30 text-emerald-200/70 hover:text-white"
                  }`}
                >
                  {t === "agriculture" ? (
                    <Leaf size={18} className="mr-3 text-emerald-400" />
                  ) : t === "elevage" ? (
                    <Dog size={18} className="mr-3 text-amber-400" />
                  ) : (
                    <Fish size={18} className="mr-3 text-blue-400" />
                  )}
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>

            {/* Sous-filtres Tâche 2.1 */}
            {activeTab === "agriculture" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-xl bg-black/20 border border-white/5">
                <label className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest block mb-3">
                  Filtrer par Culture
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cultures.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCulture(c)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedCulture === c
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-emerald-900/40 text-emerald-300 hover:text-white hover:bg-emerald-800"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Décoration en bas pour le style */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-950 to-transparent pointer-events-none" />
    </aside>
  );
}
