"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MapWrapper from "../components/map/MapWrapper";
import { Loader2 } from 'lucide-react';

// Composant interne qui utilise useSearchParams
function DashboardContent() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('agriculture');
    const [selectedCulture, setSelectedCulture] = useState('Tous');
    const [searchResult, setSearchResult] = useState<any>(null);

    const searchParams = useSearchParams();
    const target = searchParams.get('target');
    const router = useRouter();

    // --- EFFET POUR GERER LA REDIRECTION DEPUIS FAVORIS ---
    useEffect(() => {
        if (target) {
            // On simule un objet "résultat de recherche" pour que le MapController le détecte
            // Le MapController utilise 'entity_name' ou 'nom_zone' pour faire sa requête WFS et zoomer
            setSearchResult({
                entity_name: target,
                nom_zone: target,
                // On met des valeurs par défaut pour les autres champs, 
                // le SideDrawer fera son propre fetch si besoin ou affichera le nom
            });

            // Optionnel : Nettoyer l'URL après prise en compte pour ne pas re-zoomer au refresh
            // router.replace('/dashboard'); 
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

// Page principale avec Suspense Boundary
export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-100"><Loader2 className="animate-spin text-amber-500" size={48}/></div>}>
            <DashboardContent />
        </Suspense>
    );
}