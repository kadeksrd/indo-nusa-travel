import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, Settings, Check } from "lucide-react";
import RentalBookingButton from "@/components/rental/RentalBookingButton";

interface Props {
  params: { slug: string };
}

export default async function RentalMobilDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: mobil } = await supabase
    .from("rental_mobil")
    .select("*, kategori_mobil(*)")
    .eq("slug", params.slug)
    .eq("aktif", true)
    .single();

  if (!mobil) return notFound();

  const formatHarga = (h: number) => "Rp " + h.toLocaleString("id-ID");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href="/rental-mobil" className="hover:text-blue-600">Rental Mobil</Link>
        <span>›</span>
        <span className="text-gray-900">{mobil.nama}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2">
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-100 mb-6">
            {mobil.foto_utama && (
              <Image src={mobil.foto_utama} alt={mobil.nama} fill className="object-cover" />
            )}
            {mobil.terfavorit && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                ❤️ Terfavorit
              </span>
            )}
          </div>

          {mobil.galeri?.length > 0 && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {mobil.galeri.map((img: string, i: number) => (
                <div key={i} className="relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={img} alt={`${mobil.nama} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{mobil.nama}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-500" /> {mobil.kapasitas} orang
            </span>
            <span className="flex items-center gap-1">
              <Settings className="w-4 h-4 text-gray-500" /> {mobil.transmisi}
            </span>
            {mobil.kategori_mobil && (
              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                {mobil.kategori_mobil.nama}
              </span>
            )}
          </div>

          {mobil.deskripsi && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed">{mobil.deskripsi}</p>
            </div>
          )}

          {mobil.fitur?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fitur Kendaraan</h2>
              <div className="grid grid-cols-2 gap-2">
                {mobil.fitur.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Syarat & Ketentuan</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Wajib membawa SIM yang masih berlaku</li>
              <li>• Wajib membawa KTP asli sebagai jaminan</li>
              <li>• Bahan bakar tidak termasuk dalam harga sewa</li>
              <li>• Pengembalian mobil sesuai jam yang disepakati</li>
              <li>• Kerusakan akibat kelalaian penyewa menjadi tanggung jawab penyewa</li>
            </ul>
          </div>
        </div>

        {/* Right - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border rounded-2xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-1">Harga sewa</p>
            <p className="text-3xl font-bold text-blue-700">{formatHarga(mobil.harga_per_hari)}</p>
            <p className="text-gray-400 text-sm mb-4">/hari</p>

            {/* Opsi Pembayaran Preview */}
            <div className="bg-blue-50 rounded-xl p-3 mb-5 space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pilihan Pembayaran</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DP 20% (1 hari)</span>
                <span className="font-bold text-blue-700 text-sm">{formatHarga(Math.ceil(mobil.harga_per_hari * 0.2))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bayar Penuh</span>
                <span className="font-bold text-blue-700 text-sm">{formatHarga(mobil.harga_per_hari)}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                Kapasitas: {mobil.kapasitas} orang
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
                Transmisi: {mobil.transmisi}
              </div>
            </div>

            <RentalBookingButton mobil={mobil} />

            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Pembayaran aman via DOKU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
