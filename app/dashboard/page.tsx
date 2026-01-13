"use client";
import React, { useState } from 'react';
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MapWrapper from "../components/map/MapWrapper";

export default function DashboardPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('agriculture');
    const [selectedCulture, setSelectedCulture] = useState('Tous');

    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedCulture={selectedCulture}
                setSelectedCulture={setSelectedCulture}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                {/* Conteneur principal qui prend tout l'espace restant et permet le scroll si besoin */}
                <main className="flex-1 overflow-auto relative">
                    <div className="absolute inset-0">
                         <MapWrapper activeFilter={activeTab} culture={selectedCulture} />
                    </div>
                </main>
            </div>
        </div>
    );
}