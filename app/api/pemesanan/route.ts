import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const date = new Date();
  const kode = `NBT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const totalHarga = body.total_harga;
  const jumlahDP = Math.ceil(totalHarga * 0.2);
  const jumlahBayar = body.tipe_pembayaran === "dp" ? jumlahDP : totalHarga;
  const sisaBayar = body.tipe_pembayaran === "dp" ? totalHarga - jumlahDP : 0;

  const { data, error } = await supabase
    .from("pemesanan")
    .insert({
      kode_pemesanan: kode,
      user_id: user?.id || null,
      tipe: body.tipe,
      paket_wisata_id: body.paket_wisata_id || null,
      rental_mobil_id: body.rental_mobil_id || null,
      nama_lengkap: body.nama_lengkap,
      email: body.email,
      nomor_hp: body.nomor_hp,
      tanggal_berangkat: body.tanggal_berangkat,
      jumlah_orang: body.jumlah_orang || 1,
      catatan: body.catatan || null,
      total_harga: totalHarga,
      tipe_pembayaran: body.tipe_pembayaran,
      jumlah_dp: jumlahDP,
      jumlah_dibayar: jumlahBayar,
      sisa_pembayaran: sisaBayar,
      status: "pending",
      status_pembayaran: "belum_bayar",
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data, kode_pemesanan: kode });
}
