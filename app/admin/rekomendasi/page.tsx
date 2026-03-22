"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Heart, Check, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function RekomendasiPage() {
  const [loading, setLoading] = useState(true);
  const [pakets, setPakets] = useState<any[]>([]);
  const [mobils, setMobils] = useState<any[]>([]);
  const [searchPaket, setSearchPaket] = useState("");
  const [searchMobil, setSearchMobil] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: pData }, { data: mData }] = await Promise.all([
      supabase.from("paket_wisata").select("id, nama, foto_utama, populer").order("nama"),
      supabase.from("rental_mobil").select("id, nama, foto_utama, terfavorit").order("nama"),
    ]);
    setPakets(pData || []);
    setMobils(mData || []);
    setLoading(false);
  };

  const togglePopulerPaket = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("paket_wisata")
      .update({ populer: !current })
      .eq("id", id);
    if (error) toast.error("Gagal update");
    else {
      setPakets(pakets.map(p => p.id === id ? { ...p, populer: !current } : p));
      toast.success("Status diperbarui");
    }
  };

  const toggleTerfavoritMobil = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("rental_mobil")
      .update({ terfavorit: !current })
      .eq("id", id);
    if (error) toast.error("Gagal update");
    else {
      setMobils(mobils.map(m => m.id === id ? { ...m, terfavorit: !current } : m));
      toast.success("Status diperbarui");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredPakets = pakets.filter(p => p.nama.toLowerCase().includes(searchPaket.toLowerCase()));
  const filteredMobils = mobils.filter(m => m.nama.toLowerCase().includes(searchMobil.toLowerCase()));

  return (
    <div className="space-y-10 pb-20 mt-20">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manajemen Rekomendasi</h1>
        <p className="text-gray-500 mt-1 font-medium italic">Pilih produk terbaik yang ingin Anda tampilkan di halaman depan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Paket Wisata Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-orange-600 fill-current" />
               </div>
               <h2 className="text-xl font-bold text-gray-900">Paket Wisata Populer</h2>
            </div>
            <span className="text-xs font-bold text-gray-400">
               {pakets.filter(p => p.populer).length} Terpilih
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari paket..." 
              value={searchPaket}
              onChange={(e) => setSearchPaket(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredPakets.map(p => (
              <div 
                key={p.id} 
                onClick={() => togglePopulerPaket(p.id, p.populer)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  p.populer 
                  ? "border-orange-500 bg-orange-50/50" 
                  : "border-gray-100 bg-white hover:border-orange-200"
                }`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {p.foto_utama && <Image src={p.foto_utama} alt={p.nama} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${p.populer ? "text-orange-900" : "text-gray-700"}`}>{p.nama}</p>
                </div>
                {p.populer && (
                  <div className="bg-orange-500 text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rental Mobil Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600 fill-current" />
               </div>
               <h2 className="text-xl font-bold text-gray-900">Rental Mobil Unggulan</h2>
            </div>
            <span className="text-xs font-bold text-gray-400">
               {mobils.filter(p => p.terfavorit).length} Terpilih
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari mobil..." 
              value={searchMobil}
              onChange={(e) => setSearchMobil(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredMobils.map(m => (
              <div 
                key={m.id} 
                onClick={() => toggleTerfavoritMobil(m.id, m.terfavorit)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  m.terfavorit 
                  ? "border-red-500 bg-red-50/50" 
                  : "border-gray-100 bg-white hover:border-red-200"
                }`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {m.foto_utama && <Image src={m.foto_utama} alt={m.nama} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${m.terfavorit ? "text-red-900" : "text-gray-700"}`}>{m.nama}</p>
                </div>
                {m.terfavorit && (
                  <div className="bg-red-500 text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
