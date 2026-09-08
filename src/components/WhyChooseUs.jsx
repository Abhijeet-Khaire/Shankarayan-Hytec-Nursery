import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { translations } from '../utils/translations';

export default function WhyChooseUs({ lang }) {
  const t = translations[lang];

  const features = [
    { title: t['why-f1-title'], desc: t['why-f1-desc'] },
    { title: t['why-f2-title'], desc: t['why-f2-desc'] },
    { title: t['why-f3-title'], desc: t['why-f3-desc'] },
    { title: t['why-f4-title'], desc: t['why-f4-desc'] },
    { title: t['why-f5-title'], desc: t['why-f5-desc'] },
    { title: t['why-f6-title'], desc: t['why-f6-desc'] },
    { title: t['why-f7-title'], desc: t['why-f7-desc'] },
    { title: t['why-f8-title'], desc: t['why-f8-desc'] },
  ];

  return (
    <section id="why" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#2E7D32] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>{lang === 'mr' ? 'शेतकरी बांधवांची पहिली पसंती' : 'Farmers First Choice'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-poppins">
            {t['why-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['why-subtitle']}
          </p>
        </div>

        {/* Feature Cards Grid - iOS 26 Vision Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
              className="glass-card-interactive p-6 rounded-[28px] border border-white/80 hover:border-emerald-400/50 bg-white/65 hover:bg-white/90 shadow-sm relative overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[#2E7D32] flex items-center justify-center text-xs shrink-0 shadow-inner group-hover:bg-[#2E7D32] transition-all duration-300">
                    <FaCheck className="transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 font-poppins leading-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-12">
                  {feature.desc}
                </p>
              </div>

              {/* Bottom Subtle iOS Indicator */}
              <div className="mt-4 w-6 h-1 rounded-full bg-emerald-500/20 ml-12 group-hover:w-12 group-hover:bg-emerald-500 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
