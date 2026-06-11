"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        {/* Error Code / Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-red-500/10 flex items-center justify-center rounded-full border border-red-500/20">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <p className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
          Terjadi Kesalahan
        </p>

        <h1 className="font-display text-text-primary text-3xl sm:text-4xl mb-6">
          Sesuatu tidak berjalan semestinya.
        </h1>

        <p className="text-text-secondary text-[14px] leading-relaxed mb-10">
          Mohon maaf atas ketidaknyamanannya. Tim kami telah menerima laporan
          error ini dan akan segera memperbaikinya.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-text-primary text-bg-page text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-text-primary text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {/* Technical Detail (Optional, subtle) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-12 p-4 bg-red-500/5 border border-red-500/10 rounded-lg text-left">
            <p className="text-[10px] font-mono text-red-400 break-all">
              Debug: {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
