import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-text-primary pt-24 pb-12 text-bg-page">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-white/10 pb-20">
          {/* Statement Utama & Logo */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="relative block h-12 sm:h-16 w-full max-w-[200px] mb-8"
            >
              {/* Placeholder Logo: Pastikan ada logo-footer.png di folder public */}
              <Image
                src="/logo-footer.png"
                alt="Logo Rumah Andalan"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-bg-surface/60 text-[15px] leading-relaxed max-w-sm">
              Mendefinisikan ulang standar agen properti di Depok. Melayani
              dengan integritas, mengkurasi dengan visi.
            </p>
          </div>

          {/* Navigasi Simpel tapi Elegan */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-light mb-6">
                Navigasi
              </h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/listings"
                    className="text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    Koleksi Properti
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clusters"
                    className="text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    Eksplorasi Cluster
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    Filosofi Kami
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-light mb-6">
                Hubungi
              </h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    WhatsApp Konsultasi
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:halo@rumahandalan.com"
                    className="text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    halo@rumahandalan.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-light mb-6">
                Kantor
              </h4>
              <p className="text-[13px] text-white/70 leading-relaxed">
                Kawasan Depok Utama,
                <br />
                Jawa Barat, Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
          <p className="text-white/40 text-[11px] uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} Rumah Andalan.
          </p>
          <div className="flex gap-6">
            {["Instagram", "LinkedIn"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-white/40 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
