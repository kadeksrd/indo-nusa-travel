-- Menambahkan kolom slot ke tabel paket_wisata
ALTER TABLE paket_wisata 
ADD COLUMN IF NOT EXISTS slot_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS slot_tersedia INTEGER DEFAULT 0;

-- Update data yang sudah ada (opsional, set ke nilai default yang masuk akal)
UPDATE paket_wisata SET slot_total = 10, slot_tersedia = 10 WHERE slot_total = 0;
