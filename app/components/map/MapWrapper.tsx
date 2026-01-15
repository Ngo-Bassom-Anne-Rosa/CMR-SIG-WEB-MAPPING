/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";

const MapInstance = dynamic(() => import("./MapInstance"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center">Chargement SIG...</div>,
});

export default function MapWrapper(props: any) {
    return <MapInstance {...props} />;
}