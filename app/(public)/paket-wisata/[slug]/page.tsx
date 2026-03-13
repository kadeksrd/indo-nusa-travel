import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star, Users, Check } from "lucide-react";
import BookingButton from "@/components/paket/BookingButton";

interface Props {
  params: { slug: string };
}

export default async function PaketDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: paket } = await supabase
    .from("paket_wisata")
    .select("*, wilayah(*)")
    .eq("slug", params.slug)
    .eq("aktif", true)
    .single();

  if (!paket) return notFound();

  const formatHarga = (h: number) => "Rp " + h.toLocaleString("id-ID");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/paket-wisata" className="hover:text-blue-600">Paket Wisata</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{paket.nama}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2">
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-100 mb-6">
            {paket.foto_utama && (
              <Image src={paket.foto_utama} alt={paket.nama} fill className="object-cover" />
            )}
            {paket.populer && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                🔥 Populer
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{paket.nama}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-500" /> {paket.wilayah?.nama}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" /> {paket.durasi_hari} Hari
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {paket.rating} ({paket.total_ulasan} ulasan)
            </span>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Deskripsi Paket</h2>
            <p className="text-gray-600 leading-relaxed">{paket.deskripsi}</p>
            {paket.konten && <div dangerouslySetInnerHTML={{ __html: paket.konten }} />}
          </div>

          {paket.fasilitas?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-2">
                {paket.fasilitas.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {paket.itinerary?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Itinerary</h2>
              <div className="space-y-4">
                {paket.itinerary.map((item: any) => (
                  <div key={item.hari} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">
                      Hari {item.hari}: {item.judul}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {item.kegiatan?.map((k: string) => (
                        <li key={k} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span> {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border rounded-2xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-1">Mulai dari</p>
            {paket.harga_coret && (
              <p className="text-gray-400 line-through text-sm">{formatHarga(paket.harga_coret)}</p>
            )}
            <p className="text-3xl font-bold text-blue-700 mb-1">{formatHarga(paket.harga)}</p>
            <p className="text-gray-400 text-sm mb-4">/ orang</p>

            {/* Opsi Pembayaran Preview */}
            <div className="bg-blue-50 rounded-xl p-3 mb-5 space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pilihan Pembayaran</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DP 20%</span>
                <span className="font-bold text-blue-700 text-sm">{formatHarga(Math.ceil(paket.harga * 0.2))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bayar Penuh</span>
                <span className="font-bold text-blue-700 text-sm">{formatHarga(paket.harga)}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                Durasi: {paket.durasi_hari} Hari
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                Wilayah: {paket.wilayah?.nama}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                Min. 2 orang
              </div>
            </div>

            {/* Client Component - Booking Button + Modal */}
            <BookingButton paket={paket} />

            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Pembayaran aman via DOKU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
