import HeroSection from './components/landing/HeroSection';
import FeaturesSection from './components/landing/FeaturesSection';
import Footer from './components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}