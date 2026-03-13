"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const statuses = ["pending", "dikonfirmasi", "selesai", "dibatalkan"];

export default function UpdateStatusButton({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { error } = await supabase
      .from("pemesanan")
      .update({ status: e.target.value })
      .eq("id", id);
    if (error) toast.error("Gagal update status");
    else {
      toast.success("Status diperbarui");
      router.refresh();
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
