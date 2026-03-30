import Link from 'next/link'

export const metadata = {
  title: 'Tentang Kami | Rumah Andalan',
  description: 'Kenali lebih dekat Rumah Andalan, agen properti terpercaya di Depok.',
}

export default function AboutPage() {
  return (
    <div className="bg-[#F7F7FB] min-h-screen">
      {/* Header */}
      <div className="bg-[#1E1E40] py-14 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">
            Tentang Kami
          </p>
          <h1 className="font-serif text-white text-3xl md:text-4xl font-bold">
            Rumah Andalan
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-16">
        {/* Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-3">Cerita Kami</p>
            <h2 className="font-serif text-[#141422] text-3xl font-bold mb-4">
              Hadir untuk Membantu Anda Menemukan Rumah Impian
            </h2>
            <p className="text-[#3E3E58] text-[15px] leading-relaxed mb-4">
              Rumah Andalan adalah agen properti yang berfokus di kawasan Depok dan sekitarnya. Kami hadir dengan misi sederhana: membantu setiap keluarga menemukan hunian yang tepat, dengan proses yang transparan dan profesional.
            </p>
            <p className="text-[#3E3E58] text-[15px] leading-relaxed">
              Dengan jaringan cluster dan developer terpercaya di Depok, kami siap mendampingi Anda dari pencarian hingga serah terima kunci.
            </p>
          </div>
          <div className="bg-[#1E1E40] rounded-3xl aspect-square flex items-center justify-center">
            <svg className="w-24 h-24 text-[#2E9AB8] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            </svg>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-10">
            <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">Nilai Kami</p>
            <h2 className="font-serif text-[#141422] text-3xl font-bold">Yang Kami Pegang Teguh</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Terpercaya',
                desc: 'Kami membangun kepercayaan lewat rekam jejak yang konsisten dan hubungan jangka panjang dengan klien.',
              },
              {
                title: 'Transparan',
                desc: 'Setiap informasi properti kami sajikan lengkap dan jujur — tidak ada yang disembunyikan.',
              },
              {
                title: 'Profesional',
                desc: 'Tim kami terlatih untuk memberikan layanan terbaik di setiap tahap proses pembelian.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white border border-[#E4E4F0] rounded-2xl p-6">
                <h3 className="font-serif text-[#141422] text-[18px] font-bold mb-2">{title}</h3>
                <p className="text-[#5A5A78] text-[14px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#343270] to-[#285090] rounded-3xl p-10 text-center">
          <h2 className="font-serif text-white text-3xl font-bold mb-3">Siap Bekerja Sama?</h2>
          <p className="text-white/70 text-[15px] mb-6">Hubungi kami sekarang dan temukan properti impian Anda.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#343270] font-bold text-[14px] hover:bg-[#EEEDF8] transition-colors"
          >
            Hubungi Kami
          </Link>
        </section>
      </div>
    </div>
  )
}