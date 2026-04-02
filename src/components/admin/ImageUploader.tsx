"use client";

import Image from "next/image";

export type PendingImage = {
  file: File;
  preview: string;
  is_primary: boolean;
};

export type UploadedImage = {
  id?: string;
  url: string;
  is_primary: boolean;
  order: number;
};

type Props = {
  propertyId: string;
  pendingImages: PendingImage[];
  existingImages?: UploadedImage[];
  onFilesSelected: (files: FileList) => void;
  onSetPrimary: (type: "existing" | "pending", index: number) => void;
  onRemove: (type: "existing" | "pending", index: number) => void;
};

export default function ImageUploader({
  pendingImages,
  existingImages = [],
  onFilesSelected,
  onSetPrimary,
  onRemove,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Upload Area */}
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/[0.1] bg-white/[0.01] rounded-2xl p-8 cursor-pointer hover:border-[#2E9AB8] hover:bg-[#2E9AB8]/5 transition-all group">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFilesSelected(e.target.files);
              e.target.value = ""; // Reset input biar bisa pilih file yg sama lagi
            }
          }}
          className="hidden"
        />
        <svg
          className="w-10 h-10 text-[#8E8EA8] group-hover:text-[#2E9AB8] transition-colors"
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
        <p className="text-[14px] font-medium text-white mt-2">
          Klik untuk pilih foto
        </p>
        <p className="text-[12px] text-[#8E8EA8]">
          JPG, PNG, WebP — Foto akan diupload saat form disimpan
        </p>
      </label>

      {/* Image Grid */}
      {(existingImages.length > 0 || pendingImages.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {/* Menampilkan Gambar yang sudah ada di Database (Khusus Edit Mode) */}
          {existingImages.map((img, index) => (
            <div
              key={`existing-${index}`}
              className="relative group rounded-xl overflow-hidden border border-white/[0.08] aspect-square bg-white/[0.02]"
            >
              <Image
                src={img.url}
                alt={`Foto ${index}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
              {img.is_primary && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2E9AB8] text-white shadow-md">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-[#0B0B12]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onSetPrimary("existing", index);
                    }}
                    className="px-3 py-1.5 bg-white/[0.1] border border-white/[0.2] text-white rounded-lg text-[11px] font-medium hover:bg-white/[0.2] transition-colors w-24"
                  >
                    Jadikan Cover
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove("existing", index);
                  }}
                  className="px-3 py-1.5 bg-red-500/80 border border-red-500 text-white rounded-lg text-[11px] font-medium hover:bg-red-500 transition-colors w-24"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {/* Menampilkan Gambar Baru yang akan diupload */}
          {pendingImages.map((img, index) => (
            <div
              key={`pending-${index}`}
              className="relative group rounded-xl overflow-hidden border border-emerald-500/30 aspect-square bg-white/[0.02]"
            >
              <Image
                src={img.preview}
                alt={`Preview ${index}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Baru
              </span>
              {img.is_primary && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2E9AB8] text-white shadow-md">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-[#0B0B12]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onSetPrimary("pending", index);
                    }}
                    className="px-3 py-1.5 bg-white/[0.1] border border-white/[0.2] text-white rounded-lg text-[11px] font-medium hover:bg-white/[0.2] transition-colors w-24"
                  >
                    Jadikan Cover
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove("pending", index);
                  }}
                  className="px-3 py-1.5 bg-red-500/80 border border-red-500 text-white rounded-lg text-[11px] font-medium hover:bg-red-500 transition-colors w-24"
                >
                  Batal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
