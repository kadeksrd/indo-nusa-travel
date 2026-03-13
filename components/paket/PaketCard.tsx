import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { PaketWisata } from "@/types";

interface Props {
  paket: PaketWisata & { wilayah?: any };
  showPopuler?: boolean;
}

export default function PaketCard({ paket, showPopuler = true }: Props) {
  const formatHarga = (harga: number) => "Rp " + harga.toLocaleString("id-ID");

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border">
      <div className="relative">
        <div className="relative h-48 bg-gray-100">
          {paket.foto_utama && (
            <Image
              src={paket.foto_utama}
              alt={paket.nama}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full">
            {paket.durasi_hari}H
          </span>
          {showPopuler && paket.populer && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 Populer
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(paket.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({paket.total_ulasan})
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {paket.nama}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 text-red-400" />
          <span>{paket.wilayah?.nama}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Mulai dari</p>
            <p className="font-bold text-blue-700">
              {formatHarga(paket.harga)}
            </p>
          </div>
          <Link
            href={`/paket-wisata/${paket.slug}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Detail →
          </Link>
        </div>
      </div>
    </div>
  );
}
