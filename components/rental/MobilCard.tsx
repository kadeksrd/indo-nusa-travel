import Link from "next/link";
import Image from "next/image";
import { Users, Settings } from "lucide-react";
import { RentalMobil } from "@/types";

interface Props {
  mobil: RentalMobil & { kategori_mobil?: any };
  compact?: boolean;
}

export default function MobilCard({ mobil, compact = false }: Props) {
  const formatHarga = (h: number) => "Rp " + h.toLocaleString("id-ID");

  return (
    <Link href={`/rental-mobil/${mobil.slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border cursor-pointer">
        <div className={`relative bg-gray-100 ${compact ? "h-32" : "h-48"}`}>
          {mobil.foto_utama && (
            <Image
              src={mobil.foto_utama}
              alt={mobil.nama}
              fill
              className="object-cover"
            />
          )}
          {mobil.terfavorit && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Terfavorit
            </span>
          )}
        </div>
        <div className="p-3">
          {mobil.kategori_mobil && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block ${
                mobil.kategori_mobil.slug === "terfavorit"
                  ? "bg-red-50 text-red-600"
                  : mobil.kategori_mobil.slug === "mobil-besar"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-green-50 text-green-600"
              }`}
            >
              {mobil.kategori_mobil.nama}
            </span>
          )}
          <h3
            className={`font-semibold text-gray-900 ${compact ? "text-sm" : ""}`}
          >
            {mobil.nama}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {mobil.kapasitas} org
            </span>
            <span className="flex items-center gap-1">
              <Settings className="w-3 h-3" /> {mobil.transmisi}
            </span>
          </div>
          <p className="font-bold text-blue-700 mt-2 text-sm">
            {formatHarga(mobil.harga_per_hari)}
            <span className="font-normal text-gray-400">/hari</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
