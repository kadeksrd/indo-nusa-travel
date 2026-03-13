"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function BuatPaketPage() {
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    wilayah_id: "",
    durasi_hari: 1,
    harga: "",
    harga_coret: "",
    foto_utama: "",
    populer: false,
    aktif: true,
    fasilitas: "",
    konten: "",
  });
  const [wilayahs, setWilayahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("wilayah").select("*").then(({ data }) => setWilayahs(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = form.nama
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const fasilitas = form.fasilitas.split("\n").filter((f) => f.trim());

    const { error } = await supabase.from("paket_wisata").insert({
      nama: form.nama,
      slug,
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
    });

    if (error) toast.error("Gagal menyimpan: " + error.message);
    else {
      toast.success("Paket berhasil dibuat!");
      router.push("/admin/paket-wisatas");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/paket-wisatas" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Paket Wisata</h1>
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
                placeholder="Paket Wisata Bali Eksotis"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Deskripsi Singkat</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Deskripsi singkat paket wisata..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Konten Lengkap (HTML)</label>
              <textarea
                value={form.konten}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                rows={6}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                placeholder="<p>Konten lengkap paket wisata...</p>"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Fasilitas</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">Fasilitas (satu per baris)</label>
              <textarea
                value={form.fasilitas}
                onChange={(e) => setForm({ ...form, fasilitas: e.target.value })}
                rows={5}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder={`Transportasi AC\nPemandu wisata\nMakan 3x sehari\nHotel bintang 3`}
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
                value={form.wilayah_id}
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
              <label className="text-sm font-medium text-gray-700">Durasi (Hari) *</label>
              <input
                type="number" min={1}
                value={form.durasi_hari}
                onChange={(e) => setForm({ ...form, durasi_hari: parseInt(e.target.value) })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Harga (Rp) *</label>
              <input
                type="number"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1500000"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Harga Coret (opsional)</label>
              <input
                type="number"
                value={form.harga_coret}
                onChange={(e) => setForm({ ...form, harga_coret: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2000000"
              />
            </div>

            {/* IMAGE UPLOAD - ganti dari input URL */}
            <ImageUpload
              value={form.foto_utama}
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
            {loading ? "Menyimpan..." : "Simpan Paket"}
          </button>
        </div>
      </form>
    </div>
  );
}
