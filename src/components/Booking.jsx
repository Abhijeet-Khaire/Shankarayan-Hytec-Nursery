import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSeedling, 
  FaCheckCircle, 
  FaWhatsapp, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhoneAlt, 
  FaTruck, 
  FaStore, 
  FaCalculator, 
  FaTimes, 
  FaFileAlt,
  FaShieldAlt,
  FaLock,
  FaAward
} from 'react-icons/fa';
import { translations } from '../utils/translations';
import { saveOrder } from '../utils/ordersStore';
import { getCurrentUser, isUserLoggedIn } from '../utils/userAuth';
import UserAuthModal from './UserAuthModal';

// Images for plant varieties
import varietyPapaya15 from '../assets/images/seedlings/seedling_batch.jpg';

export default function Booking({ lang }) {
  const t = translations[lang];

  // Plant varieties (Exclusively Original 15 No. Papaya)
  const varieties = [
    {
      id: 'papaya-15',
      name: t['book-variety-1-title'],
      desc: t['book-variety-1-desc'],
      tag: t['book-variety-1-tag'],
      rate: 12,
      rateText: t['book-rate-papaya'],
      image: varietyPapaya15,
      isPapaya: true,
      badgeColor: 'bg-emerald-600 text-white',
    }
  ];

  // District options
  const districts = [
    { value: 'Dharashiv', label: lang === 'mr' ? 'धाराशिव (उस्मानाबाद)' : 'Dharashiv (Osmanabad)' },
    { value: 'Solapur', label: lang === 'mr' ? 'सोलापूर' : 'Solapur' },
    { value: 'Latur', label: lang === 'mr' ? 'लातूर' : 'Latur' },
    { value: 'Beed', label: lang === 'mr' ? 'बीड' : 'Beed' },
    { value: 'Pune', label: lang === 'mr' ? 'पुणे' : 'Pune' },
    { value: 'Ahilyanagar', label: lang === 'mr' ? 'अहिल्यानगर (अहमदनगर)' : 'Ahilyanagar' },
    { value: 'Satara', label: lang === 'mr' ? 'सातारा' : 'Satara' },
    { value: 'Chhatrapati Sambhajinagar', label: lang === 'mr' ? 'छत्रपती संभाजीनगर' : 'Chhatrapati Sambhajinagar' },
    { value: 'Other', label: lang === 'mr' ? 'इतर जिल्हा (Other)' : 'Other District' },
  ];

  // Form State
  const [selectedVariety, setSelectedVariety] = useState('papaya-15');
  const [quantity, setQuantity] = useState(1000);
  const [customQtyInput, setCustomQtyInput] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [farmerName, setFarmerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [villageTaluka, setVillageTaluka] = useState('');
  const [district, setDistrict] = useState('Dharashiv');
  const [preferredDate, setPreferredDate] = useState('');
  const [acres, setAcres] = useState('1');
  const [specialNotes, setSpecialNotes] = useState('');

  // User Auth & Order Interception State
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'online' | 'whatsapp'

  // Booking Summary Popup Modal State
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryMode, setSummaryMode] = useState('whatsapp'); // 'whatsapp' | 'online'

  // UI State
  const [validationError, setValidationError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field-specific validation errors and refs for auto-scrolling & focusing
  const farmerNameRef = useRef(null);
  const mobileNumberRef = useRef(null);
  const villageTalukaRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({
    farmerName: '',
    mobileNumber: '',
    villageTaluka: ''
  });

  // Sync logged in farmer details
  useEffect(() => {
    const syncUser = (user) => {
      setCurrentUser(user);
      if (user) {
        if (!farmerName && user.name) setFarmerName(user.name);
        if (!mobileNumber && user.mobile) setMobileNumber(user.mobile);
      }
    };

    const cur = getCurrentUser();
    if (cur) syncUser(cur);

    const handleAuthChange = (e) => {
      syncUser(e.detail);
    };
    window.addEventListener('shn_user_auth_changed', handleAuthChange);
    return () => window.removeEventListener('shn_user_auth_changed', handleAuthChange);
  }, []);

  // Lock body scroll whenever summary modal or confirmation slip is open
  useEffect(() => {
    if (isSummaryModalOpen || confirmedBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSummaryModalOpen, confirmedBooking]);

  // Quick quantities
  const presetQuantities = [500, 1000, 2000, 3000, 5000, 10000];

  // Find active variety
  const currentVariety = varieties.find(v => v.id === selectedVariety) || varieties[0];

  // Calculation metrics
  const activeQuantity = Number(quantity) || 1000;
  const estimatedAcres = (activeQuantity / 1000).toFixed(1);
  const estimatedTrays = Math.ceil(activeQuantity / 104);
  const estimatedTotal = currentVariety.rate ? activeQuantity * currentVariety.rate : null;

  // Set min date to tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Handle Preset Qty Click
  const handleSelectPreset = (val) => {
    setQuantity(val);
    setCustomQtyInput('');
    // Auto-update acres estimation
    setAcres((val / 1000).toFixed(1));
  };

  // Handle Custom Qty Change
  const handleCustomQtyChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomQtyInput(val);
    if (val && parseInt(val, 10) > 0) {
      const numVal = parseInt(val, 10);
      setQuantity(numVal);
      setAcres((numVal / 1000).toFixed(1));
    }
  };

  // Generate Booking Message for WhatsApp
  const generateWhatsAppMessage = (bookingId) => {
    const deliveryText = deliveryMethod === 'pickup' ? t['book-del-pickup'] : t['book-del-transport'];
    const refText = bookingId ? `*बुकिंग आयडी (Ref ID):* ${bookingId}\n` : '';
    
    return encodeURIComponent(
      `🌱 *शंकरायण हायटेक नर्सरी - नवीन रोपे बुकिंग मागणी*\n` +
      `-----------------------------------------\n` +
      refText +
      `👤 *शेतकऱ्याचे नाव:* ${farmerName.trim()}\n` +
      `📱 *मोबाईल नंबर (OTP Verified):* ${mobileNumber.trim()}\n` +
      `📍 *गाव व तालुका:* ${villageTaluka.trim()}\n` +
      `🏛️ *जिल्हा:* ${district}\n` +
      `🌿 *निवडलेला वाण:* ${currentVariety.name}\n` +
      `🔢 *रोपांची संख्या:* ${activeQuantity.toLocaleString('en-IN')} रोपे (~${estimatedTrays} ट्रे)\n` +
      `🌾 *शेत क्षेत्र:* ${acres ? acres + ' एकर' : `${estimatedAcres} एकर`}\n` +
      `🚚 *वितरण पद्धत:* ${deliveryText}\n` +
      `📅 *अपेक्षित तारीख:* ${preferredDate || 'लवकरात लवकर / चर्चेनुसार'}\n` +
      (estimatedTotal ? `💰 *अंदाजे रक्कम:* ₹${estimatedTotal.toLocaleString('en-IN')}\n` : '') +
      (specialNotes.trim() ? `📝 *विशेष टीप:* ${specialNotes.trim()}\n` : '') +
      `-----------------------------------------\n` +
      `कृपया या बुकिंगची उपलब्धता व पुढील प्रक्रिया कळवावी.`
    );
  };

  // Validate form with auto-scroll and auto-focus to first missing field
  const validateForm = () => {
    const errors = {};
    let firstInvalidRef = null;

    if (!farmerName.trim()) {
      errors.farmerName = lang === 'mr' ? 'कृपया शेतकऱ्याचे नाव प्रविष्ट करा' : 'Please enter farmer name';
      if (!firstInvalidRef) firstInvalidRef = farmerNameRef;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.mobileNumber = lang === 'mr' ? 'कृपया १०-अंकी वैध मोबाईल नंबर प्रविष्ट करा' : 'Please enter a valid 10-digit mobile number';
      if (!firstInvalidRef) firstInvalidRef = mobileNumberRef;
    }

    if (!villageTaluka.trim()) {
      errors.villageTaluka = lang === 'mr' ? 'कृपया गाव व तालुक्याचे नाव प्रविष्ट करा' : 'Please enter village and taluka';
      if (!firstInvalidRef) firstInvalidRef = villageTalukaRef;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setValidationError(
        lang === 'mr' 
          ? 'कृपया लाल रंगात दाखवलेली सर्व आवश्यक माहिती पूर्ण भरा.' 
          : 'Please fill in all highlighted required fields.'
      );
      
      // Auto-scroll to the exact invalid field and focus it!
      if (firstInvalidRef && firstInvalidRef.current) {
        firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if (firstInvalidRef.current) firstInvalidRef.current.focus();
        }, 300);
      }
      return false;
    }

    setValidationError('');
    return true;
  };

  // Open Summary Popup Modal after verifying form fields
  const handleOpenSummary = (mode) => {
    if (!validateForm()) return;
    setSummaryMode(mode);
    setIsSummaryModalOpen(true);
  };

  // Confirm WhatsApp booking from inside Summary Modal
  const handleConfirmSummaryWhatsApp = () => {
    setIsSummaryModalOpen(false);
    if (!isUserLoggedIn()) {
      setPendingAction('whatsapp');
      setIsAuthModalOpen(true);
      return;
    }
    proceedWithWhatsAppBook(currentUser || { name: farmerName, mobile: mobileNumber });
  };

  // Confirm Online booking from inside Summary Modal
  const handleConfirmSummaryOnline = () => {
    setIsSummaryModalOpen(false);
    if (!isUserLoggedIn()) {
      setPendingAction('online');
      setIsAuthModalOpen(true);
      return;
    }
    proceedWithOnlineSubmit(currentUser || { name: farmerName, mobile: mobileNumber });
  };

  // Handle WhatsApp direct book with compulsory OTP check
  const handleWhatsAppBook = () => {
    if (!validateForm()) return;

    // Compulsory Login / OTP Verification check
    if (!isUserLoggedIn()) {
      setPendingAction('whatsapp');
      setIsAuthModalOpen(true);
      return;
    }

    proceedWithWhatsAppBook(currentUser || { name: farmerName, mobile: mobileNumber });
  };

  const proceedWithWhatsAppBook = (verifiedUser) => {
    // Generate reference ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SHN-${new Date().getFullYear()}-${randomSuffix}`;
    const dateNow = new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const activeFarmerName = (verifiedUser?.name || farmerName).trim();
    const activeMobile = (verifiedUser?.mobile || mobileNumber).trim();

    const bookingData = {
      id: bookingId,
      date: dateNow,
      farmerName: activeFarmerName,
      mobileNumber: activeMobile,
      villageTaluka: villageTaluka.trim(),
      district,
      variety: currentVariety.name,
      varietyId: currentVariety.id,
      quantity: activeQuantity,
      trays: estimatedTrays,
      acres: acres || estimatedAcres,
      deliveryMethod: deliveryMethod === 'pickup' ? t['book-del-pickup'] : t['book-del-transport'],
      preferredDate: preferredDate || 'लवकरात लवकर (Soonest)',
      estimatedTotal: estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')}` : 'विचारणा दर (Quote)',
      totalAmount: estimatedTotal || activeQuantity * 12,
      advancePaid: 0,
      paymentStatus: 'Unpaid',
      status: 'Pending',
      specialNotes: specialNotes.trim(),
      orderSource: 'WhatsApp Direct',
      otpVerified: true,
      verifiedAt: Date.now()
    };

    // Save order into centralized store
    saveOrder(bookingData);

    const text = generateWhatsAppMessage(bookingId);
    const whatsappUrl = `https://wa.me/919657523258?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle Online Submit with compulsory OTP check
  const handleOnlineSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    // Compulsory Login / OTP Verification check
    if (!isUserLoggedIn()) {
      setPendingAction('online');
      setIsAuthModalOpen(true);
      return;
    }

    proceedWithOnlineSubmit(currentUser || { name: farmerName, mobile: mobileNumber });
  };

  const proceedWithOnlineSubmit = (verifiedUser) => {
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SHN-${new Date().getFullYear()}-${randomSuffix}`;
    const dateNow = new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const activeFarmerName = (verifiedUser?.name || farmerName).trim();
    const activeMobile = (verifiedUser?.mobile || mobileNumber).trim();

    const bookingData = {
      id: bookingId,
      date: dateNow,
      farmerName: activeFarmerName,
      mobileNumber: activeMobile,
      villageTaluka: villageTaluka.trim(),
      district,
      variety: currentVariety.name,
      varietyId: currentVariety.id,
      quantity: activeQuantity,
      trays: estimatedTrays,
      acres: acres || estimatedAcres,
      deliveryMethod: deliveryMethod === 'pickup' ? t['book-del-pickup'] : t['book-del-transport'],
      preferredDate: preferredDate || 'लवकरात लवकर (Soonest)',
      estimatedTotal: estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')}` : 'विचारणा दर (Quote)',
      totalAmount: estimatedTotal || activeQuantity * 12,
      advancePaid: 0,
      paymentStatus: 'Unpaid',
      status: 'Pending',
      specialNotes: specialNotes.trim(),
      orderSource: 'Online Form',
      otpVerified: true,
      verifiedAt: Date.now()
    };

    // Save order to store
    saveOrder(bookingData);

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(bookingData);
    }, 400);
  };

  // Callback after successful OTP verification
  const handleLoginSuccess = (verifiedUser) => {
    setCurrentUser(verifiedUser);
    if (verifiedUser.name) setFarmerName(verifiedUser.name);
    if (verifiedUser.mobile) setMobileNumber(verifiedUser.mobile);

    // Automatically fulfill the intercepted booking action!
    if (pendingAction === 'whatsapp') {
      setPendingAction(null);
      proceedWithWhatsAppBook(verifiedUser);
    } else if (pendingAction === 'online') {
      setPendingAction(null);
      proceedWithOnlineSubmit(verifiedUser);
    }
  };

  return (
    <section id="book" className="py-28 relative scroll-mt-20 overflow-hidden">
      
      {/* Decorative ambient refraction blurbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#2E7D32] text-xs font-bold uppercase tracking-wider shadow-sm">
            <FaSeedling className="w-3.5 h-3.5 animate-bounce text-[#2E7D32]" />
            {t['book-badge']}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 font-poppins">
            {t['book-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t['book-subtitle']}
          </p>
        </div>

        {/* UNIFIED HORIZONTAL BOOKING FORM CONTAINER */}
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-[36px] p-6 sm:p-8 lg:p-10 border border-white/90 shadow-2xl space-y-8 bg-white/80 backdrop-blur-3xl relative overflow-hidden">
            
            {/* Form Top Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/25 inline-flex items-center gap-1.5 mb-2">
                  <FaSeedling className="text-[#2E7D32]" />
                  {lang === 'mr' ? 'एकत्रित बुकिंग फॉर्म' : 'Unified Booking Form'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-poppins">
                  {lang === 'mr' ? 'ओरिजिनल १५ नंबर पपई रोपे मागणी नोंदवा' : 'Book Original 15 No. Papaya Seedlings'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {lang === 'mr' ? 'एकाच ठिकाणी वाण, संख्या आणि शेतकरी माहिती भरून त्वरित बुकिंग करा.' : 'Select quantity, fill details, and book your seedlings in one unified view.'}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-3.5 py-2 rounded-2xl border border-emerald-300 shrink-0">
                <FaAward className="text-[#2E7D32] w-4 h-4" />
                <span>{lang === 'mr' ? '१००% खात्रीशीर बियाणे व निरोगी रोपे' : '100% Guaranteed Healthy Seedlings'}</span>
              </div>
            </div>

            {/* THE 3 SECTIONS IN ONE UNIFIED HORIZONTAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              
              {/* SECTION 1: निवडलेला वाण (Cols 1-4) */}
              <div className="lg:col-span-4 bg-gradient-to-b from-emerald-500/10 via-white/70 to-emerald-500/5 rounded-3xl p-5 sm:p-6 border border-emerald-500/25 flex flex-col justify-between h-full shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                    <h4 className="text-base font-bold font-poppins text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">1</span>
                      {t['book-step1']}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                      {currentVariety.tag}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <img
                      src={currentVariety.image}
                      alt={currentVariety.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                    />
                    <div className="space-y-1">
                      <h5 className="text-base font-extrabold text-slate-900 font-poppins leading-tight">
                        {currentVariety.name}
                      </h5>
                      <p className="text-sm font-black text-[#2E7D32]">
                        {currentVariety.rateText}
                      </p>
                      <span className="text-[11px] font-medium text-slate-500 block">
                        १०४ होल प्रो-ट्रे व ग्रो बॅग्स
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-emerald-500/20">
                    {currentVariety.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] font-semibold text-emerald-800 bg-emerald-500/15 py-2 px-3 rounded-2xl flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-700 w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'mr' ? 'सध्या केवळ १५ नंबर वाण उपलब्ध आहे' : 'Flagship 15 No. Papaya active'}</span>
                </div>
              </div>

              {/* SECTION 2: संख्या व हिशोब (Cols 5-8) */}
              <div className="lg:col-span-4 bg-slate-50/70 rounded-3xl p-5 sm:p-6 border border-slate-200/80 flex flex-col justify-between h-full shadow-sm space-y-5">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
                    <h4 className="text-base font-bold font-poppins text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">2</span>
                      {t['book-step2']}
                    </h4>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <FaCalculator className="text-[#2E7D32] text-xs" />
                      ~{acres ? `${acres} एकर` : `${estimatedAcres} एकर`}
                    </span>
                  </div>

                  {/* Quantity Presets */}
                  <div className="space-y-2 mb-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      {t['book-qty-label']}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {presetQuantities.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                            quantity === preset && !customQtyInput
                              ? 'glass-btn-primary text-white shadow-md scale-102'
                              : 'glass-btn-secondary text-slate-700 hover:text-emerald-900 border border-white/80 bg-white'
                          }`}
                        >
                          {preset >= 1000 ? `${preset / 1000}k` : preset}
                          <span className="block text-[9px] font-normal opacity-75">
                            {lang === 'mr' ? 'रोपे' : 'plants'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Quantity */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t['book-qty-custom']}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="उदा. 1500, 2500..."
                      value={customQtyInput}
                      onChange={handleCustomQtyChange}
                      className="glass-input w-full px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  {/* Live Calculation Pod */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                        {lang === 'mr' ? 'अंदाजे ट्रे' : 'Trays'}
                      </span>
                      <span className="text-base font-extrabold text-[#2E7D32]">
                        ~{estimatedTrays} <span className="text-[10px] font-normal text-slate-600">ट्रे</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                        {lang === 'mr' ? 'अंदाजे रक्कम' : 'Total'}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')}` : t['book-rate-custom']}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic pt-1 text-center">
                  {t['book-calc-hint']}
                </p>
              </div>

              {/* SECTION 3: शेतकरी माहिती व वितरण (Cols 9-12) */}
              <div className="lg:col-span-4 bg-slate-50/70 rounded-3xl p-5 sm:p-6 border border-slate-200/80 flex flex-col justify-between h-full shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
                    <h4 className="text-base font-bold font-poppins text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">3</span>
                      {t['book-step3']}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500">
                      * आवश्यक
                    </span>
                  </div>

                  {/* Inputs Grid */}
                  <div className="space-y-3 text-xs">
                    {/* Farmer Name */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 flex items-center gap-1">
                          <FaUser className="text-[#2E7D32] text-[10px]" />
                          {t['book-name-label']}
                        </label>
                        {fieldErrors.farmerName && (
                          <span className="text-[10px] font-bold text-rose-600 animate-pulse">{fieldErrors.farmerName}</span>
                        )}
                      </div>
                      <input
                        ref={farmerNameRef}
                        type="text"
                        value={farmerName}
                        onChange={(e) => {
                          setFarmerName(e.target.value);
                          if (fieldErrors.farmerName) setFieldErrors(p => ({ ...p, farmerName: '' }));
                          setValidationError('');
                        }}
                        placeholder={t['book-name-placeholder']}
                        className={`glass-input w-full px-3.5 py-2 rounded-xl text-xs transition-all outline-none ${
                          fieldErrors.farmerName ? 'border-2 border-rose-500 ring-2 ring-rose-200 bg-rose-50/50' : ''
                        }`}
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 flex items-center gap-1">
                          <FaPhoneAlt className="text-[#2E7D32] text-[10px]" />
                          {t['book-phone-label']}
                        </label>
                        {fieldErrors.mobileNumber ? (
                          <span className="text-[10px] font-bold text-rose-600 animate-pulse">{fieldErrors.mobileNumber}</span>
                        ) : currentUser && currentUser.mobile === mobileNumber ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <FaCheckCircle className="w-2 h-2" />
                            <span>OTP Verified</span>
                          </span>
                        ) : null}
                      </div>
                      <input
                        ref={mobileNumberRef}
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/\D/g, ''));
                          if (fieldErrors.mobileNumber) setFieldErrors(p => ({ ...p, mobileNumber: '' }));
                          setValidationError('');
                        }}
                        placeholder={t['book-phone-placeholder']}
                        className={`glass-input w-full px-3.5 py-2 rounded-xl text-xs transition-all outline-none ${
                          fieldErrors.mobileNumber ? 'border-2 border-rose-500 ring-2 ring-rose-200 bg-rose-50/50' : ''
                        }`}
                      />
                    </div>

                    {/* Village & Taluka */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[#2E7D32] text-[10px]" />
                          {t['book-village-label']}
                        </label>
                        {fieldErrors.villageTaluka && (
                          <span className="text-[10px] font-bold text-rose-600 animate-pulse">{fieldErrors.villageTaluka}</span>
                        )}
                      </div>
                      <input
                        ref={villageTalukaRef}
                        type="text"
                        value={villageTaluka}
                        onChange={(e) => {
                          setVillageTaluka(e.target.value);
                          if (fieldErrors.villageTaluka) setFieldErrors(p => ({ ...p, villageTaluka: '' }));
                          setValidationError('');
                        }}
                        placeholder={t['book-village-placeholder']}
                        className={`glass-input w-full px-3.5 py-2 rounded-xl text-xs transition-all outline-none ${
                          fieldErrors.villageTaluka ? 'border-2 border-rose-500 ring-2 ring-rose-200 bg-rose-50/50' : ''
                        }`}
                      />
                    </div>

                    {/* District & Delivery Method (2 cols) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">
                          {t['book-district-label']}
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="glass-input w-full px-2.5 py-2 rounded-xl text-[11px] focus:outline-none"
                        >
                          {districts.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">
                          {t['book-delivery-label']}
                        </label>
                        <select
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="glass-input w-full px-2.5 py-2 rounded-xl text-[11px] focus:outline-none"
                        >
                          <option value="pickup">{t['book-del-pickup']}</option>
                          <option value="transport">{t['book-del-transport']}</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Date & Acres (2 cols) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">
                          {t['book-date-label']}
                        </label>
                        <input
                          type="date"
                          min={tomorrowStr}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="glass-input w-full px-2 py-2 rounded-xl text-[11px] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">
                          {t['book-acres-label']}
                        </label>
                        <input
                          type="text"
                          value={acres}
                          onChange={(e) => setAcres(e.target.value)}
                          placeholder="उदा. 1, 2.5"
                          className="glass-input w-full px-2.5 py-2 rounded-xl text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Special Notes (optional) */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">
                        {t['book-notes-label']}
                      </label>
                      <input
                        type="text"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder={t['book-notes-placeholder']}
                        className="glass-input w-full px-3 py-1.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* UNIFIED FORM BOTTOM BAR: Validation Message, Price Summary, & Dual Action Buttons */}
            <div className="pt-6 border-t border-slate-200/80 space-y-4">
              
              {/* Validation Warning if any field is missing */}
              {validationError && (
                <div className="p-3 bg-red-50/95 text-red-700 text-xs font-bold rounded-2xl border-2 border-red-300 flex items-center gap-2 shadow-sm animate-bounce">
                  <span>⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-teal-500/15 p-4 sm:p-5 rounded-3xl border border-emerald-500/25">
                <div className="flex items-center gap-4 text-left w-full md:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    ₹
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
                      {lang === 'mr' ? 'एकूण अंदाजे रक्कम' : 'Estimated Total'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-[#2E7D32] font-poppins">
                      {estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')}` : t['book-rate-custom']}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {currentVariety.name} • {activeQuantity.toLocaleString('en-IN')} रोपे (~{estimatedTrays} ट्रे)
                    </span>
                  </div>
                </div>

                {/* The Two Big Booking Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto shrink-0">
                  {/* WhatsApp Direct */}
                  <button
                    type="button"
                    onClick={() => handleOpenSummary('whatsapp')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-black text-sm sm:text-base transition-all shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:scale-95 shrink-0"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>{t['book-btn-whatsapp']}</span>
                  </button>

                  {/* Secondary Button: Submit Online */}
                  <button
                    type="button"
                    onClick={() => handleOpenSummary('online')}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#154a19] hover:to-[#246328] text-white font-black text-sm sm:text-base shadow-[0_10px_24px_rgba(46,125,50,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    <span>{t['book-btn-submit']}</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  {t['book-booking-guarantee']}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* BOOKING SUMMARY POPUP MODAL - Horizontal 3-Section Executive Layout */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isSummaryModalOpen && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsSummaryModalOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="glass-panel bg-white/95 rounded-[32px] sm:rounded-[36px] max-w-5xl w-full p-5 sm:p-8 shadow-2xl border border-white/90 relative my-auto backdrop-blur-3xl max-h-[92vh] overflow-y-auto flex flex-col justify-between"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsSummaryModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                {/* Modal Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200/80 gap-3 pr-10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-[#2E7D32] flex items-center justify-center shadow-inner border border-emerald-500/25 shrink-0">
                      <FaFileAlt className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-poppins flex items-center gap-2">
                        <span>{lang === 'mr' ? 'बुकिंग सारांश' : 'Booking Summary'}</span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          {summaryMode === 'whatsapp' 
                            ? (lang === 'mr' ? '💬 व्हॉट्सॲप मागणी' : '💬 WhatsApp Order')
                            : (lang === 'mr' ? '🚀 थेट ऑनलाइन नोंदणी' : '🚀 Online Order')}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        {lang === 'mr' 
                          ? 'खालील सर्व ३ विभागांतील माहिती तपासून आपली बुकिंग निश्चित करा.' 
                          : 'Review all 3 sections of your seedling order before confirming.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSummaryModalOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2 px-3.5 rounded-xl transition-colors self-start sm:self-center"
                  >
                    <span>✏️ {lang === 'mr' ? 'माहिती बदला' : 'Edit Form'}</span>
                  </button>
                </div>

                {/* ALL 3 SECTIONS IN ONE UNIFIED HORIZONTAL ROW (3 COLUMNS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 my-6">

                  {/* SECTION 1: निवडलेला वाण (Plant Variety) */}
                  <div className="bg-gradient-to-b from-emerald-500/10 via-white/80 to-emerald-500/5 rounded-3xl p-5 border border-emerald-500/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/25">
                          १. {lang === 'mr' ? 'निवडलेला वाण' : 'Selected Variety'}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                          {currentVariety.tag}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 pt-1">
                        <img
                          src={currentVariety.image}
                          alt={currentVariety.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base font-poppins leading-tight">
                            {currentVariety.name}
                          </h4>
                          <p className="text-sm font-black text-[#2E7D32] mt-0.5">
                            {currentVariety.rateText}
                          </p>
                          <span className="text-[10px] font-semibold text-slate-500">
                            १०४ होल प्रो-ट्रे व ग्रो बॅग्स
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed border-t border-emerald-500/20 pt-2.5">
                        {currentVariety.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                      <FaAward className="text-emerald-700 w-3.5 h-3.5 shrink-0" />
                      <span>{lang === 'mr' ? '१००% ओरिजिनल खात्रीशीर बियाणे' : '100% Genuine Certified Seeds'}</span>
                    </div>
                  </div>

                  {/* SECTION 2: रोपे संख्या व हिशोब (Quantity & Calculation) */}
                  <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 rounded-3xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-sm">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-200/70 px-2.5 py-1 rounded-full">
                          २. {lang === 'mr' ? 'संख्या व हिशोब' : 'Quantity & Total'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600">
                          ~{acres ? `${acres} एकर` : `${estimatedAcres} एकर`}
                        </span>
                      </div>

                      {/* Quantity & Trays Stats */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            {lang === 'mr' ? 'एकूण रोपे' : 'Total Seedlings'}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 font-poppins">
                            {activeQuantity.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{lang === 'mr' ? 'नग' : 'Plants'}</span>
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            {lang === 'mr' ? 'अंदाजे ट्रे' : 'Total Trays'}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-emerald-800 font-poppins">
                            ~{estimatedTrays}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{lang === 'mr' ? 'ट्रे (१०४ होल)' : 'Trays'}</span>
                        </div>
                      </div>

                      {/* Total Estimated Cost Box */}
                      <div className="bg-gradient-to-br from-emerald-600 to-[#1B5E20] text-white p-3.5 rounded-2xl shadow-md">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                          {lang === 'mr' ? 'एकूण अंदाजे रक्कम' : 'Estimated Total'}
                        </span>
                        <div className="flex items-baseline justify-between mt-0.5">
                          <span className="text-2xl sm:text-3xl font-black font-poppins tracking-tight text-white">
                            {estimatedTotal ? `₹${estimatedTotal.toLocaleString('en-IN')}` : t['book-rate-custom']}
                          </span>
                          <span className="text-[10px] text-emerald-200 font-medium">
                            {lang === 'mr' ? '*अंतिम दर पुष्टी वेळी' : '*At confirmation'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic mt-3 pt-2 border-t border-slate-200/60">
                      {lang === 'mr' ? '💡 रोपांचे दर नर्सरी पिकअप / स्थानिक मानकानुसार आहेत.' : '💡 Rates apply at nursery dispatch point.'}
                    </p>
                  </div>

                  {/* SECTION 3: शेतकरी व वितरण माहिती (Farmer & Delivery) */}
                  <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 rounded-3xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-sm">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-200/70 px-2.5 py-1 rounded-full">
                          ३. {lang === 'mr' ? 'शेतकरी व वितरण' : 'Farmer & Delivery'}
                        </span>
                        {currentUser && currentUser.mobile === mobileNumber && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                            <FaCheckCircle className="w-2.5 h-2.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs pt-1">
                        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <FaUser className="text-[#2E7D32] text-[10px]" />
                            {lang === 'mr' ? 'नाव:' : 'Name:'}
                          </span>
                          <span className="font-bold text-slate-900 truncate max-w-[130px]" title={farmerName.trim()}>
                            {farmerName.trim()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <FaPhoneAlt className="text-[#2E7D32] text-[10px]" />
                            {lang === 'mr' ? 'मोबाईल:' : 'Phone:'}
                          </span>
                          <span className="font-bold text-slate-900 font-mono">
                            +91 {mobileNumber.trim()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#2E7D32] text-[10px]" />
                            {lang === 'mr' ? 'गाव/तालुका:' : 'Village:'}
                          </span>
                          <span className="font-bold text-slate-900 truncate max-w-[130px]" title={`${villageTaluka.trim()}, ${district}`}>
                            {villageTaluka.trim()}, {district}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <FaTruck className="text-[#2E7D32] text-[10px]" />
                            {lang === 'mr' ? 'पद्धत:' : 'Delivery:'}
                          </span>
                          <span className="font-bold text-slate-900">
                            {deliveryMethod === 'pickup' 
                              ? (lang === 'mr' ? 'नर्सरी पिकअप' : 'Pickup') 
                              : (lang === 'mr' ? 'वाहतूक (Transport)' : 'Transport')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <FaCalendarAlt className="text-[#2E7D32] text-[10px]" />
                            {lang === 'mr' ? 'तारीख:' : 'Date:'}
                          </span>
                          <span className="font-bold text-slate-900">
                            {preferredDate || (lang === 'mr' ? 'चर्चेनुसार' : 'As scheduled')}
                          </span>
                        </div>

                        {specialNotes.trim() && (
                          <div className="pt-1.5 text-[11px] text-slate-600 bg-slate-100/80 p-2 rounded-xl border border-slate-200/70">
                            <span className="font-bold text-slate-700 block">{lang === 'mr' ? 'विशेष टीप:' : 'Note:'}</span>
                            <span className="italic line-clamp-2">"{specialNotes.trim()}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-400 text-right">
                      <span>नर्सरी कोड: SHN-2026</span>
                    </div>
                  </div>

                </div>

                {/* HORIZONTAL FOOTER & ACTION ZONE */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Left: OTP Security Pill & Mode Toggle */}
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-500/10 py-2 px-3.5 rounded-2xl border border-emerald-500/20">
                      <FaShieldAlt className="text-emerald-700 w-3.5 h-3.5 shrink-0" />
                      <span>
                        {currentUser && currentUser.mobile === mobileNumber
                          ? (lang === 'mr' ? `OTP पडताळणी पूर्ण: ${currentUser.name}` : `Verified: ${currentUser.name}`)
                          : (lang === 'mr' ? '🔒 बुकिंगसाठी OTP आवश्यक' : '🔒 OTP Required')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSummaryMode(summaryMode === 'whatsapp' ? 'online' : 'whatsapp')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline decoration-dotted py-1 px-1"
                    >
                      {summaryMode === 'whatsapp'
                        ? (lang === 'mr' ? '👉 किंवा ऑनलाइन नोंदणी करा' : '👉 Or register via Online Form')
                        : (lang === 'mr' ? '👉 किंवा व्हॉट्सॲपवर पाठवा' : '👉 Or send via WhatsApp')}
                    </button>
                  </div>

                  {/* Right: Primary Action Button */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsSummaryModalOpen(false)}
                      className="hidden sm:inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-3.5 px-5 rounded-full transition-colors"
                    >
                      {lang === 'mr' ? 'माहिती बदला' : 'Edit'}
                    </button>

                    {summaryMode === 'whatsapp' ? (
                      <button
                        type="button"
                        onClick={handleConfirmSummaryWhatsApp}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-black text-sm sm:text-base transition-all shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:scale-95 shrink-0"
                      >
                        <FaWhatsapp className="w-5 h-5" />
                        <span>{lang === 'mr' ? 'खात्री करा व व्हॉट्सॲपवर पाठवा' : 'Confirm & Send on WhatsApp'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmSummaryOnline}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#154a19] hover:to-[#246328] text-white font-black text-sm sm:text-base shadow-[0_10px_24px_rgba(46,125,50,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                        <span>{isSubmitting ? (lang === 'mr' ? 'नोंदणी होत आहे...' : 'Submitting...') : (lang === 'mr' ? 'खात्री करा व बुकिंग नोंदवा' : 'Confirm & Register Online')}</span>
                      </button>
                    )}
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* CONFIRMATION SLIP MODAL - iOS 26 Modal Sheet */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {confirmedBooking && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setConfirmedBooking(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-panel bg-white/95 rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/90 relative my-auto backdrop-blur-3xl"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setConfirmedBooking(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center space-y-2 pb-5 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-[#2E7D32] flex items-center justify-center mx-auto shadow-inner border border-emerald-500/25">
                    <FaCheckCircle className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 font-poppins">
                    {t['book-success-title']}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    {t['book-success-subtitle']}
                  </p>
                </div>

                {/* Slip Card */}
                <div className="my-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3 text-xs sm:text-sm">
                  
                  <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                    <span className="font-bold text-slate-500">{t['book-slip-id']}:</span>
                    <span className="font-mono font-extrabold text-[#2E7D32] text-sm bg-white px-2.5 py-0.5 rounded border border-emerald-300">
                      {confirmedBooking.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-farmer']}</span>
                      <span className="font-bold text-slate-800">{confirmedBooking.farmerName}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-phone']}</span>
                      <span className="font-semibold text-slate-800">{confirmedBooking.mobileNumber}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-location']}</span>
                      <span className="font-semibold text-slate-800">{confirmedBooking.villageTaluka}, {confirmedBooking.district}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-variety']}</span>
                      <span className="font-bold text-[#2E7D32]">{confirmedBooking.variety}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-qty']}</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {confirmedBooking.quantity.toLocaleString('en-IN')} {lang === 'mr' ? 'रोपे' : 'Plants'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-est-amount']}</span>
                      <span className="font-extrabold text-slate-900 text-sm">{confirmedBooking.estimatedTotal}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-delivery']}</span>
                      <span className="font-medium text-slate-700">{confirmedBooking.deliveryMethod}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{t['book-slip-target-date']}</span>
                      <span className="font-medium text-slate-700">{confirmedBooking.preferredDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{t['book-slip-status']}:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {t['book-slip-status-val']}
                      </span>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <FaShieldAlt className="w-2.5 h-2.5 text-emerald-600" />
                        <span>OTP Verified</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Modal Actions */}
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/919657523258?text=${generateWhatsAppMessage(confirmedBooking.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm transition-all shadow-md"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>{t['book-slip-share-wa']}</span>
                  </a>

                  <div className="flex gap-3">
                    <a
                      href="tel:+919657523258"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-xs transition-all"
                    >
                      <FaPhoneAlt className="w-3 h-3" />
                      <span>{t['book-slip-call']}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setConfirmedBooking(null)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
                    >
                      {t['book-slip-close']}
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* USER AUTH & OTP VERIFICATION MODAL */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        initialMobile={mobileNumber}
        initialName={farmerName}
        isCompulsoryForOrder={true}
        lang={lang}
        onLoginSuccess={handleLoginSuccess}
      />

    </section>
  );
}
