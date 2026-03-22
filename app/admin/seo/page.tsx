"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Save, Plus, Trash2 } from "lucide-react";

export default function AdminSeoPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data } = await supabase.from("seo_halaman").select("*").order("path");
    setPages(data || []);
  };

  const handleChange = (id: string, field: string, value: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = async (page: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("seo_halaman")
      .upsert({
        id: page.id,
        path: page.path,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        meta_keywords: page.meta_keywords,
        updated_at: new Date().toISOString()
      });

    if (error) toast.error("Gagal menyimpan: " + error.message);
    else toast.success(`SEO untuk ${page.path} berhasil disimpan!`);
    setLoading(false);
  };

  const handleAdd = async () => {
    const path = prompt("Masukkan path halaman (contoh: /tentang-kami):");
    if (!path) return;

    const { data, error } = await supabase
      .from("seo_halaman")
      .insert({ path, meta_title: "", meta_description: "", meta_keywords: "" })
      .select()
      .single();

    if (error) toast.error("Gagal menambah: " + error.message);
    else {
      setPages([...pages, data]);
      toast.success("Halaman berhasil ditambahkan!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengaturan SEO untuk halaman ini?")) return;
    const { error } = await supabase.from("seo_halaman").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else {
      setPages(pages.filter(p => p.id !== id));
      toast.success("Berhasil dihapus");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kelola SEO Halaman Statis</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Halaman
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pages.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-bold text-blue-700">{p.path}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(p)}
                  disabled={loading}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-700 transition"
                >
                  <Save className="w-3 h-3" /> Simpan
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Title</label>
                <input
                  value={p.meta_title || ""}
                  onChange={(e) => handleChange(p.id, "meta_title", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Judul halaman..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Keywords</label>
                <input
                  value={p.meta_keywords || ""}
                  onChange={(e) => handleChange(p.id, "meta_keywords", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="kata, kunci, seo"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Description</label>
                <textarea
                  value={p.meta_description || ""}
                  onChange={(e) => handleChange(p.id, "meta_description", e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Deskripsi singkat halaman..."
                />
              </div>
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">Belum ada halaman yang ditambahkan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
