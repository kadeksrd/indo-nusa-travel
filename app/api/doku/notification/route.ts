import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Gunakan Service Role agar bypass RLS saat update status
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
// export async function GET() {
//   return new Response("OK", { status: 200 });
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bodyString = JSON.stringify(body);

    // 1. Ambil Header (Gunakan huruf kecil sesuai standar Node/Next)
    const clientId = req.headers.get("client-id") || "";
    const requestId = req.headers.get("request-id") || "";
    const requestTimestamp = req.headers.get("request-timestamp") || "";
    const signatureFromServer = req.headers.get("signature") || "";

    // 2. Hitung Digest (Hasil murni Base64)
    const hash = crypto
      .createHash("sha256")
      .update(bodyString, "utf8")
      .digest("base64");

    // 3. Susun String Signature (HATI-HATI: Jangan ada spasi setelah titik dua!)
    // Pastikan path-nya "/api/doku/notification" sesuai di Dashboard DOKU
    const componentSignature =
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:/api/doku/notification\n` +
      `Digest:${hash}`; // Pakai hash-nya saja, tanpa prefix SHA-256= di sini

    const hmac = crypto
      .createHmac("sha256", process.env.DOKU_SECRET_KEY!)
      .update(componentSignature)
      .digest("base64");

    const expectedSignature = `HMACSHA256=${hmac}`;

    // Debugging (Cek di terminal Linux Mint kamu)
    console.log("=== WEBHOOK VERIFICATION ===");
    console.log("Incoming Signature:", signatureFromServer);
    console.log("Expected Signature:", expectedSignature);

    if (signatureFromServer !== expectedSignature) {
      console.error("❌ Signature Mismatch!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Update Status Database
    const invoiceNumber = body.order?.invoice_number;
    const transactionStatus = body.transaction?.status; // DOKU kirim: SUCCESS, FAILED, dll

    let statusPembayaran = "belum_bayar";
    let statusPemesanan = "pending";

    if (transactionStatus === "SUCCESS") {
      statusPembayaran = "lunas";
      statusPemesanan = "dikonfirmasi";
    } else if (["FAILED", "EXPIRED", "CANCELLED"].includes(transactionStatus)) {
      statusPembayaran = "gagal";
      statusPemesanan = "dibatalkan";
    }

    const { error: updateError } = await supabase
      .from("pemesanan")
      .update({
        status_pembayaran: statusPembayaran,
        status: statusPemesanan,
        doku_transaction_id: body.transaction?.id,
        paid_at: statusPembayaran === "lunas" ? new Date().toISOString() : null,
      })
      .eq("kode_pemesanan", invoiceNumber);

    if (updateError) throw updateError;

    return NextResponse.json({ status: "OK" });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
