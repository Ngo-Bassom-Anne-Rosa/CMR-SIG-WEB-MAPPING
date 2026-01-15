/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { GEOSERVER_WMS_URL } from "@/app/lib/config";

interface MapControllerProps {
    onFeatureSelect: (f: any) => void;
    activeLayer: string;
    cqlFilter: string;
    searchResult: any;
}

export default function MapController({ onFeatureSelect, activeLayer, cqlFilter, searchResult }: MapControllerProps) {
    const map = useMap();

    // Zoom manager when a search result is selected
    useEffect(() => {
        if (searchResult) {
            const fetchGeometryAndZoom = async () => {
                try {
                    const entityName = searchResult.entity_name || searchResult.nom_zone;
                    const cql = `entity_name='${entityName.replace(/'/g, "''")}'`; 
                    const url = `${GEOSERVER_WMS_URL.replace('/wms', '/wfs')}?service=WFS&version=1.0.0&request=GetFeature&typeName=${activeLayer}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(cql)}`;
                    
                    const res = await fetch(url);
                    const data = await res.json();
                    
                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        const geoJsonLayer = L.geoJSON(feature);
                        map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50], maxZoom: 10 });
                        onFeatureSelect(feature);
                    }
                } catch (e) {
                    console.error("Impossible de zoomer sur la zone", e);
                }
            };
            fetchGeometryAndZoom();
        }
    }, [searchResult, map, activeLayer, onFeatureSelect]);

    // clic on map manager
    useMapEvents({
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

            if (cqlFilter !== 'INCLUDE') params.set('CQL_FILTER', cqlFilter);

            try {
                const res = await fetch(`${GEOSERVER_WMS_URL}?${params.toString()}`);
                const data = await res.json();
                
                if (data.features && data.features.length > 0) {
                    const sortedFeatures = data.features.sort((a: any, b: any) => {
                        // Calcul surface A
                        // GeoJSON bbox format: [minX, minY, maxX, maxY]
                        const widthA = Math.abs(a.bbox[2] - a.bbox[0]);
                        const heightA = Math.abs(a.bbox[3] - a.bbox[1]);
                        const areaA = widthA * heightA;

                        // Calcul surface B
                        const widthB = Math.abs(b.bbox[2] - b.bbox[0]);
                        const heightB = Math.abs(b.bbox[3] - b.bbox[1]);
                        const areaB = widthB * heightB;

                        // Ascendent sort (smaller first)
                        return areaA - areaB;
                    });

                    // select the min
                    onFeatureSelect(sortedFeatures[0]);
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