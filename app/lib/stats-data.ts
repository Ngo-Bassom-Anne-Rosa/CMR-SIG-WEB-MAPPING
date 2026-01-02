// app/lib/stats-data.ts

export type Bassin = {
    id: string;
    name: string;
    region: string;
    production: number;
    unite: string;
    rendement: number;
    climat: string;
    croissance: string;
    evolution: { year: string; prod: number }[];
};

export const AGRO_DATA: Record<string, Bassin[]> = {
    agriculture: [
        { id: 'moungo', name: 'Moungo (Cacao)', region: 'Littoral', production: 4500, unite: 'Tonnes', rendement: 1.2, climat: 'Chaud/Humide', croissance: '+12%', evolution: [{year:'2022', prod:3800}, {year:'2023', prod:4100}, {year:'2024', prod:4500}] },
        { id: 'noun', name: 'Noun (Café)', region: 'Ouest', production: 5200, unite: 'Tonnes', rendement: 1.5, climat: 'Tempéré', croissance: '+22%', evolution: [{year:'2022', prod:4200}, {year:'2023', prod:4800}, {year:'2024', prod:5200}] },
    ],
    elevage: [
        { id: 'vina', name: 'Vina (Bovins)', region: 'Adamaoua', production: 12000, unite: 'Têtes', rendement: 85, climat: 'Soudano-Sahélien', croissance: '+5%', evolution: [{year:'2022', prod:11000}, {year:'2023', prod:11500}, {year:'2024', prod:12000}] },
        { id: 'mifi', name: 'Mifi (Porcins)', region: 'Ouest', production: 8500, unite: 'Têtes', rendement: 92, climat: 'Tempéré', croissance: '+18%', evolution: [{year:'2022', prod:7000}, {year:'2023', prod:7800}, {year:'2024', prod:8500}] },
    ],
    peche: [
        { id: 'wouri', name: 'Wouri (Artisanale)', region: 'Littoral', production: 3200, unite: 'Tonnes', rendement: 0.8, climat: 'Équatorial', croissance: '+7%', evolution: [{year:'2022', prod:2800}, {year:'2023', prod:3000}, {year:'2024', prod:3200}] },
        { id: 'ocean', name: 'Océan (Industrielle)', region: 'Sud', production: 6400, unite: 'Tonnes', rendement: 2.1, climat: 'Équatorial', croissance: '+15%', evolution: [{year:'2022', prod:5500}, {year:'2023', prod:6000}, {year:'2024', prod:6400}] },
    ]
};