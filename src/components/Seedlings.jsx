import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaRocket, FaAward, FaWhatsapp } from 'react-icons/fa';
import { translations } from '../utils/translations';
import seedlingImg from '../assets/images/seedlings/seedlings_detail.png';

export default function Seedlings({ lang }) {
  const t = translations[lang];

  const cards = [
    {
      icon: <FaChartLine className="w-8 h-8 text-[#2E7D32]" />,
      title: t['seedlings-card1-title'],
      desc: t['seedlings-card1-desc'],
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-[#2E7D32]" />,
      title: t['seedlings-card2-title'],
      desc: t['seedlings-card2-desc'],
    },
    {
      icon: <FaRocket className="w-8 h-8 text-[#2E7D32]" />,
      title: t['seedlings-card3-title'],
      desc: t['seedlings-card3-desc'],
    },
    {
      icon: <FaAward className="w-8 h-8 text-[#2E7D32]" />,
      title: t['seedlings-card4-title'],
      desc: t['seedlings-card4-desc'],
    },
  ];

  const whatsappMessage = encodeURIComponent("Hello, I want to book Original 15 No. Papaya seedlings.");
  const whatsappUrl = `https://wa.me/919657523258?text=${whatsappMessage}`;

  return (
    <section id="seedlings" className="py-24 bg-[#F7F8F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] font-poppins relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[#2E7D32] after:rounded-full">
            {t['seedlings-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['seedlings-subtitle']}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2E7D32] group-hover:text-white transition-colors duration-300">
                <div className="group-hover:text-white transition-colors">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-poppins mb-3">
                {card.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 rounded-3xl bg-gradient-to-br from-[#2E7D32] to-emerald-900 text-white p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden relative"
        >
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white leading-tight">
              {t['seedlings-banner-title']}
            </h3>
            <p className="text-emerald-100 text-base leading-relaxed opacity-95">
              {t['seedlings-banner-desc']}
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#2E7D32] hover:bg-emerald-50 font-bold text-sm transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                <FaWhatsapp className="w-5 h-5 text-emerald-600" />
                <span>{t['seedlings-banner-btn']}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
            <img
              src={seedlingImg}
              alt="Papaya Seedling Quality"
              className="w-full h-64 object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
