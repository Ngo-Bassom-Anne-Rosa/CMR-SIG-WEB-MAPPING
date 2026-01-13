'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: "Analyse Agricole",
    description: "Visualisez les zones de culture (Cacao, Café, Maïs...) et optimisez les rendements grâce aux données géospatiales.",
    image: '/agri1.jpg',
    link: '/dashboard?sector=agriculture'
  },
  {
    title: "Données d'Élevage",
    description: "Identifiez les bassins d'élevage, les zones de pâturage et les infrastructures vétérinaires à travers le territoire.",
    image: '/elevage1.jpg',
    link: '/dashboard?sector=elevage'
  },
  {
    title: "Statistiques de Pêche",
    description: "Cartographie détaillée des cours d'eau, lacs et littoraux pour une gestion durable des ressources halieutiques.",
    image: '/fish1.jpg',
    link: '/dashboard?sector=peche'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">Nos Filières</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Une Vision Intégrée des Secteurs Clés
          </p>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            Plongez au cœur des données pour chaque filière. Accédez à des analyses détaillées, des comparaisons de performance et des visualisations cartographiques intuitives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Link href={feature.link} key={idx} className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden transform hover:-translate-y-2">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src={feature.image} alt={feature.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white z-10 drop-shadow-md">
                  {feature.title}
                </h3>
              </div>
              <div className="p-8">
                <p className="text-slate-600 leading-relaxed mb-5">
                  {feature.description}
                </p>
                <span className="inline-flex items-center text-amber-600 font-semibold group-hover:text-amber-700 transition">
                  Accéder aux données
                  <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}