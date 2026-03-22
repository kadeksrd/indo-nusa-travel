import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ClipboardList } from "lucide-react";
import DashboardContent from "./DashboardContent";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  dikonfirmasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  dibatalkan: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");

  const [{ data: profile }, { data: pemesanans }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("pemesanan")
      .select(
        "*, paket_wisata(nama, foto_utama), rental_mobil(nama, foto_utama)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return <DashboardContent profile={profile} pemesanans={pemesanans || []} user={user} />;
}
