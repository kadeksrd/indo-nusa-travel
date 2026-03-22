import { createClient } from "@/lib/supabase/server";
import { getPageMetadata } from "@/lib/seo";
import MobilCard from "@/components/rental/MobilCard";
import Link from "next/link";
import { Search } from "lucide-react";

export async function generateMetadata() {
  return await getPageMetadata("/rental-mobil");
}

interface Props {
  searchParams: { q?: string; transmisi?: string };
}

export default async function RentalMobilPage({ searchParams }: Props) {
  const supabase = createClient();
  const [{ data: kategoris }, { data: mobils }, { data: settingsData }] = await Promise.all([
    supabase.from("kategori_mobil").select("*").order("nama"),
    supabase
      .from("rental_mobil")
      .select("*, kategori_mobil(*)")
      .eq("aktif", true),
    supabase.from("pengaturan_website").select("*"),
  ]);

  const settings: Record<string, string> = {};
  settingsData?.forEach((s) => (settings[s.kunci] = s.nilai));
  const heroImage = settings.hero_image_rental || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600";

  let filtered = mobils || [];
  if (searchParams.q)
    filtered = filtered.filter((m: any) =>
      m.nama.toLowerCase().includes(searchParams.q!.toLowerCase()),
    );
  if (searchParams.transmisi && searchParams.transmisi !== "semua") {
    filtered = filtered.filter(
      (m: any) => m.transmisi === searchParams.transmisi,
    );
  }

  const groupedByKategori = (kategoris || [])
    .map((k: any) => ({
      ...k,
      mobils: filtered.filter((m: any) => m.kategori_id === k.id),
    }))
    .filter((k: any) => k.mobils.length > 0);

  return (
    <div>
      <div
        className="relative h-80 md:h-[400px] bg-cover bg-center flex items-center justify-center pt-20"
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-[2px]" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Rental Mobil</h1>
          <p className="max-w-xl mx-auto text-blue-100 font-medium text-sm md:text-base">
            Armada lengkap terawat untuk perjalanan nyaman dan aman selama Anda berlibur di Pulau Bali.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <form className="flex flex-wrap gap-3 mb-8">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Cari mobil..."
            className="flex-1 min-w-48 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="transmisi"
            defaultValue={searchParams.transmisi}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="semua">Semua Transmisi</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"
          >
            <Search className="w-4 h-4" /> Filter
          </button>
        </form>

        {/* Mobil by Kategori */}
        {groupedByKategori.map((k: any) => (
          <section key={k.id} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {k.slug === "terfavorit"
                ? "❤️"
                : k.slug === "mobil-besar"
                  ? "🚌"
                  : "🚗"}{" "}
              Rental {k.nama}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {k.mobils.map((m: any) => (
                <MobilCard key={m.id} mobil={m} />
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="mt-8 bg-blue-700 rounded-3xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Siap Memesan?</h3>
          <p className="text-blue-200 mb-5">
            Isi form pemesanan dan kami akan segera menghubungi Anda via
            WhatsApp
          </p>
          <a
            href={`https://wa.me/6281234567890`}
            target="_blank"
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-blue-50 transition"
          >
            💬 Pesan Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
