"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, X, Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  pemesanan: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ pemesanan, onClose, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!komentar.trim()) return toast.error("Isi komentar Anda");

    setLoading(true);
    try {
      const { error } = await supabase.from("testimoni").insert({
        nama: pemesanan.nama_lengkap,
        email: pemesanan.email,
        rating,
        komentar,
        tipe: pemesanan.tipe,
        paket_wisata_id: pemesanan.paket_wisata_id,
        disetujui: false, // Moderasi admin
        verified: true,
      });

      if (error) throw error;
      toast.success("Terima kasih! Ulasan Anda akan segera muncul setelah disetujui admin.");
      onSuccess();
    } catch (err: any) {
      toast.error("Gagal mengirim ulasan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
             <MessageSquare className="w-5 h-5 text-blue-600" />
             <h3 className="font-black text-gray-900">Beri Ulasan</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Kepuasan Anda?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs font-black text-blue-600">
               {rating === 5 ? "Sangat Puas! 😍" : rating === 4 ? "Puas 😊" : rating === 3 ? "Cukup 😐" : "Kurang Puas 😞"}
            </p>
          </div>

          <div>
             <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Ceritakan Pengalaman Anda</label>
             <textarea
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                placeholder="Bagaimana pelayanan kami?..."
                rows={4}
                className="w-full border-2 border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
             />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl hover:bg-blue-800 transition shadow-xl shadow-blue-700/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Ulasan Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}
