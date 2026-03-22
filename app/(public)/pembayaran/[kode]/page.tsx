"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CreditCard,
  Clock,
  CheckCircle,
  ExternalLink,
  Shield,
} from "lucide-react";

export default function PembayaranPage({
  params,
}: {
  params: { kode: string };
}) {
  const [pemesanan, setPemesanan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("pemesanan")
      .select(
        "*, paket_wisata(nama, foto_utama), rental_mobil(nama, foto_utama)",
      )
      .eq("kode_pemesanan", params.kode)
      .single()
      .then(({ data }) => {
        setPemesanan(data);
        setLoading(false);
      });
  }, []);

  const handleBayar = async () => {
    setPayLoading(true);
    try {
      const res = await fetch("/api/doku/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode_pemesanan: params.kode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.payment_url;
    } catch (err: any) {
      alert("Gagal: " + err.message);
      setPayLoading(false);
    }
  };

  const fmt = (h: number) => "Rp " + h?.toLocaleString("id-ID");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" />
      </div>
    );

  if (!pemesanan)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Pemesanan tidak ditemukan</p>
      </div>
    );

  const namaLayanan =
    pemesanan.paket_wisata?.nama || pemesanan.rental_mobil?.nama;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Selesaikan Pembayaran
          </h1>
          <p className="text-gray-500 mt-1">
            Kode Booking:{" "}
            <span className="font-bold text-blue-700 tracking-wider">
              {params.kode}
            </span>
          </p>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Detail Pesanan</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Layanan</span>
              <span className="font-medium text-right max-w-xs">
                {namaLayanan}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nama Pemesan</span>
              <span className="font-medium">{pemesanan.nama_lengkap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">No. WhatsApp</span>
              <span className="font-medium">{pemesanan.nomor_hp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal Berangkat</span>
              <span className="font-medium">
                {new Date(pemesanan.tanggal_berangkat).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jumlah Orang</span>
              <span className="font-medium">
                {pemesanan.jumlah_orang} orang
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-gray-500">Total Paket</span>
              <span className="font-medium">{fmt(pemesanan.total_harga)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tipe Pembayaran</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  pemesanan.tipe_pembayaran === "dp"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {pemesanan.tipe_pembayaran === "dp" ? "DP 20%" : "Bayar Penuh"}
              </span>
            </div>
            {pemesanan.tipe_pembayaran === "dp" && (
              <div className="flex justify-between text-orange-600 text-xs">
                <span>Sisa (dibayar sebelum berangkat)</span>
                <span className="font-medium">
                  {fmt(pemesanan.sisa_pembayaran)}
                </span>
              </div>
            )}
            <div className="bg-blue-50 rounded-xl p-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Bayar Sekarang</span>
              <span className="font-bold text-blue-700 text-xl">
                {fmt(pemesanan.jumlah_dibayar)}
              </span>
            </div>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              Metode Pembayaran
            </p>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">
              Powered by DOKU
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Virtual Account BCA",
              "Virtual Account Mandiri",
              "Virtual Account BNI",
              "QRIS",
              "Kartu Kredit/Debit",
              "Alfamart",
              "Indomaret",
            ].map((m) => (
              <span
                key={m}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Status Warning */}
        {pemesanan.status_pembayaran === "lunas" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-medium">
              Pembayaran sudah lunas!
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <p className="text-yellow-700 text-sm">
              Selesaikan pembayaran dalam{" "}
              <span className="font-bold">60 menit</span> sebelum pesanan
              dibatalkan.
            </p>
          </div>
        )}

        {/* Keamanan */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4">
          <Shield className="w-4 h-4" />
          <span>Pembayaran aman & terenkripsi oleh DOKU</span>
        </div>

        {/* Tombol */}
        {pemesanan.status_pembayaran !== "lunas" && (
          <button
            onClick={handleBayar}
            disabled={payLoading}
            className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200"
          >
            {payLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengarahkan ke DOKU...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                Bayar {fmt(pemesanan.jumlah_dibayar)}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
