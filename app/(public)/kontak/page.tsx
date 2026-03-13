"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function KontakPage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Kirim via WhatsApp
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    const msg = `*Pesan dari Website*\n\nNama: ${form.nama}\nEmail: ${form.email}\nSubjek: ${form.subjek}\n\nPesan:\n${form.pesan}`;
    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    toast.success("Pesan dikirim!");
    setForm({ nama: "", email: "", subjek: "", pesan: "" });
    setLoading(false);
  };

  const kontakInfo = [
    {
      icon: Phone,
      label: "Telepon / WhatsApp",
      value: "+62 812 3456 7890",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@travelku.com",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: "Jakarta, Indonesia",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: "Senin - Minggu, 08.00 - 20.00",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-500 py-16 text-center text-white">
        <h1 className="text-3xl font-bold">Hubungi Kami</h1>
        <p className="mt-2 text-blue-200">
          Kami siap membantu perjalanan wisata Anda
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Informasi Kontak
            </h2>
            <div className="space-y-4 mb-8">
              {kontakInfo.map((k) => (
                <div key={k.label} className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <k.icon className={`w-5 h-5 ${k.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{k.label}</p>
                    <p className="font-medium text-gray-900">{k.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition"
            >
              <MessageCircle className="w-5 h-5" /> Chat WhatsApp Sekarang
            </a>

            {/* Map placeholder */}
            <div className="mt-8 bg-gray-100 rounded-2xl h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Jakarta, Indonesia</p>
                <a
                  href="https://maps.google.com/?q=Jakarta,Indonesia"
                  target="_blank"
                  className="text-blue-600 text-xs hover:underline mt-1 block"
                >
                  Buka di Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Kirim Pesan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nama *
                  </label>
                  <input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    required
                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Subjek *
                </label>
                <input
                  value={form.subjek}
                  onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                  required
                  className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Perihal pesan Anda"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Pesan *
                </label>
                <textarea
                  value={form.pesan}
                  onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                  required
                  rows={5}
                  className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />{" "}
                {loading ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
