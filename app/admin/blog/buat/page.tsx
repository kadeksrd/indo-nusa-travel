"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function BuatBlogPage() {
  const [form, setForm] = useState({
    judul: "",
    ringkasan: "",
    konten: "",
    foto_utama: "",
    author_nama: "",
    tags: "",
    dipublikasikan: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { error } = await supabase.from("blog").insert({
      judul: form.judul,
      slug,
      ringkasan: form.ringkasan,
      konten: form.konten,
      foto_utama: form.foto_utama || null,
      author_nama: form.author_nama,
      tags,
      dipublikasikan: form.dipublikasikan,
    });
    if (error) toast.error("Gagal: " + error.message);
    else {
      toast.success("Artikel berhasil dibuat!");
      router.push("/admin/blog");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Artikel Blog</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Judul Artikel *
              </label>
              <input
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10 Destinasi Wisata Terbaik..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ringkasan
              </label>
              <textarea
                value={form.ringkasan}
                onChange={(e) =>
                  setForm({ ...form, ringkasan: e.target.value })
                }
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Ringkasan singkat artikel..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Konten (HTML)
              </label>
              <textarea
                value={form.konten}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                rows={12}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                placeholder="<p>Konten artikel...</p>"
              />
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Detail Artikel</h2>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Author
              </label>
              <input
                value={form.author_nama}
                onChange={(e) =>
                  setForm({ ...form, author_nama: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Admin Nusa Bali Travel"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                URL Foto Utama
              </label>
              <input
                value={form.foto_utama}
                onChange={(e) =>
                  setForm({ ...form, foto_utama: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tags (pisah dengan koma)
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="wisata, bali, tips"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.dipublikasikan}
                onChange={(e) =>
                  setForm({ ...form, dipublikasikan: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Publikasikan
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {loading ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
}
