import Link from 'next/link';
import { Plane, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              Nusa Bali Travel
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Layanan paket wisata dan rental mobil terpercaya dengan pengalaman
            terbaik.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Layanan</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/paket-wisata"
                className="hover:text-white transition"
              >
                Paket Wisata
              </Link>
            </li>
            <li>
              <Link
                href="/rental-mobil"
                className="hover:text-white transition"
              >
                Rental Mobil
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Akun</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/masuk" className="hover:text-white transition">
                Masuk
              </Link>
            </li>
            <li>
              <Link href="/daftar" className="hover:text-white transition">
                Daftar
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Kontak</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" /> +62 812 3456 7890
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" /> info@travelku.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" /> Jakarta, Indonesia
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Nusa Bali Travel. All rights reserved.
      </div>
    </footer>
  );
}
