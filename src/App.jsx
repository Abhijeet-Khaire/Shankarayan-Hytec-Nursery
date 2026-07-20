import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Seedlings from './components/Seedlings';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FloatingCall from './components/FloatingCall';

export default function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nursery_selected_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('nursery_selected_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#F7F8F2] text-slate-800 antialiased selection:bg-[#2E7D32] selection:text-white font-inter">
      {/* Sticky Navigation */}
      <Navbar lang={lang} setLang={setLang} />

      {/* Main Sections */}
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Seedlings lang={lang} />
        <WhyChooseUs lang={lang} />
        <Gallery lang={lang} />
        <Contact lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} setLang={setLang} />

      {/* Floating Action Buttons */}
      <FloatingWhatsApp />
      <FloatingCall />
    </div>
  );
}
