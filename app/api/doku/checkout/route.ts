import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  getDokuBaseUrl,
  generateDokuSignature,
  generateRequestId,
  generateTimestamp,
} from "@/lib/doku";

// Biar gak 405 kalau diakses lewat browser/GET
export async function GET() {
  return NextResponse.json({ message: "API Checkout Indo Nusa Travel Aktif" });
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { kode_pemesanan } = await req.json();

    // 1. Ambil data pesanan dari Supabase
    const { data: pemesanan, error: dbError } = await supabase
      .from("pemesanan")
      .select("*, paket_wisata(nama), rental_mobil(nama)")
      .eq("kode_pemesanan", kode_pemesanan)
      .single();

    if (dbError || !pemesanan) {
      return NextResponse.json(
        { error: "Pemesanan tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Setup Config DOKU
    const clientId = process.env.DOKU_CLIENT_ID!;
    const secretKey = process.env.DOKU_SECRET_KEY!;
    const baseUrl = getDokuBaseUrl();

    // Pastikan URL bersih dari trailing slash
    const rawAppUrl =
      process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;
    const appUrl = rawAppUrl.replace(/\/$/, "");

    const requestId = generateRequestId();
    const requestTimestamp = generateTimestamp();
    const requestTarget = "/checkout/v1/payment";

    const namaLayanan =
      pemesanan.paket_wisata?.nama ||
      pemesanan.rental_mobil?.nama ||
      "Layanan Wisata";
    const jumlahBayar = Math.round(pemesanan.jumlah_dibayar);

    // 3. Susun Body Request ke DOKU
    const body = {
      order: {
        invoice_number: kode_pemesanan,
        line_items: [
          {
            id: String(
              pemesanan.paket_wisata_id || pemesanan.rental_mobil_id || "001",
            ),
            name:
              pemesanan.tipe_pembayaran === "dp"
                ? `DP 20% - ${namaLayanan}`.substring(0, 50)
                : namaLayanan.substring(0, 50),
            price: jumlahBayar,
            quantity: 1,
            type: "Service",
          },
        ],
        amount: jumlahBayar,
        currency: "IDR",
        session_id: kode_pemesanan,
        callback_url: `${appUrl}/api/doku/notification`,
        success_return_url: `${appUrl}/pembayaran/sukses?order_id=${kode_pemesanan}`,
        failed_return_url: `${appUrl}/pembayaran/gagal?order_id=${kode_pemesanan}`,
      },
      customer: {
        id: String(pemesanan.user_id || kode_pemesanan),
        name: pemesanan.nama_lengkap.substring(0, 50),
        email: pemesanan.email,
        phone: pemesanan.nomor_hp.replace(/[^0-9]/g, ""),
        address: "Bali, Indonesia",
        country: "ID",
      },
      payment: {
        payment_due_date: 60, // 60 menit batas bayar
      },
    };

    // 4. Generate Signature
    const { signature, digestValue } = generateDokuSignature({
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      secretKey,
      body,
    });

    // 5. Kirim ke DOKU
    const response = await fetch(`${baseUrl}${requestTarget}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": requestTimestamp,
        Signature: `HMACSHA256=${signature}`,
        Digest: digestValue,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "DOKU Reject" },
        { status: 400 },
      );
    }

    const paymentUrl = data.response?.payment?.url;

    if (paymentUrl) {
      // Update DB biar kita punya record link pembayarannya
      await supabase
        .from("pemesanan")
        .update({ doku_payment_url: paymentUrl })
        .eq("kode_pemesanan", kode_pemesanan);

      return NextResponse.json({ payment_url: paymentUrl });
    }

    return NextResponse.json(
      { error: "Gagal generate payment URL" },
      { status: 400 },
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
