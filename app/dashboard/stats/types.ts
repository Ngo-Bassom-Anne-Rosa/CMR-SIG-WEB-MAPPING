import { LucideIcon } from "lucide-react";

export interface Secteur {
    id: string;
    apiId: string;
    layerName: string;
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
    level: 'R' | 'D' | 'A';
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