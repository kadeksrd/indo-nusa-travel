"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Car,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Plane,
  MessageCircle,
  Search,
  Star,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const navGroups = [
  {
    title: "Menu Utama",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dasbor", exact: true },
      { href: "/admin/pemesanans", icon: ShoppingCart, label: "Pemesanan" },
    ]
  },
  {
    title: "Manajemen Konten",
    items: [
      { href: "/admin/paket-wisatas", icon: Package, label: "Paket Wisata" },
      { href: "/admin/rental-mobils", icon: Car, label: "Rental Mobil" },
      { href: "/admin/rekomendasi", icon: Star, label: "Rekomendasi" },
      { href: "/admin/testimoni", icon: MessageCircle, label: "Testimoni" },
      { href: "/admin/blog", icon: FileText, label: "Blog" },
    ]
  },
  {
    title: "Alat & Pemasaran",
    items: [
      { href: "/admin/seo", icon: Search, label: "Kelola SEO" },
      { href: "/admin/marketing", icon: BarChart3, label: "Pixel & GTM" },
    ]
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/pengaturan", icon: Settings, label: "Pengaturan" },
    ]
  }
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-4 border-b h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">Travel Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 font-mono">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${active
                    ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "animate-pulse" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
