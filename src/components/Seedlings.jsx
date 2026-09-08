import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaRocket, FaAward, FaSeedling } from 'react-icons/fa';
import { translations } from '../utils/translations';
import seedlingImg from '../assets/images/seedlings/seedlings_detail.jpg';

export default function Seedlings({ lang }) {
  const t = translations[lang];

  const cards = [
    {
      icon: FaChartLine,
      title: t['seedlings-card1-title'],
      desc: t['seedlings-card1-desc'],
    },
    {
      icon: FaShieldAlt,
      title: t['seedlings-card2-title'],
      desc: t['seedlings-card2-desc'],
    },
    {
      icon: FaRocket,
      title: t['seedlings-card3-title'],
      desc: t['seedlings-card3-desc'],
    },
    {
      icon: FaAward,
      title: t['seedlings-card4-title'],
      desc: t['seedlings-card4-desc'],
    },
  ];

  const whatsappMessage = encodeURIComponent("Hello, I want to book Original 15 No. Papaya seedlings.");
  const whatsappUrl = `https://wa.me/919657523258?text=${whatsappMessage}`;

  return (
    <section id="seedlings" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#2E7D32] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>{lang === 'mr' ? 'तांत्रिक वैशिष्ट्ये' : 'Scientific Highlights'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-poppins">
            {t['seedlings-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['seedlings-subtitle']}
          </p>
        </div>

        {/* 4 Feature Cards (iOS 26 Squircles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card-interactive p-7 rounded-[30px] border border-white/80 text-center relative overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2E7D32] transition-all duration-300 shadow-inner group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(46,125,50,0.35)]">
                    <IconComponent className="w-8 h-8 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-poppins mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>

              {/* Bottom Subtle iOS Indicator Bar */}
              <div className="mt-5 w-8 h-1 rounded-full bg-emerald-500/20 mx-auto group-hover:w-16 group-hover:bg-emerald-500 transition-all duration-300" />
            </motion.div>
          );
        })}
        </div>

        {/* Action Banner - iOS 26 Liquid Emerald Glass Cockpit */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 rounded-[36px] bg-gradient-to-br from-[#2E7D32]/92 via-emerald-800/90 to-[#1B5E20]/95 backdrop-blur-3xl border border-white/35 text-white p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(46,125,50,0.35)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden relative"
        >
          {/* Top Specular Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
              <FaSeedling className="text-emerald-300" />
              <span>{lang === 'mr' ? '१००% खात्रीशीर उगवण व निरोगी रोपे' : '100% Guaranteed Healthy Seedlings'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-poppins text-white leading-tight">
              {t['seedlings-banner-title']}
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed opacity-95">
              {t['seedlings-banner-desc']}
            </p>
            <div className="pt-3">
              <a
                href="#book"
                className="glass-btn-secondary inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#1B5E20] hover:bg-emerald-50 font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xl hover:-translate-y-0.5"
              >
                <FaSeedling className="w-5 h-5 text-emerald-700" />
                <span>{t['seedlings-banner-btn']}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel p-2 rounded-[28px] overflow-hidden shadow-2xl border border-white/30">
            <img
              src={seedlingImg}
              alt="Papaya Seedling Quality"
              className="w-full h-64 sm:h-72 object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
