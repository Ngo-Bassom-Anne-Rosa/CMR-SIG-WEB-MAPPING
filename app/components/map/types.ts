import L from "leaflet";

export interface MapProps {
    activeFilter: string;
    culture: string;
    searchResult?: any;
}

export interface CustomWMSOptions extends L.WMSOptions {
    cql_filter?: string;
    'ngrok-skip-browser-warning'?: string;
}

export interface FeatureProperties {
    entity_name?: string;
    nom_zone?: string;
    name?: string;
    region_name?: string;
    adm1_name1?: string;
    admin_level?: string;
    valeur_production?: number;
    unite_mesure?: string;
    rendement?: number;
    superficie_ha?: number;
    produit?: string;
    [key: string]: any;
}

export interface GeoJSONFeature {
    type: "Feature";
    properties: FeatureProperties;
    geometry: any;
    id: string;
}