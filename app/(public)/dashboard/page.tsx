import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ClipboardList } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  dikonfirmasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  dibatalkan: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");

  const [{ data: profile }, { data: pemesanans }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("pemesanan")
      .select(
        "*, paket_wisata(nama, foto_utama), rental_mobil(nama, foto_utama)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const formatHarga = (h: number) => "Rp " + h.toLocaleString("id-ID");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Banner */}
      <div className="bg-blue-700 rounded-2xl p-6 text-white flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
          {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold">
            Halo, {profile?.full_name || "Pengguna"}!
          </h1>
          <p className="text-blue-200 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Riwayat Pemesanan */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">
          Riwayat Pemesanan
        </h2>

        {!pemesanans?.length ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Belum ada riwayat pemesanan</p>
            <Link
              href="/paket-wisata"
              className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
            >
              Buat Pemesanan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pemesanans.map((p) => (
              <div key={p.id} className="border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {p.paket_wisata?.nama ||
                        p.rental_mobil?.nama ||
                        "Pemesanan"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.kode_pemesanan} •{" "}
                      {format(new Date(p.created_at), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[p.status] || "bg-gray-100"}`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {format(new Date(p.tanggal_berangkat), "dd MMM yyyy", {
                      locale: id,
                    })}{" "}
                    • {p.jumlah_orang} orang
                  </span>
                  <span className="font-bold text-blue-700">
                    {formatHarga(p.total_harga)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
