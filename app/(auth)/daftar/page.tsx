"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Plane } from "lucide-react";
import toast from "react-hot-toast";

export default function DaftarPage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.konfirmasi)
      return toast.error("Password tidak cocok");
    if (form.password.length < 6)
      return toast.error("Password minimal 6 karakter");

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.nama } },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Akun berhasil dibuat! Silakan cek email untuk verifikasi.",
      );
      router.push("/masuk");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-blue-700 text-xl">
              Nusa Bali Travel
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
          <p className="text-gray-500 text-sm mt-1">
            Daftar untuk mulai memesan
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {[
            {
              key: "nama",
              label: "Nama Lengkap",
              type: "text",
              placeholder: "Nama Anda",
            },
            {
              key: "email",
              label: "Email",
              type: "email",
              placeholder: "email@contoh.com",
            },
            {
              key: "password",
              label: "Password",
              type: "password",
              placeholder: "••••••••",
            },
            {
              key: "konfirmasi",
              label: "Konfirmasi Password",
              type: "password",
              placeholder: "••••••••",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-gray-700">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                required
                placeholder={f.placeholder}
                className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Memuat..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link
            href="/masuk"
            className="text-blue-600 font-medium hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
