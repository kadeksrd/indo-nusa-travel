import Link from "next/link";
import Image from "next/image";
import { Users, Settings2, Car, Heart } from "lucide-react";
import { RentalMobil } from "@/types";
import SlotBadge from "@/components/shared/SlotBadge";

interface Props {
  mobil: RentalMobil & { kategori_mobil?: any };
  compact?: boolean;
}

export default function MobilCard({ mobil, compact = false }: Props) {
  const formatHarga = (h: number) => "Rp " + Number(h).toLocaleString("id-ID");

  return (
    <Link
      href={`/rental-mobil/${mobil.slug}`}
      className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-700/10 hover:-translate-y-2 flex flex-col h-full"
    >
      <div className={`relative overflow-hidden bg-gray-50 flex-shrink-0 ${compact ? "h-44 md:h-52" : "h-56 md:h-64"}`}>
        {mobil.foto_utama ? (
          <Image
            src={mobil.foto_utama}
            alt={mobil.nama}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Car className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Kategori Badge */}
        <div className="absolute top-4 left-4 pt-4 px-4 pb-4">
           {mobil.kategori_mobil && (
             <span className="bg-white/95 backdrop-blur-md text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
               {mobil.kategori_mobil.nama}
             </span>
           )}
        </div>

        {mobil.terfavorit && (
          <div className="absolute top-4 right-4">
            <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg animate-bounce">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4">
           <SlotBadge tersedia={mobil.stok_tersedia} total={mobil.stok_total} variant="simpel" />
        </div>
      </div>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-blue-700 transition-colors tracking-tight line-clamp-1">
              {mobil.nama}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 text-gray-500 bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold leading-none">{mobil.kapasitas} Seat</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-500 bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100">
              <Settings2 className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase leading-none">{mobil.transmisi === "Automatic" ? "MATIC" : "MANUAL"}</span>
            </div>
          </div>

          <div className="mt-auto border-t flex items-center justify-between pt-5">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Mulai Dari</p>
               <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-blue-700">{formatHarga(Number(mobil.harga_per_hari))}</span>
                  <span className="text-[10px] items-center font-bold text-gray-400 italic">/Hari</span>
               </div>
            </div>
          </div>
      </div>
    </Link>
  );
}
