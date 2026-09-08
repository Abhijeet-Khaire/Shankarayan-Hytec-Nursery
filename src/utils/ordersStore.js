// Order Management Store & Persistence for Shankarayan Hytec Nursery
import { db } from '../firebase';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY = 'shn_farmer_bookings';
const PIN_KEY = 'shn_admin_pin';
const AUTH_KEY = 'shn_admin_auth_session';

// Seed sample orders with realistic nursery data if store is empty
const SAMPLE_ORDERS = [
  {
    id: 'SHN-2026-9142',
    date: '8 Mar 2026',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    farmerName: 'रमेश पांडुरंग शिंदे (Ramesh Shinde)',
    mobileNumber: '9822345678',
    villageTaluka: 'बार्शी रोड, येडशी (Yedshi, Dharashiv)',
    district: 'Dharashiv',
    variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)',
    varietyId: 'papaya-15',
    quantity: 3000,
    trays: 29,
    acres: '3.0',
    deliveryMethod: 'नर्सरीतून स्वतः नेणार (Self-Pickup)',
    preferredDate: '2026-03-25',
    estimatedTotal: '₹36,000',
    totalAmount: 36000,
    advancePaid: 10000,
    paymentStatus: 'Advance Received',
    status: 'Pending', // Pending, Confirmed, Ready, Completed, Cancelled
    specialNotes: 'रोपांची उंची ५-६ इंच असावी. पाण्याचा निचरा योग्य असलेल्या जमिनीसाठी रोपे हवी आहेत.',
    orderSource: 'Online Form'
  },
  {
    id: 'SHN-2026-8830',
    date: '7 Mar 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 20, // 20 hours ago
    farmerName: 'तानाजी विठ्ठल जाधव (Tanaji Jadhav)',
    mobileNumber: '9423123456',
    villageTaluka: 'कुर्डूवाडी, माढा (Kurduwadi, Madha)',
    district: 'Solapur',
    variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)',
    varietyId: 'papaya-15',
    quantity: 5000,
    trays: 49,
    acres: '5.0',
    deliveryMethod: 'गाडीने पाठवणे (Transport Delivery)',
    preferredDate: '2026-03-20',
    estimatedTotal: '₹60,000',
    totalAmount: 60000,
    advancePaid: 60000,
    paymentStatus: 'Full Paid',
    status: 'Confirmed',
    specialNotes: 'गाडी चालक संतोष पाटील यांच्या पिकअप टेम्पोमध्ये पाठवणे. फोन करून पाठवावे.',
    orderSource: 'WhatsApp Direct'
  },
  {
    id: 'SHN-2026-7915',
    date: '6 Mar 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    farmerName: 'बाळासाहेब संभाजी पवार (Balasaheb Pawar)',
    mobileNumber: '9765891234',
    villageTaluka: 'मुरूड, लातूर (Murud, Latur)',
    district: 'Latur',
    variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)',
    varietyId: 'papaya-15',
    quantity: 2000,
    trays: 20,
    acres: '2.0',
    deliveryMethod: 'नर्सरीतून स्वतः नेणार (Self-Pickup)',
    preferredDate: '2026-03-12',
    estimatedTotal: '₹24,000',
    totalAmount: 24000,
    advancePaid: 24000,
    paymentStatus: 'Full Paid',
    status: 'Ready',
    specialNotes: 'रोपे ट्रेमध्ये तयार आहेत. १०४ होल ट्रे. १४ मार्च रोजी सकाळी १० वाजता गाडी येईल.',
    orderSource: 'Online Form'
  },
  {
    id: 'SHN-2026-6204',
    date: '4 Mar 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 96, // 4 days ago
    farmerName: 'ज्ञानेश्वर मारुती पाटील (Dnyaneshwar Patil)',
    mobileNumber: '9890123789',
    villageTaluka: 'केज, बीड (Kej, Beed)',
    district: 'Beed',
    variety: 'ओरिजनल १५ नंबर पपई (Papaya 15 No.)',
    varietyId: 'papaya-15',
    quantity: 10000,
    trays: 97,
    acres: '10.0',
    deliveryMethod: 'गाडीने पाठवणे (Transport Delivery)',
    preferredDate: '2026-03-05',
    estimatedTotal: '₹1,20,000',
    totalAmount: 120000,
    advancePaid: 120000,
    paymentStatus: 'Full Paid',
    status: 'Completed',
    specialNotes: '१० एकर लागवड पूर्ण. सर्व रोपे सुस्थितीत मिळाली.',
    orderSource: 'Direct Call'
  },
  {
    id: 'SHN-2026-5120',
    date: '2 Mar 2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 144, // 6 days ago
    farmerName: 'सुनील रामराव देशमुख (Sunil Deshmukh)',
    mobileNumber: '9657112233',
    villageTaluka: 'इंदापूर (Indapur, Pune)',
    district: 'Pune',
    variety: 'आईसबेरी पपई (Iceberry Papaya)',
    varietyId: 'iceberry',
    quantity: 1000,
    trays: 10,
    acres: '1.0',
    deliveryMethod: 'नर्सरीतून स्वतः नेणार (Self-Pickup)',
    preferredDate: '2026-03-10',
    estimatedTotal: '₹12,000',
    totalAmount: 12000,
    advancePaid: 0,
    paymentStatus: 'Unpaid',
    status: 'Pending',
    specialNotes: 'ड्रिप इरिगेशन तयारी चालू आहे.',
    orderSource: 'Online Form'
  }
];

// Notify UI of changes
function dispatchUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shn_orders_updated'));
  }
}

// Get all orders (with seeding if fresh)
export function getOrders() {
  if (typeof window === 'undefined') return SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read orders from localStorage', err);
    return SAMPLE_ORDERS;
  }
}

// Save or prepend a new order
export function saveOrder(orderData) {
  const current = getOrders();
  const newOrder = {
    id: orderData.id || `SHN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: orderData.date || new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    timestamp: orderData.timestamp || Date.now(),
    farmerName: orderData.farmerName || 'अज्ञात शेतकरी',
    mobileNumber: orderData.mobileNumber || '',
    villageTaluka: orderData.villageTaluka || '',
    district: orderData.district || 'Dharashiv',
    variety: orderData.variety || 'ओरिजनल १५ नंबर पपई',
    varietyId: orderData.varietyId || 'papaya-15',
    quantity: Number(orderData.quantity) || 1000,
    trays: Number(orderData.trays) || Math.ceil((Number(orderData.quantity) || 1000) / 104),
    acres: orderData.acres || ((Number(orderData.quantity) || 1000) / 1000).toFixed(1),
    deliveryMethod: orderData.deliveryMethod || 'नर्सरीतून स्वतः नेणार',
    preferredDate: orderData.preferredDate || 'लवकरात लवकर',
    estimatedTotal: orderData.estimatedTotal || '₹12,000',
    totalAmount: typeof orderData.totalAmount === 'number' ? orderData.totalAmount : (Number(orderData.quantity) * 12 || 12000),
    advancePaid: Number(orderData.advancePaid) || 0,
    paymentStatus: orderData.paymentStatus || 'Unpaid',
    status: orderData.status || 'Pending',
    specialNotes: orderData.specialNotes || '',
    orderSource: orderData.orderSource || 'Online Form'
  };

  const updated = [newOrder, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    dispatchUpdate();
  } catch (err) {
    console.error('Failed to save order to localStorage', err);
  }

  // Cloud Firestore Sync
  try {
    if (db) {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((e) => {
        console.warn('Firestore sync note:', e.message);
      });
    }
  } catch (e) {
    // Ignore offline errors gracefully
  }

  return newOrder;
}

// Update existing order details (status, notes, payment)
export function updateOrder(orderId, updates) {
  const current = getOrders();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        ...updates,
        lastUpdated: Date.now()
      };
    }
    return ord;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    dispatchUpdate();
  } catch (err) {
    console.error('Failed to update order', err);
  }

  // Cloud Firestore Sync
  try {
    if (db) {
      updateDoc(doc(db, 'orders', orderId), updates).catch((e) => {
        console.warn('Firestore update note:', e.message);
      });
    }
  } catch (e) {
    // Ignore offline errors gracefully
  }

  return updated;
}

// Delete an order
export function deleteOrder(orderId) {
  const current = getOrders();
  const filtered = current.filter((ord) => ord.id !== orderId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    dispatchUpdate();
  } catch (err) {
    console.error('Failed to delete order', err);
  }

  // Cloud Firestore Sync
  try {
    if (db) {
      deleteDoc(doc(db, 'orders', orderId)).catch((e) => {
        console.warn('Firestore delete note:', e.message);
      });
    }
  } catch (e) {
    // Ignore offline errors gracefully
  }

  return filtered;
}

// Reset data to default samples
export function resetSampleOrders() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
    dispatchUpdate();
  } catch (err) {
    console.error('Failed to reset sample orders', err);
  }
  return SAMPLE_ORDERS;
}

// Export orders list to CSV
export function exportOrdersToCSV() {
  const orders = getOrders();
  const headers = [
    'Booking ID',
    'Date',
    'Farmer Name',
    'Mobile Number',
    'Village & Taluka',
    'District',
    'Variety',
    'Quantity',
    'Trays (104/tray)',
    'Acres',
    'Delivery Method',
    'Preferred Date',
    'Estimated Total',
    'Advance Paid',
    'Payment Status',
    'Order Status',
    'Order Source',
    'Special Notes'
  ];

  const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

  const rows = orders.map((o) => [
    escapeCSV(o.id),
    escapeCSV(o.date),
    escapeCSV(o.farmerName),
    escapeCSV(o.mobileNumber),
    escapeCSV(o.villageTaluka),
    escapeCSV(o.district),
    escapeCSV(o.variety),
    o.quantity,
    o.trays,
    escapeCSV(o.acres),
    escapeCSV(o.deliveryMethod),
    escapeCSV(o.preferredDate),
    escapeCSV(o.estimatedTotal),
    o.advancePaid || 0,
    escapeCSV(o.paymentStatus),
    escapeCSV(o.status),
    escapeCSV(o.orderSource),
    escapeCSV(o.specialNotes)
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shankarayan_nursery_orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Admin PIN Management
export function getAdminPin() {
  if (typeof window === 'undefined') return '1234';
  return localStorage.getItem(PIN_KEY) || '1234';
}

export function setAdminPin(newPin) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PIN_KEY, newPin);
}

export function isSessionAuthenticated() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function setSessionAuthenticated(isAuth) {
  if (typeof window === 'undefined') return;
  if (isAuth) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}
