import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function BlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog")
    .select("*")
    .eq("dipublikasikan", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-500 py-16 text-center text-white">
        <h1 className="text-3xl font-bold">Blog & Artikel</h1>
        <p className="mt-2 text-blue-200">
          Tips perjalanan, destinasi wisata, dan banyak lagi
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {posts?.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Belum ada artikel</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(posts || []).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border"
              >
                <div className="relative h-48 bg-gray-100">
                  {post.foto_utama && (
                    <Image
                      src={post.foto_utama}
                      alt={post.judul}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">
                    {format(new Date(post.created_at), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </p>
                  <h2 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.judul}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {post.ringkasan}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
