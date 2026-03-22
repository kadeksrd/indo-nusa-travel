"use client";
import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ClipboardList, MessageSquare, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ReviewModal from "@/components/dashboard/ReviewModal";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  dikonfirmasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700 border border-green-200",
  dibatalkan: "bg-gray-100 text-gray-700",
};

export default function DashboardContent({ profile, pemesanans, user }: any) {
  const [selectedPemesanan, setSelectedPemesanan] = useState<any>(null);
  const formatHarga = (h: number) => "Rp " + Number(h).toLocaleString("id-ID");

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
      {/* Profile Banner */}
      <div className="relative bg-blue-700 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl shadow-blue-700/20 mb-10 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125" />
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 backdrop-blur-md border-4 border-white/30 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl">
            {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Halo, {profile?.full_name?.split(' ')[0] || "Traveler"}!
            </h1>
            <p className="text-blue-100 font-bold mb-4 opacity-80">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-white/20">
                  {pemesanans.length} Pemesanan
               </div>
               <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Premium Member
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Pemesanan */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="font-black text-gray-900 text-2xl tracking-tight">
                Riwayat Perjalanan
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">Kelola dan lihat kembali petualangan Anda.</p>
           </div>
           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
           </div>
        </div>

        {!pemesanans?.length ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <ClipboardList className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold text-lg mb-6">Belum ada riwayat pemesanan</p>
            <Link
              href="/paket-wisata"
              className="inline-flex items-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-800 transition shadow-xl shadow-blue-700/20"
            >
              Mulai Petualangan Anda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pemesanans.map((p: any) => (
              <div key={p.id} className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-blue-700/5 transition-all duration-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                      {p.paket_wisata?.nama || p.rental_mobil?.nama || "Pemesanan"}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">
                      {p.kode_pemesanan} • {format(new Date(p.created_at), "dd MMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusColor[p.status] || "bg-gray-100"}`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Keberangkatan</p>
                     <p className="text-sm font-bold text-gray-700">
                        {format(new Date(p.tanggal_berangkat), "dd MMM yyyy", { locale: id })}
                     </p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total</p>
                     <p className="font-black text-lg text-blue-700">{formatHarga(p.total_harga)}</p>
                  </div>
                </div>

                {p.status === "selesai" && (
                  <button 
                    onClick={() => setSelectedPemesanan(p)}
                    className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Beri Ulasan
                  </button>
                )}
                
                {p.status === "pending" && (
                  <Link 
                    href={`/pembayaran/${p.kode_pemesanan}`}
                    className="mt-6 w-full py-3 bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                  >
                    Lanjut Bayar
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPemesanan && (
        <ReviewModal 
          pemesanan={selectedPemesanan} 
          onClose={() => setSelectedPemesanan(null)} 
          onSuccess={() => {
            setSelectedPemesanan(null);
            // Optional: refresh data
          }}
        />
      )}
    </div>
  );
}
