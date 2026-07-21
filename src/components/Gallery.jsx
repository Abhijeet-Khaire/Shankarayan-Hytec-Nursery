import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearchPlus, FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { translations } from '../utils/translations';

// Import Gallery Images
import heroImg from '../assets/images/hero/hero_nursery.png';
import seedlingsImg from '../assets/images/seedlings/seedlings_detail.png';
import plantationImg from '../assets/images/plantation/papaya_plantation.png';
import harvestImg from '../assets/images/harvest/papaya_harvest.png';
import farmerImg from '../assets/images/nursery/farmer_visit.png';
import seedlingRootsImg from '../assets/images/seedlings/seedling_roots.png';
import seedlingTraysImg from '../assets/images/seedlings/seedling_trays.png';
import seedlingBatchImg from '../assets/images/seedlings/seedling_batch.png';
import harvestCutFruitImg from '../assets/images/harvest/harvest_cut_fruit.png';
import nurseryLoadingImg from '../assets/images/nursery/nursery_loading.png';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Gallery({ lang }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const t = translations[lang];

  const galleryItems = [
    {
      id: 0,
      category: 'nursery',
      image: heroImg,
      titleEn: 'Modern High-Tech Greenhouse',
      titleMr: 'आधुनिक हायटेक ग्रीनहाऊस',
      captionEn: 'Nursery shade net infrastructure for seedling development.',
      captionMr: 'पपईच्या रोपांसाठी आधुनिक हायटेक ग्रीनहाऊस सुविधा.'
    },
    {
      id: 1,
      category: 'seedlings',
      image: seedlingsImg,
      titleEn: 'Original 15 No. Seedlings',
      titleMr: 'ओरिजिनल १५ नंबर पपई रोपे',
      captionEn: 'Healthy, disease-resistant seedlings in grow bags.',
      captionMr: 'पिशव्यांमध्ये वाढवलेली निरोगी आणि रोगप्रतिकारक ओरिजिनल १५ नंबर पपईची रोपे.'
    },
    {
      id: 2,
      category: 'plantation',
      image: plantationImg,
      titleEn: 'Drip Irrigated Farm Field',
      titleMr: 'ठिबक सिंचन पपई लागवड',
      captionEn: 'Thriving papaya plantation in Maharashtra.',
      captionMr: 'महाराष्ट्रातील ठिबक सिंचन आधारित पपईची यशस्वी लागवड.'
    },
    {
      id: 3,
      category: 'harvest',
      image: harvestImg,
      titleEn: 'High Yield Harvest',
      titleMr: 'भरपूर पपई उत्पादन',
      captionEn: 'Abundant papaya fruit harvest ready for market.',
      captionMr: 'झाडावर लगडलेली आणि काढणीसाठी तयार झालेली भरपूर फळे.'
    },
    {
      id: 4,
      category: 'farmers',
      image: farmerImg,
      titleEn: 'Satisfied Farmer Visit',
      titleMr: 'समाधानी शेतकरी भेट',
      captionEn: 'Local farmer inspecting papaya seedlings at nursery.',
      captionMr: 'नर्सरीला भेट देऊन पपईच्या रोपांची पाहणी करताना समाधानी स्थानिक शेतकरी.'
    },
    {
      id: 5,
      category: 'seedlings',
      image: seedlingRootsImg,
      titleEn: 'Strong Fibrous Root System',
      titleMr: 'मजबूत मुळांची रचना',
      captionEn: 'Well-developed roots ensuring high transplanting survival rate.',
      captionMr: 'पुनर्लागवड झाल्यानंतर उच्च जिवंत दराची हमी देणारी मजबूत मुळे.'
    },
    {
      id: 6,
      category: 'nursery',
      image: seedlingTraysImg,
      titleEn: 'Automated Misting & Germination',
      titleMr: 'ऑटोमेटेड मिस्टिंग आणि उगवण',
      captionEn: 'Sprouts receiving fine mist spray in controlled atmosphere.',
      captionMr: 'नियंत्रित वातावरणात सूक्ष्म पाण्याचे फवारे मिळणारी लहान रोपे.'
    },
    {
      id: 7,
      category: 'seedlings',
      image: seedlingBatchImg,
      titleEn: 'Batch Ready For Dispatch',
      titleMr: 'लागवडीसाठी तयार रोपांची बॅच',
      captionEn: 'Endless rows of uniform Original 15 No. seedlings.',
      captionMr: 'लागवडीसाठी तयार असलेल्या एकसमान ओरिजिनल १५ नंबर रोपांची मोठी बॅच.'
    },
    {
      id: 8,
      category: 'harvest',
      image: harvestCutFruitImg,
      titleEn: 'Sweet & Firm Papaya Pulp',
      titleMr: 'गोड आणि लालसर पपई गर',
      captionEn: 'Thick pulp and sweet taste of Original 15 No. papaya.',
      captionMr: 'ओरिजिनल १५ नंबर पपईचा गोड, दाट आणि उत्कृष्ट दर्जाचा गर.'
    },
    {
      id: 9,
      category: 'farmers',
      image: nurseryLoadingImg,
      titleEn: 'Seedling Dispatch To Farmers',
      titleMr: 'शेतकऱ्यांसाठी रोपांची वाहतूक',
      captionEn: 'Carefully packing and loading grow bags for delivery.',
      captionMr: 'शेतकऱ्यांच्या शेतावर वितरणासाठी रोपांची काळजीपूर्वक लोड-अप प्रक्रिया.'
    }
  ];

  const filterTabs = [
    { key: 'all', label: t['filter-all'] },
    { key: 'nursery', label: t['filter-nursery'] },
    { key: 'seedlings', label: t['filter-seedlings'] },
    { key: 'plantation', label: t['filter-plantation'] },
    { key: 'harvest', label: t['filter-harvest'] },
    { key: 'farmers', label: t['filter-farmers'] }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 bg-[#F7F8F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] font-poppins relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[#2E7D32] after:rounded-full">
            {t['gallery-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['gallery-subtitle']}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeFilter === tab.key
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-[#2E7D32] hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer bg-white aspect-[4/3]"
              >
                <img
                  src={item.image}
                  alt={lang === 'mr' ? item.titleMr : item.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#2E7D32]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-12 h-12 rounded-full bg-white text-[#2E7D32] flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <FaSearchPlus className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg font-poppins transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {lang === 'mr' ? item.titleMr : item.titleEn}
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 opacity-90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {lang === 'mr' ? item.captionMr : item.captionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Swiper Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 text-white hover:text-emerald-400 p-2 text-3xl z-50 transition-colors"
                aria-label="Close Lightbox"
              >
                <FaTimes />
              </button>

              {/* Modal Container */}
              <div
                className="w-full max-w-4xl max-h-[85vh] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={true}
                  pagination={{ clickable: true }}
                  initialSlide={lightboxIndex}
                  className="w-full h-full text-white"
                >
                  {filteredItems.map((item) => (
                    <SwiperSlide key={item.id} className="flex flex-col items-center justify-center">
                      <img
                        src={item.image}
                        alt={lang === 'mr' ? item.titleMr : item.titleEn}
                        className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl mx-auto"
                      />
                      <div className="text-center mt-4 px-4">
                        <h3 className="text-xl font-bold font-poppins text-white">
                          {lang === 'mr' ? item.titleMr : item.titleEn}
                        </h3>
                        <p className="text-sm text-slate-300 mt-1">
                          {lang === 'mr' ? item.captionMr : item.captionEn}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
