import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimoniSection from "@/components/home/TestimoniSection";
import BookingForm from "@/components/home/BookingForm";
import PaketCard from "@/components/paket/PaketCard";
import MobilCard from "@/components/rental/MobilCard";
import Link from "next/link";

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: pakets },
    { data: mobils },
    { data: testimonis },
    { data: wilayahs },
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
  ]);

  return (
    <div>
      <HeroSection wilayahs={wilayahs || []} />
      <WhyChooseUs />

      {/* Paket Wisata Terfavorit */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Paket Wisata Terfavorit
            </h2>
            <p className="text-gray-500 mt-1">
              Destinasi populer pilihan wisatawan
            </p>
          </div>
          <Link
            href="/paket-wisata"
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(pakets || []).map((paket) => (
            <PaketCard key={paket.id} paket={paket} />
          ))}
        </div>
      </section>

      {/* Rental Mobil Unggulan */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50 rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Rental Mobil Unggulan
            </h2>
            <p className="text-gray-500 mt-1">
              Armada pilihan untuk perjalanan nyaman
            </p>
          </div>
          <Link
            href="/rental-mobil"
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(mobils || []).map((mobil) => (
            <MobilCard key={mobil.id} mobil={mobil} compact />
          ))}
        </div>
      </section>

      <TestimoniSection testimonis={testimonis || []} />
      <BookingForm />
    </div>
  );
}
