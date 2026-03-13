"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Home, MessageCircle } from "lucide-react";

export default function PembayaranGagalPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pembayaran Gagal
        </h1>
        <p className="text-gray-500 mb-2 text-sm">
          Pembayaran tidak berhasil diproses. Silakan coba lagi atau hubungi
          kami.
        </p>

        {orderId && (
          <div className="bg-white rounded-xl border p-4 mb-6 inline-block">
            <p className="text-xs text-gray-500">Kode Booking</p>
            <p className="font-bold text-gray-900">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          {orderId && (
            <Link
              href={`/pembayaran/${orderId}`}
              className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition"
            >
              <RefreshCw className="w-4 h-4" /> Coba Bayar Lagi
            </Link>
          )}

          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent(`Halo, saya mengalami masalah pembayaran.\nKode Booking: ${orderId}\nMohon bantu. Terima kasih!`)}`}
            target="_blank"
            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition"
          >
            <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp
          </a>
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
