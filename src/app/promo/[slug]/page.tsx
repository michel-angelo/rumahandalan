import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Property } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyJsonLd from "@/components/PropertyJsonLd";
import PromoClient from "@/components/PromoClient";

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(1)} Miliar`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Juta`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default async function PromoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: property } = await supabase
    .from("properties")
    .select(
      "*, cluster:clusters(*), location:locations(*), images:property_images(*)",
    )
    .eq("slug", slug)
    .single();

  if (!property) notFound();

  const rawImages = property.images ?? [];
  const primaryImg = rawImages.find((img: any) => img.is_primary);
  const otherImgs = rawImages.filter((img: any) => !img.is_primary);
  const allImages = primaryImg ? [primaryImg, ...otherImgs] : otherImgs;

  const waMessage = encodeURIComponent(
    `Halo Rumah Andalan, saya dari Iklan dan tertarik dengan promo properti *${property.title}*.\n\nApakah saya bisa jadwalkan survei dan klaim promonya?`,
  );
  const waLink = `https://wa.me/${property.whatsapp_number || "6282116207400"}?text=${waMessage}`;

  const priceDisplay = property.price_label ?? formatPrice(property.price);

  return (
    <>
      {/* HEADER: MINIMAL, NO ESCAPE */}
      <header className="w-full bg-bg-page border-b border-text-primary/10 py-4 px-5 flex justify-center sticky top-0 z-40">
        <Image
          src="/logo-nav.png"
          alt="Rumah Andalan"
          width={140}
          height={32}
          className="object-contain"
        />
      </header>

      <main className="bg-bg-page min-h-screen pb-36">
        {/* 1. OPENING HOOK: LOSS FRAMING */}
        <div className="bg-text-primary text-bg-page py-3 px-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-light/80">
            Perhatian &mdash; Unit ini tidak akan menunggu Anda
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 flex flex-col gap-12">
          {/* 2. CLIENT COMPONENT: Scarcity counter + live viewer */}
          <PromoClient
            waLink={waLink}
            priceDisplay={priceDisplay}
            property={property}
          />

          {/* 3. TITLE */}
          <div className="flex flex-col items-center text-center">
            {property.is_promo && (
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-text-primary/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
                  Properti Kurasi Eksklusif
                </span>
                <div className="h-[1px] w-12 bg-text-primary/20" />
              </div>
            )}
            <h1 className="font-display text-text-primary text-4xl md:text-5xl leading-[1.1] mb-4">
              {property.title}
            </h1>
            <p className="text-text-secondary text-[14px] font-medium tracking-wide">
              {property.location?.district}, {property.location?.city}
            </p>
          </div>

          {/* 4. GALLERY */}
          <div className="w-full -mx-5 sm:mx-0 sm:w-auto">
            <PropertyGallery images={allImages} />
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.3em] mt-3 text-center">
              Dokumentasi Asli &mdash; Tidak Diedit
            </p>
          </div>

          {/* 5. SOCIAL PROOF STRIP: HYPERSPECIFIC */}
          <div className="border-y border-text-primary/10 py-6 grid grid-cols-3 divide-x divide-text-primary/10 text-center">
            <div className="px-4">
              <p className="font-display text-2xl text-accent mb-1">30+</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted leading-relaxed">
                Keluarga
                <br />
                Sudah Pindah
              </p>
            </div>
            <div className="px-4">
              <p className="font-display text-2xl text-accent mb-1">3</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted leading-relaxed">
                Orang Tanya
                <br />
                Minggu Ini
              </p>
            </div>
            <div className="px-4">
              <p className="font-display text-2xl text-accent mb-1">100%</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted leading-relaxed">
                Legalitas
                <br />
                Terverifikasi
              </p>
            </div>
          </div>

          {/* 6. HARGA + PROMO BOX + CURIOSITY GAP */}
          <div className="bg-bg-surface border border-text-primary/10 p-8 flex flex-col items-center text-center">
            <p className="text-[9px] text-text-muted uppercase tracking-[0.35em] font-bold mb-1">
              Nilai Investasi
            </p>

            <p className="font-display text-4xl lg:text-5xl text-accent mb-2">
              {priceDisplay}
            </p>

            {property.price_per_month && (
              <p className="text-text-secondary text-[14px] mb-6">
                Bisa dicicil mulai{" "}
                <span className="font-bold text-text-primary">
                  {formatPrice(property.price_per_month)}
                </span>{" "}
                / bulan
              </p>
            )}

            {property.is_promo &&
              property.promo_labels &&
              property.promo_labels.length > 0 && (
                <div className="w-full max-w-md border border-accent/30 p-5 mb-8 text-left bg-accent-tint">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-[0.25em] mb-4 border-b border-accent/20 pb-3">
                    Benefit Khusus Iklan Ini:
                  </p>
                  <ul className="flex flex-col gap-3">
                    {property.promo_labels
                      .slice(0, -1)
                      .map((promo: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-text-primary text-[13px] font-medium"
                        >
                          <span className="text-accent mt-0.5 flex-shrink-0">
                            ✓
                          </span>
                          {promo}
                        </li>
                      ))}
                    {property.promo_labels.length > 1 && (
                      <li className="flex items-start gap-3 text-[13px] font-medium">
                        <span className="text-accent mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="blur-[4px] select-none text-text-primary pointer-events-none">
                            {
                              property.promo_labels[
                                property.promo_labels.length - 1
                              ]
                            }
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/70 whitespace-nowrap">
                            — Tanya via WA
                          </span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-accent hover:bg-accent-dark text-bg-page text-[11px] font-bold uppercase tracking-[0.25em] transition-colors flex items-center justify-center gap-3"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.919.49 3.72 1.34 5.29L2 22l4.823-1.326A9.972 9.972 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" />
              </svg>
              Klaim Promo &amp; Tanya Benefit Tersembunyi
            </a>
            <p className="text-[10px] text-text-muted mt-4 font-body">
              *Survei &amp; konsultasi 100% gratis. Tanpa tekanan, tanpa biaya
              tersembunyi.
            </p>
          </div>

          {/* 7. SPEC GRID */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-text-muted mb-6 text-center">
              Spesifikasi Properti
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-text-primary/10">
              {[
                { val: property.bedrooms, label: "Kamar Tidur" },
                { val: `${property.building_area}m²`, label: "Luas Bangunan" },
                { val: `${property.land_area}m²`, label: "Luas Tanah" },
                {
                  val: property.certificate?.toUpperCase(),
                  label: "Legalitas",
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-bg-page py-7 px-4 text-center"
                >
                  <p className="font-display text-3xl text-text-primary mb-1">
                    {spec.val}
                  </p>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.25em]">
                    {spec.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. FASILITAS */}
          {property.facilities && property.facilities.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-text-muted mb-6 text-center">
                Fasilitas
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.facilities.map((fac: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 px-4 border border-text-primary/10 bg-bg-surface"
                  >
                    <span className="text-accent font-bold">—</span>
                    <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.1em]">
                      {fac}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. DESKRIPSI */}
          <div className="border-t border-text-primary/10 pt-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-text-muted mb-6">
              Tentang Properti Ini
            </p>
            <div className="font-body text-[15px] text-text-secondary leading-relaxed">
              <p className="whitespace-pre-line">{property.description}</p>
            </div>
          </div>

          {/* 10. WHY NOW: LOSS AVERSION */}
          <div className="bg-text-primary text-bg-page p-8 sm:p-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-accent-light/60 mb-6">
              Mengapa Keputusan Ini Tidak Bisa Ditunda
            </p>
            <div className="flex flex-col gap-5">
              {[
                {
                  num: "01",
                  title: "Harga properti Depok naik rata-rata 8–12% per tahun.",
                  body: "Setiap bulan Anda menunda, biaya beli naik. Cicilan yang sama hari ini tidak akan tersedia tahun depan.",
                },
                {
                  num: "02",
                  title: "Unit ini tidak akan diiklankan selamanya.",
                  body: "Begitu unit ini terjual, halaman ini hilang. Tidak ada waiting list, tidak ada pemberitahuan.",
                },
                {
                  num: "03",
                  title: "Promo benefit hanya berlaku dari iklan ini.",
                  body: "Jika Anda datang langsung ke marketing gallery tanpa kode iklan, benefit khusus ini tidak bisa diklaim.",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="flex gap-6 items-start border-b border-white/10 pb-5 last:border-0 last:pb-0"
                >
                  <span className="font-display text-3xl text-white/20 flex-shrink-0 leading-none">
                    {item.num}
                  </span>
                  <div>
                    <p className="font-body font-bold text-[13px] text-bg-page mb-1">
                      {item.title}
                    </p>
                    <p className="font-body text-[13px] text-white/50 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full flex items-center justify-center gap-3 py-5 bg-[#25D366] hover:bg-[#1DA851] text-white text-[11px] font-bold uppercase tracking-[0.25em] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.919.49 3.72 1.34 5.29L2 22l4.823-1.326A9.972 9.972 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" />
              </svg>
              Ya, Saya Ingin Klaim Sekarang
            </a>
          </div>

          {/* 11. TESTIMONIAL */}
          <div className="border-t border-text-primary/10 pt-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-text-muted mb-8 text-center">
              Mereka Pernah Ragu Juga
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  initials: "RW",
                  name: "Rizky W.",
                  context: "Pembeli di Beji, Depok",
                  quote:
                    "Awalnya saya mikir 'nanti dulu'. Tapi pas chat WA mereka, ternyata ada 1 unit lagi yang lebih cocok budget saya. Kalau nunggu seminggu lagi, mungkin sudah diambil orang.",
                },
                {
                  initials: "AS",
                  name: "Ayu S.",
                  context: "Pembeli di Sawangan, Depok",
                  quote:
                    "Yang bikin saya percaya adalah mereka tidak pernah push. Justru itu yang bikin saya yakin. Sekarang sudah 8 bulan tinggal di sini, tidak ada penyesalan.",
                },
              ].map((t) => (
                <div key={t.name} className="flex gap-5 items-start">
                  <div className="w-10 h-10 bg-accent-tint border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-accent text-sm">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-[14px] text-text-secondary leading-relaxed mb-3 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      {t.name} &mdash; {t.context}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12. FAQ: OBJECTION HANDLING */}
          <div className="border-t border-text-primary/10 pt-10 pb-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-text-muted mb-8 text-center">
              Pertanyaan yang Sering Ditanyakan
            </p>
            <div className="flex flex-col divide-y divide-text-primary/10">
              {[
                {
                  q: "Apakah ada biaya untuk konsultasi?",
                  a: "Tidak ada. Konsultasi, survei lokasi, dan pendampingan awal 100% gratis. Kami hanya dibayar jika transaksi berhasil.",
                },
                {
                  q: "Bagaimana jika saya belum siap beli sekarang?",
                  a: "Justru itu alasan terbaik untuk chat sekarang. Kami bantu Anda kalkulasi KPR, kebutuhan DP, dan timeline yang realistis — tanpa tekanan.",
                },
                {
                  q: "Apakah harga bisa nego?",
                  a: "Ada ruang negosiasi yang hanya bisa diakses lewat jalur iklan ini. Tanya langsung ke tim kami via WhatsApp.",
                },
              ].map((faq) => (
                <div key={faq.q} className="py-5">
                  <p className="font-body font-bold text-[13px] text-text-primary mb-2">
                    {faq.q}
                  </p>
                  <p className="font-body text-[13px] text-text-secondary leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-bg-page border-t border-text-primary/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em]">
            Harga Promo
          </p>
          <p className="font-display text-xl text-accent leading-none">
            {priceDisplay}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 flex-shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.919.49 3.72 1.34 5.29L2 22l4.823-1.326A9.972 9.972 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" />
          </svg>
          Hubungi Tim Kami Sekarang
        </a>
      </div>

      <PropertyJsonLd property={property} />
    </>
  );
}
