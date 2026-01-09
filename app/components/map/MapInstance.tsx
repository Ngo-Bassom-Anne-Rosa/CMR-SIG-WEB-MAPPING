"use client";
import { MapContainer, TileLayer, WMSTileLayer, useMapEvents, ScaleControl, LayersControl, GeoJSON, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useMemo } from "react";
import { X, Database, MapPin, TrendingUp, ChevronRight, Layers } from 'lucide-react';
import { GEOSERVER_WMS_URL, LAYERS, FILTER_COLS } from "@/app/lib/config";
import L from "leaflet";

interface MapProps {
    activeFilter: string; // 'agriculture' | 'elevage' | 'peche'
    culture: string;      // 'Tous' | 'Cacao' ...
}

// --- COMPOSANT : GESTION DES EVENEMENTS ET SYNCHRONISATION ---
function MapController({
                           onFeatureSelect,
                           activeLayer,
                           onBoundsChange
                       }: {
    onFeatureSelect: (feature: any) => void,
    activeLayer: string,
    onBoundsChange: (bounds: L.LatLngBounds) => void
}) {
    const map = useMapEvents({
        // Quand on bouge la grande carte, on met à jour le rectangle de la mini-carte
        moveend: () => {
            onBoundsChange(map.getBounds());
        },
        // Quand on clique pour sélectionner une zone
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
                X: Math.floor(point.x).toString(),
                Y: Math.floor(point.y).toString(),
                WIDTH: size.x.toString(),
                HEIGHT: size.y.toString(),
                SRS: 'EPSG:4326',
                BBOX: bounds.toBBoxString(),
                'ngrok-skip-browser-warning': 'true' // Bypass URL
            });

            try {
                const res = await fetch(`${GEOSERVER_WMS_URL}?${params.toString()}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' } // Bypass Header
                });
                const data = await res.json();

                if (data.features && data.features.length > 0) {
                    onFeatureSelect(data.features[0]);
                } else {
                    onFeatureSelect(null);
                }
            } catch (err) {
                console.error("Erreur GetFeatureInfo:", err);
            }
        },
    });

    // Initialisation des bornes au chargement
    useEffect(() => {
        onBoundsChange(map.getBounds());
    }, []);

    return null;
}

export default function MapInstance({ activeFilter, culture }: MapProps) {
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    // Détermination de la couche et du filtre
    const currentLayer = LAYERS[activeFilter as keyof typeof LAYERS] || LAYERS.default;
    let cqlFilter = "INCLUDE";
    if (culture && culture !== 'Tous') {
        const column = FILTER_COLS[activeFilter as keyof typeof FILTER_COLS] || 'type';
        cqlFilter = `${column} ILIKE '%${culture}%'`;
    }

    if (!isMounted) return null;

    return (
        <div className="h-full w-full relative overflow-hidden bg-slate-900">
            {/* Styles globaux pour la sélection et le curseur */}
            <style jsx global>{`
                .leaflet-container { cursor: crosshair !important; }
                .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.4); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>

            <MapContainer
                center={[7.3697, 12.3547]}
                zoom={6}
                className="h-full w-full z-0"
                zoomControl={false}
            >
                {/* Fonds de carte (Basemaps) */}
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" opacity={0.5} />

                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Production Actuelle">
                        <WMSTileLayer
                            key={`${currentLayer}-${cqlFilter}`}
                            url={GEOSERVER_WMS_URL}
                            params={{
                                layers: currentLayer,
                                format: 'image/png',
                                transparent: true,
                                version: '1.1.1',
                                styles: '',
                                CQL_FILTER: cqlFilter,
                                'ngrok-skip-browser-warning': 'true'
                            } as any}
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {/* --- SURBRILLANCE DE LA ZONE SÉLECTIONNÉE --- */}
                {selectedFeature && (
                    <GeoJSON
                        key={`highlight-${selectedFeature.id}`}
                        data={selectedFeature}
                        style={{
                            fillColor: '#f59e0b',
                            fillOpacity: 0.3,
                            color: '#d97706',
                            weight: 3,
                            dashArray: '5, 10'
                        }}
                    />
                )}

                <MapController
                    onFeatureSelect={setSelectedFeature}
                    activeLayer={currentLayer}
                    onBoundsChange={setMapBounds}
                />
                <ScaleControl position="bottomleft" />
            </MapContainer>

            {/* --- PANNEAU DE DÉTAILS (SIDE DRAWER) --- */}
            <div className={`fixed top-24 right-8 bottom-8 w-96 glass-panel shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[3rem] z-[1001] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${selectedFeature ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
                {selectedFeature && (
                    <div className="flex flex-col h-full">
                        {/* Header Coloré */}
                        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">
                            <button onClick={() => setSelectedFeature(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/40">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black leading-tight tracking-tight">
                                        {selectedFeature.properties.nom_reg || selectedFeature.properties.name || "Zone d'intérêt"}
                                    </h2>
                                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">Données Certifiées</span>
                                </div>
                            </div>
                        </div>

                        {/* Contenu Data */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-white/50 rounded-3xl border border-white">
                                    <TrendingUp className="mx-auto mb-2 text-emerald-500" size={20} />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Statut</p>
                                    <p className="text-sm font-black text-slate-700">Actif</p>
                                </div>
                                <div className="p-4 bg-white/50 rounded-3xl border border-white">
                                    <Layers className="mx-auto mb-2 text-blue-500" size={20} />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Couche</p>
                                    <p className="text-sm font-black text-slate-700 capitalize">{activeFilter}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(selectedFeature.properties).map(([key, value]) => {
                                    if (['bbox', 'id', 'geom', 'osm_id'].includes(key.toLowerCase())) return null;
                                    return (
                                        <div key={key} className="flex flex-col p-4 bg-white/40 rounded-2xl border border-white/60">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-slate-800 font-bold">{String(value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-8 bg-white/30">
                            <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2">
                                Voir les statistiques complètes <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MINI-CARTE (LOCATOR MAP) --- */}
            <div className="absolute bottom-10 left-10 w-44 h-44 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden z-[1000] hidden md:block bg-slate-100 group/mini">
                <MapContainer
                    center={[7.36, 12.35]}
                    zoom={4}
                    className="h-full w-full opacity-80 group-hover/mini:opacity-100 transition-opacity"
                    dragging={false}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                    {/* Rectangle de vision qui bouge avec la grande carte */}
                    {mapBounds && (
                        <Rectangle
                            bounds={mapBounds}
                            pathOptions={{ color: "#ef4444", weight: 2, fillOpacity: 0.1 }}
                        />
                    )}

                    {/* Rappel de la zone sélectionnée sur la mini-carte */}
                    {selectedFeature && (
                        <GeoJSON
                            key={`mini-${selectedFeature.id}`}
                            data={selectedFeature}
                            style={{ fillColor: '#f59e0b', fillOpacity: 0.8, color: '#d97706', weight: 1 }}
                        />
                    )}
                </MapContainer>

                {/* Badge contextuel */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur rounded-full shadow-sm">
                    <p className="text-[8px] font-black uppercase text-slate-500">Vue Globale</p>
                </div>
            </div>
        </div>
    );
}