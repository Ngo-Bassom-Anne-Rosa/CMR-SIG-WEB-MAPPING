// FILE: ./app/dashboard/page.tsx
"use client";
import React, { useState } from 'react';
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MapWrapper from "../components/map/MapWrapper";

export default function DashboardPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('agriculture');
    const [selectedCulture, setSelectedCulture] = useState('Tous');
    
    // Nouvel état pour gérer le résultat de la recherche
    const [searchResult, setSearchResult] = useState<any>(null);

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
                <Header 
                    isSidebarOpen={isSidebarOpen} 
                    setSidebarOpen={setSidebarOpen}
                    activeTab={activeTab} // On passe la filière active au Header pour la recherche
                    onSearchResult={(result) => setSearchResult(result)} // Callback quand on clique sur un résultat
                />
                
                <main className="flex-1 overflow-auto relative">
                    <div className="absolute inset-0">
                         {/* On passe le résultat de recherche à la carte pour le zoom */}
                         <MapWrapper 
                            activeFilter={activeTab} 
                            culture={selectedCulture} 
                            searchResult={searchResult}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}