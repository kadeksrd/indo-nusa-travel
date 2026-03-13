import crypto from "crypto";

export function getDokuBaseUrl() {
  // Gunakan api-sandbox untuk ngetes
  return process.env.DOKU_IS_PRODUCTION === "true"
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";
}

export function generateRequestId() {
  return crypto.randomBytes(16).toString("hex"); // Lebih aman buat ID
}

export function generateTimestamp() {
  // Format harus YYYY-MM-DDTHH:mm:ssZ
  return new Date().toISOString().split(".")[0] + "Z";
}

export function generateDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  secretKey,
  body,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  secretKey: string;
  body?: object;
}) {
  let digestValue = "";
  if (body) {
    // 1. Digest HARUS dari string JSON tanpa spasi tambahan (minified)
    const bodyString = JSON.stringify(body);
    const hash = crypto
      .createHash("sha256")
      .update(bodyString, "utf8")
      .digest("base64");
    digestValue = hash; // DOKU biasanya minta base64-nya saja untuk di-header
  }

  // 2. Komponen Signature HARUS persis urutannya
  // Hati-hati: Tidak boleh ada spasi setelah titik dua!
  const componentSignature =
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${requestTimestamp}\n` +
    `Request-Target:${requestTarget}` +
    (body ? `\nDigest:${digestValue}` : "");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(componentSignature)
    .digest("base64");

  // Kembalikan Digest dengan prefix SHA-256= untuk dikirim di Header fetch
  return {
    signature,
    digestValue: `SHA-256=${digestValue}`,
  };
}
