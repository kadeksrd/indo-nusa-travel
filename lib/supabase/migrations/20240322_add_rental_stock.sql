-- Menambahkan kolom stok ke tabel rental_mobil
ALTER TABLE rental_mobil 
ADD COLUMN IF NOT EXISTS stok_total INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS stok_tersedia INTEGER DEFAULT 1;

-- Menyamakan data awal
UPDATE rental_mobil SET stok_total = 1, stok_tersedia = 1 WHERE stok_total = 0 OR stok_total IS NULL;
