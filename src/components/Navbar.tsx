"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (pathname.startsWith("/promo") || pathname.startsWith("/admin")) {
    return null;
  }

  const navLinkClass =
    "text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-accent hover:after:w-full after:transition-all after:duration-300";

  return (
    <nav className="fixed w-full z-50 bg-bg-page/80 backdrop-blur-md border-b border-text-primary/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Placeholder */}
          {/* Logo */}
          <Link
            href="/"
            className="relative block w-[140px] md:w-[180px] flex-shrink-0"
          >
            <Image
              src="/logo-black.png"
              alt="Rumah Andalan"
              width={500} // Pakai resolusi asli hasil crop
              height={60} // Pakai resolusi asli hasil crop
              className="w-full h-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className={navLinkClass}>
              Beranda
            </Link>
            <Link href="/listings" className={navLinkClass}>
              Koleksi Properti
            </Link>
            <Link href="/clusters" className={navLinkClass}>
              Eksplorasi Cluster
            </Link>
            <Link href="/about" className={navLinkClass}>
              Filosofi Kami
            </Link>

            {/* CTA Button Editorial (Tajam, tanpa border radius) */}
            <Link
              href="/contact"
              className="ml-4 px-8 py-3.5 bg-text-primary text-bg-page text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent transition-colors"
            >
              Konsultasi Gratis
            </Link>
          </div>

          {/* Mobile Menu Button (Minimalist Icon) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-text-primary focus:outline-none"
            aria-label="Toggle Menu"
          >
            <div className="flex flex-col gap-1.5 w-7 items-end">
              <span
                className={`block h-[1px] bg-text-primary transition-all duration-300 ${isOpen ? "w-7 rotate-45 translate-y-[7px]" : "w-7"}`}
              ></span>
              <span
                className={`block h-[1px] bg-text-primary transition-all duration-300 ${isOpen ? "opacity-0" : "w-5"}`}
              ></span>
              <span
                className={`block h-[1px] bg-text-primary transition-all duration-300 ${isOpen ? "w-7 -rotate-45 -translate-y-[7px]" : "w-7"}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <div
        className={`md:hidden fixed top-24 left-0 w-full h-[calc(100vh-6rem)] bg-bg-page border-t border-text-primary/10 transition-all duration-500 overflow-y-auto ${isOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"}`}
      >
        <div className="px-5 py-8 flex flex-col gap-6">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="font-display text-2xl text-text-primary hover:text-accent"
          >
            Beranda
          </Link>
          <Link
            href="/listings"
            onClick={() => setIsOpen(false)}
            className="font-display text-2xl text-text-primary hover:text-accent"
          >
            Koleksi Properti
          </Link>
          <Link
            href="/clusters"
            onClick={() => setIsOpen(false)}
            className="font-display text-2xl text-text-primary hover:text-accent"
          >
            Eksplorasi Cluster
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="font-display text-2xl text-text-primary hover:text-accent"
          >
            Filosofi Kami
          </Link>

          <div className="mt-8 pt-8 border-t border-text-primary/10">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-4 bg-text-primary text-bg-page text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-accent transition-colors"
            >
              Konsultasi Gratis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
