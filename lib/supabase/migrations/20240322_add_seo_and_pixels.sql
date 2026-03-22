-- Add SEO columns to blog table
ALTER TABLE blog 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- Add SEO columns to paket_wisata table
ALTER TABLE paket_wisata 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- Add SEO columns to rental_mobil table
ALTER TABLE rental_mobil 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- Create seo_halaman table for static pages
CREATE TABLE IF NOT EXISTS seo_halaman (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default SEO for main pages if they don't exist
INSERT INTO seo_halaman (path, meta_title, meta_description)
VALUES 
('/', 'Indo Nusa Travel - Paket Wisata & Rental Mobil Terpercaya', 'Layanan paket wisata dan rental mobil terpercaya dengan pengalaman terbaik.'),
('/paket-wisata', 'Daftar Paket Wisata - Indo Nusa Travel', 'Pilihan paket wisata terbaik di Bali dan sekitarnya.'),
('/rental-mobil', 'Rental Mobil Terpercaya - Indo Nusa Travel', 'Sewa mobil dengan lepas kunci atau dengan supir di Bali.'),
('/blog', 'Blog & Artikel Wisata - Indo Nusa Travel', 'Tips dan informasi seputar wisata di Indonesia.')
ON CONFLICT (path) DO NOTHING;

-- Ensure tracking pixel keys exist in pengaturan_website logic
-- (This is handled by the upsert logic in the admin panel, but we can ensure the table exists)
CREATE TABLE IF NOT EXISTS pengaturan_website (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kunci TEXT UNIQUE NOT NULL,
    nilai TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
