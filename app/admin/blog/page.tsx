import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import DeleteBlogButton from "./DeleteBlogButton";

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <Link
          href="/admin/blog/buat"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-800 transition"
        >
          <Plus className="w-4 h-4" /> Buat Artikel
        </Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Judul", "Author", "Tanggal", "Publish", "Aksi"].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-gray-500 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {(posts || []).map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">
                  {p.judul}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {p.author_nama || "-"}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {format(new Date(p.created_at), "dd MMM yyyy", {
                    locale: id,
                  })}
                </td>
                <td className="py-3 px-4">
                  {p.dipublikasikan ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/blog/${p.id}/ubah`}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                    >
                      <Pencil className="w-3 h-3" /> Ubah
                    </Link>
                    <DeleteBlogButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
