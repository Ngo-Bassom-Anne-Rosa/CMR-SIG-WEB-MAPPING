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

    // Gestion du Zoom lors d'une recherche (inchangé)
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

    // Gestion du Clic sur la carte (GetFeatureInfo)
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
                // On demande beaucoup d'éléments pour être sûr d'avoir la petite division cachée en dessous
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
                    
                    // --- NOUVELLE STRATÉGIE DE TRI : SURFACE ---
                    // On ne se fie plus aux attributs (qui peuvent avoir des erreurs de saisie).
                    // On calcule la surface de la "Bounding Box" de chaque élément trouvé.
                    // Le plus petit élément est forcément le plus précis (Arrondissement < Département < Région).
                    
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

                        // Tri ascendant : le plus petit en premier
                        return areaA - areaB;
                    });

                    // Log pour débogage (à ouvrir dans la console F12)
                    console.log("Zones trouvées sous le clic (triées par taille) :", 
                        sortedFeatures.map((f: any) => `${f.properties.entity_name} (${f.properties.admin_level})`)
                    );

                    // On sélectionne le plus petit
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