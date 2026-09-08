import { FaSeedling, FaMapMarkerAlt, FaPhoneAlt, FaLock } from 'react-icons/fa';
import { translations } from '../utils/translations';

export default function Footer({ lang, setLang, onOpenAdmin }) {
  const t = translations[lang];

  return (
    <footer className="glass-dark text-slate-300 pt-20 pb-10 relative overflow-hidden">
      {/* Top Subtle Specular Emerald Edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-2.5 text-white font-bold text-2xl font-poppins group">
              <img 
                src="/logo.svg" 
                alt="Shankarayan Hytec Logo" 
                className="w-10 h-10 rounded-full object-contain shadow-md group-hover:scale-105 transition-transform" 
              />
              <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                Shankarayan Hytec
              </span>
            </a>
            <p className="text-sm leading-relaxed text-slate-400">
              {t['footer-desc']}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold font-poppins text-lg relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-emerald-400">
              {t['footer-quick-links']}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="hover:text-emerald-400 transition-colors">{t['nav-home']}</a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">{t['nav-about']}</a>
              </li>
              <li>
                <a href="#seedlings" className="hover:text-emerald-400 transition-colors">{t['nav-seedlings']}</a>
              </li>
              <li>
                <a href="#book" className="hover:text-emerald-400 transition-colors">{t['nav-book']}</a>
              </li>
              <li>
                <a href="#why" className="hover:text-emerald-400 transition-colors">{t['nav-why']}</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-emerald-400 transition-colors">{t['nav-gallery']}</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">{t['nav-contact']}</a>
              </li>
              <li>
                <a 
                  href="#admin" 
                  onClick={(e) => {
                    if (onOpenAdmin) {
                      e.preventDefault();
                      onOpenAdmin();
                    }
                  }}
                  className="hover:text-emerald-300 text-emerald-400/90 font-bold transition-colors flex items-center gap-1.5"
                >
                  <FaLock className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'mr' ? 'प्रशासक पोर्टल (ऑर्डर्स व्यवस्थापन)' : 'Admin Portal (Orders Management)'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold font-poppins text-lg relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-emerald-400">
              {t['footer-contact-info']}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t['footer-address']}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919657523258" className="hover:text-emerald-400 font-medium transition-colors">
                  +91 9657523258
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <p>
              {t['footer-copyright']}{' '}
              <span className="text-emerald-400 font-medium">{t['footer-designed']}</span>
            </p>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
            >
              <FaLock className="w-2.5 h-2.5" />
              <span>Admin</span>
            </button>
          </div>

          <div className="inline-flex bg-white/10 backdrop-blur-xl p-1 rounded-full border border-white/15">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                lang === 'en' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                lang === 'mr' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
