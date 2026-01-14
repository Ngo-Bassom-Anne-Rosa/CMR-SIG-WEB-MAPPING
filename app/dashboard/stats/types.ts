import { LucideIcon } from "lucide-react";

export interface Secteur {
    id: string;
    apiId: string;
    layerName: string; // Nom exact de la vue dans GeoServer/Postgres
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    light: string;
    ring: string;
    unit: string;
}

export interface Basin {
    id: string;
    name: string;
    region: string;
    production: number;
    rendement: number;
    unit: string;
    level: 'R' | 'D' | 'A'; // Niveau administratif pour le groupement
    climat?: string;
}

export interface KpiData {
    total_production: number;
    average_yield: number | null;
    top_basins: {
        department: string | null;
        region: string | null;
    };
    repartition: { item: string; total: number }[];
}

export interface EvolutionPoint {
    year: number;
    value: number;
}