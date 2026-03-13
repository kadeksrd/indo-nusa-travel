"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, User, Phone, Mail, Calendar,
  CreditCard, CheckCircle, Clock,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  mobil: any;
  open: boolean;
  onClose: () => void;
}

export default function RentalBookingModal({ mobil, open, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama_lengkap: "",
    email: "",
    nomor_hp: "",
    tanggal_mulai: "",
    durasi_hari: 1,
    catatan: "",
    tipe_pembayaran: "full" as "dp" | "full",
  });

  if (!open) return null;

  const totalHarga = mobil.harga_per_hari * form.durasi_hari;
  const jumlahDP = Math.ceil(totalHarga * 0.2);
  const jumlahBayar = form.tipe_pembayaran === "dp" ? jumlahDP : totalHarga;
  const fmt = (h: number) => "Rp " + h.toLocaleString("id-ID");

  const handleSubmit = async () => {
    if (!form.nama_lengkap || !form.email || !form.nomor_hp || !form.tanggal_mulai) {
      toast.error("Lengkapi semua field yang wajib diisi");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Format email tidak valid");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pemesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipe: "rental_mobil",
          rental_mobil_id: mobil.id,
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          nomor_hp: form.nomor_hp,
          tanggal_berangkat: form.tanggal_mulai,
          jumlah_orang: 1,
          catatan: `Durasi: ${form.durasi_hari} hari. ${form.catatan}`,
          total_harga: totalHarga,
          tipe_pembayaran: form.tipe_pembayaran,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/pembayaran/${data.kode_pemesanan}`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">

        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Form Pemesanan</h3>
            <p className="text-sm text-gray-500">{mobil.nama}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
              <User className="w-4 h-4" /> Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              placeholder="Nama sesuai KTP"
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Mail className="w-3 h-3" /> Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@contoh.com"
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Phone className="w-3 h-3" /> No. WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nomor_hp}
                onChange={(e) => setForm({ ...form, nomor_hp: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" /> Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.tanggal_mulai}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3" /> Durasi (Hari) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" min={1} max={30}
                value={form.durasi_hari}
                onChange={(e) => setForm({ ...form, durasi_hari: parseInt(e.target.value) || 1 })}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Catatan Tambahan</label>
            <textarea
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              rows={2}
              placeholder="Tujuan perjalanan, kebutuhan khusus, dll."
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Pilihan Pembayaran */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
              <CreditCard className="w-4 h-4" /> Pilihan Pembayaran <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, tipe_pembayaran: "dp" })}
                className={`relative p-4 rounded-xl border-2 text-left transition ${
                  form.tipe_pembayaran === "dp"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {form.tipe_pembayaran === "dp" && (
                  <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                )}
                <p className="font-semibold text-sm text-gray-900">DP 20%</p>
                <p className="text-blue-700 font-bold mt-1 text-sm">{fmt(jumlahDP)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Sisa: {fmt(totalHarga - jumlahDP)}</p>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, tipe_pembayaran: "full" })}
                className={`relative p-4 rounded-xl border-2 text-left transition ${
                  form.tipe_pembayaran === "full"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {form.tipe_pembayaran === "full" && (
                  <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                )}
                <p className="font-semibold text-sm text-gray-900">Bayar Penuh</p>
                <p className="text-blue-700 font-bold mt-1 text-sm">{fmt(totalHarga)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Langsung lunas</p>
              </button>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border">
            <p className="font-semibold text-gray-900">Ringkasan Pesanan</p>
            <div className="flex justify-between text-gray-600">
              <span>{fmt(mobil.harga_per_hari)} × {form.durasi_hari} hari</span>
              <span>{fmt(totalHarga)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
              <span>Bayar Sekarang</span>
              <span className="text-blue-700">{fmt(jumlahBayar)}</span>
            </div>
            {form.tipe_pembayaran === "dp" && (
              <p className="text-xs text-orange-600">
                * Sisa {fmt(totalHarga - jumlahDP)} dibayar sebelum penggunaan
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              `Lanjut ke Pembayaran → ${fmt(jumlahBayar)}`
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            🔒 Pembayaran aman & terenkripsi via DOKU
          </p>
        </div>
      </div>
    </div>
  );
}
