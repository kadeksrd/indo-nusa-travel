export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface Wilayah {
  id: string;
  nama: string;
  slug: string;
}

export interface PaketWisata {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  konten: string | null;
  wilayah_id: string;
  wilayah?: Wilayah;
  durasi_hari: number;
  harga: number;
  harga_coret: number | null;
  foto_utama: string | null;
  galeri: string[];
  fasilitas: string[];
  itinerary: ItineraryItem[];
  populer: boolean;
  aktif: boolean;
  rating: number;
  total_ulasan: number;
  created_at: string;
}

export interface ItineraryItem {
  hari: number;
  judul: string;
  kegiatan: string[];
}

export interface KategoriMobil {
  id: string;
  nama: string;
  slug: string;
}

export interface RentalMobil {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  kategori_id: string;
  kategori?: KategoriMobil;
  kapasitas: number;
  transmisi: "Manual" | "Automatic";
  harga_per_hari: number;
  foto_utama: string | null;
  galeri: string[];
  fitur: string[];
  terfavorit: boolean;
  aktif: boolean;
  created_at: string;
}

export interface Pemesanan {
  id: string;
  kode_pemesanan: string;
  user_id: string | null;
  tipe: "paket_wisata" | "rental_mobil";
  paket_wisata_id: string | null;
  rental_mobil_id: string | null;
  paket_wisata?: PaketWisata;
  rental_mobil?: RentalMobil;
  nama_lengkap: string;
  email: string;
  nomor_hp: string;
  tanggal_berangkat: string;
  jumlah_orang: number;
  tanggal_selesai: string | null;
  catatan: string | null;
  total_harga: number;
  status: "pending" | "dikonfirmasi" | "dibatalkan" | "selesai";
  created_at: string;
}

export interface Blog {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string | null;
  foto_utama: string | null;
  author_nama: string | null;
  tags: string[];
  dipublikasikan: boolean;
  created_at: string;
}

export interface Testimoni {
  id: string;
  nama: string;
  foto: string | null;
  rating: number;
  komentar: string;
  tipe: string;
  disetujui: boolean;
  verified: boolean;
  created_at: string;
}
