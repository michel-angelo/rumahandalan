"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent("Halo, saya ingin konsultasi properti dengan Rumah Andalan.")}`;
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#1E1E40] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="font-serif text-xl font-bold">
            Rumah <span className="text-[#2E9AB8]">Andalan</span>
          </Link>
          <p className="text-white/60 text-[14px] leading-relaxed mt-3 max-w-sm">
            Agen properti terpercaya di Depok. Kami membantu Anda menemukan
            hunian impian dengan proses yang transparan dan profesional.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[14px] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.51 5.832L.057 23.37a.75.75 0 00.926.926l5.538-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.95-1.354l-.355-.21-3.685.967.983-3.591-.231-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>

        {/* Links */}
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#2E9AB8] mb-4">
            Navigasi
          </p>
          <ul className="flex flex-col gap-2.5">
            {[
              { label: "Home", href: "/" },
              { label: "Properti", href: "/listings" },
              { label: "Tentang Kami", href: "/about" },
              { label: "Kontak", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/60 hover:text-white text-[14px] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#2E9AB8] mb-4">
            Kontak
          </p>
          <ul className="flex flex-col gap-3">
            <li className="text-white/60 text-[14px]">📍 Depok, Jawa Barat</li>
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-[14px] transition-colors"
              >
                📱 +62 812-3456-7890
              </a>
            </li>
            <li className="text-white/60 text-[14px]">
              🕐 Senin – Sabtu, 08.00 – 17.00
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-white/40">
          <p>
            © {new Date().getFullYear()} Rumah Andalan. All rights reserved.
          </p>
          <p>Depok, Jawa Barat</p>
        </div>
      </div>
    </footer>
  );
}
