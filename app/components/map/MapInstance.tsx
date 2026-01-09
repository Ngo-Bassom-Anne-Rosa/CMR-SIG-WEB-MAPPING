"use client";
import { MapContainer, TileLayer, WMSTileLayer, useMapEvents, ScaleControl, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { X, Info, AreaChart, Map as MapIcon, Database, ChevronRight } from 'lucide-react';
import { GEOSERVER_WMS_URL, LAYERS, FILTER_COLS } from "@/app/lib/config";

interface MapProps {
    activeFilter: string; // 'agriculture' | 'elevage' | 'peche'
    culture: string;      // 'Tous' | 'Cacao' ...
}

// --- GESTIONNAIRE D'ÉVÉNEMENTS (CLIC ET INTERROGATION) ---
function MapEvents({ onInfo, activeLayer }: { onInfo: (data: any) => void, activeLayer: string }) {
    const map = useMapEvents({
        click: async (e) => {
            const size = map.getSize();
            const point = map.latLngToContainerPoint(e.latlng);
            const bounds = map.getBounds();

            // Construction de l'URL GetFeatureInfo
            const params = new URLSearchParams({
                SERVICE: 'WMS',
                VERSION: '1.1.1',
                REQUEST: 'GetFeatureInfo',
                LAYERS: activeLayer,
                QUERY_LAYERS: activeLayer,
                INFO_FORMAT: 'application/json',
                X: Math.floor(point.x).toString(),
                Y: Math.floor(point.y).toString(),
                WIDTH: size.x.toString(),
                HEIGHT: size.y.toString(),
                SRS: 'EPSG:4326',
                BBOX: bounds.toBBoxString()
            });

            try {
                // CORRECTION : Ajout du header ngrok pour éviter de recevoir du HTML au lieu du JSON
                const res = await fetch(`${GEOSERVER_WMS_URL}?${params.toString()}`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                const data = await res.json();
                if (data.features && data.features.length > 0) {
                    onInfo(data.features[0].properties);
                }
            } catch (err) {
                console.error("Erreur de récupération des données GeoServer:", err);
            }
        },
    });
    return null;
}

export default function MapInstance({ activeFilter, culture }: MapProps) {
    const [feature, setFeature] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Détermination de la couche active
    const currentLayer = LAYERS[activeFilter as keyof typeof LAYERS] || LAYERS.default;

    // Construction du filtre CQL pour le filtrage dynamique
    let cqlFilter = "INCLUDE";
    if (culture && culture !== 'Tous') {
        const column = FILTER_COLS[activeFilter as keyof typeof FILTER_COLS] || 'type';
        cqlFilter = `${column} ILIKE '%${culture}%'`;
    }

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={[7.3697, 12.3547]}
                zoom={6}
                className="h-full w-full z-0"
                zoomControl={false}
            >
                {/* Fond de carte : CartoDB Light */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                />

                <LayersControl position="topright">
                    {/* COUCHE PRINCIPALE (DYNAMIQUE) */}
                    <LayersControl.BaseLayer checked name="Données GeoServer (Dynamique)">
                        <WMSTileLayer
                            key={`${currentLayer}-${cqlFilter}`} // Force le rafraîchissement
                            url={GEOSERVER_WMS_URL}
                            params={{
                                layers: currentLayer,
                                format: 'image/png',
                                transparent: true,
                                version: '1.1.1',
                                styles: '',
                                CQL_FILTER: cqlFilter,
                                // Note: Pour le flux d'images (WMS), ngrok peut aussi bloquer.
                                // Leaflet ne permet pas d'ajouter des headers personnalisés aux balises <img> nativement.
                                // Si les images ne s'affichent toujours pas, il faudra bypasser ngrok manuellement une fois dans le navigateur.
                            } as any}
                        />
                    </LayersControl.BaseLayer>

                    {/* COUCHE DE RÉFÉRENCE (Limites administratives) */}
                    <LayersControl.Overlay name="Limites Régionales">
                        <WMSTileLayer
                            url={GEOSERVER_WMS_URL}
                            params={{
                                layers: 'sig_cmr_web_mapping:regions',
                                format: 'image/png',
                                transparent: true,
                                version: '1.1.1',
                            } as any}
                            opacity={0.4}
                        />
                    </LayersControl.Overlay>
                </LayersControl>

                <MapEvents onInfo={setFeature} activeLayer={currentLayer} />
                <ScaleControl position="bottomleft" />
            </MapContainer>

            {/* --- PANEL D'INFORMATION (SIDE DRAWER) --- */}
            <div className={`fixed top-24 right-6 bottom-6 w-80 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[2.5rem] z-[1001] transition-all duration-700 ease-out border border-white/50 overflow-hidden ${feature ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
                {feature && (
                    <div className="flex flex-col h-full">
                        <div className="p-8 pb-4 relative">
                            <button onClick={() => setFeature(null)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all">
                                <X size={18} />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-amber-400 text-slate-900 rounded-2xl shadow-lg shadow-amber-400/30">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 leading-tight">
                                        {feature.nom_reg || feature.name || feature.label || "Détails Zone"}
                                    </h2>
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Donnée SIG</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(feature).map(([key, value]: [string, any]) => {
                                    if (['bbox', 'id', 'geom', 'osm_id'].includes(key.toLowerCase())) return null;
                                    return (
                                        <div key={key} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                                            <p className="text-slate-700 font-bold capitalize">{String(value)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MINI-CARTE CORRIGÉE --- */}
            <div className="absolute bottom-10 left-10 w-36 h-36 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden z-[1000] hidden md:block">
                <MapContainer
                    center={[7.36, 12.35]}
                    zoom={4}
                    className="h-full w-full"
                    dragging={false}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                </MapContainer>
            </div>
        </div>
    );
}