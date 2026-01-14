import { Leaf, Dog, Fish } from "lucide-react";
import { Secteur } from "./types";

export const SECTEURS: Secteur[] = [
  { 
    id: "agriculture", 
    apiId: "agriculture", 
    layerName: "agricultural_production_view", // CORRECTION POUR L'EXPORT
    label: "Agriculture", 
    icon: Leaf, 
    color: "#10b981", 
    bg: "bg-emerald-500", 
    light: "bg-emerald-50", 
    ring: "ring-emerald-200", 
    unit: "Tonnes" 
  },
  { 
    id: "elevage", 
    apiId: "farming", 
    layerName: "farming_production_view", // CORRECTION POUR L'EXPORT
    label: "Élevage", 
    icon: Dog, 
    color: "#f59e0b", 
    bg: "bg-amber-500", 
    light: "bg-amber-50", 
    ring: "ring-amber-200", 
    unit: "Têtes" 
  },
  { 
    id: "peche", 
    apiId: "fishing", 
    layerName: "fishing_production_view", // CORRECTION POUR L'EXPORT
    label: "Pêche", 
    icon: Fish, 
    color: "#3b82f6", 
    bg: "bg-blue-500", 
    light: "bg-blue-50", 
    ring: "ring-blue-200", 
    unit: "Tonnes" 
  },
];

export const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];