import { createClient } from "@/lib/supabase/server";
import { getPageMetadata } from "@/lib/seo";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimoniSection from "@/components/home/TestimoniSection";
import BookingForm from "@/components/home/BookingForm";
import PaketCard from "@/components/paket/PaketCard";
import MobilCard from "@/components/rental/MobilCard";
import Link from "next/link";
import ContactSection from "@/components/home/ContactSection";

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: pakets },
    { data: mobils },
    { data: testimonis },
    { data: wilayahs },
    { data: settingsData },
  ] = await Promise.all([
    supabase
      .from("paket_wisata")
      .select("*, wilayah(*)")
      .eq("aktif", true)
      .eq("populer", true)
      .limit(3),
    supabase
      .from("rental_mobil")
      .select("*, kategori_mobil(*)")
      .eq("aktif", true)
      .limit(4),
    supabase.from("testimoni").select("*").eq("disetujui", true).limit(6),
    supabase.from("wilayah").select("*"),
    supabase.from("pengaturan_website").select("*"),
  ]);

  const settings: Record<string, string> = {};
  settingsData?.forEach((s) => (settings[s.kunci] = s.nilai));

  return (
    <div className="bg-white">
      <HeroSection wilayahs={wilayahs || []} settings={settings} />
      
      <div className="relative z-20 -mt-24 pb-24">
         <WhyChooseUs />
      </div>

      {/* Paket Wisata Terfavorit */}
      {/* Paket Wisata Terfavorit */}
      <section className="py-12 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-blue-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-3 block">Pilihan Terbaik</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight px-4">
            Paket Wisata Terfavorit
          </h2>
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-blue-700 mx-auto rounded-full mb-4 md:mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto font-medium text-sm md:text-base px-4">
             Jelajahi keindahan alam dan budaya dengan paket tour terkurasi untuk pengalaman liburan yang sempurna.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {(pakets || []).map((paket) => (
            <PaketCard key={paket.id} paket={paket} />
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/paket-wisata"
            className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 bg-gray-50 text-gray-900 font-bold rounded-xl md:rounded-2xl hover:bg-blue-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-700/20 text-sm md:text-base"
          >
            Lihat Semua Destinasi
          </Link>
        </div>
      </section>

      {/* Rental Mobil Unggulan */}
      <section className="py-12 md:py-24 px-4 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-7xl mx-auto text-left md:text-center">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-blue-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-3 block">Armada Premium</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight px-4">
              Rental Mobil Unggulan
            </h2>
            <div className="w-16 md:w-20 h-1 md:h-1.5 bg-blue-700 mx-auto rounded-full mb-4 md:mb-6" />
            <p className="text-gray-500 max-w-xl mx-auto font-medium text-sm md:text-base px-4">
               Pilihan armada terawat dan terpercaya untuk kenyamanan mobilitas Anda selama di Pulau Dewata.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {(mobils || []).map((mobil) => (
              <MobilCard key={mobil.id} mobil={mobil} compact />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/rental-mobil"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-2xl hover:border-blue-700 hover:text-blue-700 transition-all duration-300"
            >
              Lihat Seluruh Armada
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <TestimoniSection testimonis={testimonis || []} />
      </div>

      <ContactSection settings={settings} />
      
      <div className="bg-gray-900 py-16">
        <BookingForm />
      </div>
    </div>
  );
}
