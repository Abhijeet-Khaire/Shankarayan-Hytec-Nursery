import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaSeedling } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { translations } from '../utils/translations';

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t['nav-home'] },
    { href: '#about', label: t['nav-about'] },
    { href: '#seedlings', label: t['nav-seedlings'] },
    { href: '#why', label: t['nav-why'] },
    { href: '#gallery', label: t['nav-gallery'] },
    { href: '#contact', label: t['nav-contact'] },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 font-bold text-xl text-[#2E7D32] hover:opacity-90 transition-opacity">
          <FaSeedling className="w-8 h-8 text-[#2E7D32]" />
          <span className="font-poppins tracking-tight">Shankarayan Hytec</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-[#2E7D32] font-medium text-sm transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2E7D32] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions (Language Switcher + Call CTA) */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="inline-flex bg-emerald-50 p-1 rounded-full border border-emerald-200">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === 'en' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-[#2E7D32] hover:bg-emerald-100'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === 'mr' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-[#2E7D32] hover:bg-emerald-100'
              }`}
            >
              मराठी
            </button>
          </div>

          <a
            href="tel:+919657523258"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#2E7D32] text-[#2E7D32] font-semibold text-xs hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm"
          >
            <FaPhoneAlt className="w-3 h-3" />
            <span>{t['nav-cta-call']}</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="inline-flex bg-emerald-50 p-1 rounded-full border border-emerald-200">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                lang === 'en' ? 'bg-[#2E7D32] text-white' : 'text-[#2E7D32]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                lang === 'mr' ? 'bg-[#2E7D32] text-white' : 'text-[#2E7D32]'
              }`}
            >
              मराठी
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 hover:text-[#2E7D32] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-emerald-100 shadow-xl overflow-hidden"
          >
            <div className="px-6 pt-4 pb-6 space-y-4 flex flex-col items-center text-center">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-800 font-medium text-base hover:text-[#2E7D32] transition-colors py-1 w-full"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="tel:+919657523258"
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] text-white font-semibold text-sm shadow-md"
              >
                <FaPhoneAlt />
                <span>{t['nav-cta-call']}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
