import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { PaketWisata } from "@/types";
import SlotBadge from "@/components/shared/SlotBadge";

interface Props {
  paket: PaketWisata & { wilayah?: any };
  showPopuler?: boolean;
}

export default function PaketCard({ paket, showPopuler = true }: Props) {
  const formatHarga = (harga: number) => "Rp " + Number(harga).toLocaleString("id-ID");

  return (
    <Link
      href={`/paket-wisata/${paket.slug}`}
      className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-700/10 hover:-translate-y-2 flex flex-col h-full"
    >
      <div className="relative h-64 md:h-72 overflow-hidden bg-gray-50 flex-shrink-0">
        {paket.foto_utama ? (
          <Image
            src={paket.foto_utama}
            alt={paket.nama}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {/* Region Badge */}
        <div className="absolute top-5 left-5">
           <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span className="text-gray-900 text-[10px] font-black uppercase tracking-wider">
                {paket.wilayah?.nama}
              </span>
           </div>
        </div>

        {showPopuler && paket.populer && (
          <div className="absolute top-5 right-5">
            <div className="bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-pulse">
              🔥 Trending
            </div>
          </div>
        )}

        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-white">
           <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">{paket.durasi_hari} Hari</span>
           </div>
           <div className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black">{paket.rating || "5.0"}</span>
           </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-blue-700 transition-colors leading-[1.3] mb-3 tracking-tight">
              {paket.nama}
            </h3>
            <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
              {paket.deskripsi}
            </p>
          </div>

          <div className="mt-auto border-t border-gray-50 flex items-center justify-between pt-6">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mulai Dari</p>
                <div className="flex items-baseline gap-1">
                   <p className="text-2xl font-black text-blue-700 tracking-tighter">
                    {formatHarga(Number(paket.harga))}
                  </p>
                  <span className="text-xs text-gray-400 font-bold italic">/Org</span>
                </div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all duration-300">
                <ArrowRight className="w-6 h-6" />
             </div>
          </div>
      </div>
    </Link>
  );
}
