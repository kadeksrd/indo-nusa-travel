"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MessageCircle, 
  User,
  Filter,
  PlusCircle,
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import TestimoniModal from "@/components/admin/TestimoniModal";

export default function AdminTestimoniPage() {
  const [testimonis, setTestimonis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"semua" | "pending" | "disetujui">("semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const supabase = createClient();

  const fetchTestimonis = async () => {
    setLoading(true);
    let query = supabase
      .from("testimoni")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "pending") query = query.eq("disetujui", false);
    if (filter === "disetujui") query = query.eq("disetujui", true);

    const { data } = await query;
    setTestimonis(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonis();
  }, [filter]);

  const handleApprove = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("testimoni")
      .update({ disetujui: !currentStatus })
      .eq("id", id);
    
    if (error) toast.error("Gagal memperbarui status");
    else {
      toast.success(currentStatus ? "Testimoni disembunyikan" : "Testimoni disetujui!");
      fetchTestimonis();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus testimoni ini secara permanen?")) return;
    const { error } = await supabase.from("testimoni").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else {
      toast.success("Testimoni dihapus");
      fetchTestimonis();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Moderasi Testimoni</h1>
          <p className="text-gray-500 text-sm font-medium">Kelola ulasan dari pelanggan Anda</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition shadow-lg shadow-blue-700/20"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Testimoni
          </button>

          <div className="flex items-center gap-1 bg-white border rounded-xl p-1 shadow-sm">
            {(["semua", "pending", "disetujui"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f 
                    ? "bg-blue-700 text-white shadow-md shadow-blue-700/20" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      ) : testimonis.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">Tidak ada testimoni ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonis.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden ${!t.disetujui ? "border-yellow-200 bg-yellow-50/10" : ""}`}>
              {!t.disetujui && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Pending Approved
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.nama}</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {format(new Date(t.created_at), "dd MMM yyyy", { locale: id })}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm italic mb-6 leading-relaxed line-clamp-4">
                "{t.komentar}"
              </p>

              <div className="flex items-center gap-2 border-t pt-4">
                <button
                  onClick={() => handleApprove(t.id, t.disetujui)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                    t.disetujui 
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                      : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20"
                  }`}
                >
                  {t.disetujui ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  {t.disetujui ? "Sembunyikan" : "Setujui"}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showAddModal && (
        <TestimoniModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchTestimonis();
          }}
        />
      )}
    </div>
  );
}
