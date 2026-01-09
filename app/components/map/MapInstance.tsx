"use client";
import { MapContainer, TileLayer, WMSTileLayer, useMapEvents, ScaleControl, LayersControl, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { X, Database, MapPin, TrendingUp, Info } from 'lucide-react';
import { GEOSERVER_WMS_URL, LAYERS, FILTER_COLS } from "@/app/lib/config";
import L from "leaflet";

interface MapProps {
    activeFilter: string;
    culture: string;
}

// --- GESTIONNAIRE D'ÉVÉNEMENTS ET SÉLECTION ---
function MapEvents({ onFeatureSelect, activeLayer }: { onFeatureSelect: (feature: any) => void, activeLayer: string }) {
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
                INFO_FORMAT: 'application/json', // On demande du JSON pour avoir la géométrie
                X: Math.floor(point.x).toString(),
                Y: Math.floor(point.y).toString(),
                WIDTH: size.x.toString(),
                HEIGHT: size.y.toString(),
                SRS: 'EPSG:4326',
                BBOX: bounds.toBBoxString(),
                'ngrok-skip-browser-warning': 'true'
            });

            try {
                const res = await fetch(`${GEOSERVER_WMS_URL}?${params.toString()}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
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
    return null;
}

export default function MapInstance({ activeFilter, culture }: MapProps) {
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const currentLayer = LAYERS[activeFilter as keyof typeof LAYERS] || LAYERS.default;

    let cqlFilter = "INCLUDE";
    if (culture && culture !== 'Tous') {
        const column = FILTER_COLS[activeFilter as keyof typeof FILTER_COLS] || 'type';
        cqlFilter = `${column} ILIKE '%${culture}%'`;
    }

    return (
        <div className="h-full w-full relative group/map">
            {/* Style CSS pour le curseur et les animations */}
            <style jsx global>{`
                .leaflet-container { cursor: crosshair !important; background: #f8fafc !important; }
                .selection-highlight { fill: #fbbf24; fill-opacity: 0.3; stroke: #f59e0b; stroke-width: 3; stroke-dasharray: 5, 5; animation: dash 20s linear infinite; }
                @keyframes dash { to { stroke-dashoffset: 1000; } }
            `}</style>

            <MapContainer
                center={[7.3697, 12.3547]}
                zoom={6}
                className="h-full w-full z-0 transition-opacity duration-500"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                    opacity={0.6}
                />

                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Vue Thématique">
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

                {/* --- COUCHE DE SURBRILLANCE (SÉLECTION) --- */}
                {selectedFeature && (
                    <GeoJSON
                        key={selectedFeature.id}
                        data={selectedFeature}
                        style={() => ({
                            fillColor: '#fbbf24',
                            fillOpacity: 0.4,
                            color: '#d97706',
                            weight: 3,
                            dashArray: '3',
                        })}
                    />
                )}

                <MapEvents onFeatureSelect={setSelectedFeature} activeLayer={currentLayer} />
                <ScaleControl position="bottomleft" />
            </MapContainer>

            {/* --- PANEL D'INFORMATION STYLISÉ --- */}
            <div className={`fixed top-24 right-8 bottom-8 w-96 bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] z-[1001] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/40 overflow-hidden ${selectedFeature ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
                {selectedFeature && (
                    <div className="flex flex-col h-full">
                        {/* Header Image-like */}
                        <div className="h-32 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 relative p-8">
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all shadow-xl"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                                    <MapPin className="text-white" size={28} />
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-black tracking-tight leading-tight">
                                        {selectedFeature.properties.nom_reg || selectedFeature.properties.name || "Secteur"}
                                    </h2>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" /> Données Temps Réel
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Corps du Panel */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                            {/* Widget Statistique Rapide */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-amber-200 transition-all">
                                    <TrendingUp className="text-amber-500 mb-2" size={20} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Potentiel</p>
                                    <p className="text-xl font-bold text-slate-800">Élevé</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-amber-200 transition-all">
                                    <Database className="text-blue-500 mb-2" size={20} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Fiabilité</p>
                                    <p className="text-xl font-bold text-slate-800">94%</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Informations Détaillées</p>
                                {Object.entries(selectedFeature.properties).map(([key, value]: [string, any]) => {
                                    if (['bbox', 'id', 'geom', 'osm_id'].includes(key.toLowerCase())) return null;
                                    return (
                                        <div key={key} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                            <span className="text-xs font-bold text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-sm font-black text-slate-700">{String(value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
                                Générer un rapport PDF
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

