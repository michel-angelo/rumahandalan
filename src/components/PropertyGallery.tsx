"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

type ImageType = {
  id: string;
  url: string;
};

export default function PropertyGallery({ images }: { images: ImageType[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setActiveIdx((idx + images.length) % images.length);
    },
    [images.length],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 40) goTo(activeIdx + (delta > 0 ? 1 : -1));
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] w-full bg-bg-surface flex items-center justify-center">
        <span className="text-text-muted text-[10px] font-bold uppercase tracking-[0.4em]">
          Belum Ada Visual
        </span>
      </div>
    );
  }

  const activeUrl = images[activeIdx]?.url;

  return (
    <div className="flex flex-col gap-0 w-full">
      {/* ── MAIN FRAME WITH BLUR BACKDROP ── */}
      <div
        className="relative w-full aspect-[4/3] lg:aspect-[16/9] overflow-hidden bg-bg-surface"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Blur backdrop (sama-blurred version untuk fill ruang kosong) */}
        <div className="absolute inset-0 scale-110">
          <Image
            src={activeUrl}
            alt=""
            fill
            className="object-cover blur-2xl opacity-60 saturate-50"
            sizes="100vw"
            quality={20}
            aria-hidden
          />
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-10" />

        {/* Main image — contain agar tidak crop */}
        <div className="absolute inset-0 z-20">
          <Image
            key={activeUrl}
            src={activeUrl}
            alt="Visual Properti"
            fill
            priority
            className="object-contain animate-fade-in"
            sizes="(max-width: 1024px) 100vw, 66vw"
            quality={85}
          />
        </div>

        {/* Arrow nav — desktop only */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIdx - 1)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-bg-page/80 hover:bg-bg-page items-center justify-center transition-colors"
              aria-label="Sebelumnya"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 text-text-primary"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </button>
            <button
              onClick={() => goTo(activeIdx + 1)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-bg-page/80 hover:bg-bg-page items-center justify-center transition-colors"
              aria-label="Berikutnya"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 text-text-primary"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </button>
          </>
        )}

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-30 bg-bg-page/80 px-3 py-1.5">
            <span className="text-[10px] font-bold tabular-nums text-text-primary uppercase tracking-[0.2em]">
              {activeIdx + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* ── DOT INDICATORS — mobile ── */}
      {images.length > 1 && (
        <div className="flex md:hidden justify-center gap-1.5 pt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-[3px] transition-all duration-300 ${
                i === activeIdx ? "w-6 bg-accent" : "w-3 bg-text-primary/20"
              }`}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── THUMBNAILS — desktop only ── */}
      {images.length > 1 && (
        <div className="hidden md:flex overflow-x-auto gap-3 pt-4 pb-1 scrollbar-hide">
          {images.map((img, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={img.id}
                onClick={() => goTo(i)}
                className={`relative flex-shrink-0 w-28 h-20 overflow-hidden transition-all duration-300 ${
                  isActive
                    ? "opacity-100 outline outline-2 outline-accent outline-offset-2"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="15vw"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
