"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Save, Globe, Phone, Share2, Image as ImageIcon, BarChart3, Info } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = [
  {
    id: "umum",
    label: "Informasi Umum",
    icon: Globe,
    fields: [
      { kunci: "nama_website", label: "Nama Website", placeholder: process.env.NEXT_PUBLIC_APP_NAME || "Indo Nusa Travel" },
      { kunci: "tagline", label: "Tagline", placeholder: "Solusi Liburan Terpercaya" },
    ],
  },
  {
    id: "kontak",
    label: "Kontak & Media Sosial",
    icon: Phone,
    fields: [
      { kunci: "telepon", label: "Telepon" },
      { kunci: "email", label: "Email" },
      { kunci: "alamat", label: "Alamat" },
      { kunci: "whatsapp", label: "WhatsApp (tanpa +)", placeholder: "6281234..." },
      { kunci: "instagram", label: "Username Instagram" },
      { kunci: "facebook", label: "Username Facebook" },
      { kunci: "maps_link", label: "Google Maps Embed Link", placeholder: "https://www.google.com/maps/embed?pb=..." },
    ],
  },
  {
    id: "hero",
    label: "Tampilan Beranda (Hero)",
    icon: ImageIcon,
    fields: [
      { kunci: "hero_judul", label: "Judul Utama Hero" },
      { kunci: "hero_subjudul", label: "Sub-judul Hero" },
      { kunci: "hero_image_home", label: "URL Background Hero Beranda", placeholder: "https://images.unsplash.com/..." },
      { kunci: "hero_image_paket", label: "URL Background Hero Paket Wisata", placeholder: "https://images.unsplash.com/..." },
      { kunci: "hero_image_rental", label: "URL Background Hero Rental Mobil", placeholder: "https://images.unsplash.com/..." },
    ],
  },
];

export default function PengaturanPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("pengaturan_website")
      .select("*")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        data?.forEach((d: any) => {
          map[d.kunci] = d.nilai || "";
        });
        setSettings(map);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const updates = Object.entries(settings).map(([kunci, nilai]) => ({
      kunci,
      nilai,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from("pengaturan_website")
      .upsert(updates, { onConflict: "kunci" });
    if (error) toast.error("Gagal menyimpan");
    else toast.success("Pengaturan berhasil disimpan!");
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="space-y-6 pb-12">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border shadow-sm">
            <div className="px-6 py-4 border-b flex items-center gap-2 bg-gray-50/50 rounded-t-xl">
              <cat.icon className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">{cat.label}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {cat.fields.map((f: any) => {
                const isImage = f.kunci.includes("image") || f.kunci.includes("logo");
                const recommendedSize = f.kunci.includes("hero") ? "1920x1080 px" : f.kunci.includes("logo") ? "200x50 px" : "";

                return (
                  <div key={f.kunci} className={`${f.description || isImage ? "md:col-span-2" : ""} ${f.description ? "bg-blue-50/30 p-4 rounded-xl border border-blue-100/50" : ""}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-bold text-gray-700 block">
                        {f.label}
                      </label>
                      {recommendedSize && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Info className="w-3 h-3" /> {recommendedSize}
                        </span>
                      )}
                    </div>

                    {isImage ? (
                      <div className="mt-1">
                        <ImageUpload
                          value={settings[f.kunci] || ""}
                          onChange={(url) => setSettings({ ...settings, [f.kunci]: url })}
                          folder="settings"
                        />
                      </div>
                    ) : (
                      <input
                        value={settings[f.kunci] || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, [f.kunci]: e.target.value })
                        }
                        placeholder={f.placeholder}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      />
                    )}
                    
                    {f.description && (
                      <p className="mt-2 text-xs text-blue-600 font-medium flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        {f.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
