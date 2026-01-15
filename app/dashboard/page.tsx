"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MapWrapper from "../components/map/MapWrapper";
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCulture, setSelectedCulture] = useState('Tous');
    const [searchResult, setSearchResult] = useState<any>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const target = searchParams.get('target');
    const sector = searchParams.get('sector');
    const [activeTab, setActiveTab] = useState(sector || 'agriculture');

    useEffect(() => {
        if (target) {
            setSearchResult({
                entity_name: target,
                nom_zone: target,
            });
        }
    }, [target]);

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
                    activeTab={activeTab}
                    onSearchResult={(result) => setSearchResult(result)}
                />
                
                <main className="flex-1 overflow-auto relative">
                    <div className="absolute inset-0">
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

// Principal page
export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-100"><Loader2 className="animate-spin text-amber-500" size={48}/></div>}>
            <DashboardContent />
        </Suspense>
    );
}