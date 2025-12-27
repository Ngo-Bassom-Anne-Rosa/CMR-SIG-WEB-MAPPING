"use client";
import { MapContainer, TileLayer, WMSTileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function MapInstance() {
    const [isMounted, setIsMounted] = useState(false);

    // URL de votre GeoServer via ngrok
    const G_SERVER_URL = "https://apodemal-kathern-semisentimentalized.ngrok-free.dev/geoserver/sig_cmr_web_mapping/wms";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // Empêche tout rendu Leaflet côté serveur

    return (
        <div className="h-full w-full">
            <MapContainer
                center={[7.3697, 12.3547]}
                zoom={6}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                {/* Fond de carte neutre pour faire ressortir les données Agro */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                />

                {/* Gestion des couches provenant UNIQUEMENT de GeoServer */}
                <LayersControl position="topright">

                    {/* Couche des polygones (Bassins de production) */}
                    <LayersControl.Overlay checked name="Bassins de Production (WMS)">
                        <WMSTileLayer
                            url={G_SERVER_URL}
                            params={{
                                layers: 'sig_cmr_web_mapping:bassins_production', // Vérifiez ce nom dans votre GeoServer
                                format: 'image/png',
                                transparent: true,
                                version: '1.1.1',
                            }}
                            opacity={0.7}
                        />
                    </LayersControl.Overlay>

                    {/* Ajoutez ici d'autres couches si vous en avez (ex: points de collecte) */}

                </LayersControl>
            </MapContainer>
        </div>
    );
}