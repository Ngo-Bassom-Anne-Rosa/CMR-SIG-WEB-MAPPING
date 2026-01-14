"use client";
import { MapContainer, TileLayer, WMSTileLayer, useMapEvents, ScaleControl, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
import { X, Database, ChevronRight, Loader2 } from 'lucide-react';
import { GEOSERVER_WMS_URL, LAYERS, STYLES, FILTER_COLS, SECTOR_API_MAPPING } from "@/app/lib/config";
import L from "leaflet";
import { API_BASE_URL } from "@/app/lib/config";

// --- DÉFINITION DES TYPES (Pour résoudre les erreurs TypeScript) ---
interface MapProps {
    activeFilter: string;
    culture: string;
}

// Étend les options de Leaflet pour inclure nos paramètres personnalisés
interface CustomWMSOptions extends L.WMSOptions {
    cql_filter?: string;
    'ngrok-skip-browser-warning'?: string;
}

// Type pour les propriétés d'une feature GeoJSON
interface FeatureProperties {
    entity_name?: string;
    nom_zone?: string;
    name?: string;
    region_name?: string;
    adm1_name1?: string;
    admin_level?: string;
    [key: string]: any; // Permet d'autres propriétés
}

// Type pour une feature GeoJSON complète
interface GeoJSONFeature {
    type: "Feature";
    properties: FeatureProperties;
    geometry: any;
    id: string;
}


// --- COMPOSANT : MAPCONTROLLER (Logique d'interaction) ---
function MapController({ onFeatureSelect, activeLayer, cqlFilter }: { onFeatureSelect: (feature: GeoJSONFeature | null) => void, activeLayer: string, cqlFilter: string }) {
    const map = useMapEvents({
        click: async (e) => {
            const size = map.getSize();
            const point = map.latLngToContainerPoint(e.latlng);
            const bounds = map.getBounds();

            const params = new URLSearchParams({
                SERVICE: 'WMS',
                VERSION: '1.1.1',
                REQUEST: 'GetFeatureInfo',
                LAYERS: activeLayer,
                QUERY_LAYERS: activeLayer,
                INFO_FORMAT: 'application/json',
                FEATURE_COUNT: '10',
                X: Math.floor(point.x).toString(),
                Y: Math.floor(point.y).toString(),
                WIDTH: size.x.toString(),
                HEIGHT: size.y.toString(),
                SRS: 'EPSG:4326',
                BBOX: bounds.toBBoxString(),
            });

            if (cqlFilter !== 'INCLUDE') {
                params.set('CQL_FILTER', cqlFilter);
            }

            try {
                const res = await fetch(`${GEOSERVER_WMS_URL}?${params.toString()}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (!res.ok) throw new Error('Réponse GetFeatureInfo non valide');
                
                const data = await res.json();

                if (data.features && data.features.length > 0) {
                    onFeatureSelect(data.features[0]);
                } else {
                    onFeatureSelect(null);
                }
            } catch (err) {
                console.error("Erreur GetFeatureInfo:", err);
                onFeatureSelect(null);
            }
        },
    });
    return null;
}

// --- COMPOSANT : SIDEDRAWER (Panneau de détails) ---
function SideDrawer({ feature, activeFilter, onClose }: { feature: GeoJSONFeature | null, activeFilter: string, onClose: () => void }) {
    const [details, setDetails] = useState<FeatureProperties | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!feature?.properties?.entity_name) {
             setDetails(feature?.properties || null);
             return;
        };

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const apiFiliere = SECTOR_API_MAPPING[activeFilter as keyof typeof SECTOR_API_MAPPING] || 'agriculture';
                const entityName = encodeURIComponent(feature.properties.entity_name as string);
                
                const res = await fetch(`${API_BASE_URL}/basins/${apiFiliere}/${entityName}`);
                if (res.ok) {
                    setDetails(await res.json());
                } else {
                    setDetails(feature.properties);
                }
            } catch (error) {
                console.error("Erreur de récupération des détails:", error);
                setDetails(feature.properties);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [feature, activeFilter]);


    const renderContent = () => {
        if (!feature) return null;
        
        const properties = details || feature.properties;
        const displayName = properties.entity_name || properties.nom_zone || properties.name || "Zone d'Intérêt";
        const regionName = properties.region_name || properties.adm1_name1 || "N/A";

        return (
            <div className="flex flex-col h-full">
                <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={18} /></button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/40"><Database size={20} /></div>
                        <div>
                            <h2 className="text-xl font-black leading-tight tracking-tight">{displayName}</h2>
                            <span className="text-xs font-medium text-slate-400">{regionName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                    {isLoading ? <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-amber-500" size={32}/></div> : (
                        <>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                {/* ... contenu ... */}
                            </div>
                            <div className="space-y-2">
                                {Object.entries(properties).map(([key, value]) => {
                                    if (['bbox', 'id', 'geom', 'user_id', 'admin_level'].includes(key.toLowerCase()) || value === null) return null;
                                    return (
                                        <div key={key} className="flex flex-col p-3 bg-white/40 rounded-lg border border-white/60 text-sm">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-slate-800 font-semibold">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 bg-white/30 border-t border-white/50">
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 text-sm">
                        Voir les statistiques complètes <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={`fixed top-20 right-6 bottom-6 w-80 md:w-96 glass-panel shadow-2xl rounded-3xl z-1001 transition-transform duration-500 ease-in-out ${feature ? 'translate-x-0' : 'translate-x-[120%]'}`}>
            {renderContent()}
        </div>
    );
}


// --- COMPOSANT PRINCIPAL : MAPINSTANCE ---
export default function MapInstance({ activeFilter, culture }: MapProps) {
    const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
    
    useEffect(() => {
        setSelectedFeature(null);
    }, [activeFilter, culture]);

    const currentLayerName = LAYERS[activeFilter as keyof typeof LAYERS] || LAYERS.default;
    const currentStyleName = STYLES[activeFilter as keyof typeof STYLES] || '';

    const wmsParams: CustomWMSOptions = {
        layers: currentLayerName,
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        styles: currentStyleName,
    };

    let cqlFilter = "INCLUDE";
    
    // --- LOGIQUE DE FILTRAGE SIMPLIFIÉE ---
    if (culture && culture !== 'Tous') {
        const filterColumn = FILTER_COLS[activeFilter as keyof typeof FILTER_COLS];
        const sanitizedCulture = culture.replace("'", "''");
        
        // Comme toutes les vues utilisent maintenant la colonne 'produit', la logique est simple
        if (filterColumn) { // filterColumn sera toujours 'produit'
             cqlFilter = `${filterColumn} = '${sanitizedCulture}'`;
        }
    }
    
    if (cqlFilter !== "INCLUDE") {
        wmsParams.cql_filter = cqlFilter;
    }
    // ------------------------------------------

    return (
        <div className="h-full w-full relative overflow-hidden">
            <style jsx global>{`
                .leaflet-container { cursor: crosshair !important; }
                .glass-panel { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.3); }
            `}</style>

            <MapContainer center={[7.3697, 12.3547]} zoom={6} className="h-full w-full z-0" zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO'/>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" pane="shadowPane" />

                <WMSTileLayer
                    key={`${currentLayerName}-${culture}`} // 'culture' est plus fiable que 'cqlFilter' pour la clé
                    url={GEOSERVER_WMS_URL}
                    params={wmsParams}
                />

                {selectedFeature && (
                    <GeoJSON
                        key={selectedFeature.id}
                        data={selectedFeature.geometry}
                        style={{ fillColor: '#f59e0b', fillOpacity: 0.3, color: '#d97706', weight: 3 }}
                    />
                )}

                <MapController onFeatureSelect={setSelectedFeature} activeLayer={currentLayerName} cqlFilter={cqlFilter}/>
                <ScaleControl position="bottomleft" />
            </MapContainer>

            <SideDrawer feature={selectedFeature} activeFilter={activeFilter} onClose={() => setSelectedFeature(null)} />
        </div>
    );
}