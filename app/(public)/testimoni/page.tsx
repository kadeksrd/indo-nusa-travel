import { createClient } from "@/lib/supabase/server";
import { Star } from "lucide-react";

export default async function TestimoniPage() {
  const supabase = createClient();
  const { data: testimonis } = await supabase
    .from("testimoni")
    .select("*")
    .eq("disetujui", true)
    .order("created_at", { ascending: false });

  const avgRating = testimonis?.length
    ? (
        testimonis.reduce((a, t) => a + t.rating, 0) / testimonis.length
      ).toFixed(1)
    : "0";

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-500 py-16 text-center text-white">
        <h1 className="text-3xl font-bold">Testimoni Pelanggan</h1>
        <p className="mt-2 text-blue-200">
          Kepercayaan Anda adalah prioritas utama kami
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-2xl font-bold">{avgRating}</span>
          <span className="text-blue-200 text-sm">
            dari {testimonis?.length} ulasan
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl border p-6 mb-10">
          <h2 className="font-bold text-gray-900 mb-4">Distribusi Rating</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                testimonis?.filter((t) => t.rating === star).length || 0;
              const pct = testimonis?.length
                ? (count / testimonis.length) * 100
                : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-right text-gray-600">{star}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimoni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(testimonis || []).map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border p-6 hover:shadow-md transition"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                `{t.komentar}`
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                  {t.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.nama}
                  </p>
                  {t.verified && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      ✓ Verified Customer
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
