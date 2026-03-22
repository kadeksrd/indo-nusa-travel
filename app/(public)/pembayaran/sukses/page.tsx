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
  const [waNumber, setWaNumber] = useState("6281234567890");
  const supabase = createClient();
  const isPending = status === "pending";

  useEffect(() => {
    // Fetch WA Number from settings
    supabase
      .from("pengaturan_website")
      .select("nilai")
      .eq("kunci", "whatsapp")
      .single()
      .then(({ data }) => {
        if (data?.nilai) setWaNumber(data.nilai);
      });
  }, []);

  useEffect(() => {
    if (!orderId) return;
    supabase
      .from("pemesanan")
      .select("*, paket_wisata(nama, slot_tersedia), rental_mobil(nama)")
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
    const wa = waNumber;
    let msg = "";

    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Indo Nusa Travel";

    if (pemesanan) {
      const tipeText = pemesanan.tipe_pembayaran === "dp" ? "DP 20%" : "LUNAS";
      const namaLayanan = pemesanan.paket_wisata?.nama || pemesanan.rental_mobil?.nama;
      
      msg = `Halo Admin ${appName} 👋\n\nSaya *${pemesanan.nama_lengkap}* baru saja menyelesaikan pembayaran *${tipeText}*.\n\nMohon dibantu konfirmasi pesanan saya ya:\n\n*Kode Booking:* ${orderId}\n*Produk:* ${namaLayanan}\n\nTerima kasih! 🙏`;
    } else {
      // Fallback message if booking details are not loaded yet
      msg = `Halo Admin ${appName} 👋\n\nSaya baru saja melakukan pembayaran, mohon bantuannya untuk konfirmasi pesanan saya.\n\n*Kode Booking:* ${orderId || "-"}\n\nTerima kasih banyak! 🙏`;
    }

    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const fmt = (h: number) => "Rp " + h?.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24 pb-12">
      <div className="max-w-md w-full text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100 shadow-sm">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Pemesanan Berhasil!
          </h1>
          <p className="text-gray-600 font-medium px-4">
            Terima kasih telah memilih {process.env.NEXT_PUBLIC_APP_NAME || "Indo Nusa Travel"}. Langkah terakhir, silakan konfirmasi pesanan Anda lewat WhatsApp Admin kami.
          </p>
        </div>

        {/* Dual Primary Actions */}
        <div className="space-y-4 mb-8">
          <div className="bg-green-50 border border-green-100 rounded-3xl p-5 shadow-sm">
            <button
              onClick={handleWAConfirmation}
              className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-100 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-lg">Chat Admin Sekarang</span>
            </button>
            <p className="text-green-700/70 text-[10px] mt-3 font-medium">
              *Konfirmasi cepat & kirim bukti bayar via WhatsApp
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 shadow-sm">
            <Link
              href="/dashboard"
              className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Clock className="w-6 h-6" />
              <span className="text-lg">Cek Riwayat Pesanan</span>
            </Link>
            <p className="text-blue-700/70 text-[10px] mt-3 font-medium">
              *Lihat status & detail pesanan Anda di dashboard
            </p>
          </div>
        </div>

        {/* Extra Info & Home */}
        <div className="space-y-4">
          {orderId && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-0.5 text-left">Kode Booking</p>
                <span className="text-gray-900 font-mono font-bold text-lg">{orderId}</span>
              </div>
              <button
                onClick={handleCopyKode}
                className="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          )}

          <Link
            href="/"
            className="w-full text-gray-400 font-bold py-3 flex items-center justify-center gap-2 hover:text-gray-600 transition text-sm"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>

        {/* Help Footer */}
        <div className="mt-12 text-gray-400 text-xs text-center border-t pt-8">
          <p>Butuh bantuan lain? Jangan ragu untuk chat kami.</p>
          <p className="mt-1">{process.env.NEXT_PUBLIC_APP_NAME || "Indo Nusa Travel"} &copy; {new Date().getFullYear()}</p>
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
