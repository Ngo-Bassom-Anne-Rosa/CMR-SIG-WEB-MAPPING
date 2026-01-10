'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, X, Map as MapIcon } from 'lucide-react'

// --- CONFIGURATION DES DONNÉES ---
const slides = [
  {
    id: 1,
    image: '/agri2.jpg', // Image de fond slider
    title: "L'Agriculture au Cameroun",
    subtitle: "Cartographie des bassins de production agricole.",
  },
  {
    id: 2,
    image: '/elevage2.jpg', // Image de fond slider
    title: "L'Élevage Moderne",
    subtitle: "Suivi et gestion des zones pastorales.",
  },
  {
    id: 3,
    image: '/fish2.jpg', // Image de fond slider
    title: "La Pêche Durable",
    subtitle: "Analyse des zones de pêche maritimes et fluviales.",
  },
];

const features = [
  {
    title: "Secteur Agricole",
    description: "Visualisez les grandes zones de culture (Cacao, Café, Maïs...) et optimisez les rendements grâce aux données géospatiales précises sur les sols et le climat.",
    image: '/agri1.jpg', // Image carte 1
    link: '/dashboard?sector=agriculture'
  },
  {
    title: "Secteur Élevage",
    description: "Identifiez les bassins d'élevage bovin, les zones de pâturage et les infrastructures vétérinaires réparties à travers le territoire national.",
    image: '/elevage1.jpg', // Image carte 2
    link: '/dashboard?sector=elevage'
  },
  {
    title: "Secteur Pêche",
    description: "Cartographie détaillée des cours d'eau, des lacs et du littoral pour une gestion durable des ressources halieutiques et le suivi des activités.",
    image: '/fish1.jpg', // Image carte 3
    link: '/dashboard?sector=peche'
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      
      {/* --- HERO SECTION --- */}
      <header className="relative h-screen w-full overflow-hidden bg-slate-900">
        
        {/* Background Slider */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-slate-900/60 z-10" /> 
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* --- NAVBAR --- */}
        <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            
            {/* LOGO (Exactement comme sur la photo) */}
            <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-400 rounded-lg"><MapPin className="text-slate-900" size={24} /></div>
                        <h1 className="text-xl font-bold">Agro-Sig <span className="text-amber-400">237</span></h1>
                    </div>
                    <button  className="lg:hidden"><X /></button>
                </div>

            {/* BOUTONS NAVIGATION (Gauche) */}
            <div className="hidden md:flex gap-4">
              <Link href="/auth/login"> 
                <button className="px-6 py-2 rounded-full border border-slate-300 text-white hover:bg-white hover:text-slate-900 transition font-medium text-sm">
                  Se connecter
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-6 py-2 rounded-full bg-amber-400 text-slate-900 hover:bg-amber-500 transition font-bold text-sm shadow-lg shadow-amber-400/20">
                  S'inscrire
                </button>
              </Link>
            </div>
          </div>
          
          {/* Menu Mobile */}
          <div className="md:hidden text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </div>
        </nav>

        {/* --- TEXTE CENTRAL --- */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 max-w-3xl mb-10 font-light">
            {slides[currentSlide].subtitle}
          </p>
          <Link href="/dashboard">
            <button className="bg-amber-400 text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-amber-500 transition transform hover:-translate-y-1 shadow-xl">
               Accéder à la carte Interactive
            </button>
          </Link>
        </div>
        
        {/* Indicateurs (dots) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/40 w-2 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </header>

      {/* --- SECTION PRÉSENTATION (IMAGES CARDS) --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Nos secteurs d'activité
          </h2>
          <div className="h-1 w-20 bg-amber-400 mx-auto rounded-full mb-4"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Une vue d'ensemble des ressources naturelles du Cameroun pour une meilleure prise de décision.
          </p>
        </div>

        {/* Grid des Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
              
              {/* Zone Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition z-10" />
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Petit Tag sur l'image */}
                <div className="absolute top-4 left-4 z-20 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Cameroun
                </div>
              </div>

              {/* Contenu Texte */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>
                
                {/* Lien "En savoir plus" */}
                <Link href={feature.link} className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition self-start">
                  Voir sur la carte
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo Footer */}
          <div className="flex items-center gap-3">
             <div className="bg-amber-400 p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
             </div>
             <span className="text-xl font-bold text-white">Agro-Sig <span className="text-amber-400">237</span></span>
          </div>

          <div className="text-sm text-slate-400 text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Groupe 5 - Polytechnique Yaoundé.</p>
            <p>Projet de Système d'Informations Géographiques.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}