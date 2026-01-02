"use client";
import { MapContainer, TileLayer, WMSTileLayer, useMapEvents, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { X, Info, AreaChart, Map as MapIcon } from 'lucide-react';

const WMS_URL = "https://apodemal-kathern-semisentimentalized.ngrok-free.dev/geoserver/sig_cmr_web_mapping/wms";

interface MapProps { activeFilter: string; culture: string; }

// Gestionnaire de clic pour Tâche 2.2
function MapEvents({ onInfo }: { onInfo: (data: any) => void }) {
    const map = useMapEvents({
        click: async (e) => {
            const size = map.getSize();
            const point = map.latLngToContainerPoint(e.latlng);
            const bounds = map.getBounds();

            const url = `${WMS_URL}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=sig_cmr_web_mapping:regions&QUERY_LAYERS=sig_cmr_web_mapping:regions&INFO_FORMAT=application/json&X=${Math.floor(point.x)}&Y=${Math.floor(point.y)}&WIDTH=${size.x}&HEIGHT=${size.y}&SRS=EPSG:4326&BBOX=${bounds.toBBoxString()}`;

            try {
                const res = await fetch(url);
                const data = await res.json();
                if (data.features?.length > 0) onInfo(data.features[0].properties);
            } catch (err) { console.error(err); }
        },
    });
    return null;
}

export default function MapInstance({ activeFilter, culture }: MapProps) {
    const [feature, setFeature] = useState<any>(null);

    // Tâche 2.1 : Construction du filtre CQL
    const cqlFilter = culture !== 'Tous' ? `culture='${culture}'` : "INCLUDE";

    return (
        <div className="h-full w-full relative">
            <MapContainer center={[7.36, 12.35]} zoom={6} className="h-full w-full" zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                <WMSTileLayer
                    url={WMS_URL}
                    params={{
                        layers: 'sig_cmr_web_mapping:regions',
                        format: 'image/png',
                        transparent: true,
                        CQL_FILTER: cqlFilter
                    } as any}
                />

                <MapEvents onInfo={setFeature} />
                <ScaleControl position="bottomleft" />
            </MapContainer>

            {/* Tâche 2.3 : Side Drawer Coulissant */}
            <div className={`fixed top-24 right-6 bottom-6 w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl z-[1001] transition-transform duration-500 border border-slate-200 ${feature ? 'translate-x-0' : 'translate-x-[120%]'}`}>
                {feature && (
                    <div className="p-6 h-full flex flex-col">
                        <button onClick={() => setFeature(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><Info size={24} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{feature.nom_reg || "Région"}</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Détails du bassin</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-1 text-slate-400"><MapIcon size={14} /> <span className="text-[10px] font-bold uppercase">Chef-Lieu</span></div>
                                <p className="font-semibold text-slate-700">{feature.chef_lieu || "N/A"}</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                <div className="flex items-center gap-2 mb-1 text-emerald-500"><AreaChart size={14} /> <span className="text-[10px] font-bold uppercase">Superficie</span></div>
                                <p className="font-bold text-emerald-700 text-lg">45,000 km²</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tâche 4.3 : Mini-Carte (Aperçu fixe) */}
            <div className="absolute bottom-6 left-6 w-32 h-32 rounded-2xl border-2 border-white shadow-lg overflow-hidden z-[1000] hidden md:block">
                <MapContainer center={[7.36, 12.35]} zoom={3} className="h-full w-full" dragging={false} zoomControl={false} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </div>
        </div>
    );
}