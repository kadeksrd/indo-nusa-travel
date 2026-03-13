-- =============================================
-- NUSA BALI TRAVEL - Database Schema
-- Jalankan di Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WILAYAH TABLE
-- =============================================
CREATE TABLE wilayah (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PAKET WISATA TABLE
-- =============================================
CREATE TABLE paket_wisata (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  konten TEXT,
  wilayah_id UUID REFERENCES wilayah(id),
  durasi_hari INTEGER NOT NULL DEFAULT 1,
  harga DECIMAL(15,2) NOT NULL,
  harga_coret DECIMAL(15,2),
  foto_utama TEXT,
  galeri TEXT[] DEFAULT '{}',
  fasilitas TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  populer BOOLEAN DEFAULT false,
  aktif BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ulasan INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- KATEGORI MOBIL TABLE
-- =============================================
CREATE TABLE kategori_mobil (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RENTAL MOBIL TABLE
-- =============================================
CREATE TABLE rental_mobil (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deskripsi TEXT,
  kategori_id UUID REFERENCES kategori_mobil(id),
  kapasitas INTEGER NOT NULL DEFAULT 4,
  transmisi TEXT DEFAULT 'Manual' CHECK (transmisi IN ('Manual', 'Automatic')),
  harga_per_hari DECIMAL(15,2) NOT NULL,
  foto_utama TEXT,
  galeri TEXT[] DEFAULT '{}',
  fitur TEXT[] DEFAULT '{}',
  terfavorit BOOLEAN DEFAULT false,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PEMESANAN TABLE
-- =============================================
CREATE TABLE pemesanan (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kode_pemesanan TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id),
  tipe TEXT NOT NULL CHECK (tipe IN ('paket_wisata', 'rental_mobil')),
  paket_wisata_id UUID REFERENCES paket_wisata(id),
  rental_mobil_id UUID REFERENCES rental_mobil(id),
  nama_lengkap TEXT NOT NULL,
  email TEXT NOT NULL,
  nomor_hp TEXT NOT NULL,
  tanggal_berangkat DATE NOT NULL,
  jumlah_orang INTEGER DEFAULT 1,
  tanggal_selesai DATE,
  catatan TEXT,
  total_harga DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dikonfirmasi', 'dibatalkan', 'selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BLOG TABLE
-- =============================================
CREATE TABLE blog (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ringkasan TEXT,
  konten TEXT,
  foto_utama TEXT,
  author_id UUID REFERENCES profiles(id),
  author_nama TEXT,
  tags TEXT[] DEFAULT '{}',
  dipublikasikan BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TESTIMONI TABLE
-- =============================================
CREATE TABLE testimoni (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT,
  foto TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  komentar TEXT NOT NULL,
  tipe TEXT CHECK (tipe IN ('paket_wisata', 'rental_mobil', 'umum')),
  paket_wisata_id UUID REFERENCES paket_wisata(id),
  disetujui BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PENGATURAN WEBSITE TABLE
-- =============================================
CREATE TABLE pengaturan_website (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kunci TEXT NOT NULL UNIQUE,
  nilai TEXT,
  tipe TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_paket_wisata_wilayah ON paket_wisata(wilayah_id);
CREATE INDEX idx_paket_wisata_aktif ON paket_wisata(aktif);
CREATE INDEX idx_paket_wisata_populer ON paket_wisata(populer);
CREATE INDEX idx_paket_wisata_slug ON paket_wisata(slug);
CREATE INDEX idx_rental_mobil_kategori ON rental_mobil(kategori_id);
CREATE INDEX idx_rental_mobil_aktif ON rental_mobil(aktif);
CREATE INDEX idx_rental_mobil_slug ON rental_mobil(slug);
CREATE INDEX idx_pemesanan_user ON pemesanan(user_id);
CREATE INDEX idx_pemesanan_status ON pemesanan(status);
CREATE INDEX idx_pemesanan_kode ON pemesanan(kode_pemesanan);
CREATE INDEX idx_blog_dipublikasikan ON blog(dipublikasikan);
CREATE INDEX idx_blog_slug ON blog(slug);
CREATE INDEX idx_testimoni_disetujui ON testimoni(disetujui);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE paket_wisata ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_mobil ENABLE ROW LEVEL SECURITY;
ALTER TABLE pemesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimoni ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilayah ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori_mobil ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaturan_website ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PAKET WISATA
CREATE POLICY "paket_select_public" ON paket_wisata
  FOR SELECT USING (
    aktif = true
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "paket_admin_all" ON paket_wisata
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RENTAL MOBIL
CREATE POLICY "rental_select_public" ON rental_mobil
  FOR SELECT USING (
    aktif = true
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "rental_admin_all" ON rental_mobil
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PEMESANAN
CREATE POLICY "pemesanan_select_own" ON pemesanan
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "pemesanan_insert_public" ON pemesanan
  FOR INSERT WITH CHECK (true);

CREATE POLICY "pemesanan_update_admin" ON pemesanan
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "pemesanan_delete_admin" ON pemesanan
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- BLOG
CREATE POLICY "blog_select_public" ON blog
  FOR SELECT USING (
    dipublikasikan = true
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "blog_admin_all" ON blog
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- WILAYAH
CREATE POLICY "wilayah_select_public" ON wilayah
  FOR SELECT USING (true);

CREATE POLICY "wilayah_admin_all" ON wilayah
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- KATEGORI MOBIL
CREATE POLICY "kategori_select_public" ON kategori_mobil
  FOR SELECT USING (true);

CREATE POLICY "kategori_admin_all" ON kategori_mobil
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TESTIMONI
CREATE POLICY "testimoni_select_approved" ON testimoni
  FOR SELECT USING (
    disetujui = true
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "testimoni_insert_public" ON testimoni
  FOR INSERT WITH CHECK (true);

CREATE POLICY "testimoni_admin_all" ON testimoni
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PENGATURAN WEBSITE
CREATE POLICY "pengaturan_select_public" ON pengaturan_website
  FOR SELECT USING (true);

CREATE POLICY "pengaturan_admin_all" ON pengaturan_website
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto create profile saat user baru daftar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON paket_wisata
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON rental_mobil
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON pemesanan
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON blog
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();