// components/rental/RentalBookingButton.tsx
"use client";
import { useState } from "react";
import RentalBookingModal from "./RentalBookingModal";

export default function RentalBookingButton({ mobil }: { mobil: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2"
      >
        Sewa Sekarang
      </button>
      <RentalBookingModal mobil={mobil} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
