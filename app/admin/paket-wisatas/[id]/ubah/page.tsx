"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function UbahPaketPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<any>(null);
  const [wilayahs, setWilayahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from("paket_wisata").select("*").eq("id", params.id).single(),
      supabase.from("wilayah").select("*"),
    ]).then(([{ data: paket }, { data: wil }]) => {
      if (paket) setForm({ ...paket, fasilitas: paket.fasilitas?.join("\n") || "" });
      setWilayahs(wil || []);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fasilitas = form.fasilitas.split("\n").filter((f: string) => f.trim());
    const { error } = await supabase
      .from("paket_wisata")
      .update({
        nama: form.nama,
        deskripsi: form.deskripsi,
        konten: form.konten,
        wilayah_id: form.wilayah_id || null,
        durasi_hari: form.durasi_hari,
        harga: parseFloat(form.harga),
        harga_coret: form.harga_coret ? parseFloat(form.harga_coret) : null,
        foto_utama: form.foto_utama || null,
        fasilitas,
        populer: form.populer,
        aktif: form.aktif,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        meta_keywords: form.meta_keywords || null,
        slot_total: form.slot_total || 0,
        slot_tersedia: form.slot_tersedia || 0,
      })
      .eq("id", params.id);

    if (error) toast.error("Gagal: " + error.message);
    else {
      toast.success("Berhasil diperbarui!");
      router.push("/admin/paket-wisatas");
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
        <Link href="/admin/paket-wisatas" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Paket Wisata</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Informasi Dasar</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Paket *</label>
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
              <label className="text-sm font-medium text-gray-700">Konten (HTML)</label>
              <textarea
                value={form.konten || ""}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                rows={6}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Fasilitas (satu per baris)</label>
              <textarea
                value={form.fasilitas}
                onChange={(e) => setForm({ ...form, fasilitas: e.target.value })}
                rows={4}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
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
                placeholder="wisata bali, paket tour, nusa penida"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Detail Paket</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">Wilayah</label>
              <select
                value={form.wilayah_id || ""}
                onChange={(e) => setForm({ ...form, wilayah_id: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Wilayah</option>
                {wilayahs.map((w) => (
                  <option key={w.id} value={w.id}>{w.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Durasi (Hari)</label>
              <input
                type="number" min={1}
                value={form.durasi_hari}
                onChange={(e) => setForm({ ...form, durasi_hari: parseInt(e.target.value) })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Harga (Rp)</label>
              <input
                type="number"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Harga Coret</label>
              <input
                type="number"
                value={form.harga_coret || ""}
                onChange={(e) => setForm({ ...form, harga_coret: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Total Slot</label>
              <input
                type="number"
                value={form.slot_total || 0}
                onChange={(e) => setForm({ ...form, slot_total: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Slot Tersedia</label>
              <input
                type="number"
                value={form.slot_tersedia || 0}
                onChange={(e) => setForm({ ...form, slot_tersedia: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <ImageUpload
              value={form.foto_utama || ""}
              onChange={(url) => setForm({ ...form, foto_utama: url })}
              bucket="images"
              folder="paket-wisata"
              label="Foto Utama"
            />

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.populer}
                  onChange={(e) => setForm({ ...form, populer: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Populer</span>
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
