import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { translations } from '../utils/translations';
import farmerImg from '../assets/images/nursery/farmers_inspecting_4k.jpg';
import loadingImg from '../assets/images/nursery/nursery_loading.jpg';

export default function About({ lang }) {
  const t = translations[lang];

  const highlights = [
    t['about-hl-1'],
    t['about-hl-2'],
    t['about-hl-3'],
    t['about-hl-4'],
  ];

  return (
    <section id="about" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#2E7D32] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>{lang === 'mr' ? 'विश्वासार्ह गुणवत्ता' : 'Trusted Excellence'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-poppins">
            {t['about-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['about-subtitle']}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Nursery Photos with Glass Badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative group"
          >
            <div className="glass-panel p-2.5 rounded-[36px] overflow-hidden shadow-2xl border border-white/90">
              <div className="relative rounded-[28px] overflow-hidden">
                <img
                  src={farmerImg}
                  alt="Shankarayan Hytec Nursery Visit"
                  className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Inset Secondary Dispatch Image in Glass Frame */}
            <div className="hidden sm:block absolute -top-6 -left-6 w-36 h-36 glass-panel p-1.5 rounded-2xl overflow-hidden shadow-2xl border border-white/90">
              <img
                src={loadingImg}
                alt="Nursery Seedling Loading"
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Floating VisionOS Glass Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 glass-panel bg-gradient-to-br from-[#2E7D32]/90 to-emerald-900/90 backdrop-blur-2xl text-white p-5 sm:p-6 rounded-3xl shadow-2xl text-center border border-white/40">
              <span className="block text-3xl font-black font-poppins">{t['about-exp-years']}</span>
              <span className="text-[11px] uppercase tracking-wider font-bold opacity-90">{t['about-exp-label']}</span>
            </div>
          </motion.div>

          {/* Right: Glass Card with Information */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass-panel rounded-[36px] p-8 sm:p-10 border border-white/85 shadow-xl space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-poppins leading-snug">
              {t['about-text-heading']}
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              {t['about-text-p1']}
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              {t['about-text-p2']}
            </p>

            {/* Highlights iOS Interactive Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {highlights.map((item, index) => (
                <div 
                  key={index} 
                  className="glass-card-interactive p-3.5 rounded-2xl border border-white/80 flex items-center gap-3 bg-white/60 hover:bg-white/90"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-[#2E7D32] flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <FaCheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
