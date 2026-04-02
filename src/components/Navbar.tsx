"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#1E1E40] border-b border-[#343270] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Placeholder (Otomatis Menyesuaikan) */}
          <Link
            href="/"
            className="relative block h-8 sm:h-10 w-[160px] sm:w-[200px] flex-shrink-0"
          >
            <Image
              src="/logo-nav.png" // Taruh file logo-nav.png di folder /public
              alt="Logo Rumah Andalan"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Menu (Editorial Typography) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white text-[11px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/listings"
              className="text-white text-[11px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
            >
              Properti
            </Link>
            <Link
              href="/clusters"
              className="text-white text-[11px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
            >
              Cluster
            </Link>
            <Link
              href="/about"
              className="text-white text-[11px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
            >
              Tentang Kami
            </Link>

            {/* CTA Button Kaku */}
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#2E9AB8] text-white text-[11px] font-bold uppercase tracking-widest border border-transparent hover:border-white hover:shadow-[4px_4px_0px_white] hover:-translate-y-0.5 transition-all"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* Mobile Menu Button (Ikon Garis Tajam) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-[#2E9AB8] transition-colors"
          >
            {isOpen ? (
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#1E1E40] border-t border-[#343270]">
          <div className="px-5 pt-4 pb-6 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-white text-[12px] font-bold uppercase tracking-widest border-b border-[#343270] pb-3"
            >
              Beranda
            </Link>
            <Link
              href="/listings"
              onClick={() => setIsOpen(false)}
              className="text-white text-[12px] font-bold uppercase tracking-widest border-b border-[#343270] pb-3"
            >
              Properti
            </Link>
            <Link
              href="/clusters"
              onClick={() => setIsOpen(false)}
              className="text-white text-[12px] font-bold uppercase tracking-widest border-b border-[#343270] pb-3"
            >
              Cluster
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-white text-[12px] font-bold uppercase tracking-widest border-b border-[#343270] pb-3"
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-center px-6 py-3 bg-[#2E9AB8] text-white text-[12px] font-bold uppercase tracking-widest border border-transparent active:border-white active:shadow-[4px_4px_0px_white] transition-all"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
