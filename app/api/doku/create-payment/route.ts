import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  getDokuBaseUrl,
  generateDokuSignature,
  generateRequestId,
  generateTimestamp,
} from "@/lib/doku";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { kode_pemesanan } = await req.json();

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

  // Ambil Config
  const clientId = process.env.DOKU_CLIENT_ID!;
  const secretKey = process.env.DOKU_SECRET_KEY!;
  const baseUrl = getDokuBaseUrl();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

  const requestId = generateRequestId();
  const requestTimestamp = generateTimestamp();
  const requestTarget = "/checkout/v1/payment";

  const namaLayanan =
    pemesanan.paket_wisata?.nama ||
    pemesanan.rental_mobil?.nama ||
    "Layanan Travel";
  const jumlahBayar = Math.round(pemesanan.jumlah_dibayar);

  // 1. Susun Body (Sangat krusial: jangan ada field undefined)
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
              ? `DP - ${namaLayanan}`.substring(0, 50)
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
      phone: pemesanan.nomor_hp.replace(/[^0-9]/g, "").startsWith("0")
        ? "62" + pemesanan.nomor_hp.replace(/[^0-9]/g, "").slice(1)
        : pemesanan.nomor_hp.replace(/[^0-9]/g, ""),
      address: "Indonesia",
      country: "ID",
    },
    payment: {
      payment_due_date: 60,
    },
  };

  // 2. Generate Signature & Digest
  const { signature, digestValue } = generateDokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    secretKey,
    body,
  });

  try {
    const response = await fetch(`${baseUrl}${requestTarget}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": requestTimestamp,
        Signature: `HMACSHA256=${signature}`, // Wajib pakai prefix ini
        Digest: digestValue, // Isinya "SHA-256=..."
      },
      body: JSON.stringify(body), // Harus sama persis dengan yang di-hash
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "Respon DOKU bukan JSON" },
        { status: 500 },
      );
    }

    if (!response.ok) {
      console.error("DOKU ERROR:", data);
      return NextResponse.json(
        { error: data.error?.message || "Gagal ke DOKU" },
        { status: 400 },
      );
    }

    const paymentUrl = data.response?.payment?.url;

    if (paymentUrl) {
      await supabase
        .from("pemesanan")
        .update({ doku_payment_url: paymentUrl })
        .eq("kode_pemesanan", kode_pemesanan);

      return NextResponse.json({ payment_url: paymentUrl });
    }

    return NextResponse.json(
      { error: "Payment URL tidak ditemukan" },
      { status: 400 },
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
