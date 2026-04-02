import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E40] border-t-8 border-[#2E9AB8] pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-[#343270] pb-16">
          {/* Logo & About Section (Left Aligned Besar) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link
              href="/"
              className="relative block h-16 sm:h-24 w-full max-w-[280px] mb-8"
            >
              <Image
                src="/logo-footer.png" // Taruh file logo-footer.png di folder /public
                alt="Logo Footer Rumah Andalan"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-[#EEEDF8] text-[14px] leading-relaxed max-w-sm border-l-2 border-[#2E9AB8] pl-5">
              Agensi properti andalan Anda di Depok. Kami berdedikasi untuk
              memberikan layanan transparan, profesional, dan mengkurasi hunian
              dengan nilai investasi terbaik.
            </p>
          </div>

          {/* Links Section (Editorial Grid) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Kolom 1 */}
            <div>
              <h4 className="font-serif text-white text-[18px] font-black uppercase tracking-wide mb-6">
                Navigasi
              </h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/"
                    className="text-[#EEEDF8] text-[12px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/listings"
                    className="text-[#EEEDF8] text-[12px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
                  >
                    Properti
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clusters"
                    className="text-[#EEEDF8] text-[12px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
                  >
                    Cluster
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 2 */}
            <div>
              <h4 className="font-serif text-white text-[18px] font-black uppercase tracking-wide mb-6">
                Perusahaan
              </h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/about"
                    className="text-[#EEEDF8] text-[12px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[#EEEDF8] text-[12px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[#EEEDF8] text-[12px] font-bold uppercase tracking-widest hover:text-[#2E9AB8] transition-colors"
                  >
                    Karir
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3 */}
            <div>
              <h4 className="font-serif text-white text-[18px] font-black uppercase tracking-wide mb-6">
                Kontak
              </h4>
              <ul className="flex flex-col gap-4">
                <li className="text-[#EEEDF8] text-[12px] leading-relaxed border-b border-[#343270] pb-3">
                  <strong className="block text-white font-bold uppercase tracking-widest mb-1">
                    Telepon
                  </strong>
                  +62 812-3456-7890
                </li>
                <li className="text-[#EEEDF8] text-[12px] leading-relaxed border-b border-[#343270] pb-3">
                  <strong className="block text-white font-bold uppercase tracking-widest mb-1">
                    Email
                  </strong>
                  halo@rumahandalan.com
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Kaku & Bersih) */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-6">
          <p className="text-[#EEEDF8] text-[11px] font-bold uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} Rumah Andalan. Hak Cipta
            Dilindungi.
          </p>

          {/* Social Icons Kotak Tegas */}
          <div className="flex gap-4">
            {["FB", "IG", "YT", "WA"].map((social) => (
              <Link
                key={social}
                href="#"
                className="w-10 h-10 bg-[#343270] flex items-center justify-center text-white text-[11px] font-black uppercase border border-[#1E1E40] hover:bg-[#2E9AB8] hover:shadow-[4px_4px_0px_white] hover:-translate-y-1 transition-all"
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
