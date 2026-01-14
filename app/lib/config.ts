// URLs de base
// export const API_BASE_URL = "https://cameroun-sig-api.onrender.com/api";
export const API_BASE_URL = "http://localhost:3001/api";
// On pointe maintenant vers le service de cache GeoWebCache (GWC) pour des performances optimales
export const GEOSERVER_WMS_URL = "http://localhost:7900/geoserver/sig_cmr_web_mapping/wms";

// NOMS DES COUCHES (VUES) DANS GEOSERVER
export const LAYERS = {
    agriculture: 'sig_cmr_web_mapping:agricultural_production_view',
    elevage: 'sig_cmr_web_mapping:farming_production_view',
    peche: 'sig_cmr_web_mapping:fishing_production_view',
    default: 'sig_cmr_web_mapping:regions'
};

// NOMS DES COLONNES DE FILTRAGE UNIFIÉES
export const FILTER_COLS = {
    agriculture: 'produit',
    elevage: 'produit', // CORRIGÉ
    peche: 'produit'    // CORRIGÉ
};

// NOMS DES STYLES DANS GEOSERVER
export const STYLES = {
    agriculture: '', // Laissez vide pour utiliser le style par défaut de la couche
    elevage: '',
    peche: '',
    default: 'polygon'
};

// MAPPING POUR LES APPELS API VERS LE BACKEND NODE.JS
export const SECTOR_API_MAPPING: Record<string, string> = {
    agriculture: 'agriculture',
    elevage: 'farming',
    peche: 'fishing'
};