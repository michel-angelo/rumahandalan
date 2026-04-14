import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | Konsultasi & Jadwal Survei Rumah",
  description:
    "Punya pertanyaan seputar properti atau ingin menjadwalkan kunjungan lapangan? Tim kami siap membantu Anda kapan saja.",
  openGraph: {
    title: "Konsultasi Properti Gratis dengan Rumah Andalan",
    description:
      "Chat via WhatsApp atau buat janji temu untuk survei lokasi rumah impian Anda di Depok.",
    url: "https://rumahandalan.com/contact",
    images: [{ url: "/og-contact.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function ContactPage() {
  const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Halo Tim Rumah Andalan, saya ingin menjadwalkan sesi konsultasi gratis terkait pencarian properti.",
  )}`;

  return (
    <div className="bg-bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ── HEADING ASIMETRIS ── */}
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-6 border-l border-accent pl-4 animate-fade-in">
            Layanan Prioritas
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-text-primary leading-[1.1] tracking-tight animate-fade-up">
            Konsultasi Gratis, <br />
            <span className="italic font-light text-accent">
              Tanpa Komitmen.
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* ── KIRI: INFORMASI & PROSES ── */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <p className="text-[16px] text-text-secondary leading-relaxed font-body max-w-xl">
              Mencari hunian tidak seharusnya menjadi proses yang memusingkan.
              Beritahu kami kriteria, lokasi, dan anggaran Anda. Tim kurator
              kami akan menyaringkan properti terbaik di kawasan Depok dan
              sekitarnya khusus untuk Anda.
            </p>

            {/* Proses 3 Langkah (Expectation Setting) */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-6 block">
                Apa yang Akan Terjadi Selanjutnya?
              </p>
              <div className="flex flex-col gap-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-text-primary/10">
                {[
                  {
                    title: "Diskusi Ringan",
                    desc: "Kami akan mendengarkan kebutuhan Anda via WA atau Telepon.",
                  },
                  {
                    title: "Kurasi Personal",
                    desc: "Kami kirimkan 3-5 opsi properti yang paling sesuai dengan kriteria Anda.",
                  },
                  {
                    title: "Survei Bersama",
                    desc: "Kami temani Anda melihat lokasi secara langsung, tanpa paksaan membeli.",
                  },
                ].map((step, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-bg-surface border border-text-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-text-primary">
                        {i + 1}
                      </span>
                    </div>
                    <p className="font-display text-xl text-text-primary mb-1">
                      {step.title}
                    </p>
                    <p className="text-[14px] text-text-secondary">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kontak Langsung (Clickable Links) */}
            <div className="flex flex-col gap-8 border-t border-text-primary/20 pt-10">
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2 block">
                    Direct Line
                  </p>
                  <a
                    href="tel:+6282116207400"
                    className="font-display text-2xl text-text-primary hover:text-accent transition-colors block"
                  >
                    +62 821-1620-7400
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2 block">
                    Email Inquiries
                  </p>
                  <a
                    href="mailto:halo@rumahandalan.com"
                    className="font-display text-2xl text-text-primary hover:text-accent transition-colors block"
                  >
                    halo@rumahandalan.com
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-2 block">
                  Jam Operasional Tim
                </p>
                <p className="font-display text-2xl text-text-primary">
                  Senin – Sabtu, 08.00 – 17.00
                </p>
              </div>
            </div>
          </div>

          {/* ── KANAN: VIP CALL TO ACTION ── */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-text-primary p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              {/* Ornamen Elegan */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

              <h3 className="font-display text-3xl text-bg-page mb-4 relative z-10">
                Terhubung Sekarang
              </h3>
              <p className="text-bg-page/70 text-[14px] leading-relaxed mb-8 relative z-10">
                Respon rata-rata di bawah 15 menit pada jam kerja operasional
                kami.
              </p>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all transform active:scale-95 relative z-10"
              >
                {/* Icon WA Kecil */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.919.49 3.72 1.34 5.29L2 22l4.823-1.326A9.972 9.972 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" />
                </svg>
                Mulai Chat WhatsApp
              </a>

              <div className="mt-6 flex items-center justify-center gap-2 relative z-10">
                <svg
                  className="w-3.5 h-3.5 text-bg-page/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-[10px] text-bg-page/50 uppercase tracking-[0.2em] font-bold">
                  Data 100% Aman & Rahasia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
