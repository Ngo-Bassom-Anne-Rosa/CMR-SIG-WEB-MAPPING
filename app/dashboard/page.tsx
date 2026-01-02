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
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedCulture={selectedCulture}
                setSelectedCulture={setSelectedCulture}
            />

            <main className="flex-1 flex flex-col relative min-w-0">
                <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 relative z-0">
                    {/* On passe le filtre et la culture à la carte */}
                    <MapWrapper activeFilter={activeTab} culture={selectedCulture} />
                </div>
            </main>
        </div>
    );
}