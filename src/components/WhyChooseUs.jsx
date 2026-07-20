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
    <section id="why" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] font-poppins relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[#2E7D32] after:rounded-full">
            {t['why-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['why-subtitle']}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
              className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100/80 hover:bg-white hover:border-[#2E7D32] hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <FaCheck />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-poppins leading-tight">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-11">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
