// FILE: ./app/components/map/MapInstance.tsx
"use client";
import { MapContainer, TileLayer, WMSTileLayer, GeoJSON, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
import { GEOSERVER_WMS_URL, LAYERS, STYLES, FILTER_COLS } from "@/app/lib/config";

// Imports des composants modulaires
import MapController from "./MapController";
import SideDrawer from "./SideDrawer";
// --- 1. IMPORT DE LA LÉGENDE ---
import Legend from "../ui/Legend"; 
import { MapProps, GeoJSONFeature, CustomWMSOptions } from "./types";

export default function MapInstance({ activeFilter, culture, searchResult }: MapProps) {
    const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
    
    useEffect(() => { setSelectedFeature(null); }, [activeFilter, culture]);

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
    if (culture && culture !== 'Tous') {
        const filterColumn = FILTER_COLS[activeFilter as keyof typeof FILTER_COLS];
        const sanitizedCulture = culture.replace("'", "''");
        if (filterColumn) cqlFilter = `${filterColumn} = '${sanitizedCulture}'`;
    }
    if (cqlFilter !== "INCLUDE") wmsParams.cql_filter = cqlFilter;

    return (
        <div className="h-full w-full relative overflow-hidden bg-slate-200">
            <style jsx global>{`
                .leaflet-container { cursor: crosshair !important; background: #e2e8f0; }
                .drawer-enter { transform: translateX(100%); }
                .drawer-enter-active { transform: translateX(0); transition: transform 300ms ease-out; }
                .drawer-exit { transform: translateX(0); }
                .drawer-exit-active { transform: translateX(100%); transition: transform 300ms ease-in; }
            `}</style>

            <MapContainer center={[7.3697, 12.3547]} zoom={6} className="h-full w-full z-0" zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO'/>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" pane="shadowPane" />

                <WMSTileLayer
                    key={`${currentLayerName}-${culture}`}
                    url={GEOSERVER_WMS_URL}
                    params={wmsParams}
                />

                {selectedFeature && (
                    <GeoJSON
                        key={selectedFeature.id}
                        data={selectedFeature.geometry}
                        style={{ fillColor: 'transparent', color: '#f59e0b', weight: 4, opacity: 1 }}
                    />
                )}

                <MapController 
                    onFeatureSelect={setSelectedFeature} 
                    activeLayer={currentLayerName} 
                    cqlFilter={cqlFilter}
                    searchResult={searchResult}
                />
                
                <ScaleControl position="bottomleft" />
            </MapContainer>

            {/* --- 2. INTÉGRATION DE LA LÉGENDE --- */}
            {/* On la passe activeFilter pour qu'elle s'adapte (Vert/Jaune/Bleu) */}
            <Legend activeFilter={activeFilter} />

            {/* Conteneur du SideDrawer */}
            <div className={`fixed z-[1000] transition-transform duration-500 ease-in-out bottom-0 left-0 right-0 h-[60vh] rounded-t-3xl md:top-24 md:right-6 md:bottom-6 md:left-auto md:h-auto md:w-auto md:rounded-3xl md:translate-y-0 ${selectedFeature ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-[120%]'}`}>
                <SideDrawer 
                    feature={selectedFeature} 
                    activeFilter={activeFilter} 
                    onClose={() => setSelectedFeature(null)} 
                />
            </div>
        </div>
    );
}