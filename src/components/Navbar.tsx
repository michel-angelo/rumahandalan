"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/listings", label: "Properti" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)] py-3"
              : "bg-transparent py-5"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 select-none"
            onClick={() => setIsOpen(false)}
          >
            {/* Icon mark */}
            <span
              className="
              flex items-center justify-center w-8 h-8 rounded-lg
              bg-[#285090] text-white text-sm font-bold
              transition-transform duration-300 group-hover:scale-110
            "
            >
              R
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-gray-900">
              Rumah<span className="text-[#2E9AB8] ml-1">Andalan</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="
                  relative px-4 py-2 text-[13.5px] font-medium text-gray-500
                  hover:text-[#343270] rounded-lg hover:bg-gray-50
                  transition-all duration-200
                  after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[1.5px]
                  after:bg-[#2E9AB8] after:scale-x-0 after:transition-transform after:duration-200
                  hover:after:scale-x-100 after:origin-left
                "
              >
                {label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="
                ml-3 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold
                bg-[#343270] text-white
                hover:bg-[#2E9AB8]
                active:scale-[0.97]
                transition-all duration-200
              "
            >
              Hubungi Kami
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="
              md:hidden flex flex-col justify-center items-center
              w-10 h-10 rounded-xl
              hover:bg-gray-100 active:scale-95
              transition-all duration-200
              gap-[5px]
            "
          >
            <span
              className={`
              block h-[1.5px] bg-gray-700 transition-all duration-300 origin-center
              ${isOpen ? "w-5 translate-y-[6.5px] rotate-45" : "w-5"}
            `}
            />
            <span
              className={`
              block h-[1.5px] bg-gray-700 transition-all duration-300
              ${isOpen ? "w-0 opacity-0" : "w-4"}
            `}
            />
            <span
              className={`
              block h-[1.5px] bg-gray-700 transition-all duration-300 origin-center
              ${isOpen ? "w-5 -translate-y-[6.5px] -rotate-45" : "w-5"}
            `}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 md:hidden
          w-72 bg-white
          flex flex-col
          shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#285090] text-white text-sm font-bold">
              R
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-gray-900">
              Rumah<span className="text-[#2E9AB8] ml-1">Andalan</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2L14 14M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col p-4 gap-1 flex-1">
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: isOpen ? `${i * 50 + 80}ms` : "0ms" }}
              className={`
                flex items-center justify-between px-4 py-3.5 rounded-xl
                text-[15px] font-medium text-gray-700
                hover:text-[#343270] hover:bg-gray-50
                transition-all duration-300
                ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
              `}
            >
              {label}
              <svg
                className="text-gray-300"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div className="p-6 border-t border-gray-100">
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="
              flex items-center justify-center w-full
              px-5 py-3.5 rounded-xl
              bg-[#343270] text-white
              text-[14px] font-semibold
              hover:bg-[#2E9AB8]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            Hubungi Kami
          </Link>
          <p className="text-center text-xs text-gray-400 mt-3">
            Kami siap membantu Anda menemukan rumah impian
          </p>
        </div>
      </div>
    </>
  );
}
