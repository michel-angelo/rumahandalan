//src/components/PromoClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types";

interface PromoClientProps {
  waLink: string;
  priceDisplay: string;
  property: Property;
}

export default function PromoClient({ waLink, priceDisplay, property }: PromoClientProps) {
  const [viewers, setViewers] = useState(0);
  const [viewerDelta, setViewerDelta] = useState<"up" | "down" | null>(null);

  const unitsLeft = 2;

  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    const seed = property.slug
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const baseViewers = 8 + (seed % 7);
    setViewers(baseViewers);

    const viewerInterval = setInterval(() => {
      setViewers((prev) => {
        const rand = Math.random();
        if (rand < 0.3 && prev < 18) {
          setViewerDelta("up");
          setTimeout(() => setViewerDelta(null), 1200);
          return prev + 1;
        } else if (rand < 0.15 && prev > 6) {
          setViewerDelta("down");
          setTimeout(() => setViewerDelta(null), 1200);
          return prev - 1;
        }
        return prev;
      });
    }, 7000);

    const timerInterval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(timerInterval);
    };
  }, [property.slug]);

  const formatSession = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <>
      {/* ── SCARCITY + LIVE VIEWER BAR ── */}
      <div className="border border-text-primary/10 bg-bg-surface divide-y divide-text-primary/10">

        {/* Unit scarcity */}
        <div className="flex items-center justify-between px-5 py-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <p className="text-[11px] font-bold text-text-primary uppercase tracking-[0.15em]">
              Tersisa{" "}
              <span className="text-red-600">{unitsLeft} unit</span>{" "}
              di cluster ini
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-3 ${
                  i < unitsLeft
                    ? "bg-accent"
                    : "bg-text-primary/10"
                }`}
              />
            ))}
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest ml-2">
              dari 5
            </span>
          </div>
        </div>

        {/* Live viewer + session time */}
        <div className="flex items-center justify-between px-5 py-3 gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold tabular-nums transition-colors duration-500 ${
                viewerDelta === "up"
                  ? "text-red-500"
                  : viewerDelta === "down"
                  ? "text-text-muted"
                  : "text-text-primary"
              }`}
            >
              {viewers}
            </span>
            <span className="text-[11px] text-text-muted font-medium">
              orang sedang melihat halaman ini
            </span>
          </div>
          {sessionSeconds > 15 && (
            <p className="text-[10px] text-text-muted font-body hidden sm:block">
              Anda sudah di sini{" "}
              <span className="font-bold text-text-secondary tabular-nums">
                {formatSession(sessionSeconds)}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ── MICRO-COMMITMENT CTA ── */}
      {sessionSeconds >= 30 && (
        <div className="border border-accent/20 bg-accent-tint p-6 animate-fade-in-up">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent mb-3">
            Anda sudah membaca cukup lama.
          </p>
          <p className="font-body text-[14px] text-text-secondary mb-5 leading-relaxed">
            Biasanya, orang yang sampai sejauh ini serius mencari rumah. Satu langkah kecil — chat tim kami — cukup untuk tahu apakah properti ini cocok untuk Anda.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-dark text-bg-page text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.919.49 3.72 1.34 5.29L2 22l4.823-1.326A9.972 9.972 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z"/>
            </svg>
            Tanya Dulu, Tanpa Komitmen
          </a>
        </div>
      )}
    </>
  );
}