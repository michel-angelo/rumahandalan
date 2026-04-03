"use client";

import { useState } from "react";
import Image from "next/image";

type ImageType = {
  id: string;
  url: string;
};

export default function PropertyGallery({ images }: { images: ImageType[] }) {
  const [activeUrl, setActiveUrl] = useState(images[0]?.url || "");

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] lg:aspect-[16/9] w-full bg-bg-surface flex items-center justify-center">
        <span className="text-text-muted text-[10px] font-bold uppercase tracking-[0.4em]">
          Belum Ada Visual
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── GAMBAR SUPER (UTAMA) ── */}
      <div className="relative w-full aspect-[4/3] lg:aspect-[16/9] bg-bg-surface overflow-hidden transition-all duration-700">
        <Image
          key={activeUrl} // Memaksa re-render untuk mentrigger animasi CSS
          src={activeUrl}
          alt="Kurasi Visual Properti"
          fill
          priority
          className="object-cover animate-fade-in"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* ── THUMBNAILS (GAYA EDITORIAL) ── */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {images.map((img) => {
            const isActive = activeUrl === img.url;
            return (
              <button
                key={img.id}
                onClick={() => setActiveUrl(img.url)}
                className={`relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 transition-all duration-500 overflow-hidden ${
                  isActive
                    ? "border-b-2 border-text-primary grayscale-0 scale-100"
                    : "grayscale opacity-60 hover:opacity-100 hover:grayscale-0 scale-95"
                }`}
              >
                <Image
                  src={img.url}
                  alt="Thumbnail Kurasi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 15vw"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
