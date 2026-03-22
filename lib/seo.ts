import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export async function getPageMetadata(path: string): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("seo_halaman")
    .select("meta_title, meta_description, meta_keywords")
    .eq("path", path)
    .single();

  if (!data) return {};

  return {
    title: data.meta_title || undefined,
    description: data.meta_description || undefined,
    keywords: data.meta_keywords || undefined,
  };
}

export async function getBlogMetadata(slug: string): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog")
    .select("judul, ringkasan, meta_title, meta_description, meta_keywords, foto_utama")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  const title = data.meta_title || data.judul;
  const description = data.meta_description || data.ringkasan;

  return {
    title: `${title} - Indo Nusa Travel`,
    description,
    keywords: data.meta_keywords || undefined,
    openGraph: {
      title,
      description,
      images: data.foto_utama ? [data.foto_utama] : [],
    },
  };
}

export async function getPaketMetadata(slug: string): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("paket_wisata")
    .select("nama, deskripsi, meta_title, meta_description, meta_keywords, foto_utama")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  const title = data.meta_title || data.nama;
  const description = data.meta_description || data.deskripsi;

  return {
    title: `${title} - Indo Nusa Travel`,
    description,
    keywords: data.meta_keywords || undefined,
    openGraph: {
      title,
      description,
      images: data.foto_utama ? [data.foto_utama] : [],
    },
  };
}

export async function getMobilMetadata(slug: string): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("rental_mobil")
    .select("nama, deskripsi, meta_title, meta_description, meta_keywords, foto_utama")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  const title = data.meta_title || data.nama;
  const description = data.meta_description || data.deskripsi;

  return {
    title: `${title} - Indo Nusa Travel`,
    description,
    keywords: data.meta_keywords || undefined,
    openGraph: {
      title,
      description,
      images: data.foto_utama ? [data.foto_utama] : [],
    },
  };
}
