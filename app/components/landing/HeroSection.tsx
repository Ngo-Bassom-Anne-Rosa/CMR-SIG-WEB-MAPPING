'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Dog, Fish, ArrowRight } from 'lucide-react';
import Navbar from '../layout/Navbar';

const slides = [
  {
    id: 1,
    image: '/agri2.jpg',
    Icon: Leaf,
    title: "Intelligence Agricole",
    subtitle: "Cartographiez les bassins de production, analysez les rendements et optimisez vos stratégies agricoles.",
    color: 'emerald',
  },
  {
    id: 2,
    image: '/elevage2.jpg',
    Icon: Dog,
    title: "Gestion Pastorale",
    subtitle: "Visualisez la répartition du cheptel, suivez les zones de pâturage et planifiez le développement de l'élevage.",
    color: 'amber',
  },
  {
    id: 3,
    image: '/fish2.jpg',
    Icon: Fish,
    title: "Ressources Halieutiques",
    subtitle: "Explorez les zones de pêche maritimes et continentales pour une exploitation durable et informée.",
    color: 'blue',
  },
];

const colorVariants = {
  emerald: 'text-emerald-400 bg-emerald-400 shadow-emerald-400/30 hover:bg-emerald-500',
  amber: 'text-amber-400 bg-amber-400 shadow-amber-400/30 hover:bg-amber-500',
  blue: 'text-blue-400 bg-blue-400 shadow-blue-400/30 hover:bg-blue-500',
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[currentSlide];
  const activeColorClass = colorVariants[activeSlide.color as keyof typeof colorVariants];

  return (
    <header className="relative h-screen w-full overflow-hidden bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-10" />
          <Image src={slide.image} alt={slide.title} fill className="object-cover scale-105" priority={index === 0} />
        </div>
      ))}

      <Navbar activeColorClass={activeColorClass} />

      <div className="relative z-20 h-full flex flex-col justify-center items-start text-left px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className={`flex items-center gap-3 mb-4 text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${activeColorClass}`}>
            <activeSlide.Icon size={18} />
            {activeSlide.title}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700" key={activeSlide.id}>
            {activeSlide.subtitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 font-light animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            Notre plateforme SIG centralise les données de production pour offrir une vision stratégique et décisionnelle sur les secteurs clés de l'économie camerounaise.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-transform transform hover:-translate-y-1 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            Explorer la Carte Interactive
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 z-30 bg-white/10">
        <div style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} className={`h-full transition-all duration-500 ease-linear ${activeColorClass.replace('text-', 'bg-')}`} />
      </div>
    </header>
  );
}