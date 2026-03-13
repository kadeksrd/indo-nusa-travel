"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  bucket = "images",
  folder = "uploads",
  label = "Foto Utama",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange(data.publicUrl);
      toast.success("Foto berhasil diupload!");
    } catch (err: any) {
      toast.error("Gagal upload: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border group">
          <div className="relative h-48 w-full bg-gray-100">
            <Image src={value} alt="Preview" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100"
            >
              <Upload className="w-4 h-4" /> Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-red-600"
            >
              <X className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
            uploading
              ? "border-blue-300 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon className="w-10 h-10" />
              <p className="text-sm font-medium text-gray-600">
                Klik atau drag foto ke sini
              </p>
              <p className="text-xs">PNG, JPG, WEBP maks. 5MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {/* Fallback URL manual */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau tempel URL gambar langsung..."
          className="w-full border rounded-lg px-3 py-2 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}
