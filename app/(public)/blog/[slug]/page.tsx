import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Clock, User, Tag } from "lucide-react";

interface Props {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog")
    .select("*")
    .eq("slug", params.slug)
    .eq("dipublikasikan", true)
    .single();

  if (!post) return notFound();

  // Related posts
  const { data: relatedPosts } = await supabase
    .from("blog")
    .select("*")
    .eq("dipublikasikan", true)
    .neq("id", post.id)
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-blue-600">
          Blog
        </Link>
        <span>›</span>
        <span className="text-gray-900 line-clamp-1">{post.judul}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article */}
        <article className="lg:col-span-2">
          {post.foto_utama && (
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100">
              <Image
                src={post.foto_utama}
                alt={post.judul}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {post.judul}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(new Date(post.created_at), "dd MMMM yyyy", {
                locale: id,
              })}
            </span>
            {post.author_nama && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {post.author_nama}
              </span>
            )}
          </div>

          {post.ringkasan && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium border-l-4 border-blue-500 pl-4">
              {post.ringkasan}
            </p>
          )}

          {post.konten ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.konten }}
            />
          ) : (
            <p className="text-gray-600">Konten tidak tersedia.</p>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* CTA */}
            <div className="bg-blue-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Siap Berwisata?</h3>
              <p className="text-blue-200 text-sm mb-4">
                Temukan paket wisata terbaik untuk Anda
              </p>
              <Link
                href="/paket-wisata"
                className="block bg-white text-blue-700 font-bold text-center py-2.5 rounded-xl text-sm hover:bg-blue-50 transition"
              >
                Lihat Paket Wisata
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Artikel Lainnya
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {p.foto_utama && (
                          <Image
                            src={p.foto_utama}
                            alt={p.judul}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                          {p.judul}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(p.created_at), "dd MMM yyyy", {
                            locale: id,
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
