import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSeedling, 
  FaLock, 
  FaUnlock, 
  FaSignOutAlt, 
  FaSearch, 
  FaFilter, 
  FaFileExport, 
  FaPlus, 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaPrint, 
  FaTrashAlt, 
  FaCheckCircle, 
  FaClock, 
  FaTruck, 
  FaTimes, 
  FaEdit, 
  FaKey, 
  FaUserCheck, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaLayerGroup, 
  FaMoneyBillWave, 
  FaArrowLeft,
  FaUndoAlt
} from 'react-icons/fa';
import { 
  getOrders, 
  saveOrder, 
  updateOrder, 
  deleteOrder, 
  resetSampleOrders, 
  exportOrdersToCSV, 
  getAdminPin, 
  setAdminPin, 
  isSessionAuthenticated, 
  setSessionAuthenticated 
} from '../utils/ordersStore';

export default function AdminPanel({ lang = 'mr', onClose }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => isSessionAuthenticated());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [varietyFilter, setVarietyFilter] = useState('ALL');

  // Modals State
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isPinSettingsOpen, setIsPinSettingsOpen] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    farmerName: '',
    mobileNumber: '',
    villageTaluka: '',
    district: 'Dharashiv',
    variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)',
    varietyId: 'papaya-15',
    quantity: 1000,
    acres: '1.0',
    deliveryMethod: 'नर्सरीतून स्वतः नेणार (Self-Pickup)',
    preferredDate: '',
    ratePerPlant: 12,
    advancePaid: 0,
    specialNotes: '',
    orderSource: 'Walk-in / Phone'
  });

  // Load orders on mount and listen to changes
  useEffect(() => {
    const load = () => setOrders(getOrders());
    load();
    window.addEventListener('shn_orders_updated', load);
    return () => window.removeEventListener('shn_orders_updated', load);
  }, []);

  // Handle PIN verification
  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    const currentPin = getAdminPin();
    if (pinInput.trim() === currentPin) {
      setIsAuthenticated(true);
      setPinError(false);
      if (rememberMe) {
        setSessionAuthenticated(true);
      }
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionAuthenticated(false);
    setPinInput('');
  };

  // Handle Change PIN
  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPinValue.trim().length >= 4) {
      setAdminPin(newPinValue.trim());
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setIsPinSettingsOpen(false);
        setNewPinValue('');
      }, 1500);
    }
  };

  // Handle Status Update
  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
  };

  // Handle Payment Status Update
  const handlePaymentChange = (orderId, newPaymentStatus) => {
    updateOrder(orderId, { paymentStatus: newPaymentStatus });
  };

  // Handle Notes Update
  const handleNotesChange = (orderId, newNotes) => {
    updateOrder(orderId, { specialNotes: newNotes });
  };

  // Handle Order Deletion
  const handleDeleteOrder = (orderId) => {
    deleteOrder(orderId);
    setDeleteConfirmId(null);
    if (receiptOrder && receiptOrder.id === orderId) {
      setReceiptOrder(null);
    }
  };

  // Handle Manual Order Submission
  const handleCreateNewOrder = (e) => {
    e.preventDefault();
    if (!newOrderForm.farmerName.trim() || !newOrderForm.mobileNumber.trim()) {
      alert('कृपया शेतकऱ्याचे नाव आणि मोबाईल नंबर टाका.');
      return;
    }

    const qty = Number(newOrderForm.quantity) || 1000;
    const rate = Number(newOrderForm.ratePerPlant) || 12;
    const total = qty * rate;
    const adv = Number(newOrderForm.advancePaid) || 0;
    let payStat = 'Unpaid';
    if (adv >= total && total > 0) payStat = 'Full Paid';
    else if (adv > 0) payStat = 'Advance Received';

    saveOrder({
      farmerName: newOrderForm.farmerName.trim(),
      mobileNumber: newOrderForm.mobileNumber.trim(),
      villageTaluka: newOrderForm.villageTaluka.trim(),
      district: newOrderForm.district,
      variety: newOrderForm.variety,
      varietyId: newOrderForm.varietyId,
      quantity: qty,
      trays: Math.ceil(qty / 104),
      acres: newOrderForm.acres,
      deliveryMethod: newOrderForm.deliveryMethod,
      preferredDate: newOrderForm.preferredDate || 'लवकरात लवकर',
      estimatedTotal: `₹${total.toLocaleString('en-IN')}`,
      totalAmount: total,
      advancePaid: adv,
      paymentStatus: payStat,
      status: 'Pending',
      specialNotes: newOrderForm.specialNotes.trim(),
      orderSource: newOrderForm.orderSource
    });

    setIsNewOrderModalOpen(false);
    // Reset form
    setNewOrderForm({
      farmerName: '',
      mobileNumber: '',
      villageTaluka: '',
      district: 'Dharashiv',
      variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)',
      varietyId: 'papaya-15',
      quantity: 1000,
      acres: '1.0',
      deliveryMethod: 'नर्सरीतून स्वतः नेणार (Self-Pickup)',
      preferredDate: '',
      ratePerPlant: 12,
      advancePaid: 0,
      specialNotes: '',
      orderSource: 'Walk-in / Phone'
    });
  };

  // WhatsApp Message Generator for Admin Quick Reply
  const sendWhatsAppUpdate = (order, type = 'confirm') => {
    let message = '';
    const cleanPhone = order.mobileNumber.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    if (type === 'confirm') {
      message = encodeURIComponent(
        `🌱 *शंकरायण हायटेक नर्सरी - ऑर्डर निश्चिती पावती*\n` +
        `-----------------------------------------\n` +
        `नमस्कार ${order.farmerName} जी,\n` +
        `आपली रोपांची ऑर्डर यशस्वीरित्या नोंदवली आहे.\n\n` +
        `📋 *बुकिंग क्रमांक:* ${order.id}\n` +
        `🌿 *वाण:* ${order.variety}\n` +
        `🔢 *संख्या:* ${order.quantity?.toLocaleString('en-IN')} रोपे (~${order.trays} ट्रे)\n` +
        `🌾 *क्षेत्र:* ${order.acres} एकर\n` +
        `💰 *अंदाजे रक्कम:* ${order.estimatedTotal}\n` +
        `🚚 *वितरण पद्धत:* ${order.deliveryMethod}\n` +
        `📅 *अपेक्षित तारीख:* ${order.preferredDate}\n` +
        `-----------------------------------------\n` +
        `पत्ता: मु. पो. येडशी (बार्शी रोड), ता. जि. धाराशिव\n` +
        `संपर्क: +91 9657523258 / शंकरायण हायटेक नर्सरी.`
      );
    } else if (type === 'ready') {
      message = encodeURIComponent(
        `🌱 *शंकरायण हायटेक नर्सरी - रोपे तयार असल्याचा संदेश*\n` +
        `-----------------------------------------\n` +
        `नमस्कार ${order.farmerName} जी,\n` +
        `आपल्या बुकिंग क्रमांकाची (${order.id}) *${order.variety}* रोपे नर्सरीमध्ये उचलण्यासाठी / पाठवण्यासाठी पूर्णपणे तयार आहेत.\n\n` +
        `🔢 *संख्या:* ${order.quantity?.toLocaleString('en-IN')} रोपे (~${order.trays} ट्रे)\n` +
        `कृपया लवकरात लवकर नर्सरीशी संपर्क साधून गाडीचे नियोजन करावे.\n\n` +
        `संपर्क: +91 9657523258 / शंकरायण हायटेक नर्सरी.`
      );
    }

    window.open(`https://wa.me/${phoneWithCode}?text=${message}`, '_blank');
  };

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status Filter
      if (statusFilter !== 'ALL' && ord.status !== statusFilter) {
        return false;
      }
      // Variety Filter
      if (varietyFilter !== 'ALL' && ord.varietyId !== varietyFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = ord.farmerName?.toLowerCase().includes(query);
        const matchPhone = ord.mobileNumber?.includes(query);
        const matchId = ord.id?.toLowerCase().includes(query);
        const matchVillage = ord.villageTaluka?.toLowerCase().includes(query);
        const matchDistrict = ord.district?.toLowerCase().includes(query);
        const matchVariety = ord.variety?.toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchId && !matchVillage && !matchDistrict && !matchVariety) {
          return false;
        }
      }
      return true;
    });
  }, [orders, statusFilter, varietyFilter, searchQuery]);

  // Overall Metrics Calculation
  const metrics = useMemo(() => {
    let totalPlants = 0;
    let totalTrays = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let readyCount = 0;
    let completedCount = 0;
    let totalRevenueEst = 0;

    orders.forEach((o) => {
      const q = Number(o.quantity) || 0;
      totalPlants += q;
      totalTrays += (o.trays || Math.ceil(q / 104));
      
      if (o.status === 'Pending') pendingCount++;
      else if (o.status === 'Confirmed') confirmedCount++;
      else if (o.status === 'Ready') readyCount++;
      else if (o.status === 'Completed') completedCount++;

      if (o.totalAmount) {
        totalRevenueEst += Number(o.totalAmount);
      } else {
        totalRevenueEst += q * 12;
      }
    });

    return {
      totalOrders: orders.length,
      totalPlants,
      totalTrays,
      pendingCount,
      confirmedCount,
      readyCount,
      completedCount,
      totalRevenueEst
    };
  }, [orders]);

  // Helper for Status Badge Color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Ready':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusLabelMarathi = (status) => {
    switch (status) {
      case 'Pending': return 'प्रलंबित (Pending)';
      case 'Confirmed': return 'निश्चित (Confirmed)';
      case 'Ready': return 'तयार (Ready for Dispatch)';
      case 'Completed': return 'पूर्ण (Completed)';
      case 'Cancelled': return 'रद्द (Cancelled)';
      default: return status;
    }
  };

  // If NOT Authenticated, show Security PIN Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-[36px] border border-white/80 bg-white/90 shadow-2xl text-slate-800 relative overflow-hidden"
        >
          {/* Top Edge Specular Glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-500" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-700 shadow-inner">
              <FaLock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black font-poppins text-slate-900 tracking-tight">
              {lang === 'mr' ? 'प्रशासक प्रवेश (Admin Access)' : 'Admin Login'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {lang === 'mr' 
                ? 'शंकरायण हायटेक नर्सरी - प्राप्त ऑर्डर्स पाहण्यासाठी ४-अंकी पिन टाका' 
                : 'Enter your 4-digit PIN to access orders dashboard'}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {lang === 'mr' ? '४-अंकी सिक्युरिटी पिन (PIN)' : '4-Digit PIN'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  autoFocus
                  placeholder="••••"
                  className={`w-full text-center text-3xl tracking-[0.6em] font-mono py-3.5 px-4 rounded-2xl bg-white border ${
                    pinError ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  } outline-none shadow-sm transition-all`}
                />
              </div>
              {pinError && (
                <p className="text-xs font-semibold text-rose-600 mt-2 text-center">
                  {lang === 'mr' ? '❌ चुकीचा पिन! कृपया पुन्हा प्रयत्न करा.' : '❌ Incorrect PIN. Please try again.'}
                </p>
              )}
            </div>

            {/* Hint for demo & convenience */}
            <div className="text-center">
              <span className="inline-block text-xs text-slate-500 bg-emerald-50 border border-emerald-200/60 rounded-lg px-3 py-1">
                {lang === 'mr' ? 'डिफॉल्ट पिन (Default PIN): ' : 'Default PIN: '} 
                <strong className="text-emerald-800 font-mono">1234</strong>
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{lang === 'mr' ? 'या ब्राउझरवर लॉगइन लक्षात ठेवा' : 'Remember on this device'}</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#164d1a] hover:to-[#246328] text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FaUnlock className="w-4 h-4" />
              <span>{lang === 'mr' ? 'डॅशबोर्ड उघडा (Login)' : 'Unlock Dashboard'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <FaArrowLeft className="w-3 h-3" />
                <span>{lang === 'mr' ? 'वेबसाईटवर परत जा' : 'Back to Website'}</span>
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100/95 backdrop-blur-2xl text-slate-800 overflow-hidden font-inter">
      
      {/* Top Glass Navigation Bar */}
      <header className="shrink-0 glass-panel border-b border-slate-200/80 bg-white/85 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="Shankarayan Hytec" 
            className="w-10 h-10 rounded-full object-contain shadow-sm" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 font-poppins text-lg sm:text-xl tracking-tight">
                {lang === 'mr' ? 'शंकरायण हायटेक नर्सरी' : 'Shankarayan Hytec'}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white rounded-md">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'mr' ? 'प्राप्त ऑर्डर्स व्यवस्थापन प्रणाली (Received Orders Portal)' : 'Orders Management & Dispatch Portal'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Manual Order Button */}
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            title="नवीन ऑफलाइन ऑर्डर नोंदवा"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{lang === 'mr' ? 'नवीन ऑर्डर नोंदवा' : 'New Order'}</span>
          </button>

          {/* Export to CSV */}
          <button
            onClick={exportOrdersToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold shadow-sm transition-all"
            title="Excel / CSV डाऊनलोड करा"
          >
            <FaFileExport className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{lang === 'mr' ? 'CSV डाऊनलोड' : 'Export CSV'}</span>
          </button>

          {/* PIN Settings */}
          <button
            onClick={() => setIsPinSettingsOpen(true)}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 text-xs font-bold transition-all"
            title="पिन बदला (Change PIN)"
          >
            <FaKey className="w-3.5 h-3.5" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all"
            title="लॉगआउट (Logout)"
          >
            <FaSignOutAlt className="w-3.5 h-3.5" />
          </button>

          {/* Close Panel & Back to Site */}
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all ml-1"
            >
              <FaTimes className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'mr' ? 'वेबसाईटवर जा' : 'Close'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Dashboard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Card 1: Total Orders */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'mr' ? 'एकूण ऑर्डर्स' : 'Total Orders'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-poppins mt-1">
                {metrics.totalOrders}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FaLayerGroup className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Seedlings */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'mr' ? 'एकूण रोपे मागणी' : 'Total Seedlings'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-poppins mt-1">
                {metrics.totalPlants.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] font-semibold text-slate-500">
                (~{metrics.totalTrays} ट्रे)
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center">
              <FaSeedling className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Pending Action */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {lang === 'mr' ? 'प्रलंबित चौकशी' : 'Pending Review'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 font-poppins mt-1">
                {metrics.pendingCount}
              </p>
              <span className="text-[11px] font-semibold text-amber-700/80">
                {lang === 'mr' ? 'कॉल / संपर्क आवश्यक' : 'Follow-up required'}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaClock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Confirmed & Ready */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                {lang === 'mr' ? 'निश्चित व तयार' : 'Confirmed / Ready'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-blue-600 font-poppins mt-1">
                {metrics.confirmedCount + metrics.readyCount}
              </p>
              <span className="text-[11px] font-semibold text-blue-600">
                {metrics.readyCount} {lang === 'mr' ? 'उचलीसाठी तयार' : 'Ready for pickup'}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Card 5: Estimated Revenue */}
          <div className="col-span-2 lg:col-span-1 glass-panel p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'mr' ? 'अंदाजे उलाढाल' : 'Est. Revenue'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-poppins mt-1">
                ₹{(metrics.totalRevenueEst / 100000).toFixed(2)}L
              </p>
              <span className="text-[11px] font-semibold text-slate-500">
                ₹{metrics.totalRevenueEst.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FaMoneyBillWave className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Filter Controls & Search */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/85 shadow-sm space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'mr' ? 'शेतकऱ्याचे नाव, मोबाईल, गाव किंवा आयडी शोधा...' : 'Search by farmer name, phone, village, or ID...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Variety Selector Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={varietyFilter}
                onChange={(e) => setVarietyFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="ALL">{lang === 'mr' ? 'सर्व ऑर्डर्स (All Orders)' : 'All Orders'}</option>
                <option value="papaya-15">ओरिजनल १५ नंबर पपई (Papaya 15 No.)</option>
              </select>

              {/* Reset to sample data button */}
              <button
                onClick={() => {
                  if (window.confirm(lang === 'mr' ? 'डेमो ऑर्डर्स पुन्हा रीसेट करायच्या आहेत का?' : 'Reset to sample orders?')) {
                    resetSampleOrders();
                  }
                }}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 text-xs transition-colors"
                title="डेमो ऑर्डर्स रीसेट करा (Reset Demo Data)"
              >
                <FaUndoAlt className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {[
              { id: 'ALL', label: lang === 'mr' ? 'सर्व ऑर्डर्स' : 'All Orders', count: orders.length },
              { id: 'Pending', label: lang === 'mr' ? 'प्रलंबित' : 'Pending', count: metrics.pendingCount, color: 'text-amber-700' },
              { id: 'Confirmed', label: lang === 'mr' ? 'निश्चित' : 'Confirmed', count: metrics.confirmedCount, color: 'text-emerald-700' },
              { id: 'Ready', label: lang === 'mr' ? 'तयार' : 'Ready', count: metrics.readyCount, color: 'text-blue-700' },
              { id: 'Completed', label: lang === 'mr' ? 'पूर्ण' : 'Completed', count: metrics.completedCount, color: 'text-teal-700' },
              { id: 'Cancelled', label: lang === 'mr' ? 'रद्द' : 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length, color: 'text-rose-700' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Orders List / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/80 bg-white/60 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FaSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 font-poppins">
              {lang === 'mr' ? 'कोणतीही ऑर्डर आढळली नाही' : 'No Orders Found'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {lang === 'mr' ? 'तुमच्या फिल्टर किंवा शोध निकषाशी जुळणारी कोणतीही ऑर्डर उपलब्ध नाही.' : 'No orders match your filter criteria or search query.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setVarietyFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-block"
            >
              {lang === 'mr' ? 'फिल्टर साफ करा' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDeleting = deleteConfirmId === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/85 bg-white/90 shadow-md hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    
                    {/* ID & Date */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                        {order.id}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                        {order.date}
                      </span>
                      {order.orderSource && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                          {order.orderSource}
                        </span>
                      )}
                    </div>

                    {/* Status Changer & Payment Pill */}
                    <div className="flex items-center gap-2">
                      {/* Payment Status Dropdown */}
                      <select
                        value={order.paymentStatus || 'Unpaid'}
                        onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${
                          order.paymentStatus === 'Full Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.paymentStatus === 'Advance Received'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Unpaid">रक्कम बाकी (Unpaid)</option>
                        <option value="Advance Received">ॲडव्हान्स जमा (Advance)</option>
                        <option value="Full Paid">पूर्ण जमा (Full Paid)</option>
                      </select>

                      {/* Order Status Dropdown */}
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-black px-3 py-1.5 rounded-xl border font-poppins focus:outline-none transition-all shadow-sm ${getStatusBadge(order.status)}`}
                      >
                        <option value="Pending">🟡 प्रलंबित (Pending)</option>
                        <option value="Confirmed">🟢 निश्चित (Confirmed)</option>
                        <option value="Ready">🔵 उचलण्यासाठी तयार (Ready)</option>
                        <option value="Completed">🟣 पूर्ण झाले (Completed)</option>
                        <option value="Cancelled">🔴 रद्द (Cancelled)</option>
                      </select>
                    </div>

                  </div>

                  {/* Main Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    
                    {/* Farmer Details (Col 1-4) */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          <FaUserCheck />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                            {order.farmerName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`tel:${order.mobileNumber}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md"
                            >
                              <FaPhoneAlt className="w-2.5 h-2.5" />
                              {order.mobileNumber}
                            </a>
                            {order.otpVerified ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                <FaCheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                                <span>OTP Verified</span>
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-1.5">
                            <FaMapMarkerAlt className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{order.villageTaluka}, {order.district}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Plant & Order Specs (Col 5-8) */}
                    <div className="md:col-span-5 space-y-1.5 bg-slate-50/75 p-3.5 rounded-2xl border border-slate-100 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">निवडलेला वाण:</span>
                        <span className="font-extrabold text-slate-900">{order.variety}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">रोपांची संख्या:</span>
                        <span className="font-black text-emerald-700 text-sm">
                          {Number(order.quantity)?.toLocaleString('en-IN')} रोपे
                          <span className="text-[11px] font-medium text-slate-500 ml-1">
                            (~{order.trays || Math.ceil(order.quantity / 104)} ट्रे)
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">शेत क्षेत्र / वितरण:</span>
                        <span className="font-semibold text-slate-800">
                          {order.acres} एकर | {order.deliveryMethod}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">अपेक्षित तारीख:</span>
                        <span className="font-bold text-slate-900">{order.preferredDate}</span>
                      </div>
                    </div>

                    {/* Pricing & Amount (Col 9-12) */}
                    <div className="md:col-span-3 space-y-1 text-right sm:text-right">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        अंदाजे रक्कम
                      </span>
                      <p className="text-xl font-black text-slate-900 font-poppins">
                        {order.estimatedTotal || `₹${(order.quantity * 12).toLocaleString('en-IN')}`}
                      </p>
                      {order.advancePaid > 0 && (
                        <p className="text-xs font-semibold text-emerald-700">
                          ॲडव्हान्स: ₹{order.advancePaid.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Special Notes if available */}
                  {order.specialNotes && (
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900">
                      <strong className="font-bold">टीप / शेरा: </strong>
                      {order.specialNotes}
                    </div>
                  )}

                  {/* Card Action Buttons Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    
                    {/* Direct Contact Group */}
                    <div className="flex items-center gap-2">
                      {/* WhatsApp Confirm */}
                      <button
                        onClick={() => sendWhatsAppUpdate(order, 'confirm')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-extrabold transition-all"
                        title="शेतकऱ्याला व्हॉट्सॲपवर ऑर्डर कन्फर्मेशन पाठवा"
                      >
                        <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                        <span>कन्फर्म करा (WhatsApp)</span>
                      </button>

                      {/* WhatsApp Ready for Pickup */}
                      <button
                        onClick={() => sendWhatsAppUpdate(order, 'ready')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all"
                        title="रोपे तयार असल्याचा व्हॉट्सॲप मेसेज"
                      >
                        <FaTruck className="w-3.5 h-3.5" />
                        <span>रोपे तयार मेसेज</span>
                      </button>

                      {/* Phone Call */}
                      <a
                        href={`tel:${order.mobileNumber}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                      >
                        <FaPhoneAlt className="w-3 h-3 text-slate-500" />
                        <span>कॉल करा</span>
                      </a>
                    </div>

                    {/* Receipt & Management Group */}
                    <div className="flex items-center gap-2">
                      {/* Printable Receipt */}
                      <button
                        onClick={() => setReceiptOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all"
                      >
                        <FaPrint className="w-3.5 h-3.5 text-emerald-600" />
                        <span>पावती पहा / प्रिंट</span>
                      </button>

                      {/* Delete */}
                      {isDeleting ? (
                        <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-xl p-1">
                          <span className="text-[11px] font-bold text-rose-700 px-1">खरेच हटवायचे?</span>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold"
                          >
                            होय
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-bold"
                          >
                            रद्द
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(order.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="ऑर्डर हटवा"
                        >
                          <FaTrashAlt className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================== */}
      {/* MODAL 1: PRINTABLE ORDER RECEIPT / INVOICE VIEW */}
      {/* ========================================================== */}
      <AnimatePresence>
        {receiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 my-8 print:m-0 print:p-0 print:border-none print:shadow-none"
            >
              {/* Receipt Header for Print */}
              <div className="border-b-2 border-emerald-600 pb-4 mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
                    <h2 className="text-xl sm:text-2xl font-black font-poppins text-slate-900 tracking-tight">
                      शंकरायण हायटेक नर्सरी
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    मु. पो. येडशी (बार्शी रोड), ता. जि. धाराशिव (उस्मानाबाद) | मो. ९६५७५२३२५८
                  </p>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    विशेषज्ञ: ओरिजनल १५ नंबर पपई व उच्च दर्जाची फळझाड रोपे
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-lg font-mono">
                    {receiptOrder.id}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">तारीख: {receiptOrder.date}</p>
                </div>
              </div>

              {/* Farmer & Order Information Table */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">शेतकऱ्याचे नाव</span>
                  <p className="font-extrabold text-sm text-slate-900 mt-0.5">{receiptOrder.farmerName}</p>
                  <p className="text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                    <span>मोबाईल: {receiptOrder.mobileNumber}</span>
                    {receiptOrder.otpVerified && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                        OTP Verified
                      </span>
                    )}
                  </p>
                  <p className="text-slate-600">गाव / तालुका: {receiptOrder.villageTaluka}</p>
                  <p className="text-slate-600">जिल्हा: {receiptOrder.district}</p>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">वितरण व स्थिती तपशील</span>
                  <p className="font-semibold text-slate-800 mt-0.5">पद्धत: {receiptOrder.deliveryMethod}</p>
                  <p className="text-slate-600">अपेक्षित तारीख: {receiptOrder.preferredDate}</p>
                  <p className="text-slate-600">ऑर्डर स्थिती: <strong className="text-emerald-700">{getStatusLabelMarathi(receiptOrder.status)}</strong></p>
                  <p className="text-slate-600">पेमेंट स्थिती: <strong>{receiptOrder.paymentStatus}</strong></p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">तपशील (Variety)</th>
                      <th className="p-3 text-center">संख्या (Qty)</th>
                      <th className="p-3 text-center">ट्रे संख्या</th>
                      <th className="p-3 text-center">शेत क्षेत्र</th>
                      <th className="p-3 text-right">रक्कम (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">{receiptOrder.variety}</td>
                      <td className="p-3 text-center font-black text-emerald-700">{receiptOrder.quantity?.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center text-slate-600">{receiptOrder.trays} ट्रे</td>
                      <td className="p-3 text-center text-slate-600">{receiptOrder.acres} एकर</td>
                      <td className="p-3 text-right font-black text-slate-900">{receiptOrder.estimatedTotal}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                    <tr>
                      <td colSpan={4} className="p-3 text-right text-slate-700">एकूण अंदाजे रक्कम:</td>
                      <td className="p-3 text-right text-base text-slate-900 font-black font-poppins">{receiptOrder.estimatedTotal}</td>
                    </tr>
                    {receiptOrder.advancePaid > 0 && (
                      <tr>
                        <td colSpan={4} className="p-2.5 text-right text-emerald-700">जमा ॲडव्हान्स:</td>
                        <td className="p-2.5 text-right text-emerald-700 font-bold">₹{receiptOrder.advancePaid.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {receiptOrder.specialNotes && (
                <div className="mb-6 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200">
                  <span className="font-bold">विशेष टीप: </span>
                  {receiptOrder.specialNotes}
                </div>
              )}

              {/* Terms & Nursery Seal / Sign */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 items-end">
                <div>
                  <p className="font-bold text-slate-700 mb-1">नियम व अटी:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>रोपे उचलीच्या वेळी संपूर्ण तपासणी करून घ्यावी.</li>
                    <li>गाडी भाडे व वाहतूक व्यवस्था शेतकऱ्याने ठरवायची आहे.</li>
                    <li>नर्सरीमार्फत योग्य लागवड मार्गदर्शन मोफत दिले जाईल.</li>
                  </ul>
                </div>
                <div className="text-right">
                  <div className="h-12 flex items-end justify-end">
                    <span className="font-dancing text-lg font-bold text-slate-700">Shankarayan Nursery</span>
                  </div>
                  <p className="font-bold text-slate-800 border-t border-slate-300 pt-1 inline-block">
                    अधिकृत स्वाक्षरी / शिक्का
                  </p>
                </div>
              </div>

              {/* Modal Control Buttons (Hidden when printing) */}
              <div className="mt-8 flex items-center justify-end gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => setReceiptOrder(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  बंद करा
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-2"
                >
                  <FaPrint />
                  <span>प्रिंट / PDF सेव्ह करा</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* MODAL 2: CREATE MANUAL / WALK-IN ORDER */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 my-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <FaPlus />
                  </div>
                  <h3 className="font-extrabold text-slate-900 font-poppins text-lg">
                    नवीन ऑर्डर नोंदवा (New Manual Order)
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateNewOrder} className="space-y-4 mt-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">शेतकऱ्याचे नाव *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. रमेश शिंदे"
                      value={newOrderForm.farmerName}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, farmerName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">मोबाईल नंबर *</label>
                    <input
                      type="tel"
                      required
                      placeholder="उदा. 9822XXXXXX"
                      value={newOrderForm.mobileNumber}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, mobileNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">गाव व तालुका</label>
                    <input
                      type="text"
                      placeholder="उदा. येडशी, धाराशिव"
                      value={newOrderForm.villageTaluka}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, villageTaluka: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">जिल्हा</label>
                    <select
                      value={newOrderForm.district}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value="Dharashiv">धाराशिव (उस्मानाबाद)</option>
                      <option value="Solapur">सोलापूर</option>
                      <option value="Latur">लातूर</option>
                      <option value="Beed">बीड</option>
                      <option value="Pune">पुणे</option>
                      <option value="Ahilyanagar">अहिल्यानगर (अहमदनगर)</option>
                      <option value="Satara">सातारा</option>
                      <option value="Chhatrapati Sambhajinagar">छत्रपती संभाजीनगर</option>
                      <option value="Other">इतर (Other)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">पपई वाण</label>
                    <select
                      value={newOrderForm.varietyId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewOrderForm({ 
                          ...newOrderForm, 
                          varietyId: val, 
                          variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)', 
                          ratePerPlant: 12 
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold"
                    >
                      <option value="papaya-15">ओरिजनल १५ नंबर पपई (Papaya 15 No.) - ₹12/रोप</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">रोपांची संख्या (Plants)</label>
                    <input
                      type="number"
                      step={100}
                      value={newOrderForm.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setNewOrderForm({
                          ...newOrderForm,
                          quantity: val,
                          acres: (val / 1000).toFixed(1)
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">शेत क्षेत्र (एकर)</label>
                    <input
                      type="text"
                      value={newOrderForm.acres}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, acres: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">वितरण पद्धत</label>
                    <select
                      value={newOrderForm.deliveryMethod}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, deliveryMethod: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    >
                      <option value="नर्सरीतून स्वतः नेणार (Self-Pickup)">नर्सरीतून स्वतः नेणार</option>
                      <option value="गाडीने पाठवणे (Transport Delivery)">गाडीने पाठवणे</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">अपेक्षित तारीख</label>
                    <input
                      type="date"
                      value={newOrderForm.preferredDate}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, preferredDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">दर प्रति रोप (₹)</label>
                    <input
                      type="number"
                      value={newOrderForm.ratePerPlant}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, ratePerPlant: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">जमा ॲडव्हान्स (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newOrderForm.advancePaid}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, advancePaid: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">विशेष शेरा / टीप</label>
                  <textarea
                    rows={2}
                    placeholder="उदा. गाडी नंबर, ड्रिपची माहिती किंवा विशेष सूचना"
                    value={newOrderForm.specialNotes}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, specialNotes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    रद्द करा
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md"
                  >
                    ऑर्डर सेव्ह करा
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* MODAL 3: CHANGE PIN SETTINGS */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isPinSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-black text-slate-900 text-base font-poppins flex items-center gap-2">
                  <FaKey className="text-emerald-600" />
                  <span>पिन बदला (Change Admin PIN)</span>
                </h4>
                <button onClick={() => setIsPinSettingsOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleChangePin} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">नवीन ४-अंकी किंवा ६-अंकी पिन</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    maxLength={8}
                    placeholder="नवीन पिन टाका"
                    value={newPinValue}
                    onChange={(e) => setNewPinValue(e.target.value)}
                    className="w-full text-center text-xl font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {pinChangeSuccess && (
                  <p className="text-emerald-600 font-bold text-center">
                    ✅ पिन यशस्वीरित्या बदलला आहे!
                  </p>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPinSettingsOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                  >
                    रद्द करा
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black"
                  >
                    पिन सेव्ह करा
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
