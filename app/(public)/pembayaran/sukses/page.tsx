"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  MessageCircle,
  Home,
  Copy,
  Check,
} from "lucide-react";

function PembayaranSuksesContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");
  const [pemesanan, setPemesanan] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const isPending = status === "pending";

  useEffect(() => {
    if (!orderId) return;
    supabase
      .from("pemesanan")
      .select("*, paket_wisata(nama), rental_mobil(nama)")
      .eq("kode_pemesanan", orderId)
      .single()
      .then(({ data }) => setPemesanan(data));
  }, [orderId]);

  const handleCopyKode = () => {
    navigator.clipboard.writeText(orderId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWAConfirmation = () => {
    if (!pemesanan) return;
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    const namaLayanan =
      pemesanan.paket_wisata?.nama || pemesanan.rental_mobil?.nama;
    const tglBerangkat = new Date(
      pemesanan.tanggal_berangkat,
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const msg = isPending
      ? `Halo Admin Nusa Bali Travel 👋\n\nSaya ingin konfirmasi pembayaran saya yang masih pending.\n\n*Kode Booking:* ${orderId}\n*Nama:* ${pemesanan.nama_lengkap}\n*Layanan:* ${namaLayanan}\n\nMohon bantu cek status pembayaran saya. Terima kasih!`
      : `Halo Admin Nusa Bali Travel 👋\n\n✅ Saya telah berhasil melakukan pembayaran.\n\n` +
        `*KODE BOOKING: ${orderId}*\n\n` +
        `📋 *Detail Pesanan:*\n` +
        `• Layanan: ${namaLayanan}\n` +
        `• Nama: ${pemesanan.nama_lengkap}\n` +
        `• Email: ${pemesanan.email}\n` +
        `• No. HP: ${pemesanan.nomor_hp}\n` +
        `• Tanggal Berangkat: ${tglBerangkat}\n` +
        `• Jumlah Orang: ${pemesanan.jumlah_orang} orang\n` +
        `• Tipe Bayar: ${pemesanan.tipe_pembayaran === "dp" ? "DP 20%" : "Lunas"}\n` +
        `• Dibayar: Rp ${pemesanan.jumlah_dibayar?.toLocaleString("id-ID")}\n` +
        (pemesanan.tipe_pembayaran === "dp"
          ? `• Sisa: Rp ${pemesanan.sisa_pembayaran?.toLocaleString("id-ID")}\n`
          : "") +
        `\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;

    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const fmt = (h: number) => "Rp " + h?.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Icon & Title */}
        <div className="text-center mb-6">
          {isPending ? (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {isPending ? "Menunggu Pembayaran" : "Pembayaran Berhasil! 🎉"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isPending
              ? "Pembayaran Anda sedang diproses. Simpan kode booking di bawah."
              : "Pesanan Anda sudah dikonfirmasi. Segera hubungi kami via WhatsApp."}
          </p>
        </div>

        {/* Kode Booking */}
        <div className="bg-blue-700 rounded-2xl p-5 mb-4 text-center">
          <p className="text-blue-200 text-sm mb-1">Kode Booking Anda</p>
          <p className="text-white text-2xl font-bold tracking-widest mb-3">
            {orderId}
          </p>
          <button
            onClick={handleCopyKode}
            className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 mx-auto transition"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Tersalin!" : "Salin Kode"}
          </button>
        </div>

        {/* Detail Pemesanan */}
        {pemesanan && (
          <div className="bg-white rounded-2xl border shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Detail Pemesanan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Layanan</span>
                <span className="font-medium text-right max-w-xs">
                  {pemesanan.paket_wisata?.nama || pemesanan.rental_mobil?.nama}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium">{pemesanan.nama_lengkap}</span>
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
              <div className="flex justify-between">
                <span className="text-gray-500">Tipe Bayar</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    pemesanan.tipe_pembayaran === "dp"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {pemesanan.tipe_pembayaran === "dp" ? "DP 20%" : "Lunas"}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Dibayar</span>
                <span className="text-blue-700">
                  {fmt(pemesanan.jumlah_dibayar)}
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
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleWAConfirmation}
            className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg shadow-green-100"
          >
            <MessageCircle className="w-5 h-5" />
            {isPending
              ? "Konfirmasi via WhatsApp"
              : "Kirim Konfirmasi ke WhatsApp"}
          </button>

          <Link
            href="/dashboard"
            className="w-full border-2 border-blue-700 text-blue-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition"
          >
            Lihat Riwayat Pemesanan
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PembayaranSuksesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      }
    >
      <PembayaranSuksesContent />
    </Suspense>
  );
}
