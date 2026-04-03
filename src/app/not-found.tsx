import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-bg-page min-h-screen flex items-center justify-center px-5 pt-20">
      <div className="text-center max-w-md">
        <p className="font-display text-[120px] font-light text-text-primary/10 leading-none mb-4">
          404
        </p>
        <h1 className="font-display text-text-primary text-3xl mb-4">
          Halaman <span className="italic text-accent">Tidak Ditemukan.</span>
        </h1>
        <p className="text-text-secondary text-[15px] leading-relaxed font-body mb-10">
          Koleksi yang Anda cari mungkin telah terjual atau halamannya sudah
          dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-text-primary text-bg-page text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/listings"
            className="px-8 py-4 border border-text-primary text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-white transition-colors"
          >
            Lihat Koleksi
          </Link>
        </div>
      </div>
    </div>
  );
}
