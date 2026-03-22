"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Home, MessageCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function PembayaranGagalContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [waNumber, setWaNumber] = useState("6281234567890");
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("pengaturan_website")
      .select("nilai")
      .eq("kunci", "whatsapp")
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.nilai) setWaNumber(data.nilai);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
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
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo, saya mengalami masalah pembayaran.\nKode Booking: ${orderId}\nMohon bantu. Terima kasih!`)}`}
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

export default function PembayaranGagalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      }
    >
      <PembayaranGagalContent />
    </Suspense>
  );
}
