"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Wilayah } from "@/types";

interface Props {
  wilayahs: Wilayah[];
}

export default function HeroSection({ wilayahs }: Props) {
  const [tab, setTab] = useState<"paket" | "rental">("paket");
  const [wilayah, setWilayah] = useState("");
  const [durasi, setDurasi] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (tab === "paket") {
      const params = new URLSearchParams();
      if (wilayah) params.set("wilayah", wilayah);
      if (durasi) params.set("durasi", durasi);
      router.push("/paket-wisata?" + params.toString());
    } else {
      router.push("/rental-mobil");
    }
  };

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
          🌴 Jelajahi Surga Nusantara
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Jelajahi Keindahan <span className="text-yellow-400">Nusantara</span>{" "}
          Bersama Kami
        </h1>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Paket wisata eksklusif dan rental mobil nyaman untuk perjalanan tak
          terlupakan di Bali & sekitarnya.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("paket")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "paket" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              🏖️ Paket Wisata
            </button>
            <button
              onClick={() => setTab("rental")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "rental" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              🚗 Rental Mobil
            </button>
          </div>

          {tab === "paket" && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Wilayah
                </label>
                <select
                  value={wilayah}
                  onChange={(e) => setWilayah(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Wilayah</option>
                  {wilayahs.map((w) => (
                    <option key={w.id} value={w.slug}>
                      {w.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Durasi
                </label>
                <select
                  value={durasi}
                  onChange={(e) => setDurasi(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Durasi</option>
                  <option value="3">3 Hari</option>
                  <option value="4">4 Hari</option>
                  <option value="5">5 Hari</option>
                  <option value="7">7 Hari</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition"
          >
            <Search className="w-4 h-4" /> Cari Paket
          </button>
        </div>
      </div>
    </section>
  );
}
