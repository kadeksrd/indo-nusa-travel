import { Star } from "lucide-react";
import { Testimoni } from "@/types";

interface Props {
  testimonis: Testimoni[];
}

export default function TestimoniSection({ testimonis }: Props) {
  return (
    <section className="py-16 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Apa Kata Mereka?</h2>
          <p className="text-blue-200 mt-2">
            Kepercayaan pelanggan adalah prioritas utama
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonis.map((t) => (
            <div
              key={t.id}
              className="bg-white/10 backdrop-blur rounded-xl p-5 text-white"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-white/90 mb-4 leading-relaxed">
                `{t.komentar}`
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                  {t.nama.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.nama}</p>
                  {t.verified && (
                    <p className="text-xs text-blue-200">✓ Verified Customer</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
