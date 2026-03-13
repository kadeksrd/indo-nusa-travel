import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import DeletePaketButton from "./DeletePaketButton";

export default async function AdminPaketPage() {
  const supabase = createClient();
  const { data: pakets } = await supabase
    .from("paket_wisata")
    .select("*, wilayah(*)")
    .order("created_at", { ascending: false });

  const formatHarga = (h: number) => "Rp " + h.toLocaleString("id-ID");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="text-sm text-gray-400 mb-1">Paket › Daftar</nav>
          <h1 className="text-2xl font-bold text-gray-900">Paket Wisata</h1>
        </div>
        <Link
          href="/admin/paket-wisatas/buat"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"
        >
          <Plus className="w-4 h-4" /> Buat paket wisata
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b flex justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Cari"
              className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Foto
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Nama paket
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Wilayah
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Durasi
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Harga
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Populer
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Aktif
                </th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(pakets || []).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      {p.foto_utama && (
                        <img
                          src={p.foto_utama}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {p.nama}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {p.wilayah?.nama}
                    </span>
                  </td>
                  <td className="py-3 px-4">{p.durasi_hari} Hari</td>
                  <td className="py-3 px-4">{formatHarga(p.harga)}</td>
                  <td className="py-3 px-4">
                    {p.populer ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.aktif ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/paket-wisatas/${p.id}/ubah`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                      >
                        <Pencil className="w-3 h-3" /> Ubah
                      </Link>
                      <DeletePaketButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <span>
            Menampilkan 1 sampai {pakets?.length} dari {pakets?.length} hasil
          </span>
          <div className="flex items-center gap-2">
            <span>per halaman</span>
            <select className="border rounded px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
