import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// --- LOADER ---
export const LoadingState = ({ message = "Chargement des données..." }: { message?: string }) => (
    <div className="flex flex-col items-center justify-center p-8 h-full min-h-[200px] w-full text-slate-400 animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-amber-500 mb-3" size={40} />
        <p className="text-sm font-medium animate-pulse">{message}</p>
    </div>
);

// --- ERROR ---
export const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 h-full min-h-[200px] w-full bg-red-50 rounded-2xl border border-red-100 text-red-500 animate-in zoom-in-95 duration-300">
        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
            <AlertCircle size={32} />
        </div>
        <h3 className="font-bold text-lg text-red-700 mb-1">Oups !</h3>
        <p className="text-sm text-center max-w-xs mb-4">{message}</p>
        {onRetry && (
            <button 
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-100 transition-colors shadow-sm"
            >
                <RefreshCw size={16} /> Réessayer
            </button>
        )}
    </div>
);

// --- EMPTY ---
export const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-sm font-medium">{message}</p>
    </div>
);