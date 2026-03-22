"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Menu,
  X,
  Plane,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar({ settings }: { settings?: Record<string, string> }) {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !menuOpen;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/paket-wisata", label: "Paket Wisata" },
    { href: "/rental-mobil", label: "Rental Mobil" },
    { href: "/testimoni", label: "Testimoni" },
    { href: "/blog", label: "Blog" },
    { href: "/kontak", label: "Kontak" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isTransparent
          ? "bg-transparent py-6"
          : "bg-white/70 backdrop-blur-2xl shadow-2xl shadow-black/[0.03] py-4 border-b border-white/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-700 transform group-hover:rotate-[15deg] group-hover:scale-110 shadow-xl ${
               isTransparent ? "bg-white text-blue-700 shadow-white/20" : "bg-blue-700 text-white shadow-blue-700/20"
            }`}>
              <Plane className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
            <span className={`font-black text-xl md:text-2xl tracking-tighter transition-colors duration-500 uppercase leading-none ${
                  isTransparent ? "text-white" : "text-blue-700"
               }`}>
                 {(settings?.nama_website || process.env.NEXT_PUBLIC_APP_NAME || "INDO NUSA TRAVEL").split(" ")[0]}
                 <span className={isTransparent ? "text-yellow-400" : "text-orange-500"}>
                    {" " + (settings?.nama_website || process.env.NEXT_PUBLIC_APP_NAME || "INDO NUSA TRAVEL").split(" ").slice(1).join(" ")}
                 </span>
               </span>
               <span className={`text-[8px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${isTransparent ? "text-white/60" : "text-gray-400"}`}>Premium Travel Partner</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative group ${
                  isTransparent
                    ? "text-white/80 hover:text-white"
                    : pathname === link.href
                      ? "text-blue-700"
                      : "text-gray-500 hover:text-blue-700"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full transition-all duration-500 group-hover:w-full ${
                   isTransparent ? "bg-yellow-400" : "bg-blue-700"
                }`} />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-8">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-black border-2 border-white shadow-lg transition-transform group-hover:scale-110">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isTransparent ? "text-white" : "text-gray-900"}`}>Akun Saya</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-6 w-64 bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-gray-100 p-3 overflow-hidden animate-in slide-in-from-top-5 duration-500 z-[110]">
                    <div className="px-5 py-4 border-b border-gray-50 mb-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                       <p className="text-xs font-black text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-2xl transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Panel Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 w-full px-5 py-3.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Keluar Akun
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/masuk"
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${
                    isTransparent ? "text-white hover:text-yellow-400" : "text-gray-900 hover:text-blue-700"
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl hover:-translate-y-1 active:scale-95 ${
                    isTransparent 
                      ? "bg-white text-blue-700 hover:bg-blue-50 shadow-white/10" 
                      : "bg-blue-700 text-white hover:bg-blue-800 shadow-blue-700/20"
                  }`}
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className={`md:hidden p-2 rounded-xl transition-colors ${isTransparent ? "text-white bg-white/10" : "text-gray-900 bg-gray-100"}`} 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-fade-in z-[110]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-lg font-black uppercase tracking-widest py-2 ${
                 pathname === link.href ? "text-blue-700" : "text-gray-800"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="bg-blue-50 text-blue-700 text-center py-3 rounded-2xl font-black text-sm uppercase tracking-widest"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-50 text-red-600 text-center py-3 rounded-2xl font-black text-sm uppercase tracking-widest"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/masuk" 
                  className="bg-gray-50 text-gray-700 text-center py-3 rounded-2xl font-black text-sm uppercase tracking-widest"
                  onClick={() => setMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="bg-blue-700 text-white text-center py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-700/20"
                  onClick={() => setMenuOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
