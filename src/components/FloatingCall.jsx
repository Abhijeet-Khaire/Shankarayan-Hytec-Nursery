import { FaPhoneAlt } from 'react-icons/fa';

export default function FloatingCall() {
  return (
    <a
      href="tel:+919657523258"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 focus:outline-none"
      aria-label="Call Shankarayan Hytec Nursery"
    >
      <FaPhoneAlt className="w-6 h-6" />
    </a>
  );
}
