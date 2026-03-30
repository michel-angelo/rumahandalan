import Link from 'next/link'

export const metadata = {
  title: 'Kontak | Rumah Andalan',
  description: 'Hubungi Rumah Andalan untuk konsultasi properti gratis.',
}

export default function ContactPage() {
  const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent('Halo, saya ingin konsultasi properti dengan Rumah Andalan.')}`

  return (
    <div className="bg-[#F7F7FB] min-h-screen">
      {/* Header */}
      <div className="bg-[#1E1E40] py-14 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">
            Kontak
          </p>
          <h1 className="font-serif text-white text-3xl md:text-4xl font-bold">
            Hubungi Kami
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-3">Kami Siap Membantu</p>
            <h2 className="font-serif text-[#141422] text-2xl font-bold mb-3">
              Konsultasi Gratis, Tanpa Komitmen
            </h2>
            <p className="text-[#5A5A78] text-[15px] leading-relaxed">
              Ceritakan kebutuhan properti Anda kepada kami. Tim Rumah Andalan siap membantu menemukan hunian yang tepat sesuai budget dan lokasi yang Anda inginkan.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="flex flex-col gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white border border-[#E4E4F0] hover:border-emerald-300 rounded-2xl p-4 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.51 5.832L.057 23.37a.75.75 0 00.926.926l5.538-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.95-1.354l-.355-.21-3.685.967.983-3.591-.231-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] text-[#8E8EA8] font-medium">WhatsApp</p>
                <p className="text-[15px] font-semibold text-[#141422]">+62 812-3456-7890</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-white border border-[#E4E4F0] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-xl bg-[#EEEDF8] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#343270]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] text-[#8E8EA8] font-medium">Lokasi</p>
                <p className="text-[15px] font-semibold text-[#141422]">Depok, Jawa Barat</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-[#E4E4F0] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-xl bg-[#EEEDF8] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#343270]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] text-[#8E8EA8] font-medium">Jam Operasional</p>
                <p className="text-[15px] font-semibold text-[#141422]">Senin – Sabtu, 08.00 – 17.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - CTA */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-[#343270] to-[#285090] rounded-3xl p-8 text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.51 5.832L.057 23.37a.75.75 0 00.926.926l5.538-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.95-1.354l-.355-.21-3.685.967.983-3.591-.231-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-white text-2xl font-bold mb-2">Chat via WhatsApp</h3>
              <p className="text-white/70 text-[14px] leading-relaxed">
                Cara tercepat untuk konsultasi. Tim kami siap menjawab pertanyaan Anda seputar properti di Depok.
              </p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-white text-[#343270] font-bold text-[14px] text-center hover:bg-[#EEEDF8] transition-colors"
            >
              Mulai Chat Sekarang
            </a>
          </div>

          <div className="bg-white border border-[#E4E4F0] rounded-2xl p-5 text-center">
            <p className="text-[#5A5A78] text-[14px] leading-relaxed">
              Ingin melihat langsung propertinya? Kami siap atur jadwal survey sesuai waktu Anda.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-[#343270] font-semibold text-[14px] hover:text-[#2E9AB8] transition-colors"
            >
              Jadwalkan Survey →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}