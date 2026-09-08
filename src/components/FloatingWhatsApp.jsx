import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
  const whatsappMessage = encodeURIComponent("Hello, I want to book Original 15 No. Papaya seedlings.");
  const whatsappUrl = `https://wa.me/919657523258?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366]/90 backdrop-blur-xl border border-white/50 text-white flex items-center justify-center shadow-[0_12px_32px_rgba(37,211,102,0.45)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 focus:outline-none group"
      aria-label="Book Papaya Seedlings on WhatsApp"
    >
      <div className="absolute top-1 left-2 right-2 h-4 bg-gradient-to-b from-white/35 to-transparent rounded-full pointer-events-none" />
      <FaWhatsapp className="w-7 h-7 group-hover:scale-105 transition-transform drop-shadow" />
    </a>
  );
}

