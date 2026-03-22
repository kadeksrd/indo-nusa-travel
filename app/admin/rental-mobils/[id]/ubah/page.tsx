"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function UbahMobilPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<any>(null);
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from("rental_mobil").select("*").eq("id", params.id).single(),
      supabase.from("kategori_mobil").select("*"),
    ]).then(([{ data: mobil }, { data: kat }]) => {
      if (mobil) setForm({ ...mobil, fitur: mobil.fitur?.join("\n") || "" });
      setKategoris(kat || []);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fitur = form.fitur.split("\n").filter((f: string) => f.trim());
    const { error } = await supabase
      .from("rental_mobil")
      .update({
        nama: form.nama,
        deskripsi: form.deskripsi,
        kategori_id: form.kategori_id || null,
        kapasitas: form.kapasitas,
        transmisi: form.transmisi,
        harga_per_hari: parseFloat(form.harga_per_hari),
        foto_utama: form.foto_utama || null,
        fitur,
        terfavorit: form.terfavorit,
        aktif: form.aktif,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        meta_keywords: form.meta_keywords || null,
        stok_total: form.stok_total || 1,
        stok_tersedia: form.stok_tersedia !== undefined ? form.stok_tersedia : (form.stok_total || 1),
      })
      .eq("id", params.id);

    if (error) toast.error("Gagal: " + error.message);
    else {
      toast.success("Berhasil diperbarui!");
      router.push("/admin/rental-mobils");
    }
    setLoading(false);
  };

  if (!form)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/rental-mobils" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Rental Mobil</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Informasi Kendaraan</h2>
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Kendaraan *</label>
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={form.deskripsi || ""}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Fitur (satu per baris)</label>
            <textarea
              value={form.fitur}
              onChange={(e) => setForm({ ...form, fitur: e.target.value })}
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">SEO (Optimasi Mesin Pencari)</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Title</label>
              <input
                value={form.meta_title || ""}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Judul untuk SEO..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              <textarea
                value={form.meta_description || ""}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Deskripsi singkat untuk hasil pencarian Google..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Keywords</label>
              <input
                value={form.meta_keywords || ""}
                onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="rental mobil bali, sewa mobil murah"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Detail</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={form.kategori_id || ""}
                onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori</option>
                {kategoris.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kapasitas</label>
              <input
                type="number"
                value={form.kapasitas}
                onChange={(e) => setForm({ ...form, kapasitas: parseInt(e.target.value) })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Transmisi</label>
              <select
                value={form.transmisi}
                onChange={(e) => setForm({ ...form, transmisi: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Harga per Hari (Rp)</label>
              <input
                type="number"
                value={form.harga_per_hari}
                onChange={(e) => setForm({ ...form, harga_per_hari: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Total Stok</label>
                <input
                  type="number" min={1}
                  value={form.stok_total || 0}
                  onChange={(e) => setForm({ ...form, stok_total: parseInt(e.target.value) })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Stok Tersedia</label>
                <input
                  type="number" min={0}
                  value={form.stok_tersedia || 0}
                  onChange={(e) => setForm({ ...form, stok_tersedia: parseInt(e.target.value) })}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <ImageUpload
              value={form.foto_utama || ""}
              onChange={(url) => setForm({ ...form, foto_utama: url })}
              bucket="images"
              folder="rental-mobil"
              label="Foto Kendaraan"
            />

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terfavorit}
                  onChange={(e) => setForm({ ...form, terfavorit: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Terfavorit</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.aktif}
                  onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
