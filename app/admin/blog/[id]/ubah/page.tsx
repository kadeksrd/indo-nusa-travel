"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function UbahBlogPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("blog")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        if (data) setForm({ ...data, tags: data.tags?.join(", ") || "" });
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const tags = form.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const { error } = await supabase
      .from("blog")
      .update({
        judul: form.judul,
        ringkasan: form.ringkasan,
        konten: form.konten,
        foto_utama: form.foto_utama || null,
        author_nama: form.author_nama,
        tags,
        dipublikasikan: form.dipublikasikan,
      })
      .eq("id", params.id);

    if (error) toast.error("Gagal: " + error.message);
    else {
      toast.success("Berhasil diperbarui!");
      router.push("/admin/blog");
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
        <Link href="/admin/blog" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Artikel</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Judul *
              </label>
              <input
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ringkasan
              </label>
              <textarea
                value={form.ringkasan || ""}
                onChange={(e) =>
                  setForm({ ...form, ringkasan: e.target.value })
                }
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Konten (HTML)
              </label>
              <textarea
                value={form.konten || ""}
                onChange={(e) => setForm({ ...form, konten: e.target.value })}
                rows={12}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              />
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                value={form.author_nama || ""}
                onChange={(e) =>
                  setForm({ ...form, author_nama: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                URL Foto
              </label>
              <input
                value={form.foto_utama || ""}
                onChange={(e) =>
                  setForm({ ...form, foto_utama: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
