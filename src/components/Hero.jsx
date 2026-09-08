import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FaWhatsapp, FaArrowRight, FaSeedling } from 'react-icons/fa';
import { translations } from '../utils/translations';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Image imports
import heroBg from '../assets/images/hero/hero_nursery.jpg';
import seedlingsBg from '../assets/images/nursery/seedlings_nursery_4k.jpg';
import plantationBg from '../assets/images/plantation/plantation_4k.jpg';
import harvestBg from '../assets/images/harvest/harvest_4k.jpg';

export default function Hero({ lang }) {
  const t = translations[lang];

  const slides = [
    { id: 1, image: heroBg },
    { id: 2, image: seedlingsBg },
    { id: 3, image: plantationBg },
    { id: 4, image: harvestBg },
  ];

  const whatsappMessage = encodeURIComponent("Hello, I want to book Original 15 No. Papaya seedlings.");
  const whatsappUrl = `https://wa.me/919657523258?text=${whatsappMessage}`;

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden pt-20">
      
      {/* Swiper Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={slide.image}
                  alt="Shankarayan Hytec Papaya Nursery"
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchpriority={idx === 0 ? "high" : "auto"}
                  decoding={idx === 0 ? "sync" : "async"}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero Text Content Container - iOS 26 Frosted Glass Pod */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 sm:p-12 rounded-[36px] bg-black/35 backdrop-blur-2xl border border-white/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] text-center space-y-6 relative overflow-hidden"
        >
          {/* Subtle iOS Top Edge Specular Reflection */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          {/* iOS 26 Live Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
            <span>{lang === 'mr' ? 'सीझन २०२६ अग्रिम नोंदणी सुरू' : 'Season 2026 Advance Bookings Open'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-poppins text-white leading-tight drop-shadow-md">
            {t['hero-title']}
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-emerald-300 drop-shadow">
            {t['hero-subtitle']}
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 py-1">
            <span className="bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white transition-all shadow-sm">
              {t['hero-tag-1']}
            </span>
            <span className="bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white transition-all shadow-sm">
              {t['hero-tag-2']}
            </span>
            <span className="bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white transition-all shadow-sm">
              {t['hero-tag-3']}
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <a
              href="#book"
              className="glass-btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl hover:-translate-y-0.5"
            >
              <FaSeedling className="w-5 h-5 text-emerald-200" />
              <span>{t['hero-btn-book']}</span>
            </a>

            <a
              href="#contact"
              className="glass-btn-secondary inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/20 hover:bg-white/30 border border-white/50 text-white font-bold text-sm sm:text-base backdrop-blur-xl shadow-lg hover:-translate-y-0.5"
            >
              <span>{t['hero-btn-contact']}</span>
              <FaArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
