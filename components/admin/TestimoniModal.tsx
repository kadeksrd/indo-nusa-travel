"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, X, Loader2, User, MessageSquare, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimoniModal({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    rating: 5,
    komentar: "",
    avatar_url: "",
    disetujui: true,
    verified: true,
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.komentar) return toast.error("Nama dan komentar wajib diisi");

    setLoading(true);
    try {
      const { error } = await supabase.from("testimoni").insert(formData);
      if (error) throw error;
      toast.success("Testimoni berhasil ditambahkan");
      onSuccess();
    } catch (err: any) {
      toast.error("Gagal menambah testimoni: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <MessageSquare className="w-5 h-5" />
             </div>
             <h3 className="font-black text-gray-900">Tambah Testimoni Manual</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nama Pelanggan</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Email (Opsional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="budi@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Rating Kepuasan</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: s })}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-8 h-8 ${
                      formData.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Isi Testimoni</label>
            <textarea
              value={formData.komentar}
              onChange={(e) => setFormData({ ...formData, komentar: e.target.value })}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Tulis ulasan pelanggan di sini..."
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Foto / Avatar (Opsional)</label>
            <ImageUpload 
              value={formData.avatar_url}
              onChange={(url) => setFormData({ ...formData, avatar_url: url })}
              folder="testimonials"
            />
          </div>

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.disetujui}
                  onChange={(e) => setFormData({ ...formData, disetujui: e.target.checked })}
                  className="w-5 h-5 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Langsung Tampilkan</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-5 h-5 rounded-lg text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                   <CheckCircle2 className="w-3.5 h-3.5" /> Verified Order
                </span>
             </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl hover:bg-blue-800 transition shadow-xl shadow-blue-700/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Testimoni"}
          </button>
        </form>
      </div>
    </div>
  );
}
