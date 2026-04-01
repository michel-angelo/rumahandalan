"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import Image from "next/image";

type UploadedImage = {
  url: string;
  is_primary: boolean;
  order: number;
};

type Props = {
  propertyId: string;
  existingImages?: UploadedImage[];
  onImagesChange?: (images: UploadedImage[]) => void;
};

export default function ImageUploader({
  propertyId,
  existingImages = [],
  onImagesChange,
}: Props) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file, { upsert: false });

      if (uploadError) {
        setError(`Gagal upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName);

      newImages.push({
        url: publicUrl,
        is_primary: images.length === 0 && newImages.length === 0,
        order: images.length + newImages.length,
      });
    }

    // Save to property_images table
    if (newImages.length > 0) {
      const { error: dbError } = await supabase.from("property_images").insert(
        newImages.map((img) => ({
          property_id: propertyId,
          url: img.url,
          is_primary: img.is_primary,
          order: img.order,
        })),
      );

      if (dbError) {
        setError(`Gagal menyimpan ke database: ${dbError.message}`);
      } else {
        const updated = [...images, ...newImages];
        setImages(updated);
        onImagesChange?.(updated);
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  async function setPrimary(index: number) {
    const supabase = createSupabaseBrowserClient();
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));

    // Update semua gambar di DB
    for (const img of updated) {
      await supabase
        .from("property_images")
        .update({ is_primary: img.is_primary })
        .eq("property_id", propertyId)
        .eq("url", img.url);
    }

    setImages(updated);
    onImagesChange?.(updated);
  }

  async function removeImage(index: number) {
    const supabase = createSupabaseBrowserClient();
    const img = images[index];

    // 1. SAFETY CHECK: Kalau img atau img.url kosong, hentikan fungsi biar gak crash
    if (!img || !img.url) {
      console.error("URL tidak ditemukan, gagal menghapus gambar.");
      return;
    }

    try {
      // 2. Ekstrak path dengan aman
      const pathParts = img.url.split("/property-images/");
      if (pathParts.length > 1) {
        const path = pathParts[1];
        await supabase.storage.from("property-images").remove([path]);
      }

      // 3. Delete from DB (pakai .eq("url", ...))
      await supabase
        .from("property_images")
        .delete()
        .eq("property_id", propertyId)
        .eq("url", img.url);

      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      onImagesChange?.(updated);
    } catch (err) {
      console.error("Gagal menghapus gambar:", err);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Area */}
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#C8C7E8] rounded-2xl p-8 cursor-pointer hover:border-[#343270] hover:bg-[#EEEDF8]/30 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-[#343270]">
            <svg
              className="w-8 h-8 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-[14px] font-semibold">Mengupload...</p>
          </div>
        ) : (
          <>
            <svg
              className="w-10 h-10 text-[#C8C7E8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-[14px] font-semibold text-[#343270]">
              Klik untuk upload foto
            </p>
            <p className="text-[12px] text-[#8E8EA8]">
              JPG, PNG, WebP — maks. 50MB per file
            </p>
          </>
        )}
      </label>

      {error && (
        <p className="text-red-500 text-[13px] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-[#E4E4F0] aspect-square bg-[#F7F7FB]"
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              )}

              {/* Primary Badge */}
              {img.is_primary && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#343270] text-white">
                  Cover
                </span>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    onClick={() => setPrimary(index)}
                    className="px-2 py-1 bg-white text-[#343270] rounded-lg text-[11px] font-bold hover:bg-[#EEEDF8] transition-colors"
                  >
                    Set Cover
                  </button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg text-[11px] font-bold hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
