import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMobileAlt, 
  FaCheckCircle, 
  FaUser, 
  FaLock, 
  FaTimes, 
  FaSignOutAlt, 
  FaSeedling, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaRedoAlt,
  FaReceipt
} from 'react-icons/fa';
import { 
  getCurrentUser, 
  sendOtp, 
  verifyOtp, 
  logoutUser, 
  getUserOrders 
} from '../utils/userAuth';

export default function UserAuthModal({ 
  isOpen, 
  onClose, 
  initialMobile = '', 
  initialName = '', 
  onLoginSuccess,
  isCompulsoryForOrder = false,
  lang = 'mr' 
}) {
  // Current user state
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  
  // Form Steps: 'mobile' -> 'otp' -> 'account'
  const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState(initialMobile);
  const [farmerName, setFarmerName] = useState(initialName);
  const [otpValue, setOtpValue] = useState('');
  
  // Feedback & Timers
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Simulated SMS Toast Notification
  const [smsNotification, setSmsNotification] = useState(null);

  // Orders for logged in user
  const [userOrders, setUserOrders] = useState([]);

  const otpInputRef = useRef(null);

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      setCurrentUser(user);
      setErrorMessage('');
      setSuccessMessage('');

      if (user) {
        setStep('account');
        setUserOrders(getUserOrders(user.mobile));
      } else {
        setStep('mobile');
        if (initialMobile) setMobileNumber(initialMobile);
        if (initialName) setFarmerName(initialName);
      }
    }
  }, [isOpen, initialMobile, initialName]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Listen to simulated OTP dispatch
  useEffect(() => {
    const handleOtpSent = (e) => {
      const { mobile, code } = e.detail;
      setSmsNotification({ mobile, code });
    };

    window.addEventListener('shn_otp_dispatched', handleOtpSent);
    return () => window.removeEventListener('shn_otp_dispatched', handleOtpSent);
  }, []);

  // Timer countdown for resend OTP
  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(lang === 'mr' ? 'कृपया १०-अंकी वैध मोबाईल नंबर टाका.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const res = sendOtp(cleanPhone);
      setIsSending(false);

      if (res.success) {
        setStep('otp');
        setCountdown(30);
        setCanResend(false);
        setOtpValue('');
        setTimeout(() => {
          if (otpInputRef.current) otpInputRef.current.focus();
        }, 100);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (otpValue.trim().length < 4) {
      setErrorMessage(lang === 'mr' ? 'कृपया ४-अंकी OTP टाका.' : 'Please enter 4-digit OTP.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const res = verifyOtp(mobileNumber, otpValue.trim(), farmerName);
      setIsVerifying(false);

      if (res.success) {
        setCurrentUser(res.user);
        setSuccessMessage(lang === 'mr' ? 'मोबाईल पडताळणी पूर्ण झाली!' : 'Phone verified successfully!');
        setSmsNotification(null);

        // Notify callback if triggered by booking checkout
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }

        setTimeout(() => {
          setSuccessMessage('');
          if (isCompulsoryForOrder) {
            onClose();
          } else {
            setStep('account');
            setUserOrders(getUserOrders(res.user.mobile));
          }
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setStep('mobile');
    setMobileNumber('');
    setFarmerName('');
    setUserOrders([]);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-2xl overflow-y-auto">
      
      {/* Simulated SMS Push Notification Banner */}
      <AnimatePresence>
        {smsNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-60 max-w-sm w-[92%] bg-slate-900/95 text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex items-start gap-3 cursor-pointer"
            onClick={() => {
              setOtpValue(smsNotification.code);
              setSmsNotification(null);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <FaMobileAlt className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-400">
                <span>📲 SMS: शंकरायण हायटेक नर्सरी</span>
                <span className="text-[10px] text-slate-400">आत्ताच</span>
              </div>
              <p className="text-slate-200 mt-1 leading-relaxed">
                आपला पडताळणी OTP कोड आहे: <strong className="text-emerald-300 font-mono text-sm underline">{smsNotification.code}</strong>.
              </p>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                👉 येथे क्लिक करा आणि OTP आपोआप भरा (Auto-fill)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="w-full max-w-md bg-white/95 rounded-[36px] p-6 sm:p-8 shadow-2xl border border-white/90 text-slate-800 relative overflow-hidden backdrop-blur-3xl"
      >
        {/* Specular Green Emerald Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>

        {/* ========================================================= */}
        {/* VIEW 1: ENTER MOBILE NUMBER */}
        {/* ========================================================= */}
        {step === 'mobile' && (
          <div className="space-y-5">
            <div className="text-center pt-2">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-700 shadow-inner">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black font-poppins text-slate-900 tracking-tight">
                {isCompulsoryForOrder
                  ? (lang === 'mr' ? 'ऑर्डर कन्फर्म करण्यासाठी लॉगिन' : 'Verify Phone to Confirm Order')
                  : (lang === 'mr' ? 'शेतकरी लॉगिन (OTP)' : 'Farmer Login')}
              </h2>
              <p className="text-slate-500 text-xs mt-1.5">
                {isCompulsoryForOrder
                  ? (lang === 'mr' ? 'ऑर्डर नोंदणीसाठी मोबाईल नंबर पडताळणी करणे बंधनकारक आहे.' : 'Mobile OTP verification is mandatory to confirm your booking.')
                  : (lang === 'mr' ? 'तुमच्या रोपांच्या बुकिंगची स्थिती पाहण्यासाठी मोबाईल नंबर टाका.' : 'Enter your mobile number to view and track your orders.')}
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'mr' ? 'शेतकऱ्याचे नाव' : 'Farmer Full Name'}
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    required
                    placeholder={lang === 'mr' ? 'उदा. रमेश पांडुरंग शिंदे' : 'e.g. Ramesh Shinde'}
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'mr' ? 'मोबाईल नंबर (१० अंकी) *' : 'Mobile Number (10 Digits) *'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    autoFocus
                    placeholder="98XXXXXXXX"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setMobileNumber(val);
                      setErrorMessage('');
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-base font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-rose-600 text-center bg-rose-50 py-2 px-3 rounded-xl border border-rose-200">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending || mobileNumber.length < 10}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#164d1a] hover:to-[#246328] disabled:opacity-50 text-white font-black text-sm tracking-wide shadow-md shadow-emerald-900/20 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <span>{lang === 'mr' ? 'OTP पाठवत आहे...' : 'Sending OTP...'}</span>
                ) : (
                  <>
                    <FaMobileAlt />
                    <span>{lang === 'mr' ? 'OTP मिळवा (Send OTP)' : 'Send OTP'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: ENTER OTP */}
        {/* ========================================================= */}
        {step === 'otp' && (
          <div className="space-y-5">
            <div className="text-center pt-2">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-700 shadow-inner">
                <FaLock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black font-poppins text-slate-900 tracking-tight">
                {lang === 'mr' ? 'OTP प्रविष्ट करा' : 'Enter OTP'}
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {lang === 'mr' ? '+91' : '+91'} <strong className="text-slate-800 font-mono">{mobileNumber}</strong> {lang === 'mr' ? 'वर पाठवलेला ४-अंकी कोड टाका.' : 'enter the 4-digit code sent to your phone.'}
              </p>
              <button
                type="button"
                onClick={() => setStep('mobile')}
                className="text-[11px] text-emerald-700 hover:underline font-bold mt-1 inline-block"
              >
                {lang === 'mr' ? 'मोबाईल नंबर बदला (Edit Number)' : 'Edit Number'}
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  ref={otpInputRef}
                  type="text"
                  maxLength={4}
                  autoFocus
                  value={otpValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtpValue(val);
                    setErrorMessage('');
                  }}
                  placeholder="••••"
                  className="w-full text-center text-3xl tracking-[0.6em] font-mono py-3.5 px-4 rounded-2xl bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm transition-all"
                />
              </div>

              {/* Quick Demo Hint */}
              <div className="text-center">
                <span className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  {lang === 'mr' ? 'डेमो OTP कोड: ' : 'Demo OTP code: '} 
                  <button 
                    type="button" 
                    onClick={() => setOtpValue('1234')} 
                    className="font-mono font-bold text-emerald-700 underline"
                  >
                    1234
                  </button>
                </span>
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-rose-600 text-center bg-rose-50 py-2 px-3 rounded-xl border border-rose-200">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="text-xs font-bold text-emerald-700 text-center bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
                  <FaCheckCircle className="text-emerald-600" />
                  <span>{successMessage}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || otpValue.length < 4}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#164d1a] hover:to-[#246328] disabled:opacity-50 text-white font-black text-sm tracking-wide shadow-md shadow-emerald-900/20 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <span>{lang === 'mr' ? 'पडताळणी चालू आहे...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>
                      {isCompulsoryForOrder
                        ? (lang === 'mr' ? 'पडताळणी करून ऑर्डर पूर्ण करा' : 'Verify & Place Order')
                        : (lang === 'mr' ? 'पडताळणी करा (Verify OTP)' : 'Verify OTP')}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 mx-auto"
                  >
                    <FaRedoAlt className="w-3 h-3" />
                    <span>{lang === 'mr' ? 'OTP पुन्हा पाठवा (Resend OTP)' : 'Resend OTP'}</span>
                  </button>
                ) : (
                  <span className="text-slate-400 mx-auto">
                    {lang === 'mr' ? `पुन्हा OTP पाठवण्यासाठी ${countdown} सेकंद प्रतीक्षा करा` : `Resend OTP in ${countdown}s`}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: ACCOUNT & PAST ORDERS (WHEN LOGGED IN) */}
        {/* ========================================================= */}
        {step === 'account' && currentUser && (
          <div className="space-y-5">
            {/* Header User Badge */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-800/20">
                  {currentUser.name?.charAt(0) || '👤'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base font-poppins">
                      {currentUser.name}
                    </h3>
                    <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-md">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono font-medium">
                    +91 {currentUser.mobile}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                title="लॉगआउट (Logout)"
              >
                <FaSignOutAlt className="w-4 h-4" />
              </button>
            </div>

            {/* My Seedling Bookings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm font-poppins flex items-center gap-1.5">
                  <FaSeedling className="text-emerald-600" />
                  <span>{lang === 'mr' ? 'माझ्या नोंदवलेल्या ऑर्डर्स' : 'My Seedling Orders'}</span>
                </h4>
                <span className="text-xs font-semibold text-slate-500">
                  {userOrders.length} {lang === 'mr' ? 'ऑर्डर्स' : 'orders'}
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 space-y-2">
                  <p>{lang === 'mr' ? 'या नंबरवर अद्याप कोणतीही ऑर्डर नोंदवलेली नाही.' : 'No orders registered under this phone number yet.'}</p>
                  <a
                    href="#book"
                    onClick={onClose}
                    className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                  >
                    {lang === 'mr' ? 'नवीन रोपे बुकिंग करा' : 'Book Seedlings Now'}
                  </a>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {ord.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          ord.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                          ord.status === 'Completed' ? 'bg-teal-100 text-teal-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="font-bold text-slate-800">{ord.variety}</span>
                        <span className="font-black text-emerald-700 text-sm">
                          {Number(ord.quantity)?.toLocaleString('en-IN')} रोपे
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>तारीख: {ord.date}</span>
                        <span>{ord.estimatedTotal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                {lang === 'mr' ? 'बंद करा (Close)' : 'Close'}
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
