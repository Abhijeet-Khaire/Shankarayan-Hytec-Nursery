import { FaSeedling, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { translations } from '../utils/translations';

export default function Footer({ lang, setLang }) {
  const t = translations[lang];

  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-8 border-t-4 border-[#2E7D32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-2.5 text-white font-bold text-2xl font-poppins">
              <FaSeedling className="w-8 h-8 text-[#81C784]" />
              <span>Shankarayan Hytec</span>
            </a>
            <p className="text-sm leading-relaxed text-slate-400">
              {t['footer-desc']}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold font-poppins text-lg relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#81C784]">
              {t['footer-quick-links']}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="hover:text-[#81C784] transition-colors">{t['nav-home']}</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#81C784] transition-colors">{t['nav-about']}</a>
              </li>
              <li>
                <a href="#seedlings" className="hover:text-[#81C784] transition-colors">{t['nav-seedlings']}</a>
              </li>
              <li>
                <a href="#why" className="hover:text-[#81C784] transition-colors">{t['nav-why']}</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#81C784] transition-colors">{t['nav-gallery']}</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#81C784] transition-colors">{t['nav-contact']}</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-bold font-poppins text-lg relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#81C784]">
              {t['footer-contact-info']}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-5 h-5 text-[#81C784] shrink-0 mt-0.5" />
                <span>{t['footer-address']}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="w-4 h-4 text-[#81C784] shrink-0" />
                <a href="tel:+919657523258" className="hover:text-[#81C784] transition-colors">
                  +91 9657523258
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            {t['footer-copyright']}{' '}
            <span className="text-[#81C784] font-medium">{t['footer-designed']}</span>
          </p>

          <div className="inline-flex bg-slate-800 p-1 rounded-full border border-slate-700">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === 'en' ? 'bg-[#2E7D32] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === 'mr' ? 'bg-[#2E7D32] text-white' : 'text-slate-400 hover:text-white'
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
