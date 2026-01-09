// app/lib/config.ts

// URLs de base
export const API_BASE_URL = "https://cameroun-sig-api.onrender.com/api";
export const GEOSERVER_WMS_URL = "https://apodemal-kathern-semisentimentalized.ngrok-free.dev/geoserver/sig_cmr_web_mapping/wms";

// MAPPING DES COUCHES GEOSERVER (WMS)
// On associe l'ID de l'onglet (frontend) au nom réel de la couche (GeoServer)
export const LAYERS = {
    default: 'sig_cmr_web_mapping:regions',
    agriculture: 'sig_cmr_web_mapping:regions', // On garde celui qui marche (polygones)
    elevage: 'sig_cmr_web_mapping:farming',     // Couche Points/Icones (Farming)
    peche: 'sig_cmr_web_mapping:fishing'        // Couche Points/Icones (Fishing)
};

// MAPPING DES COLONNES SQL (CQL_FILTER)
// Adaptation aux noms de variables en ANGLAIS du backend
export const FILTER_COLS = {
    agriculture: 'culture',      // Si ça marche déjà, on touche pas
    elevage: 'category',         // Souvent 'category', 'type' ou 'animal' en anglais
    peche: 'type'                // Souvent 'type' ou 'technique'
};


export const SECTOR_API_MAPPING: Record<string, string> = {
    agriculture: 'agriculture',
    elevage: 'farming', // Important pour tes routes /api/stats/farming/...
    peche: 'fishing'
};