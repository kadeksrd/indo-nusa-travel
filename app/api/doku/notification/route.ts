import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Gunakan Service Role agar bypass RLS saat update status
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const orderId = 
    searchParams.get("order_id") || 
    searchParams.get("invoice_number") || 
    searchParams.get("TRANSIDMERCHANT") ||
    searchParams.get("invoiceNumber") ||
    searchParams.get("SESSIONID"); // DOKU often uses SESSIONID

  console.log("DOKU GET REDIRECT:", { 
    url: req.url,
    allParams: Object.fromEntries(searchParams.entries()),
    determinedOrderId: orderId 
  });

  if (orderId) {
    const successUrl = new URL("/pembayaran/sukses", new URL(req.url).origin);
    successUrl.searchParams.set("order_id", orderId);
    return NextResponse.redirect(successUrl.toString());
  }

  // Jika tidak ada orderId tetap arahkan ke halaman sukses (nanti di sana ada pengecekan)
  // daripada ke dashboard yang membingungkan user
  return NextResponse.redirect(new URL("/pembayaran/sukses", new URL(req.url).origin).toString());
}

export async function POST(req: NextRequest) {
  try {
    // Periksa Content-Type untuk membedakan Webhook (JSON) vs Redirect (Form)
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Jika ini redirect dari browser (DOKU mengirim POST form-data)
      const formData = await req.formData();
      const invoiceNumber = formData.get("order?.invoice_number") || formData.get("invoice_number");
      
      const url = new URL(req.url);
      const successUrl = new URL("/pembayaran/sukses", url.origin);
      if (invoiceNumber) successUrl.searchParams.set("order_id", invoiceNumber.toString());
      
      return NextResponse.redirect(successUrl.toString(), 303);
    }
    
    // Simpan raw body untuk verifikasi signature agar tidak ada perubahan formatting
    const bodyString = await req.text();
    const body = JSON.parse(bodyString);

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

    // 3. Susun String Signature
    const componentSignature =
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:/api/doku/notification\n` +
      `Digest:${hash}`;

    const hmac = crypto
      .createHmac("sha256", process.env.DOKU_SECRET_KEY!)
      .update(componentSignature)
      .digest("base64");

    const expectedSignature = `HMACSHA256=${hmac}`;

    console.log("=== WEBHOOK VERIFICATION ===");
    console.log("Incoming Signature:", signatureFromServer);
    console.log("Expected Signature:", expectedSignature);

    if (signatureFromServer !== expectedSignature) {
      console.error("❌ Signature Mismatch!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const invoiceNumber = body.order?.invoice_number;
    const transactionStatus = body.transaction?.status;

    // 4. Ambil data pemesanan saat ini
    const { data: currentPemesanan } = await supabase
      .from("pemesanan")
      .select("*, paket_wisata_id, rental_mobil_id, jumlah_orang, status_pembayaran")
      .eq("kode_pemesanan", invoiceNumber)
      .single();

    if (!currentPemesanan) {
      console.error("❌ Pemesanan tidak ditemukan:", invoiceNumber);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let statusPembayaran = "belum_bayar";
    let statusPemesanan = "pending";

    if (transactionStatus === "SUCCESS") {
      statusPembayaran = "lunas";
      statusPemesanan = "dikonfirmasi";
    } else if (["FAILED", "EXPIRED", "CANCELLED"].includes(transactionStatus)) {
      statusPembayaran = "gagal";
      statusPemesanan = "dibatalkan";
    }

    // Hanya update slot/stok jika status berubah ke lunas dan sebelumnya belum lunas
    if (statusPembayaran === "lunas" && currentPemesanan.status_pembayaran !== "lunas") {
      // 1. Paket Wisata
      if (currentPemesanan.paket_wisata_id) {
        const { data: paket } = await supabase
          .from("paket_wisata")
          .select("slot_tersedia")
          .eq("id", currentPemesanan.paket_wisata_id)
          .single();
        
        if (paket) {
          const newSlot = Math.max(0, (paket.slot_tersedia || 0) - (currentPemesanan.jumlah_orang || 1));
          await supabase
            .from("paket_wisata")
            .update({ slot_tersedia: newSlot })
            .eq("id", currentPemesanan.paket_wisata_id);
        }
      }

      // 2. Rental Mobil
      if (currentPemesanan.rental_mobil_id) {
        const { data: mobil } = await supabase
          .from("rental_mobil")
          .select("stok_tersedia")
          .eq("id", currentPemesanan.rental_mobil_id)
          .single();

        if (mobil) {
          const newStok = Math.max(0, (mobil.stok_tersedia || 0) - 1); // Rental mobil biasanya 1 per booking
          await supabase
            .from("rental_mobil")
            .update({ stok_tersedia: newStok })
            .eq("id", currentPemesanan.rental_mobil_id);
        }
      }
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
