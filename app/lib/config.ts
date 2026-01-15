// Base URLs
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const API_BASE_URL = `${BASE_URL}/api`;
export const GEOSERVER_WMS_URL = process.env.NEXT_PUBLIC_GEOSERVER_URL || "http://localhost:7900/geoserver/sig_cmr_web_mapping/wms";

// Layers names (views) in GeoServer/PostGIS
export const LAYERS = {
    agriculture: 'sig_cmr_web_mapping:agricultural_production_view',
    elevage: 'sig_cmr_web_mapping:breeding_production_view',
    peche: 'sig_cmr_web_mapping:fishing_production_view',
    default: 'sig_cmr_web_mapping:regions'
};

// Columns names for filters
export const FILTER_COLS = {
    agriculture: 'produit',
    elevage: 'produit',
    peche: 'produit'
};

// Styles names
export const STYLES = {
    agriculture: 'style_agriculture',
    elevage: 'style_breeding',
    peche: 'style_fishing',
    default: 'polygon'
};

// Mapping with backend name conventions
export const SECTOR_API_MAPPING: Record<string, string> = {
    agriculture: 'agriculture',
    elevage: 'breeding',
    peche: 'fishing'
};