import React from "react";
import { Users, Car } from "lucide-react";

interface SlotBadgeProps {
  tersedia: number;
  total: number;
  showText?: boolean;
  variant?: "flash" | "simpel";
}

export default function SlotBadge({ 
  tersedia, 
  total, 
  showText = true, 
  variant = "flash" 
}: SlotBadgeProps) {
  if (total <= 0) return null;

  const isCritical = tersedia > 0 && tersedia <= 3;
  const isWarning = tersedia > 3 && tersedia <= 5;
  const isSoldOut = tersedia <= 0;

  // SIMPEL VARIANT (Requested for Mobil)
  if (variant === "simpel") {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 transition shadow-sm">
        <Car className="w-4 h-4 text-green-500" />
        <span className="text-xs font-bold uppercase tracking-tight">
          {tersedia <= 0 ? "Stok Habis" : `${tersedia} MOBIL TERSEDIA`}
        </span>
      </div>
    );
  }

  // FLASH SALE VARIANT (For Paket Wisata)
  let bgColor = "bg-green-100 text-green-700 border-green-200";
  let iconColor = "text-green-500";
  let text = `${tersedia} Slot Tersedia`;
  let animationClass = "";

  if (isSoldOut) {
    bgColor = "bg-gray-100 text-gray-500 border-gray-200";
    iconColor = "text-gray-400";
    text = "Slot Habis";
  } else if (isCritical) {
    bgColor = "bg-red-500 text-white border-red-600 shadow-lg shadow-red-200";
    iconColor = "text-white";
    text = `🔥 HANYA SISA ${tersedia} SLOT!`;
    animationClass = "animate-pulse ring-2 ring-red-500 ring-offset-1";
  } else if (isWarning) {
    bgColor = "bg-orange-500 text-white border-orange-600";
    iconColor = "text-white";
    text = `⚠️ SLOT TERBATAS: SISA ${tersedia}!`;
  }

  const percentage = total > 0 ? (tersedia / total) * 100 : 0;
  let barColor = "bg-green-500";
  if (isSoldOut) barColor = "bg-gray-300";
  else if (isCritical) barColor = "bg-red-600";
  else if (isWarning) barColor = "bg-orange-500";

  return (
    <div className="w-full space-y-1.5">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${bgColor} ${animationClass}`}
      >
        <Users className={`w-3 h-3 ${iconColor}`} />
        {showText && <span>{text}</span>}
      </div>
      
      {/* Progress Bar Style Flash Sale */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-100 shadow-inner">
        <div 
          className={`h-full ${barColor} transition-all duration-700 ease-out rounded-full relative`}
          style={{ width: `${percentage}%` }}
        >
          {isCritical && (
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}
