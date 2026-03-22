import { createClient } from "@/lib/supabase/server";
import { getPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export async function generateMetadata() {
  return await getPageMetadata("/blog");
}

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
      <div className="relative h-80 md:h-[350px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Blog & Artikel</h1>
          <p className="max-w-xl mx-auto text-blue-100 font-medium text-sm md:text-base">
            Inspirasi liburan, tips perjalanan, dan berita terbaru seputar destinasi wisata eksotis di Indonesia.
          </p>
        </div>
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
