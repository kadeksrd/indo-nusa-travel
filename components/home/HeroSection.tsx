"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Wilayah } from "@/types";

interface Props {
  wilayahs: Wilayah[];
  settings?: Record<string, string>;
}

export default function HeroSection({ wilayahs, settings }: Props) {
  const [tab, setTab] = useState<"paket" | "rental">("paket");
  const [wilayah, setWilayah] = useState("");
  const [durasi, setDurasi] = useState("");
  const router = useRouter();

  const heroImage = settings?.hero_image_home || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&auto=format&fit=crop&q=80";
  const heroTitle = settings?.hero_judul || "Destinasi Impian";
  const heroSub = settings?.hero_subjudul || "Temukan pengalaman perjalanan tak terlupakan dengan paket wisata eksklusif dan layanan rental mobil premium di Bali.";

  const handleSearch = () => {
    // ... (existing logic) ...
  };

  return (
    <section className="relative min-h-[800px] h-[95vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <Image
        src={heroImage}
        alt="Hero Background"
        fill
        priority
        className="object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-32 pb-24 md:pt-40 md:pb-40">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-[0.2em] mb-6 md:mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          Jelajahi Surga Nusantara
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
          {heroTitle.split(" ").slice(0, -2).join(" ")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            {heroTitle.split(" ").slice(-2).join(" ")}
          </span>
        </h1>
        
        <p className="text-white/90 text-sm md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-4">
          {heroSub}
        </p>

        {/* Floating Search Container */}
        <div className="relative max-w-4xl mx-auto mt-4 md:mt-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-2 md:p-3 border border-white/50 transform transition-all hover:shadow-blue-500/10 mx-auto w-full max-w-[95%] md:max-w-none">
            <div className="flex flex-col md:flex-row items-stretch gap-1 md:gap-2">
              <div className="flex-1 flex items-center gap-3 p-3 md:pl-6 border-b md:border-b-0 md:border-r border-gray-100">
                <Search className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="flex-1 text-left">
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider">Cari Destinasi</label>
                  <select 
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    className="w-full bg-transparent text-gray-900 font-bold text-sm focus:outline-none appearance-none cursor-pointer py-1"
                  >
                    <option value="">Semua Wilayah</option>
                    {wilayahs.map(w => <option key={w.id} value={w.slug}>{w.nama}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 p-3 md:pl-6 border-b md:border-b-0 md:border-r border-gray-100 md:border-r-0">
                <div className="flex-1 text-left">
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider">Durasi Liburan</label>
                  <select 
                    value={durasi}
                    onChange={(e) => setDurasi(e.target.value)}
                    className="w-full bg-transparent text-gray-900 font-bold text-sm focus:outline-none appearance-none cursor-pointer py-1"
                  >
                    <option value="">Pilih Durasi</option>
                    <option value="3">3-4 Hari</option>
                    <option value="5">5-6 Hari</option>
                    <option value="7">7+ Hari</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSearch}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-[1.2rem] md:rounded-[2rem] font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-700/30 md:mt-0"
              >
                Cari Sekarang
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-12 opacity-80">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-white text-[10px] md:text-xs font-bold">10k+ Travelers</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Search className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              </div>
              <span className="text-white text-[10px] md:text-xs font-bold">Top Choice 2024</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
