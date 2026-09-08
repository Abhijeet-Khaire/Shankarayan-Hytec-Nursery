// User Authentication & OTP Service for Shankarayan Hytec Nursery

const USER_STORAGE_KEY = 'shn_user_auth';
const OTP_SESSION_KEY = 'shn_active_otp_session';

// Dispatch custom event to sync all UI components
function dispatchAuthChange(user) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shn_user_auth_changed', { detail: user }));
  }
}

// Get logged-in user from localStorage
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read user auth state', err);
    return null;
  }
}

// Check if user is logged in
export function isUserLoggedIn() {
  return !!getCurrentUser();
}

// Send OTP to mobile number
export function sendOtp(mobileNumber) {
  const cleanPhone = String(mobileNumber || '').replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { success: false, message: 'कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.' };
  }

  // Generate a random 4-digit OTP (or fixed memorable fallback)
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const session = {
    mobile: cleanPhone,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes validity
  };

  try {
    sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Could not set OTP in sessionStorage', err);
  }

  // Broadcast OTP sent event for on-screen SMS toast demo
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shn_otp_dispatched', {
      detail: { mobile: cleanPhone, code }
    }));
  }

  return {
    success: true,
    code,
    mobile: cleanPhone,
    message: `OTP +91 ${cleanPhone} वर पाठवला आहे.`
  };
}

// Verify OTP
export function verifyOtp(mobileNumber, enteredOtp, farmerName = '', extra = {}) {
  const cleanPhone = String(mobileNumber || '').replace(/\D/g, '');
  const cleanOtp = String(enteredOtp || '').trim();

  let valid = false;

  // Check against active session
  try {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      if (session.mobile === cleanPhone && session.code === cleanOtp && Date.now() <= session.expiresAt) {
        valid = true;
      }
    }
  } catch (err) {
    console.warn('Error reading OTP session', err);
  }

  // Universal fallback test codes: '1234' or '4826' or matching session
  if (cleanOtp === '1234' || cleanOtp === '4826') {
    valid = true;
  }

  if (!valid) {
    return {
      success: false,
      message: '❌ चुकीचा किंवा कालबाह्य OTP! कृपया पुन्हा तपासा.'
    };
  }

  // Create user object
  const user = {
    id: `USR-${cleanPhone.slice(-4)}`,
    mobile: cleanPhone,
    name: farmerName.trim() || 'शेतकरी मित्र',
    villageTaluka: extra.villageTaluka || '',
    district: extra.district || 'Dharashiv',
    verifiedAt: Date.now(),
    role: 'farmer'
  };

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    sessionStorage.removeItem(OTP_SESSION_KEY);
  } catch (err) {
    console.error('Failed to store user', err);
  }

  dispatchAuthChange(user);

  return {
    success: true,
    user,
    message: '✅ मोबाईल पडताळणी यशस्वी झाली!'
  };
}

// Logout user
export function logoutUser() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(OTP_SESSION_KEY);
  } catch (err) {
    console.error('Failed to logout', err);
  }
  dispatchAuthChange(null);
}

// Get all orders belonging to this user
export function getUserOrders(mobileNumber) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('shn_farmer_bookings');
    if (!raw) return [];
    const all = JSON.parse(raw);
    const cleanPhone = String(mobileNumber || '').replace(/\D/g, '');
    return all.filter((o) => {
      const ordPhone = String(o.mobileNumber || '').replace(/\D/g, '');
      return ordPhone.endsWith(cleanPhone.slice(-10)) || cleanPhone.endsWith(ordPhone.slice(-10));
    });
  } catch (err) {
    console.error('Failed to get user orders', err);
    return [];
  }
}
