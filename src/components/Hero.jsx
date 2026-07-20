import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { translations } from '../utils/translations';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Image imports
import heroBg from '../assets/images/hero/hero_nursery.png';
import seedlingsBg from '../assets/images/seedlings/seedlings_detail.png';
import plantationBg from '../assets/images/plantation/papaya_plantation.png';
import harvestBg from '../assets/images/harvest/papaya_harvest.png';

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
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero Text Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-poppins drop-shadow-md text-white">
            {t['hero-title']}
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-[#81C784] drop-shadow">
            {t['hero-subtitle']}
          </p>

          <div className="flex flex-wrap justify-center gap-3 py-2">
            <span className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-sm font-medium">
              {t['hero-tag-1']}
            </span>
            <span className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-sm font-medium">
              {t['hero-tag-2']}
            </span>
            <span className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-sm font-medium">
              {t['hero-tag-3']}
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#8D6E63] text-white font-semibold text-base transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              <FaWhatsapp className="w-5 h-5 text-emerald-300" />
              <span>{t['hero-btn-book']}</span>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white text-white font-semibold text-base backdrop-blur-sm transition-all duration-300 shadow-md hover:-translate-y-0.5"
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
