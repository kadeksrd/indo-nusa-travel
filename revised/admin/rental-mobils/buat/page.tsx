"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function BuatMobilPage() {
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    kategori_id: "",
    kapasitas: 4,
    transmisi: "Manual",
    harga_per_hari: "",
    foto_utama: "",
    terfavorit: false,
    aktif: true,
    fitur: "",
  });
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("kategori_mobil").select("*").then(({ data }) => setKategoris(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.nama
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const fitur = form.fitur.split("\n").filter((f) => f.trim());

    const { error } = await supabase.from("rental_mobil").insert({
      nama: form.nama,
      slug,
      deskripsi: form.deskripsi,
      kategori_id: form.kategori_id || null,
      kapasitas: form.kapasitas,
      transmisi: form.transmisi,
      harga_per_hari: parseFloat(form.harga_per_hari),
      foto_utama: form.foto_utama || null,
      fitur,
      terfavorit: form.terfavorit,
      aktif: form.aktif,
    });

    if (error) toast.error("Gagal: " + error.message);
    else {
      toast.success("Mobil berhasil ditambahkan!");
      router.push("/admin/rental-mobils");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/rental-mobils" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Rental Mobil</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Informasi Kendaraan</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Kendaraan *</label>
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Toyota Avanza"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Deskripsi kendaraan..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Fitur (satu per baris)</label>
              <textarea
                value={form.fitur}
                onChange={(e) => setForm({ ...form, fitur: e.target.value })}
                rows={4}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder={`AC\nAudio System\nGPS\nKursi Nyaman`}
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
                value={form.kategori_id}
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
              <label className="text-sm font-medium text-gray-700">Kapasitas (orang)</label>
              <input
                type="number" min={1}
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
              <label className="text-sm font-medium text-gray-700">Harga per Hari (Rp) *</label>
              <input
                type="number"
                value={form.harga_per_hari}
                onChange={(e) => setForm({ ...form, harga_per_hari: e.target.value })}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="350000"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <ImageUpload
              value={form.foto_utama}
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
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
