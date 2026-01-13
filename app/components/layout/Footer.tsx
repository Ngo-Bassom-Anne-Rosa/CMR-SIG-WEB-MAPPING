'use client';
import React from 'react';
import { BarChart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="bg-amber-400 p-2 rounded-lg">
            <BarChart className="h-6 w-6 text-slate-900" />
          </div>
          <span className="text-2xl font-bold text-white">Agro-Sig</span>
        </div>
        <p className="max-w-md mx-auto mb-6">
          Plateforme de valorisation des données de production pour une prise de décision éclairée au Cameroun.
        </p>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Groupe 5 - Projet de SIG, Polytechnique Yaoundé.
        </p>
      </div>
    </footer>
  );
}