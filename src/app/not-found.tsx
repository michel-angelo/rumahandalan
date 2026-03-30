import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-[#F7F7FB] min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="font-serif text-[120px] font-bold text-[#E4E4F0] leading-none">404</p>
        <h1 className="font-serif text-[#141422] text-2xl font-bold mb-3 -mt-4">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#5A5A78] text-[15px] leading-relaxed mb-8">
          Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#343270] text-white rounded-xl font-semibold text-[14px] hover:bg-[#2E9AB8] transition-colors"
          >
            Kembali ke Home
          </Link>
          <Link
            href="/listings"
            className="px-6 py-3 border border-[#E4E4F0] text-[#343270] rounded-xl font-semibold text-[14px] hover:border-[#343270] transition-colors"
          >
            Lihat Properti
          </Link>
        </div>
      </div>
    </div>
  )
}