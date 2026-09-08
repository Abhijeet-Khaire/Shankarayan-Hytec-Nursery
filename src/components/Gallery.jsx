import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearchPlus, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { translations } from '../utils/translations';

// Import Gallery Images
import heroImg from '../assets/images/hero/hero_nursery.jpg';
import seedlingsImg from '../assets/images/seedlings/seedlings_detail.jpg';
import plantationImg from '../assets/images/plantation/papaya_plantation.jpg';
import harvestImg from '../assets/images/harvest/papaya_harvest.jpg';
import farmerImg from '../assets/images/nursery/farmer_visit.jpg';
import seedlingRootsImg from '../assets/images/seedlings/seedling_roots.jpg';
import seedlingTraysImg from '../assets/images/seedlings/seedling_trays.jpg';
import seedlingBatchImg from '../assets/images/seedlings/seedling_batch.jpg';
import harvestCutFruitImg from '../assets/images/harvest/harvest_cut_fruit.jpg';
import nurseryLoadingImg from '../assets/images/nursery/nursery_loading.jpg';

// Import new 4K generated images
import plantation4kImg from '../assets/images/plantation/plantation_4k.jpg';
import papayaBunch4kImg from '../assets/images/plantation/papaya_bunch_4k.jpg';
import papayaClose4kImg from '../assets/images/plantation/papaya_close_4k.jpg';
import farmers4kImg from '../assets/images/nursery/farmers_inspecting_4k.jpg';
import nursery4kImg from '../assets/images/nursery/seedlings_nursery_4k.jpg';
import harvest4kImg from '../assets/images/harvest/harvest_4k.jpg';

// Import exact user enhanced images
import userEnhanced1 from '../assets/images/plantation/user_enhanced_1.jpg';
import userEnhanced2 from '../assets/images/plantation/user_enhanced_2.jpg';
import userEnhanced3 from '../assets/images/nursery/user_enhanced_3.jpg';
import userEnhanced4 from '../assets/images/nursery/user_enhanced_4.jpg';
import userEnhanced5 from '../assets/images/plantation/user_enhanced_5.jpg';

export default function Gallery({ lang }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredFilter, setHoveredFilter] = useState(null);
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
    },
    {
      id: 10,
      category: 'plantation',
      image: plantation4kImg,
      titleEn: 'Lush 4K Plantation',
      titleMr: 'उत्कृष्ट पपई बाग',
      captionEn: 'High-resolution view of our thriving papaya plantation.',
      captionMr: 'आमच्या यशस्वी पपई बागेचे उच्च-गुणवत्तेचे दृश्य.'
    },
    {
      id: 11,
      category: 'plantation',
      image: papayaBunch4kImg,
      titleEn: 'Heavy Papaya Yield',
      titleMr: 'भरघोस पपई उत्पादन',
      captionEn: 'Close-up of Original 15 No. Papaya tree heavily laden with green papayas.',
      captionMr: 'ओरिजिनल १५ नंबर पपईच्या झाडावरील भरघोस फळांचे जवळून घेतलेले छायाचित्र.'
    },
    {
      id: 12,
      category: 'plantation',
      image: papayaClose4kImg,
      titleEn: 'Premium Quality Fruit',
      titleMr: 'उत्कृष्ट दर्जाची फळे',
      captionEn: 'Detailed look at the smooth skin and size of our papayas.',
      captionMr: 'आमच्या पपईची गुळगुळीत त्वचा आणि आकाराचे तपशीलवार दृश्य.'
    },
    {
      id: 13,
      category: 'farmers',
      image: farmers4kImg,
      titleEn: 'Agronomist Field Visit',
      titleMr: 'कृषी तज्ञांची शेत भेट',
      captionEn: 'Farmers inspecting the high yield of our papaya orchard.',
      captionMr: 'शेतकरी पपई बागेच्या उच्च उत्पादनाची पाहणी करत आहेत.'
    },
    {
      id: 14,
      category: 'nursery',
      image: nursery4kImg,
      titleEn: 'Organized Seedling Rows',
      titleMr: 'रोपांच्या पद्धतशीर रांगा',
      captionEn: 'Endless rows of healthy seedlings in our modern greenhouse.',
      captionMr: 'आमच्या आधुनिक ग्रीनहाऊसमध्ये निरोगी रोपांच्या अनंत रांगा.'
    },
    {
      id: 15,
      category: 'harvest',
      image: harvest4kImg,
      titleEn: 'Bountiful Harvest Pile',
      titleMr: 'काढणीनंतरची भरपूर फळे',
      captionEn: 'Freshly harvested large, perfect papayas ready for market.',
      captionMr: 'बाजारात पाठवण्यासाठी तयार असलेली ताजी, मोठी आणि उत्कृष्ट पपई.'
    },
    {
      id: 16,
      category: 'plantation',
      image: userEnhanced1,
      titleEn: 'Expansive Papaya Field',
      titleMr: 'विस्तीर्ण पपईचे शेत',
      captionEn: 'Lush green Taiwan 786 papaya plantation under open sky.',
      captionMr: 'खुल्या आकाशाखालील तैवान ७८६ पपईची हिरवीगार बाग.'
    },
    {
      id: 17,
      category: 'plantation',
      image: userEnhanced2,
      titleEn: 'Dense Fruit Cluster',
      titleMr: 'फळांचा दाट घड',
      captionEn: 'Close-up of our high-yielding papaya tree variety.',
      captionMr: 'आमच्या उच्च उत्पन्न देणाऱ्या पपईच्या झाडाचा जवळून फोटो.'
    },
    {
      id: 18,
      category: 'farmers',
      image: userEnhanced3,
      titleEn: 'Happy Agronomists',
      titleMr: 'आनंदी कृषी तज्ञ',
      captionEn: 'Farmers proudly inspecting the healthy papaya crop.',
      captionMr: 'शेतकरी अभिमानाने निरोगी पपई पिकाची पाहणी करताना.'
    },
    {
      id: 19,
      category: 'farmers',
      image: userEnhanced4,
      titleEn: 'Farm Field Visit',
      titleMr: 'शेत शिवार भेट',
      captionEn: 'Checking the growth and fruit size in the orchard.',
      captionMr: 'बागेतील फळांच्या वाढीची आणि आकाराची तपासणी करताना.'
    },
    {
      id: 20,
      category: 'plantation',
      image: userEnhanced5,
      titleEn: 'Healthy Green Papayas',
      titleMr: 'निरोगी हिरवी पपई',
      captionEn: 'Thick, healthy green fruits hanging in heavy clusters.',
      captionMr: 'मोठ्या घडांमध्ये लटकणारी जाड आणि निरोगी हिरवी फळे.'
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

  const currentItem = (lightboxIndex !== null && filteredItems[lightboxIndex])
    ? filteredItems[lightboxIndex]
    : null;

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  }, [filteredItems.length]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  }, [filteredItems.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation & scroll locking
  useEffect(() => {
    if (lightboxIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleClose();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, handleClose, handlePrev, handleNext]);

  return (
    <section id="gallery" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#2E7D32] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>{lang === 'mr' ? 'फोटो व व्हिडिओ दर्शन' : 'Visual Showcase'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-poppins">
            {t['gallery-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['gallery-subtitle']}
          </p>
        </div>

        {/* Filter Buttons - iOS 26 Floating Segmented Dock with Sliding Indicator */}
        <div className="flex justify-center mb-12">
          <div 
            onMouseLeave={() => setHoveredFilter(null)}
            className="glass-dock p-1.5 rounded-full inline-flex flex-wrap justify-center gap-1.5 border border-white/85 shadow-md relative"
          >
            {filterTabs.map((tab) => {
              const isCurrent = (hoveredFilter === tab.key) || (!hoveredFilter && activeFilter === tab.key);

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveFilter(tab.key);
                    setLightboxIndex(null);
                  }}
                  onMouseEnter={() => setHoveredFilter(tab.key)}
                  className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 z-10 flex items-center justify-center ${
                    isCurrent
                      ? 'text-white'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {/* Fluid Sliding Dark Green Indicator Pill */}
                  {isCurrent && (
                    <motion.span
                      layoutId="gallery-sliding-indicator"
                      className="absolute inset-0 rounded-full -z-10 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] border border-white/20 shadow-[0_3px_14px_rgba(46,125,50,0.4)]"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                        mass: 0.8
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
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
                className="glass-panel p-2 rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl cursor-pointer border border-white/80 transition-all duration-500 hover:-translate-y-1.5 aspect-[4/3] group relative"
              >
                <div className="w-full h-full rounded-[20px] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={lang === 'mr' ? item.titleMr : item.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* iOS 26 Liquid Frosted Overlay */}
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center text-white border border-white/20 rounded-[20px]">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                      <FaSearchPlus className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg font-poppins transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {lang === 'mr' ? item.titleMr : item.titleEn}
                    </h3>
                    <p className="text-xs text-emerald-200 mt-1 opacity-90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 line-clamp-2">
                      {lang === 'mr' ? item.captionMr : item.captionEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal rendered cleanly via React Portal into document.body */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {currentItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[99999] bg-slate-950/92 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-6 select-none"
                onClick={handleClose}
              >
                {/* Header / Top Bar */}
                <div 
                  className="w-full max-w-6xl flex items-center justify-between z-10 pt-1 pb-3 px-2 sm:px-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white font-medium text-xs sm:text-sm shadow-md">
                      {lang === 'mr' 
                        ? `फोटो ${lightboxIndex + 1} / ${filteredItems.length}` 
                        : `Photo ${lightboxIndex + 1} of ${filteredItems.length}`}
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                      {filterTabs.find(tab => tab.key === currentItem.category)?.label || ''}
                    </span>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-lg border border-white/25 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Close Lightbox"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Center Image Container with Prev/Next buttons */}
                <div 
                  className="relative w-full max-w-6xl flex-1 flex items-center justify-center min-h-0 my-auto px-1 sm:px-16"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Previous Button */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/15 hover:bg-white/35 backdrop-blur-xl border border-white/25 text-white flex items-center justify-center text-lg sm:text-xl z-20 transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Previous Photo"
                  >
                    <FaChevronLeft className="mr-0.5" />
                  </button>

                  {/* Main Displayed Image with smooth transition & touch drag support */}
                  <div className="w-full h-full flex flex-col items-center justify-center max-h-[62vh] sm:max-h-[68vh]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentItem.id}
                        src={currentItem.image}
                        alt={lang === 'mr' ? currentItem.titleMr : currentItem.titleEn}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 60) handlePrev();
                          else if (info.offset.x < -60) handleNext();
                        }}
                        className="max-h-[62vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/15 cursor-grab active:cursor-grabbing"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/15 hover:bg-white/35 backdrop-blur-xl border border-white/25 text-white flex items-center justify-center text-lg sm:text-xl z-20 transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Next Photo"
                  >
                    <FaChevronRight className="ml-0.5" />
                  </button>
                </div>

                {/* Bottom Area: Caption Card & Thumbnail Carousel Strip */}
                <div 
                  className="w-full max-w-4xl z-10 flex flex-col items-center gap-2.5 pb-2 pt-2 px-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Glassmorphic Caption Card */}
                  <div className="w-full text-center px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl">
                    <h3 className="text-base sm:text-lg font-bold font-poppins text-white tracking-wide">
                      {lang === 'mr' ? currentItem.titleMr : currentItem.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-200 mt-0.5 line-clamp-2">
                      {lang === 'mr' ? currentItem.captionMr : currentItem.captionEn}
                    </p>
                  </div>

                  {/* Quick Thumbnail Strip */}
                  <div className="w-full overflow-x-auto flex items-center justify-center gap-2 py-1 px-2 no-scrollbar">
                    {filteredItems.map((item, idx) => {
                      const isActive = idx === lightboxIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setLightboxIndex(idx)}
                          className={`relative flex-shrink-0 w-11 h-9 sm:w-13 sm:h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            isActive
                              ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/40 opacity-100 ring-2 ring-emerald-400/50'
                              : 'border-white/20 opacity-40 hover:opacity-85'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
}
