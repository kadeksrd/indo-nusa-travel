"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Save, Loader2, Info, Facebook, Globe, Hash } from "lucide-react";
import toast from "react-hot-toast";

export default function MarketingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    pixel_fb: "",
    gtm_id: "",
    pixel_analytics: "",
    whatsapp: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("pengaturan_website").select("*");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((d: any) => {
        map[d.kunci] = d.nilai || "";
      });
      setSettings({
        pixel_fb: map.pixel_fb || "",
        gtm_id: map.gtm_id || "",
        pixel_analytics: map.pixel_analytics || "",
        whatsapp: map.whatsapp || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = [
        { kunci: "pixel_fb", nilai: settings.pixel_fb },
        { kunci: "gtm_id", nilai: settings.gtm_id },
        { kunci: "pixel_analytics", nilai: settings.pixel_analytics },
        { kunci: "whatsapp", nilai: settings.whatsapp },
      ].map(u => ({ ...u, updated_at: new Date().toISOString() }));

      const { error } = await supabase
        .from("pengaturan_website")
        .upsert(updates, { onConflict: "kunci" });

      if (error) throw error;
      toast.success("Pengaturan pemasaran berhasil disimpan!");
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketing & Tracking</h1>
          <p className="text-gray-500 font-medium">Kelola Pixel, GTM, dan Analytics dalam satu tempat.</p>
        </div>
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl shadow-blue-700/5">
           <BarChart3 className="w-7 h-7" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex gap-4 items-start">
         <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
         <div>
            <h4 className="font-black text-blue-900 text-sm uppercase tracking-widest mb-1">Informasi Penting</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
               ID yang Anda masukkan di sini akan secara otomatis diterapkan pada seluruh halaman website untuk membantu pelacakan konversi dan performa iklan.
            </p>
         </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Facebook className="w-4 h-4" />
             </div>
             <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Meta / Facebook</h3>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Facebook Pixel ID</label>
            <input
              type="text"
              value={settings.pixel_fb}
              onChange={(e) => setSettings({ ...settings, pixel_fb: e.target.value })}
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
              placeholder="Contoh: 123456789012345"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                <Globe className="w-4 h-4" />
             </div>
             <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Google System</h3>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Google Tag Manager ID (GTM)</label>
            <input
              type="text"
              value={settings.gtm_id}
              onChange={(e) => setSettings({ ...settings, gtm_id: e.target.value })}
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
              placeholder="Contoh: GTM-XXXXXXX"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Google Analytics ID (GA4)</label>
            <input
              type="text"
              value={settings.pixel_analytics}
              onChange={(e) => setSettings({ ...settings, pixel_analytics: e.target.value })}
              className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
              placeholder="Contoh: G-XXXXXXXXXX"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <Hash className="w-4 h-4" />
             </div>
             <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Kontak & Support</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp Utama (Tanpa +)</label>
                <div className="relative">
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">+</span>
                   <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl pl-10 pr-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                    placeholder="628123456789"
                   />
                </div>
                <p className="text-[9px] text-gray-400 font-bold mt-2 italic px-1">* Digunakan sebagai tujuan utama tombol CTA di seluruh website.</p>
             </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-blue-700 text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-2xl shadow-blue-700/20 disabled:opacity-50 group active:scale-95"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
