'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Edit, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/config";

type UserProfile = {
    user_id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
};

export default function ProfilePage() {
    const router = useRouter(); // On initialise le router
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Vous n'êtes pas connecté. Redirection...");
                setTimeout(() => window.location.href = '/auth/login', 2000);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/profile/me`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Impossible de charger le profil. Votre session a peut-être expiré.");
                const data = await res.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('authToken');
        if (!token || !profile) {
            setError("Session invalide. Veuillez vous reconnecter.");
            setIsSaving(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.errors?.[0]?.msg || "La mise à jour a échoué.");
            }
            
            const updatedProfile = await res.json();
            setProfile(prev => ({ ...prev!, first_name: updatedProfile.first_name, last_name: updatedProfile.last_name }));
            setSuccess("Profil mis à jour avec succès !");
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (profile) {
            setProfile({ ...profile, [e.target.name]: e.target.value });
        }
    };

    if (isLoading && !profile) {
        return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;
    }
    
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    {/* --- CORRECTION DU BOUTON RETOUR --- */}
                    <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-amber-500 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mon Profil</h1>
                        <p className="text-slate-500 font-medium">Gérez vos informations personnelles.</p>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                    <form onSubmit={handleSave}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><User size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Informations Personnelles</h2>
                                    <p className="text-sm text-slate-500">{isEditing ? "Mode édition" : "Vos informations sont privées."}</p>
                                </div>
                            </div>
                            {!isEditing ? (
                                <button type="button" onClick={() => { setIsEditing(true); setSuccess(''); setError(''); }} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                                    <Edit size={14} /> Modifier
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg">Annuler</button>
                                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                                        {isSaving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} Enregistrer
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
                        {success && <div className="mb-4 p-3 bg-emerald-100 text-emerald-600 text-sm rounded-lg flex items-center gap-2"><CheckCircle size={16}/> {success}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Prénom</label>
                                <input type="text" name="first_name" value={profile?.first_name || ''} onChange={handleInputChange} disabled={!isEditing} className="w-full font-semibold text-slate-700 bg-transparent p-2 rounded-md disabled:bg-slate-50 border disabled:border-slate-200 border-transparent focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400">Nom</label>
                                <input type="text" name="last_name" value={profile?.last_name || ''} onChange={handleInputChange} disabled={!isEditing} className="w-full font-semibold text-slate-700 bg-transparent p-2 rounded-md disabled:bg-slate-50 border disabled:border-slate-200 border-transparent focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"/>
                            </div>
                            <div className="space-y-1 col-span-1 md:col-span-2">
                                <label className="text-xs font-medium text-slate-400">Email</label>
                                <p className="font-semibold text-slate-500 bg-slate-50 border border-slate-200 p-2 rounded-md">{profile?.email || 'Chargement...'}</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}