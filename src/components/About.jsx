import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { translations } from '../utils/translations';
import farmerImg from '../assets/images/nursery/farmer_visit.png';

export default function About({ lang }) {
  const t = translations[lang];

  const highlights = [
    t['about-hl-1'],
    t['about-hl-2'],
    t['about-hl-3'],
    t['about-hl-4'],
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] font-poppins relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[#2E7D32] after:rounded-full">
            {t['about-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['about-subtitle']}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Nursery Photo with Badge */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-50">
              <img
                src={farmerImg}
                alt="Shankarayan Hytec Nursery Visit"
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent" />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-[#2E7D32] text-white p-5 rounded-2xl shadow-xl text-center border-2 border-white">
              <span className="block text-3xl font-black font-poppins">{t['about-exp-years']}</span>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">{t['about-exp-label']}</span>
            </div>
          </motion.div>

          {/* Right: Text Information */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
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

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <FaCheckCircle className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  <span className="font-semibold text-slate-800 text-sm">{item}</span>
                </div>
              ))}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
