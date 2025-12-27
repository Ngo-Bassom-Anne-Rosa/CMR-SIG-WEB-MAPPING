"use client";

import dynamic from "next/dynamic";


const MapInstance = dynamic(() => import("./MapInstance"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
            Initialisation de la carte du Cameroun...
        </div>
    ),
});

export default function MapWrapper() {
    return <MapInstance />;
}