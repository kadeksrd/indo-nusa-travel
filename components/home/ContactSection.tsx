"use client";
import { Mail, Phone, MapPin, MessageSquare, Clock, ArrowRight } from "lucide-react";

interface Props {
  settings: Record<string, string>;
}

export default function ContactSection({ settings }: Props) {
  const whatsapp = settings.whatsapp || "6281234567890";
  const email = settings.email || "info@indonusatravel.com";
  const alamat = settings.alamat || "Bali, Indonesia";
  const mapsLink = settings.maps_link || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126214.33649692482!2d115.15423184841774!3d-8.672455959955845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2409b0e5e3859%3A0x6a877995a892b3a!2sDenpasar%2C%20Bali!5e0!3m2!1sid!2sid!4v1711082500000!5m2!1sid!2sid";

  return (
    <section id="kontak" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -ml-48 -mb-48 opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Get In Touch</span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Hubungi Kami</h2>
          <div className="w-24 h-2 bg-blue-700 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gray-50/50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Informasi Kontak</h3>
              
              <div className="space-y-8">
                <a href={`https://wa.me/${whatsapp}`} target="_blank" className="flex items-center gap-6 group/item">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-green-500 group-hover/item:bg-green-500 group-hover/item:text-white transition-all duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-lg font-bold text-gray-900">+{whatsapp}</p>
                  </div>
                </a>

                <div className="flex items-center gap-6 group/item">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-500 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-900">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group/item">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-red-500 group-hover/item:bg-red-500 group-hover/item:text-white transition-all duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kantor</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">{alamat}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-blue-700 rounded-3xl text-white relative overflow-hidden group/cta">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                 <h4 className="font-black text-lg mb-2 relative z-10">Bantuan 24/7</h4>
                 <p className="text-blue-100 text-sm mb-6 relative z-10">Tim kami siap membantu perencanaan liburan Anda kapan saja.</p>
                 <a href={`https://wa.me/${whatsapp}`} target="_blank" className="bg-white text-blue-700 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg">
                    Konsultasi Gratis <ArrowRight className="w-4 h-4" />
                 </a>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="lg:col-span-7 h-full min-h-[500px] lg:min-h-0">
            <div className="w-full h-80 lg:h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-700/10 border-8 border-white relative">
              <iframe
                src={mapsLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
