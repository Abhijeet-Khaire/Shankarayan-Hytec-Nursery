import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
  const whatsappMessage = encodeURIComponent("Hello, I want to book Original 15 No. Papaya seedlings.");
  const whatsappUrl = `https://wa.me/919657523258?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 focus:outline-none"
      aria-label="Book Papaya Seedlings on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
    </a>
  );
}
