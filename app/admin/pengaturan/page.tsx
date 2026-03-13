"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

const settingFields = [
  { kunci: "nama_website", label: "Nama Website" },
  { kunci: "tagline", label: "Tagline" },
  { kunci: "telepon", label: "Telepon" },
  { kunci: "email", label: "Email" },
  { kunci: "alamat", label: "Alamat" },
  { kunci: "whatsapp", label: "Nomor WhatsApp (tanpa +)" },
  { kunci: "instagram", label: "Username Instagram" },
  { kunci: "facebook", label: "Username Facebook" },
  { kunci: "hero_judul", label: "Hero Judul" },
  { kunci: "hero_subjudul", label: "Hero Sub Judul" },
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

      <div className="bg-white rounded-xl border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {settingFields.map((f) => (
            <div key={f.kunci}>
              <label className="text-sm font-medium text-gray-700">
                {f.label}
              </label>
              <input
                value={settings[f.kunci] || ""}
                onChange={(e) =>
                  setSettings({ ...settings, [f.kunci]: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
