import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Indo Nusa Travel - Paket Wisata & Rental Mobil Terpercaya",
  description:
    "Layanan paket wisata dan rental mobil terpercaya dengan pengalaman terbaik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
