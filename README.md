# Indo Nusa Travel - Premium Travel & Rental Portal

Indo Nusa Travel adalah platform pemesanan paket wisata dan rental mobil premium yang dibangun dengan Next.js 14, Tailwind CSS, dan Supabase.

## Fitur Utama

- 🌟 **Desain Premium**: Antarmuka modern dengan glassmorphism dan animasi halus.
- 📱 **Responsive**: Optimal untuk tampilan Mobile dan Desktop.
- 🛍️ **E-Commerce**: Pemesanan paket wisata dan rental mobil dengan sistem slot.
- 💳 **Pembayaran Otomatis**: Integrasi dengan Doku Payment Gateway.
- 🛠️ **Admin Panel CMS**:
  - Kelola Paket, Rental, & Blog.
  - Moderasi Testimoni & Tambah Manual.
  - Pengaturan SEO & Tracking (Pixel/GTM/GA4).
  - Pengaturan Branding Website secara dinamis.
- 👤 **User Dashboard**: Riwayat pesanan dan fitur ulasan (testimonial).

## Persiapan Awal

### 1. Prasyarat
- Node.js 18+ 
- Akun Supabase
- Akun Doku (untuk sandbox/production)

### 2. Kloning Project
```bash
git clone https://github.com/UsernameKamu/indo-nusa-travel.git
cd indo-nusa-travel
```

### 3. Instalasi Dependency
```bash
npm install
```

### 4. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan isi dengan kredensial Anda:
```bash
cp .env.example .env
```

### 5. Setup Database (Supabase)
1. Buat project baru di [Supabase](https://supabase.com).
2. Buka **SQL Editor** di Dashboard Supabase.
3. Jalankan isi file `lib/supabase/migrations/001_schema.sql` untuk membuat tabel dan kebijakan RLS.
4. (Opsional) Jalankan `002.seed.sql` untuk data dummy awal.
5. Pastikan menjalankan migrasi tambahan di folder `migrations` jika ada fitur baru (SEO, Slots, dll).

## Menjalankan Project

Jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Deploy ke Production

Platform yang direkomendasikan adalah **Vercel**:
1. Hubungkan repository GitHub Anda ke Vercel.
2. Tambahkan semua Environment Variables yang ada di `.env` ke settings Vercel.
3. Vercel akan secara otomatis mendeteksi Next.js dan melakukan build & deploy.

## Lisensi
Distributed under the MIT License. See `LICENSE` for more information.

---
Dibuat dengan ❤️ untuk industri pariwisata Indonesia.
