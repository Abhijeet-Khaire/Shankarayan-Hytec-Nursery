import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Seedlings from './components/Seedlings';
import Booking from './components/Booking';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FloatingCall from './components/FloatingCall';
import AdminPanel from './components/AdminPanel';
import UserAuthModal from './components/UserAuthModal';

export default function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nursery_selected_lang') || 'mr';
  });

  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#admin';
  });

  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nursery_selected_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const checkHash = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const openAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminOpen(true);
  };

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminOpen(false);
  };

  const openUserAuth = () => {
    setIsUserAuthOpen(true);
  };

  const closeUserAuth = () => {
    setIsUserAuthOpen(false);
  };

  return (
    <div className="min-h-screen ios-bg-canvas text-slate-800 antialiased selection:bg-[#2E7D32] selection:text-white font-inter relative overflow-hidden">
      {/* Ambient iOS 26 Glass Light Orbs (Refracted through frosted panels) */}
      <div className="ios-orb w-[600px] h-[600px] bg-emerald-400/25 top-[-100px] left-[-150px]" />
      <div className="ios-orb w-[500px] h-[500px] bg-lime-300/20 top-[600px] right-[-120px]" />
      <div className="ios-orb w-[700px] h-[700px] bg-teal-400/20 top-[1600px] left-[-200px]" />
      <div className="ios-orb w-[550px] h-[550px] bg-amber-300/20 top-[2600px] right-[-100px]" />
      <div className="ios-orb w-[650px] h-[650px] bg-emerald-500/20 top-[3800px] left-1/3" />

      {/* Floating Glass Dock / Navbar */}
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        onOpenUserAuth={openUserAuth} 
      />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero lang={lang} />
        <About lang={lang} />
        <Seedlings lang={lang} />
        <Booking lang={lang} />
        <WhyChooseUs lang={lang} />
        <Gallery lang={lang} />
        <Contact lang={lang} />
      </main>

      {/* Footer */}
      <Footer 
        lang={lang} 
        setLang={setLang} 
        onOpenAdmin={openAdmin} 
        onOpenUserAuth={openUserAuth} 
      />

      {/* Floating Action Buttons */}
      <FloatingWhatsApp />
      <FloatingCall />

      {/* Admin Panel Overlay */}
      {isAdminOpen && (
        <AdminPanel lang={lang} onClose={closeAdmin} />
      )}

      {/* Customer / Farmer User Auth & Account Modal */}
      <UserAuthModal
        isOpen={isUserAuthOpen}
        onClose={closeUserAuth}
        lang={lang}
      />
    </div>
  );
}

