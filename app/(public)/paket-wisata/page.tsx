import { createClient } from "@/lib/supabase/server";
import { getPageMetadata } from "@/lib/seo";
import PaketCard from "@/components/paket/PaketCard";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

export async function generateMetadata() {
  return await getPageMetadata("/paket-wisata");
}

interface Props {
  searchParams: { wilayah?: string; durasi?: string; q?: string };
}

export default async function PaketWisataPage({ searchParams }: Props) {
  const supabase = createClient();

  const [{ data: wilayahs }, { data: pakets }, { data: settingsData }] = await Promise.all([
    supabase.from("wilayah").select("*").order("nama"),
    supabase
      .from("paket_wisata")
      .select("*, wilayah(*)")
      .eq("aktif", true)
      .order("created_at", { ascending: false }),
    supabase.from("pengaturan_website").select("*"),
  ]);

  const settings: Record<string, string> = {};
  settingsData?.forEach((s) => (settings[s.kunci] = s.nilai));
  const heroImage = settings.hero_image_paket || "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600";

  // Client-side filter will happen via params on refresh
  let filteredPakets = pakets || [];
  if (searchParams.wilayah) {
    filteredPakets = filteredPakets.filter(
      (p: any) => p.wilayah?.slug === searchParams.wilayah,
    );
  }
  if (searchParams.durasi) {
    filteredPakets = filteredPakets.filter(
      (p: any) => p.durasi_hari === parseInt(searchParams.durasi!),
    );
  }
  if (searchParams.q) {
    filteredPakets = filteredPakets.filter((p: any) =>
      p.nama.toLowerCase().includes(searchParams.q!.toLowerCase()),
    );
  }

  const popularPakets = filteredPakets.filter((p: any) => p.populer);

  return (
    <div>
      {/* Hero */}
      <div
        className="relative h-80 md:h-[400px] bg-cover bg-center flex items-center justify-center pt-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-[2px]" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Paket Wisata</h1>
          <p className="max-w-xl mx-auto text-blue-100 font-medium text-sm md:text-base">
            Temukan destinasi wisata impian Anda bersama kami melalui pilihan paket tour eksklusif dan terpercaya.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <form className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-xl shadow-sm border">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Cari paket wisata..."
            className="flex-1 min-w-48 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="wilayah"
            defaultValue={searchParams.wilayah}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Wilayah</option>
            {(wilayahs || []).map((w: any) => (
              <option key={w.id} value={w.slug}>
                {w.nama}
              </option>
            ))}
          </select>
          <select
            name="durasi"
            defaultValue={searchParams.durasi}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Durasi</option>
            <option value="3">3 Hari</option>
            <option value="4">4 Hari</option>
            <option value="5">5 Hari</option>
            <option value="7">7 Hari</option>
          </select>
          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"
          >
            <Search className="w-4 h-4" /> Filter
          </button>
        </form>

        {/* Populer */}
        {popularPakets.length > 0 && !searchParams.q && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔥 Paket Wisata Populer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {popularPakets.map((p: any) => (
                <PaketCard key={p.id} paket={p} />
              ))}
            </div>
          </section>
        )}

        {/* All Pakets */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Semua Paket Wisata{" "}
            <span className="text-gray-400 font-normal text-base">
              ({filteredPakets.length} paket)
            </span>
          </h2>
          {filteredPakets.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">Paket tidak ditemukan</p>
              <Link
                href="/paket-wisata"
                className="text-blue-600 text-sm mt-2 inline-block hover:underline"
              >
                Reset filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredPakets.map((p: any) => (
                <PaketCard key={p.id} paket={p} />
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="mt-12 bg-blue-700 rounded-3xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Siap Memesan?</h3>
          <p className="text-blue-200 mb-5">
            Isi form pemesanan dan kami akan segera menghubungi Anda via
            WhatsApp
          </p>

          {/* Nah, di sini tadi tag <a> nya hilang, langsung href saja */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-blue-50 transition"
          >
            💬 Pesan Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
