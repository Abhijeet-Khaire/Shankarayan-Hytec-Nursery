import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaSeedling, FaUser } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { translations } from '../utils/translations';
import { getCurrentUser } from '../utils/userAuth';

export default function Navbar({ lang, setLang, onOpenUserAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [hoveredNav, setHoveredNav] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const t = translations[lang];

  useEffect(() => {
    const handleAuthChange = (e) => {
      setCurrentUser(e.detail);
    };
    window.addEventListener('shn_user_auth_changed', handleAuthChange);
    return () => window.removeEventListener('shn_user_auth_changed', handleAuthChange);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hardware-accelerated IntersectionObserver for smooth scroll spy
    const sections = ['home', 'about', 'seedlings', 'book', 'why', 'gallery', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { href: '#home', label: t['nav-home'] },
    { href: '#about', label: t['nav-about'] },
    { href: '#seedlings', label: t['nav-seedlings'] },
    { href: '#book', label: t['nav-book'] },
    { href: '#why', label: t['nav-why'] },
    { href: '#gallery', label: t['nav-gallery'] },
    { href: '#contact', label: t['nav-contact'] },
  ];

  return (
    <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <motion.div 
        layout
        className={`max-w-7xl mx-auto glass-dock rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
          scrolled ? 'shadow-[0_20px_45px_-10px_rgba(0,0,0,0.12)] bg-white/80' : 'bg-white/70'
        }`}
      >
        
        {/* Brand Logo with iOS Frosted Glass Badge */}
        <a 
          href="#home" 
          onClick={() => setActiveSection('#home')}
          className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-[#2E7D32] hover:opacity-90 transition-opacity group"
        >
          <img 
            src="/logo.svg" 
            alt="Shankarayan Hytec Logo" 
            className="w-9 h-9 rounded-full object-contain shadow-xs group-hover:scale-105 transition-transform" 
          />
          <span className="font-poppins font-extrabold tracking-tight bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] bg-clip-text text-transparent">
            Shankarayan Hytec
          </span>
        </a>

        {/* Desktop Navigation with iOS 27 Fluid Sliding Glass Pill Indicator */}
        <nav 
          onMouseLeave={() => setHoveredNav(null)}
          className="hidden lg:flex items-center gap-1 relative"
        >
          {navLinks.map((link) => {
            const isCurrent = (hoveredNav === link.href) || (!hoveredNav && activeSection === link.href);
            const isBook = link.href === '#book';

            return (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredNav(link.href)}
                onClick={() => setActiveSection(link.href)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors duration-200 z-10 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'text-[#1B5E20]'
                    : 'text-slate-700 hover:text-[#1B5E20]'
                }`}
              >
                {/* iOS 27 Fluid Sliding Green Frosted Indicator Pill */}
                {isCurrent && (
                  <motion.span
                    layoutId="navbar-sliding-indicator"
                    className="absolute inset-0 rounded-full -z-10 bg-[#D1FAE5]/85 border border-[#10B981]/50 shadow-[0_2px_12px_rgba(16,185,129,0.22)] backdrop-blur-md"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                      mass: 0.8
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  {isBook && <FaSeedling className="w-3.5 h-3.5 text-[#2E7D32]" />}
                  {link.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Right Actions (Liquid CTA + Glass Call Button + Man Symbol User Profile) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Book Now Liquid Glass Button */}
          <a
            href="#book"
            onClick={() => setActiveSection('#book')}
            className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-bold text-xs tracking-wide shadow-md"
          >
            <FaSeedling className="w-3.5 h-3.5 text-emerald-200" />
            <span>{t['nav-cta-book']}</span>
          </a>

          {/* Call Us Glass Capsule */}
          <a
            href="tel:+919657523258"
            className="glass-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-emerald-900 font-semibold text-xs border border-white/80"
          >
            <FaPhoneAlt className="w-3 h-3 text-[#2E7D32]" />
            <span>{t['nav-cta-call']}</span>
          </a>

          {/* Man Symbol User Profile / Login (Right side of Call) */}
          <button
            onClick={onOpenUserAuth}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
              currentUser
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-400/40 shadow-emerald-700/20'
                : 'glass-btn-secondary text-slate-700 hover:text-emerald-800 border border-white/80 hover:bg-emerald-50/70'
            }`}
            title={currentUser ? (lang === 'mr' ? `माझे खाते: ${currentUser.name}` : `My Account: ${currentUser.name}`) : (lang === 'mr' ? 'शेतकरी लॉगिन (OTP)' : 'Farmer Login')}
            aria-label="User Account"
          >
            <FaUser className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile User Auth Button */}
          <button
            onClick={onOpenUserAuth}
            className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-center text-emerald-700 text-xs shadow-sm"
            title={currentUser ? currentUser.name : "Login"}
            aria-label="User Account"
          >
            <FaUser className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-800 hover:text-[#2E7D32] shadow-sm transition-all focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Glass Sheet / Dynamic Island Slider */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="lg:hidden glass-panel max-w-md mx-auto mt-2 rounded-[28px] p-5 shadow-2xl border border-white/90 backdrop-blur-3xl overflow-hidden pointer-events-auto"
          >
            <div className="space-y-1.5 flex flex-col items-center text-center">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.025 }}
                  onClick={() => {
                    setActiveSection(link.href);
                    setIsOpen(false);
                  }}
                  className={`font-semibold text-sm transition-all py-2.5 px-4 rounded-2xl w-full ${
                    activeSection === link.href
                      ? 'bg-[#D1FAE5]/85 text-[#1B5E20] shadow-sm font-bold border border-[#10B981]/50'
                      : 'text-slate-800 hover:text-[#1B5E20] hover:bg-emerald-50/60'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="w-full flex flex-col gap-2 pt-2 border-t border-slate-200/50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenUserAuth) onOpenUserAuth();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-emerald-900 font-bold text-xs border border-emerald-500/30 bg-emerald-500/10"
                >
                  <FaUser className="text-emerald-700 w-3.5 h-3.5" />
                  <span>
                    {currentUser
                      ? (lang === 'mr' ? `माझे खाते (${currentUser.name})` : `My Account (${currentUser.name})`)
                      : (lang === 'mr' ? 'शेतकरी लॉगिन (OTP)' : 'Farmer Login (OTP)')}
                  </span>
                </button>

                <a
                  href="#book"
                  onClick={() => {
                    setActiveSection('#book');
                    setIsOpen(false);
                  }}
                  className="w-full glass-btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm shadow-md"
                >
                  <FaSeedling className="w-4 h-4 text-emerald-200" />
                  <span>{t['nav-cta-book']}</span>
                </a>

                <a
                  href="tel:+919657523258"
                  onClick={() => setIsOpen(false)}
                  className="w-full glass-btn-secondary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-emerald-900 font-semibold text-sm border border-white/80"
                >
                  <FaPhoneAlt className="text-[#2E7D32]" />
                  <span>{t['nav-cta-call']}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

