"use client";
import React from 'react';
import { Menu, Search, Settings } from 'lucide-react';

interface HeaderProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
}

export default function Header({ isSidebarOpen, setSidebarOpen }: HeaderProps) {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-8 justify-between z-40">
            <div className="flex items-center gap-4 flex-1">
                <button onClick={() => setSidebarOpen(true)} className={`${isSidebarOpen ? 'hidden' : 'block'} p-2 hover:bg-slate-100 rounded-lg text-slate-600`}>
                    <Menu size={20} />
                </button>
                <div className="relative w-full max-w-lg hidden sm:block">
                    <Search className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une localité..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase italic">Groupe 5</p>
                    <p className="text-xs font-semibold text-slate-700">Polytechnique YDE</p>
                </div>
                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 border border-slate-300">
                    <Settings size={18} />
                </div>
            </div>
        </header>
    );
}