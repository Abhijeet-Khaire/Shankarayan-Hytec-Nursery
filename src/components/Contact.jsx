import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaWhatsapp, FaDirections } from 'react-icons/fa';
import { translations } from '../utils/translations';

export default function Contact({ lang }) {
  const t = translations[lang];

  const whatsappMessage = encodeURIComponent("Hello, I want to book Original 15 No. Papaya seedlings.");
  const whatsappUrl = `https://wa.me/919657523258?text=${whatsappMessage}`;

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] font-poppins relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[#2E7D32] after:rounded-full">
            {t['contact-title']}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {t['contact-subtitle']}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold font-poppins text-slate-800 mb-8 pb-4 border-b border-slate-100">
                {t['contact-card-heading']}
              </h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8D6E63] flex items-center justify-center shrink-0 shadow-sm">
                    <FaMapMarkerAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">
                      {t['contact-lbl-address']}
                    </span>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {t['contact-val-address']}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8D6E63] flex items-center justify-center shrink-0 shadow-sm">
                    <FaPhoneAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">
                      {t['contact-lbl-phone']}
                    </span>
                    <a href="tel:+919657523258" className="text-slate-800 text-base font-semibold hover:text-[#2E7D32] transition-colors">
                      +91 9657523258
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8D6E63] flex items-center justify-center shrink-0 shadow-sm">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-1">
                      {t['contact-lbl-hours']}
                    </span>
                    <p className="text-slate-700 text-sm font-medium">
                      {t['contact-val-hours']}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-8 mt-8 border-t border-slate-100">
              <a
                href="tel:+919657523258"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#8D6E63] text-white font-bold text-sm transition-all shadow-md"
              >
                <FaPhoneAlt />
                <span>{t['contact-btn-call']}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-md"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{t['contact-btn-whatsapp']}</span>
              </a>

              <a
                href="https://www.google.com/maps?q=18.33556,75.49085"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
              >
                <FaDirections />
                <span>{t['contact-btn-directions']}</span>
              </a>
            </div>

          </motion.div>

          {/* Right: Embedded Google Map Viewport */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl border border-slate-100 min-h-[450px]"
          >
            <iframe
              src="https://maps.google.com/maps?q=18.33556,75.49085&hl=en&z=15&output=embed"
              className="w-full h-full min-h-[450px] border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shankarayan Hytec Nursery Google Map"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
