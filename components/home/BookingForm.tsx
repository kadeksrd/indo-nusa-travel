"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function BookingForm() {
  const [form, setForm] = useState({
    nama: "",
    nomor_hp: "",
    email: "",
    layanan: "",
    tanggal: "",
    jumlah: 1,
    catatan: "",
  });

  const handleWhatsApp = () => {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    const msg = `Halo, saya ingin memesan:\n*Nama:* ${form.nama}\n*Layanan:* ${form.layanan}\n*Tanggal:* ${form.tanggal}\n*Jumlah:* ${form.jumlah} orang\n*Catatan:* ${form.catatan}`;
    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto bg-blue-700 rounded-3xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Siap Berwisata?</h2>
          <p className="text-blue-200 mt-2">
            Isi form di bawah dan tim kami akan segera menghubungi Anda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-blue-100">
              Nama Lengkap *
            </label>
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Masukkan nama Anda"
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-100">
              Nomor HP / WhatsApp *
            </label>
            <input
              value={form.nomor_hp}
              onChange={(e) => setForm({ ...form, nomor_hp: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-100">Email *</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="email@contoh.com"
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-100">
              Layanan Diminati
            </label>
            <select
              value={form.layanan}
              onChange={(e) => setForm({ ...form, layanan: e.target.value })}
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <option value="">-- Pilih Layanan --</option>
              <option value="Paket Wisata">Paket Wisata</option>
              <option value="Rental Mobil">Rental Mobil</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-blue-100">
              Tanggal Keberangkatan
            </label>
            <input
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              type="date"
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-100">
              Jumlah Orang
            </label>
            <input
              value={form.jumlah}
              onChange={(e) =>
                setForm({ ...form, jumlah: parseInt(e.target.value) || 1 })
              }
              type="number"
              min={1}
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-blue-100">
              Catatan Tambahan
            </label>
            <textarea
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              rows={3}
              placeholder="Permintaan khusus, destinasi yang diinginkan, dll."
              className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
            />
          </div>
        </div>
        <button
          onClick={handleWhatsApp}
          className="mt-6 w-full bg-white text-blue-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition"
        >
          <MessageCircle className="w-5 h-5" /> Kirim ke WhatsApp
        </button>
      </div>
    </section>
  );
}
