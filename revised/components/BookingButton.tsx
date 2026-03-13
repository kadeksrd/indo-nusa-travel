"use client";
import { useState } from "react";
import BookingModal from "./BookingModal";

export default function BookingButton({ paket }: { paket: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2"
      >
        Pesan Sekarang
      </button>
      <BookingModal paket={paket} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
