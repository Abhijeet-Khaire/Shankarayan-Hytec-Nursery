import { FaPhoneAlt } from 'react-icons/fa';

export default function FloatingCall() {
  return (
    <a
      href="tel:+919657523258"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#2E7D32]/90 backdrop-blur-xl border border-white/50 text-white flex items-center justify-center shadow-[0_12px_32px_rgba(46,125,50,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 focus:outline-none group"
      aria-label="Call Shankarayan Hytec Nursery"
    >
      <div className="absolute top-1 left-2 right-2 h-4 bg-gradient-to-b from-white/35 to-transparent rounded-full pointer-events-none" />
      <FaPhoneAlt className="w-5 h-5 group-hover:rotate-12 transition-transform drop-shadow" />
    </a>
  );
}

