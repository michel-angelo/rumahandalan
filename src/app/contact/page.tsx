import Link from "next/link";

export const metadata = {
  title: "Kontak | Rumah Andalan",
  description: "Hubungi Rumah Andalan untuk konsultasi properti gratis.",
};

export default function ContactPage() {
  const waLink = `https://wa.me/6282116207400?text=${encodeURIComponent(
    "Halo, saya ingin konsultasi properti dengan Rumah Andalan.",
  )}`;

  return (
    <div className="bg-bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ── Heading Asimetris ── */}
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-6 border-l border-accent pl-4">
            Hubungi Kami
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-text-primary leading-[1.1] tracking-tight">
            Konsultasi Gratis, <br />
            <span className="italic font-light text-accent">
              Tanpa Komitmen.
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kiri - Info */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <p className="text-[15px] text-text-secondary leading-relaxed font-body max-w-xl">
              Ceritakan kebutuhan properti Anda kepada kami. Tim Rumah Andalan
              siap membantu menemukan hunian yang tepat sesuai budget dan lokasi
              yang Anda inginkan di kawasan Depok dan sekitarnya.
            </p>

            <div className="flex flex-col gap-6 border-t border-text-primary/20 pt-10">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-16">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2 block">
                    WhatsApp / Telepon
                  </p>
                  <p className="font-display text-2xl text-text-primary">
                    +62 821-1620-7400
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2 block">
                    Email
                  </p>
                  <p className="font-display text-2xl text-text-primary">
                    halo@rumahandalan.com
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2 block">
                  Operasional
                </p>
                <p className="font-display text-2xl text-text-primary">
                  Senin – Sabtu, 08.00 – 17.00
                </p>
              </div>
            </div>
          </div>

          {/* Kanan - Call To Action Box */}
          <div className="lg:col-span-5 bg-bg-surface border border-text-primary/10 p-10 flex flex-col items-center text-center">
            <h3 className="font-display text-3xl text-text-primary mb-4">
              Mulai Diskusi
            </h3>
            <p className="text-text-secondary text-[14px] leading-relaxed mb-8">
              Cara tercepat untuk konsultasi atau mengatur jadwal survei lokasi
              adalah melalui WhatsApp.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center bg-text-primary text-bg-page px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
