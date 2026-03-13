import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, CheckCircle, XCircle } from "lucide-react";
import DeleteMobilButton from "./DeleteMobilButton";

export default async function AdminRentalMobilPage() {
  const supabase = createClient();
  const { data: mobils } = await supabase
    .from("rental_mobil")
    .select("*, kategori_mobil(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="text-sm text-gray-400 mb-1">Paket › Rental Mobil</nav>
          <h1 className="text-2xl font-bold text-gray-900">Rental Mobil</h1>
        </div>
        <Link
          href="/admin/rental-mobils/buat"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Mobil
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Foto",
                  "Nama Mobil",
                  "Kategori",
                  "Kapasitas",
                  "Transmisi",
                  "Harga/Hari",
                  "Favorit",
                  "Aktif",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-gray-500 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {(mobils || []).map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-12 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      {m.foto_utama && (
                        <img
                          src={m.foto_utama}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {m.nama}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {m.kategori_mobil?.nama}
                    </span>
                  </td>
                  <td className="py-3 px-4">{m.kapasitas} org</td>
                  <td className="py-3 px-4">{m.transmisi}</td>
                  <td className="py-3 px-4 font-medium">
                    Rp {m.harga_per_hari?.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4">
                    {m.terfavorit ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {m.aktif ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/rental-mobils/${m.id}/ubah`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                      >
                        <Pencil className="w-3 h-3" /> Ubah
                      </Link>
                      <DeleteMobilButton id={m.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t text-sm text-gray-500">
          Total: {mobils?.length || 0} kendaraan
        </div>
      </div>
    </div>
  );
}
