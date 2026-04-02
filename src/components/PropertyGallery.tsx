"use client";

import { useState } from "react";
import Image from "next/image";

type ImageType = {
  id: string;
  url: string;
};

export default function PropertyGallery({ images }: { images: ImageType[] }) {
  // Set gambar pertama sebagai default gambar besar
  const [activeUrl, setActiveUrl] = useState(images[0]?.url || "");

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] border-2 border-[#1E1E40] shadow-[12px_12px_0px_#1E1E40] bg-[#1E1E40] flex items-center justify-center">
        <span className="text-[#2E9AB8] text-sm font-bold uppercase tracking-[0.3em]">
          No Image Available
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── GAMBAR SUPER (UTAMA) ── */}
      <div className="relative w-full aspect-[16/9] border-2 border-[#1E1E40] shadow-[12px_12px_0px_#1E1E40] bg-[#1E1E40] transition-opacity duration-300">
        <Image
          src={activeUrl}
          alt="Gambar Properti Utama"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {/* ── THUMBNAILS (BISA DIGESER HORIZONTAL) ── */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-4 pt-4 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((img) => {
            const isActive = activeUrl === img.url;
            return (
              <button
                key={img.id}
                onClick={() => setActiveUrl(img.url)}
                // Kotak thumbnail kaku ala majalah, bisa di-scroll ke samping
                className={`relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 border-2 snap-start transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? "border-[#2E9AB8] shadow-[4px_4px_0px_#2E9AB8] grayscale-0 -translate-y-1"
                    : "border-[#1E1E40] grayscale-[50%] hover:grayscale-0 hover:-translate-y-1 shadow-[4px_4px_0px_#1E1E40]"
                }`}
              >
                <Image
                  src={img.url}
                  alt="Thumbnail Properti"
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
