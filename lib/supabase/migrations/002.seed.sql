-- =============================================
-- SEED DATA - Nusa Bali Travel
-- Jalankan SETELAH 001_schema.sql
-- =============================================

-- WILAYAH
INSERT INTO wilayah (nama, slug) VALUES
('Bali', 'bali'),
('Lombok', 'lombok'),
('Raja Ampat', 'raja-ampat'),
('Yogyakarta', 'yogyakarta'),
('Labuan Bajo', 'labuan-bajo'),
('Bromo', 'bromo');

-- KATEGORI MOBIL
INSERT INTO kategori_mobil (nama, slug, deskripsi) VALUES
('Terfavorit', 'terfavorit', 'Kendaraan paling populer dipilih pelanggan'),
('Mobil Besar', 'mobil-besar', 'Kendaraan berkapasitas besar untuk rombongan'),
('Self Drive', 'self-drive', 'Kendaraan untuk dikemudikan sendiri');

-- PAKET WISATA
INSERT INTO paket_wisata (
  nama, slug, deskripsi, konten, wilayah_id, durasi_hari,
  harga, harga_coret, foto_utama, fasilitas, itinerary,
  populer, aktif, rating, total_ulasan
) VALUES
(
  'Paket Wisata Bali Eksotis',
  'paket-wisata-bali-eksotis',
  'Jelajahi keindahan Bali dengan paket wisata eksklusif kami. Nikmati pantai, budaya, dan kuliner khas Bali.',
  '<p>Bali menawarkan pengalaman wisata yang tak terlupakan. Dari pura-pura suci, pantai eksotis, hingga seni budaya yang kaya.</p><h2>Highlight Perjalanan</h2><ul><li>Kunjungi Pura Tanah Lot yang ikonik</li><li>Menikmati sunset di Kuta Beach</li><li>Wisata budaya di Ubud</li><li>Berbelanja di Pasar Seni Sukawati</li></ul>',
  (SELECT id FROM wilayah WHERE slug = 'bali'),
  3, 1500000, 1800000,
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  ARRAY['Transportasi AC', 'Pemandu wisata profesional', 'Makan 3x sehari', 'Hotel bintang 3', 'Tiket masuk objek wisata', 'Dokumentasi foto'],
  '[
    {"hari": 1, "judul": "Tiba di Bali", "kegiatan": ["Penjemputan di bandara", "Check-in hotel", "Makan malam di restoran lokal", "Briefing perjalanan"]},
    {"hari": 2, "judul": "Wisata Budaya & Pantai", "kegiatan": ["Sarapan di hotel", "Kunjungi Pura Tanah Lot", "Makan siang di Kuta", "Pantai Kuta & sunset", "Belanja oleh-oleh"]},
    {"hari": 3, "judul": "Ubud & Kepulangan", "kegiatan": ["Sarapan", "Wisata Ubud - Tegallalang Rice Terrace", "Pasar Seni Ubud", "Transfer ke bandara"]}
  ]'::jsonb,
  true, true, 4.3, 56
),
(
  'Paket Wisata Lombok Eksotis',
  'paket-wisata-lombok-eksotis',
  'Temukan pesona Lombok yang memukau dengan pantai berpasir putih dan Gunung Rinjani yang megah.',
  '<p>Lombok adalah surga tersembunyi yang belum banyak terjamah. Keindahan alamnya tak kalah dengan Bali.</p><h2>Yang Akan Anda Nikmati</h2><ul><li>Snorkeling di Gili Trawangan</li><li>Pemandangan Gunung Rinjani</li><li>Pantai Senggigi yang eksotis</li><li>Budaya Sasak yang unik</li></ul>',
  (SELECT id FROM wilayah WHERE slug = 'lombok'),
  4, 2000000, 2400000,
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
  ARRAY['Transportasi AC', 'Pemandu wisata', 'Makan 3x sehari', 'Hotel bintang 3', 'Tiket kapal ke Gili', 'Alat snorkeling'],
  '[
    {"hari": 1, "judul": "Tiba di Lombok", "kegiatan": ["Penjemputan di bandara", "Check-in hotel Senggigi", "Wisata Pantai Senggigi", "Makan malam seafood"]},
    {"hari": 2, "judul": "Gili Trawangan", "kegiatan": ["Naik kapal ke Gili Trawangan", "Snorkeling", "Makan siang di Gili", "Sunset di Gili", "Kembali ke Lombok"]},
    {"hari": 3, "judul": "Wisata Budaya Sasak", "kegiatan": ["Kunjungi Desa Sade", "Masjid Bayan Beleq", "Kerajinan tenun Sasak", "Pasar Cakranegara"]},
    {"hari": 4, "judul": "Kepulangan", "kegiatan": ["Sarapan", "Free time", "Transfer ke bandara"]}
  ]'::jsonb,
  true, true, 4.5, 76
),
(
  'Paket Wisata Raja Ampat Eksotis',
  'paket-wisata-raja-ampat-eksotis',
  'Selami keindahan bawah laut Raja Ampat yang terkenal sebagai surga diving terbaik di dunia.',
  '<p>Raja Ampat memiliki keanekaragaman hayati laut terkaya di dunia. Lebih dari 1.500 spesies ikan dan 700 spesies moluska hidup di sini.</p><h2>Aktivitas Utama</h2><ul><li>Diving & snorkeling kelas dunia</li><li>Island hopping ke pulau-pulau eksotis</li><li>Melihat Cendrawasih di habitatnya</li><li>Sunset di Piaynemo</li></ul>',
  (SELECT id FROM wilayah WHERE slug = 'raja-ampat'),
  5, 2500000, 3000000,
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  ARRAY['Transportasi speedboat', 'Pemandu diving bersertifikat', 'Makan 3x sehari', 'Resort tepi pantai', 'Peralatan snorkeling', 'Tiket masuk kawasan'],
  '[
    {"hari": 1, "judul": "Tiba di Sorong", "kegiatan": ["Tiba di Bandara Sorong", "Speedboat ke Raja Ampat", "Check-in resort", "Makan malam"]},
    {"hari": 2, "judul": "Diving & Snorkeling", "kegiatan": ["Sarapan", "Snorkeling Manta Ray", "Makan siang di pulau", "Diving spot Sardine Reef"]},
    {"hari": 3, "judul": "Island Hopping", "kegiatan": ["Kunjungi Pulau Pianemo", "Foto di viewpoint ikonik", "Snorkeling Blue Water Manta Ray", "Sunset cruise"]},
    {"hari": 4, "judul": "Cendrawasih & Budaya", "kegiatan": ["Bird watching Cendrawasih", "Kunjungi desa lokal", "Beli kerajinan lokal"]},
    {"hari": 5, "judul": "Kepulangan", "kegiatan": ["Sarapan", "Foto terakhir", "Speedboat ke Sorong", "Terbang pulang"]}
  ]'::jsonb,
  true, true, 4.7, 87
),
(
  'Paket Wisata Yogyakarta Eksotis',
  'paket-wisata-yogyakarta-eksotis',
  'Jelajahi kota budaya Yogyakarta dengan candi-candi megah, seni tradisional, dan kuliner yang lezat.',
  '<p>Yogyakarta adalah jantung budaya Jawa. Kota ini kaya akan warisan sejarah, seni, dan kuliner yang tak tertandingi.</p><h2>Destinasi Unggulan</h2><ul><li>Candi Borobudur - Warisan Dunia UNESCO</li><li>Candi Prambanan yang megah</li><li>Kraton Yogyakarta</li><li>Malioboro - surga belanja</li></ul>',
  (SELECT id FROM wilayah WHERE slug = 'yogyakarta'),
  7, 3000000, NULL,
  'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800',
  ARRAY['Transportasi AC', 'Pemandu wisata', 'Makan 3x sehari', 'Hotel bintang 3', 'Tiket masuk semua objek', 'Workshop batik'],
  '[
    {"hari": 1, "judul": "Tiba di Yogyakarta", "kegiatan": ["Penjemputan", "Check-in hotel", "Makan malam di Malioboro"]},
    {"hari": 2, "judul": "Borobudur & Prambanan", "kegiatan": ["Sunrise di Borobudur", "Candi Prambanan", "Museum Batik"]},
    {"hari": 3, "judul": "Kraton & Budaya", "kegiatan": ["Kraton Yogyakarta", "Taman Sari", "Pertunjukan wayang"]},
    {"hari": 4, "judul": "Alam Merapi", "kegiatan": ["Jeep Lava Tour Merapi", "Museum Merapi", "Kaliurang"]},
    {"hari": 5, "judul": "Kuliner & Belanja", "kegiatan": ["Workshop membatik", "Pasar Beringharjo", "Bakpia factory tour"]},
    {"hari": 6, "judul": "Free & Relax", "kegiatan": ["Free program", "Spa tradisional Jawa", "Dinner spesial"]},
    {"hari": 7, "judul": "Kepulangan", "kegiatan": ["Sarapan", "Belanja oleh-oleh terakhir", "Transfer ke stasiun/bandara"]}
  ]'::jsonb,
  false, true, 4.2, 60
),
(
  'Paket Wisata Labuan Bajo Eksotis',
  'paket-wisata-labuan-bajo-eksotis',
  'Petualangan seru di Labuan Bajo dengan Komodo Dragon dan pemandangan sunset yang luar biasa.',
  '<p>Labuan Bajo adalah pintu gerbang menuju Taman Nasional Komodo. Nikmati keindahan alam bawah laut dan bertemu Komodo Dragon di habitat aslinya.</p>',
  (SELECT id FROM wilayah WHERE slug = 'labuan-bajo'),
  3, 3500000, 4000000,
  'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800',
  ARRAY['Transportasi kapal phinisi', 'Pemandu wisata', 'Makan 3x sehari', 'Penginapan di kapal/resort', 'Tiket Taman Nasional Komodo', 'Peralatan snorkeling'],
  '[
    {"hari": 1, "judul": "Tiba di Labuan Bajo", "kegiatan": ["Tiba di bandara", "Check-in hotel/kapal", "Sunset di Bukit Cinta"]},
    {"hari": 2, "judul": "Komodo Dragon", "kegiatan": ["Pulau Komodo - trekking", "Bertemu Komodo Dragon", "Snorkeling Pink Beach", "Pulau Rinca"]},
    {"hari": 3, "judul": "Pulau Padar & Kepulangan", "kegiatan": ["Sunrise di Pulau Padar", "Snorkeling Manta Point", "Kembali ke Labuan Bajo", "Transfer ke bandara"]}
  ]'::jsonb,
  false, true, 4.8, 87
),
(
  'Paket Wisata Bromo Eksotis',
  'paket-wisata-bromo-eksotis',
  'Saksikan keagungan matahari terbit di atas Gunung Bromo yang akan meninggalkan kenangan tak terlupakan.',
  '<p>Gunung Bromo adalah salah satu destinasi wisata alam paling ikonik di Indonesia. Pemandangan sunrise di atas lautan pasir yang luas sungguh memukau.</p>',
  (SELECT id FROM wilayah WHERE slug = 'bromo'),
  4, 4000000, NULL,
  'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800',
  ARRAY['Jeep 4WD', 'Pemandu wisata', 'Makan 3x sehari', 'Hotel bintang 3 Malang', 'Tiket masuk TNBTS', 'Kuda untuk naik ke Bromo'],
  '[
    {"hari": 1, "judul": "Tiba di Malang", "kegiatan": ["Tiba di Malang", "Check-in hotel", "City tour Malang", "Makan malam"]},
    {"hari": 2, "judul": "Sunrise Bromo", "kegiatan": ["Berangkat pukul 02.00", "Penanjakan 1 - sunrise", "Jeep ke lautan pasir", "Naik kuda ke kawah Bromo", "Kembali ke Malang"]},
    {"hari": 3, "judul": "Air Terjun & Wisata Alam", "kegiatan": ["Coban Rondo waterfall", "Selecta garden", "Batu night spectacular"]},
    {"hari": 4, "judul": "Kepulangan", "kegiatan": ["Sarapan", "Oleh-oleh khas Malang", "Transfer ke bandara/stasiun"]}
  ]'::jsonb,
  false, true, 3.9, 21
);

-- RENTAL MOBIL
INSERT INTO rental_mobil (
  nama, slug, deskripsi, kategori_id, kapasitas,
  transmisi, harga_per_hari, foto_utama, fitur, terfavorit, aktif
) VALUES
(
  'Toyota Avanza', 'toyota-avanza',
  'MPV keluarga yang nyaman dan irit bahan bakar. Pilihan terbaik untuk wisata bersama keluarga.',
  (SELECT id FROM kategori_mobil WHERE slug = 'terfavorit'),
  7, 'Manual', 350000,
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  ARRAY['AC Double Blower', 'Audio System', 'Power Window', 'Central Lock', 'Airbag', 'Sabuk pengaman lengkap'],
  true, true
),
(
  'Toyota Innova', 'toyota-innova',
  'SUV premium dengan kabin luas dan nyaman. Ideal untuk perjalanan jauh maupun wisata.',
  (SELECT id FROM kategori_mobil WHERE slug = 'terfavorit'),
  8, 'Automatic', 450000,
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800',
  ARRAY['AC Triple Zone', 'Kursi kulit premium', 'Audio premium', 'Kamera mundur', 'Cruise control', 'Sunroof'],
  true, true
),
(
  'Hiace Commuter', 'hiace-commuter',
  'Van besar ideal untuk rombongan wisata. Kabin luas dengan tempat duduk nyaman.',
  (SELECT id FROM kategori_mobil WHERE slug = 'mobil-besar'),
  15, 'Manual', 700000,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  ARRAY['AC Powerful', '15 kursi penumpang', 'Bagasi besar', 'Audio system', 'Tirai jendela'],
  false, true
),
(
  'ELF Long', 'elf-long',
  'Kendaraan besar berkapasitas 19 orang untuk rombongan wisata besar.',
  (SELECT id FROM kategori_mobil WHERE slug = 'mobil-besar'),
  19, 'Manual', 900000,
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
  ARRAY['AC Double', '19 kursi', 'Bagasi luas', 'Speaker sound system'],
  false, true
),
(
  'Daihatsu Xenia', 'daihatsu-xenia',
  'MPV hemat bahan bakar untuk self drive. Mudah dikendarai dan irit.',
  (SELECT id FROM kategori_mobil WHERE slug = 'self-drive'),
  7, 'Manual', 300000,
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  ARRAY['AC', 'Audio System', 'Power Window', 'Bahan bakar irit', 'Mudah parkir'],
  false, true
),
(
  'Suzuki Ertiga', 'suzuki-ertiga',
  'MPV modern dengan transmisi otomatis. Nyaman untuk self drive jarak jauh.',
  (SELECT id FROM kategori_mobil WHERE slug = 'self-drive'),
  7, 'Automatic', 380000,
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
  ARRAY['AC', 'Transmisi otomatis', 'Audio Bluetooth', 'USB Charger', 'Kamera mundur'],
  false, true
);

-- TESTIMONI
INSERT INTO testimoni (nama, rating, komentar, tipe, disetujui, verified) VALUES
('Siti Rahma', 5, 'Pelayanan sangat memuaskan! Paket wisata Bali yang saya pesan sangat luar biasa. Pemandu wisatanya ramah dan profesional. Akan pesan lagi!', 'paket_wisata', true, true),
('Ahmad Fauzi', 5, 'Rental mobil sangat nyaman, mobil bersih dan terawat. Harga juga sangat terjangkau dibanding tempat lain. Recommended!', 'rental_mobil', true, true),
('Dewi Sartika', 4, 'Paket Lombok 5 hari 4 malam sangat worth it! Snorkeling di Gili Trawangan jadi pengalaman tak terlupakan. Terima kasih tim Nusa Bali!', 'paket_wisata', true, true),
('Budi Hartono', 5, 'Sudah 3x pakai layanan travel ini dan selalu puas. Recommended banget untuk keluarga maupun teman-teman!', 'umum', true, true),
('Maya Indah', 4, 'Sangat membantu! Pemandunya berpengalaman dan tahu banyak spot foto bagus. Trip Bromo jadi berkesan banget.', 'paket_wisata', true, true),
('Budi Prakoso', 5, 'Proses pemesanan mudah lewat WhatsApp, respon cepat, dan harga transparan. Tidak ada biaya tersembunyi. Terima kasih!', 'umum', true, true),
('Rina Marlina', 5, 'Raja Ampat via Nusa Bali Travel benar-benar luar biasa! Diving spot yang dikunjungi sangat amazing. Best trip ever!', 'paket_wisata', true, true),
('Hendra Gunawan', 4, 'Innova yang saya sewa bersih dan terawat. Sopirnya ramah dan tahu banyak rute. Pasti sewa lagi!', 'rental_mobil', true, true),
('Lestari Wulandari', 5, 'Paket Labuan Bajo memuaskan banget. Ketemu Komodo langsung seru dan menegangkan haha. Worth every rupiah!', 'paket_wisata', true, true);

-- BLOG
INSERT INTO blog (judul, slug, ringkasan, konten, dipublikasikan, author_nama, foto_utama, created_at) VALUES
(
  '10 Destinasi Wisata Terbaik di Indonesia 2024',
  '10-destinasi-wisata-terbaik-di-indonesia-2024',
  'Jelajahi keindahan nusantara dengan mengunjungi 10 destinasi terbaik pilihan wisatawan lokal dan mancanegara.',
  '<p>Indonesia memiliki ribuan destinasi wisata yang memukau. Dari Sabang sampai Merauke, setiap sudut negeri ini menyimpan keindahan yang tak ternilai.</p>
<h2>1. Bali - Pulau Dewata</h2>
<p>Bali masih menjadi destinasi favorit wisatawan dunia. Dengan pantai-pantai indah seperti Kuta, Seminyak, dan Nusa Dua, ditambah kekayaan budaya dan kuliner yang luar biasa, Bali selalu punya pesona tersendiri.</p>
<h2>2. Raja Ampat - Surga Bawah Laut</h2>
<p>Terletak di ujung timur Indonesia, Raja Ampat dikenal sebagai surga bawah laut dengan keanekaragaman hayati tertinggi di dunia. Lebih dari 1.500 spesies ikan hidup di sini.</p>
<h2>3. Labuan Bajo - Tanah Komodo</h2>
<p>Labuan Bajo menjadi semakin populer sebagai destinasi premium. Taman Nasional Komodo dengan Komodo Dragon-nya, ditambah keindahan alam bawah lautnya yang menakjubkan.</p>
<h2>4. Yogyakarta - Kota Budaya</h2>
<p>Yogyakarta adalah pusat kebudayaan Jawa dengan Candi Borobudur dan Prambanan sebagai ikonnya. Kota ini juga terkenal dengan batik, wayang, dan kuliner khasnya.</p>
<h2>5. Lombok - Bali yang Lebih Tenang</h2>
<p>Lombok menawarkan keindahan serupa Bali namun lebih tenang dan terjangkau. Gili Islands dengan trio pulaunya yang cantik menjadi daya tarik utama.</p>',
  true, 'Admin Nusa Bali Travel',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  NOW() - INTERVAL '9 days'
),
(
  'Tips Rental Mobil Aman untuk Liburan Keluarga',
  'tips-rental-mobil-aman-untuk-liburan-keluarga',
  'Sebelum memesan rental mobil, ada beberapa hal penting yang perlu diperhatikan agar perjalanan berjalan lancar dan aman.',
  '<p>Merencanakan liburan keluarga dengan rental mobil bisa menjadi pilihan yang ekonomis dan fleksibel. Namun, ada beberapa hal yang perlu diperhatikan agar perjalanan berjalan lancar.</p>
<h2>1. Pilih Perusahaan Rental Terpercaya</h2>
<p>Pastikan memilih perusahaan rental yang memiliki reputasi baik, asuransi kendaraan yang jelas, dan armada yang terawat. Baca review dari pelanggan sebelumnya.</p>
<h2>2. Periksa Kondisi Kendaraan</h2>
<p>Sebelum menerima kendaraan, periksa seluruh body mobil dan dokumentasikan kondisinya. Pastikan tidak ada kerusakan yang tidak tercatat.</p>
<h2>3. Pastikan Dokumen Lengkap</h2>
<p>Siapkan SIM yang masih berlaku, KTP, dan dokumen kendaraan. Periksa tanggal kadaluarsa STNK dan asuransi kendaraan.</p>
<h2>4. Pilih Kendaraan Sesuai Kebutuhan</h2>
<p>Sesuaikan kapasitas kendaraan dengan jumlah penumpang dan barang bawaan. Jangan memaksakan semua orang dalam satu kendaraan kecil.</p>
<h2>5. Pahami Ketentuan Sewa</h2>
<p>Baca dengan teliti kontrak sewa termasuk ketentuan bahan bakar, jam pengembalian, dan biaya tambahan jika terlambat.</p>',
  true, 'Admin Nusa Bali Travel',
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
  NOW() - INTERVAL '16 days'
),
(
  'Panduan Lengkap Wisata Bali untuk Pertama Kali',
  'panduan-lengkap-wisata-bali-untuk-pertama-kali',
  'Bali adalah destinasi impian banyak orang. Artikel ini akan memandu Anda menikmati Bali secara maksimal.',
  '<p>Bali menawarkan pengalaman wisata yang tak terlupakan bagi siapa pun yang mengunjunginya. Berikut panduan lengkap untuk Anda yang baru pertama kali ke Bali.</p>
<h2>Kapan Waktu Terbaik ke Bali?</h2>
<p>Musim kemarau (April-Oktober) adalah waktu terbaik berkunjung ke Bali. Cuaca cerah dan minim hujan membuat aktivitas outdoor lebih menyenangkan.</p>
<h2>Tempat Wajib Dikunjungi</h2>
<p>Beberapa tempat yang wajib dikunjungi saat pertama kali ke Bali antara lain Pura Tanah Lot, Ubud dengan sawah Tegallalang-nya, Pantai Kuta untuk sunset, dan Seminyak untuk kuliner dan hiburan malam.</p>
<h2>Tips Transportasi di Bali</h2>
<p>Cara terbaik menjelajah Bali adalah dengan menyewa motor atau mobil. Taksi online seperti Grab juga tersedia di area Bali selatan.</p>
<h2>Kuliner Khas Bali</h2>
<p>Jangan lewatkan Babi Guling, Bebek Betutu, Nasi Campur Bali, dan Lawar. Untuk oleh-oleh, Pie Susu Bali dan kopi luwak adalah pilihan populer.</p>
<h2>Etika Berkunjung ke Pura</h2>
<p>Saat mengunjungi pura, gunakan kain saput (sarung) yang biasanya disediakan. Hormati area suci dan jangan masuk ke area yang dilarang.</p>',
  true, 'Admin Nusa Bali Travel',
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
  NOW() - INTERVAL '23 days'
);

-- PENGATURAN WEBSITE
INSERT INTO pengaturan_website (kunci, nilai, tipe) VALUES
('nama_website', 'Nusa Bali Travel', 'text'),
('tagline', 'Layanan paket wisata dan rental mobil terpercaya dengan pengalaman terbaik.', 'text'),
('telepon', '+62 812 3456 7890', 'text'),
('email', 'info@nusabalitravel.com', 'text'),
('alamat', 'Jakarta, Indonesia', 'text'),
('whatsapp', '6281234567890', 'text'),
('instagram', 'nusabalitravel', 'text'),
('facebook', 'nusabalitravel', 'text'),
('hero_judul', 'Jelajahi Keindahan Nusantara Bersama Kami', 'text'),
('hero_subjudul', 'Paket wisata eksklusif dan rental mobil nyaman untuk perjalanan tak terlupakan Anda di Bali & sekitarnya.', 'text')
ON CONFLICT (kunci) DO UPDATE SET nilai = EXCLUDED.nilai;