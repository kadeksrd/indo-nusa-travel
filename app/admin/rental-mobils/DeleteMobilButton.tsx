"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DeleteMobilButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus mobil ini?")) return;
    const { error } = await supabase.from("rental_mobil").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else {
      toast.success("Berhasil dihapus");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs font-medium"
    >
      <Trash2 className="w-3 h-3" /> Hapus
    </button>
  );
}
