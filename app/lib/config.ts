// app/lib/config.ts

// URLs de base
export const API_BASE_URL = "https://cameroun-sig-api.onrender.com/api";
export const GEOSERVER_WMS_URL = "https://apodemal-kathern-semisentimentalized.ngrok-free.dev/geoserver/sig_cmr_web_mapping/wms";

// NOMS DES COUCHES (VUES) FOURNIS PAR LE BACKEND
export const LAYERS = {
    default: 'sig_cmr_web_mapping:regions',
    agriculture: 'sig_cmr_web_mapping:agricultural_production_view',
    elevage: 'sig_cmr_web_mapping:farming_production_view',
    peche: 'sig_cmr_web_mapping:fishing_production_view'
};

// NOMS DES COLONNES DE FILTRAGE (Pour le CQL_FILTER)
export const FILTER_COLS = {
    agriculture: 'product',      // Colonne 'product' selon le backend
    elevage: 'species',          // Colonne 'species' selon le backend
    peche: 'fishing_type'        // Colonne 'fishing_type' selon le backend
};


export const SECTOR_API_MAPPING: Record<string, string> = {
    agriculture: 'agriculture',
    elevage: 'farming', // Important pour tes routes /api/stats/farming/...
    peche: 'fishing'
};