import { createClient } from "@/lib/supabase/server";
import {
  Package,
  Car,
  ShoppingCart,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: totalPaket },
    { count: totalMobil },
    { count: totalPemesanan },
    { count: totalBlog },
    { data: recentPemesanan },
  ] = await Promise.all([
    supabase.from("paket_wisata").select("*", { count: "exact", head: true }),
    supabase.from("rental_mobil").select("*", { count: "exact", head: true }),
    supabase.from("pemesanan").select("*", { count: "exact", head: true }),
    supabase.from("blog").select("*", { count: "exact", head: true }),
    supabase
      .from("pemesanan")
      .select("*, paket_wisata(nama), rental_mobil(nama)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Paket Wisata",
      value: totalPaket || 0,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Rental Mobil",
      value: totalMobil || 0,
      icon: Car,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pemesanan",
      value: totalPemesanan || 0,
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Artikel Blog",
      value: totalBlog || 0,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    dikonfirmasi: "bg-blue-100 text-blue-700",
    selesai: "bg-green-100 text-green-700",
    dibatalkan: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-5">
            <div
              className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}
            >
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Pemesanan */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" /> Pemesanan Terbaru
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Kode
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Layanan
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Pemesan
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Total
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(recentPemesanan || []).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-xs">
                    {p.kode_pemesanan}
                  </td>
                  <td className="py-3 px-3">
                    {p.paket_wisata?.nama || p.rental_mobil?.nama || "-"}
                  </td>
                  <td className="py-3 px-3">{p.nama_lengkap}</td>
                  <td className="py-3 px-3 font-medium">
                    Rp {p.total_harga?.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
