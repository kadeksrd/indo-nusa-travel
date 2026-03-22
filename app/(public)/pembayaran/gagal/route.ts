import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Ambil URL asal (dengan query params)
  const url = new URL(req.url);
  
  // Redirect ke URL yang sama tapi menggunakan method GET
  // Status 303 (See Other) memaksa browser melakukan GET ke URL baru
  return NextResponse.redirect(url.toString(), 303);
}
