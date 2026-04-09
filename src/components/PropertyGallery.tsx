"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

type ImageType = {
  id: string;
  url: string;
};

export default function PropertyGallery({ images }: { images: ImageType[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // State untuk Lightbox
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setActiveIdx((idx + images.length) % images.length);
    },
    [images.length],
  );

  // --- Kunci Scroll Body saat Lightbox terbuka ---
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  // --- Navigasi Keyboard saat Lightbox terbuka (Esc, Kiri, Kanan) ---
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight") goTo(activeIdx + 1);
      if (e.key === "ArrowLeft") goTo(activeIdx - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, activeIdx, goTo]);

  // --- Touch Handlers (Swipe) ---
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
    <>
      <div className="flex flex-col gap-0 w-full">
        {/* ── MAIN FRAME WITH BLUR BACKDROP ── */}
        <div
          className="relative w-full aspect-[4/3] lg:aspect-[16/9] overflow-hidden bg-bg-surface group cursor-pointer"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setIsFullscreen(true)} // Buka Lightbox saat diklik
        >
          {/* Blur backdrop */}
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

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-10" />

          {/* Main image */}
          <div className="absolute inset-0 z-20">
            <Image
              key={activeUrl}
              src={activeUrl}
              alt="Visual Properti"
              fill
              priority
              className="object-contain animate-fade-in group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 66vw"
              quality={85}
            />
          </div>

          {/* Ikon Expand (Muncul saat di-hover) */}
          <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-bg-page/90 backdrop-blur-sm p-4 rounded-full text-text-primary shadow-xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </div>
          </div>

          {/* Arrow nav — desktop only */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIdx - 1);
                }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 bg-bg-page/80 hover:bg-bg-page items-center justify-center transition-colors"
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
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIdx + 1);
                }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 bg-bg-page/80 hover:bg-bg-page items-center justify-center transition-colors"
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
            <div className="absolute bottom-4 right-4 z-40 bg-bg-page/90 px-3 py-1.5 pointer-events-none">
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

      {/* ── LIGHTBOX OVERLAY (FULLSCREEN) ── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[999] bg-bg-page/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
          {/* Header Lightbox (Tombol Close & Counter) */}
          <div className="flex items-center justify-between p-5 md:p-8 z-50">
            <span className="text-[10px] font-bold tabular-nums text-text-primary uppercase tracking-[0.3em]">
              {activeIdx + 1} / {images.length}
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="text-text-primary hover:text-accent transition-colors flex items-center gap-2"
            >
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.2em]">
                Tutup
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Area Gambar Lightbox */}
          <div
            className="flex-1 relative w-full flex items-center justify-center px-4 md:px-20 pb-10"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative w-full h-full max-w-7xl mx-auto">
              <Image
                key={`lightbox-${activeUrl}`}
                src={activeUrl}
                alt="Visual Properti Fullscreen"
                fill
                className="object-contain"
                sizes="100vw"
                quality={100} // Resolusi maksimal
                priority
              />
            </div>

            {/* Tombol Kiri Kanan Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIdx - 1);
                  }}
                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-5 text-text-primary hover:text-accent transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-8 h-8 md:w-12 md:h-12"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      d="M15 18l-6-6 6-6"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIdx + 1);
                  }}
                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-5 text-text-primary hover:text-accent transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-8 h-8 md:w-12 md:h-12"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      d="M9 18l6-6-6-6"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
