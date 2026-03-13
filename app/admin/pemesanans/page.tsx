import { createClient } from "@/lib/supabase/server";
import UpdateStatusButton from "./UpdateStatusButton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  dikonfirmasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  dibatalkan: "bg-red-100 text-red-700",
};

const statusBayarColor: Record<string, string> = {
  belum_bayar: "bg-gray-100 text-gray-600",
  dp_terbayar: "bg-orange-100 text-orange-700",
  lunas: "bg-green-100 text-green-700",
  gagal: "bg-red-100 text-red-600",
  refund: "bg-purple-100 text-purple-700",
};

const statusBayarLabel: Record<string, string> = {
  belum_bayar: "Belum Bayar",
  dp_terbayar: "DP Terbayar",
  lunas: "Lunas",
  gagal: "Gagal",
  refund: "Refund",
};

export default async function AdminPemesananPage() {
  const supabase = createClient();
  const { data: pemesanans } = await supabase
    .from("pemesanan")
    .select("*, paket_wisata(nama), rental_mobil(nama)")
    .order("created_at", { ascending: false });

  const total = pemesanans?.length || 0;
  const lunas = pemesanans?.filter((p) => p.status_pembayaran === "lunas").length || 0;
  const pending = pemesanans?.filter((p) => p.status === "pending").length || 0;
  const totalRevenue = pemesanans
    ?.filter((p) => p.status_pembayaran === "lunas")
    .reduce((sum, p) => sum + (p.jumlah_dibayar || 0), 0) || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pemesanan</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Pesanan</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pending}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Pembayaran Lunas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{lunas}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-lg font-bold text-blue-700 mt-1">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Kode", "Layanan", "Pemesan", "Tanggal", "Pembayaran", "Status Bayar", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {(pemesanans || []).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-mono text-xs text-gray-700">{p.kode_pemesanan}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.tipe_pembayaran === "dp" ? "DP 20%" : "Lunas"}
                    </p>
                  </td>
                  <td className="py-3 px-4 max-w-[160px]">
                    <p className="truncate text-gray-800">
                      {p.paket_wisata?.nama || p.rental_mobil?.nama}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.jumlah_orang} orang
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{p.nama_lengkap}</p>
                    <p className="text-gray-400 text-xs">{p.nomor_hp}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                    {p.tanggal_berangkat
                      ? format(new Date(p.tanggal_berangkat), "dd MMM yyyy", { locale: id })
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">
                      Rp {(p.jumlah_dibayar || p.total_harga)?.toLocaleString("id-ID")}
                    </p>
                    {p.tipe_pembayaran === "dp" && p.sisa_pembayaran > 0 && (
                      <p className="text-xs text-orange-500 mt-0.5">
                        Sisa: Rp {p.sisa_pembayaran?.toLocaleString("id-ID")}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusBayarColor[p.status_pembayaran] || "bg-gray-100 text-gray-600"
                    }`}>
                      {statusBayarLabel[p.status_pembayaran] || p.status_pembayaran || "-"}
                    </span>
                    {p.paid_at && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(p.paid_at), "dd/MM HH:mm")}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <UpdateStatusButton id={p.id} currentStatus={p.status} />
                  </td>
                </tr>
              ))}
              {(!pemesanans || pemesanans.length === 0) && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Belum ada pemesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
