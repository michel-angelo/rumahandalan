import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Property, Location } from "@/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyJsonLd from "@/components/PropertyJsonLd";
import PromoClient from "@/components/PromoClient";

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(1)} Miliar`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Juta`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function buildWaLink(title: string, wa: string) {
  const msg = encodeURIComponent(
    `Halo Rumah Andalan, saya dari Iklan dan tertarik dengan promo properti *${title}*.\n\nApakah saya bisa jadwalkan survei dan klaim promonya?`,
  );
  return `https://wa.me/${wa || "6282116207400"}?text=${msg}`;
}

function normalizeLoc(raw: unknown): Location | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as Location) ?? null;
  return raw as Location;
}

// ─────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: p } = await supabase
    .from("properties")
    .select(
      "title, description, price, price_label, location:locations(*), images:property_images(*)",
    )
    .eq("slug", slug)
    .single();

  if (!p) return { title: "Properti Tidak Ditemukan | Rumah Andalan" };

  const loc = normalizeLoc(p.location);
  const priceDisplay = p.price_label ?? formatPrice(p.price);
  const locStr = `${loc?.district ?? ""}, ${loc?.city ?? ""}`;
  const title = `${p.title} — ${priceDisplay} | Rumah Andalan`;
  const description = `Properti eksklusif di ${locStr}. ${p.description?.slice(0, 120) ?? ""}… Klaim promo sekarang, survei & konsultasi gratis.`;
  const primaryImg = (p.images ?? []).find((img: any) => img.is_primary);
  const ogImage = primaryImg?.url ?? null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "id_ID",
      siteName: "Rumah Andalan",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: p.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: { index: true, follow: true },
  };
}

// ─────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────
function WaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.919.49 3.72 1.34 5.29L2 22l4.823-1.326A9.972 9.972 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
    >
      <path
        d="M2 8l4 4 8-8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="square"
      />
    </svg>
  );
}

// ─────────────────────────────────────────
// WA BUTTON
// ─────────────────────────────────────────
function WaButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1DA851] active:scale-[0.98] text-white font-bold uppercase tracking-[0.2em] transition-all ${className}`}
    >
      <WaIcon className="w-4 h-4 flex-shrink-0" />
      {children}
    </a>
  );
}

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────
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

  const loc = normalizeLoc(property.location);
  const locStr = `${loc?.district ?? ""}, ${loc?.city ?? ""}`;

  const rawImages = property.images ?? [];
  const primaryImg = rawImages.find((img: any) => img.is_primary);
  const otherImgs = rawImages.filter((img: any) => !img.is_primary);
  const allImages = primaryImg ? [primaryImg, ...otherImgs] : otherImgs;
  const heroUrl = primaryImg?.url ?? allImages[0]?.url ?? null;

  const priceDisplay = property.price_label ?? formatPrice(property.price);
  const waLink = buildWaLink(property.title, property.whatsapp_number);

  const specs = [
    { val: property.bedrooms, label: "KT" },
    { val: property.bathrooms, label: "KM" },
    { val: `${property.building_area}m²`, label: "LB" },
    { val: `${property.land_area}m²`, label: "LT" },
  ];

  return (
    <>
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-text-primary">
        <Image
          src="/logo-nav.png"
          alt="Rumah Andalan"
          width={110}
          height={26}
          className="object-contain"
        />
        <WaButton href={waLink} className="text-[9px] px-4 py-2.5">
          Chat Sekarang
        </WaButton>
      </header>

      <main className="bg-text-primary min-h-screen pt-[52px]">
        {/* ══════════════════════════════════════
            1. HERO — DARK + FULL BLEED
        ══════════════════════════════════════ */}
        <section className="relative w-full h-[85svh] min-h-[560px] max-h-[820px] overflow-hidden">
          {heroUrl && (
            <>
              {/* Blur backdrop */}
              <div className="absolute inset-0 scale-110">
                <Image
                  src={heroUrl}
                  alt=""
                  fill
                  className="object-cover blur-3xl opacity-30 saturate-0"
                  sizes="100vw"
                  quality={10}
                  aria-hidden
                />
              </div>
              {/* Main image */}
              <Image
                src={heroUrl}
                alt={property.title}
                fill
                priority
                className="object-contain"
                sizes="100vw"
                quality={85}
              />
            </>
          )}

          {/* Dark gradient — bottom heavy */}
          <div className="absolute inset-0 bg-gradient-to-t from-text-primary via-text-primary/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 sm:px-8 pb-10">
            {property.is_promo && (
              <p className="inline-block bg-accent text-bg-page text-[9px] font-bold uppercase tracking-[0.35em] px-3 py-1.5 mb-5">
                ✦ Promo Terbatas
              </p>
            )}

            {/* Big price — anchor attention immediately */}
            <p className="font-display text-accent text-4xl sm:text-5xl md:text-6xl leading-none mb-3">
              {priceDisplay}
            </p>

            <h1 className="font-display text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-2 max-w-2xl">
              {property.title}
            </h1>

            <p className="text-white/50 text-[12px] uppercase tracking-[0.2em] font-bold mb-8">
              {locStr}
            </p>

            {/* Specs inline */}
            <div className="flex flex-wrap gap-4 mb-8">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="font-display text-white text-xl">
                    {s.val}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    {s.label}
                  </span>
                </div>
              ))}
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-white text-xl">
                  {property.certificate?.toUpperCase()}
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  Sertifikat
                </span>
              </div>
            </div>

            <WaButton
              href={waLink}
              className="w-full sm:w-auto text-[11px] px-8 py-5"
            >
              Klaim Promo — Gratis Konsultasi
            </WaButton>
          </div>
        </section>

        {/* ══════════════════════════════════════
            2. TICKER URGENCY
        ══════════════════════════════════════ */}
        <div className="bg-accent overflow-hidden py-3">
          <p className="text-bg-page text-[10px] font-bold uppercase tracking-[0.4em] text-center animate-pulse">
            ⚡ Unit Terbatas &nbsp;·&nbsp; Promo Hanya Dari Iklan Ini
            &nbsp;·&nbsp; Survei 100% Gratis &nbsp;·&nbsp; Konsultasi Tanpa
            Tekanan
          </p>
        </div>

        {/* ══════════════════════════════════════
            3. SCARCITY (PromoClient)
        ══════════════════════════════════════ */}
        <div className="bg-text-primary px-5 sm:px-8 py-8 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <PromoClient
              waLink={waLink}
              priceDisplay={priceDisplay}
              property={property}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════
            4. GALLERY — light break
        ══════════════════════════════════════ */}
        <section className="bg-bg-page">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-text-muted mb-6">
              ── Dokumentasi Asli
            </p>
          </div>
          <PropertyGallery images={allImages} />
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-12 pt-4">
            <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.3em]">
              Foto tidak diedit. Yang Anda lihat adalah kondisi aktual.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5. NUMBERS — dark bg, big type
        ══════════════════════════════════════ */}
        <section className="bg-text-primary border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-3 gap-px">
            {[
              { val: "30+", label: "Keluarga\nSudah Pindah" },
              { val: "< 1 Jam", label: "Ke Pusat\nJakarta" },
              { val: "100%", label: "Legalitas\nBersih" },
            ].map((s) => (
              <div key={s.label} className="text-center px-2">
                <p className="font-display text-accent text-4xl sm:text-5xl mb-2">
                  {s.val}
                </p>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed whitespace-pre-line">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            6. PROMO BENEFIT BOX
        ══════════════════════════════════════ */}
        {property.is_promo && property.promo_labels?.length > 0 && (
          <section className="bg-accent">
            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
              <p className="text-bg-page/70 text-[9px] font-bold uppercase tracking-[0.4em] mb-2">
                Benefit Khusus Iklan Ini
              </p>
              <p className="font-display text-bg-page text-2xl sm:text-3xl mb-8">
                Yang tidak bisa Anda dapatkan kalau datang langsung.
              </p>
              <ul className="flex flex-col gap-4">
                {property.promo_labels
                  .slice(0, -1)
                  .map((promo: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-bg-page text-[14px] font-medium"
                    >
                      <CheckIcon />
                      {promo}
                    </li>
                  ))}
                {property.promo_labels.length > 1 && (
                  <li className="flex items-start gap-3 text-[14px] font-medium">
                    <CheckIcon />
                    <span className="flex items-center gap-3">
                      <span className="blur-[5px] select-none text-bg-page pointer-events-none">
                        {
                          property.promo_labels[
                            property.promo_labels.length - 1
                          ]
                        }
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-bg-page/60 whitespace-nowrap">
                        Tanya via WA →
                      </span>
                    </span>
                  </li>
                )}
              </ul>
              <div className="mt-10 pt-8 border-t border-bg-page/20">
                <WaButton
                  href={waLink}
                  className="w-full text-[11px] py-5 bg-text-primary hover:bg-accent-dark"
                >
                  Klaim Semua Benefit Sekarang
                </WaButton>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            7. HARGA + CICILAN
        ══════════════════════════════════════ */}
        <section className="bg-bg-page border-b border-text-primary/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 flex flex-col items-center text-center">
            <p className="text-[9px] text-text-muted uppercase tracking-[0.4em] font-bold mb-3">
              Nilai Investasi
            </p>
            <p className="font-display text-text-primary text-5xl sm:text-6xl md:text-7xl leading-none mb-4">
              {priceDisplay}
            </p>
            {property.price_per_month && (
              <p className="text-text-secondary text-[15px] mb-8">
                Cicilan mulai{" "}
                <span className="font-bold text-text-primary">
                  {formatPrice(property.price_per_month)}
                </span>{" "}
                /bulan
              </p>
            )}
            <WaButton
              href={waLink}
              className="w-full sm:w-auto text-[11px] px-10 py-5 bg-text-primary"
            >
              Hitung KPR & Klaim Promo
            </WaButton>
            <p className="text-[10px] text-text-muted mt-4">
              Konsultasi gratis. Tidak ada biaya tersembunyi.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            8. SPEC DETAIL
        ══════════════════════════════════════ */}
        <section className="bg-text-primary border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.4em] mb-8">
              ── Spesifikasi
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10">
              {[
                { val: property.bedrooms, label: "Kamar Tidur" },
                { val: `${property.building_area}m²`, label: "Luas Bangunan" },
                { val: `${property.land_area}m²`, label: "Luas Tanah" },
                {
                  val: property.certificate?.toUpperCase(),
                  label: "Sertifikat",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-text-primary py-8 px-4 text-center"
                >
                  <p className="font-display text-white text-3xl sm:text-4xl mb-2">
                    {s.val}
                  </p>
                  <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.25em]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            9. FASILITAS
        ══════════════════════════════════════ */}
        {property.facilities?.length > 0 && (
          <section className="bg-text-primary border-t border-white/10">
            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.4em] mb-8">
                ── Fasilitas
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.facilities.map((fac: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-4 px-5 border border-white/10"
                  >
                    <span className="text-accent font-bold text-lg leading-none">
                      —
                    </span>
                    <span className="text-white/70 text-[12px] font-medium uppercase tracking-[0.1em]">
                      {fac}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            10. DESKRIPSI
        ══════════════════════════════════════ */}
        <section className="bg-bg-page border-t border-text-primary/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-text-muted mb-6">
              ── Tentang Properti
            </p>
            <p className="font-body text-[16px] text-text-secondary leading-loose whitespace-pre-line max-w-2xl">
              {property.description}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            11. WHY NOW — aggressive
        ══════════════════════════════════════ */}
        <section className="bg-text-primary border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
            <p className="font-display text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-12 max-w-lg">
              Setiap hari yang Anda tunda adalah uang yang hilang.
            </p>
            <div className="flex flex-col gap-0 border border-white/10">
              {[
                {
                  num: "01",
                  title: "Harga properti Depok naik 8–12% per tahun.",
                  body: "Cicilan yang sama hari ini tidak akan tersedia tahun depan.",
                },
                {
                  num: "02",
                  title: "Halaman ini hilang begitu unit terjual.",
                  body: "Tidak ada waiting list. Tidak ada pemberitahuan. Hilang begitu saja.",
                },
                {
                  num: "03",
                  title: "Benefit ini eksklusif dari iklan ini saja.",
                  body: "Datang langsung ke marketing gallery? Benefit tidak bisa diklaim.",
                },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className={`flex gap-6 items-start p-6 sm:p-8 ${i < 2 ? "border-b border-white/10" : ""}`}
                >
                  <span className="font-display text-4xl text-white/10 flex-shrink-0 leading-none w-10">
                    {item.num}
                  </span>
                  <div>
                    <p className="font-body font-bold text-[14px] text-white mb-1.5">
                      {item.title}
                    </p>
                    <p className="font-body text-[13px] text-white/40 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <WaButton href={waLink} className="w-full text-[11px] py-6">
                Ya, Saya Tidak Mau Menyesal — Chat Sekarang
              </WaButton>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            12. TESTIMONIAL
        ══════════════════════════════════════ */}
        <section className="bg-bg-page border-t border-text-primary/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.4em] mb-10">
              ── Kata Mereka
            </p>
            <div className="flex flex-col gap-0 border border-white/10">
              {[
                {
                  initials: "RA",
                  name: "Pembeli Verified",
                  context: "Depok, 2024",
                  quote:
                    "Prosesnya lebih mudah dari yang saya bayangkan. Tim Rumah Andalan bantu dari awal sampai akad — tidak ada yang ditutup-tutupin.",
                },
                {
                  initials: "YP",
                  name: "Pembeli Verified",
                  context: "Depok, 2024",
                  quote:
                    "Saya tanya jam 9 malam, langsung direspons. Tidak ada tekanan sama sekali. Malah dibantu kalkulasi KPR dulu sebelum saya putuskan.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`p-6 sm:p-8 ${i < 1 ? "border-b border-text-primary/10" : ""}`}
                >
                  <p className="font-display text-text-primary text-[18px] sm:text-[20px] leading-snug mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-bg-page text-xs">
                        {t.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-text-primary uppercase tracking-[0.15em]">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-text-muted uppercase tracking-[0.1em]">
                        {t.context}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            13. FAQ
        ══════════════════════════════════════ */}
        <section className="bg-text-primary border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.4em] mb-10">
              ── FAQ
            </p>
            <div className="flex flex-col gap-0 border border-white/10">
              {[
                {
                  q: "Ada biaya untuk konsultasi?",
                  a: "Tidak ada. Konsultasi, survei, dan pendampingan 100% gratis. Kami hanya dibayar jika transaksi berhasil.",
                },
                {
                  q: "Belum siap beli sekarang?",
                  a: "Justru itu alasan terbaik untuk chat sekarang. Kami bantu kalkulasi KPR, DP, dan timeline — tanpa tekanan.",
                },
                {
                  q: "Harga bisa nego?",
                  a: "Kami akan pertemukan Anda langsung dengan developer untuk diskusi harga. Jalur ini hanya tersedia lewat iklan kami.",
                },
              ].map((faq, i) => (
                <div
                  key={faq.q}
                  className={`p-6 sm:p-8 ${i < 2 ? "border-b border-white/10" : ""}`}
                >
                  <p className="font-body font-bold text-[14px] text-white mb-2">
                    {faq.q}
                  </p>
                  <p className="font-body text-[13px] text-white/50 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <WaButton href={waLink} className="w-full text-[11px] py-6">
                Tanya Langsung via WhatsApp
              </WaButton>
            </div>
          </div>
        </section>
      </main>

      {/* ── STICKY BOTTOM CTA ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-text-primary border-t border-white/10 px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-8px_32px_rgba(0,0,0,0.3)]">
        <div className="min-w-0">
          <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] leading-none mb-1">
            Harga Promo
          </p>
          <p className="font-display text-accent text-lg sm:text-xl leading-none truncate">
            {priceDisplay}
          </p>
        </div>
        <WaButton href={waLink} className="flex-shrink-0 text-[10px] px-5 py-4">
          Hubungi Kami
        </WaButton>
      </div>

      <PropertyJsonLd property={property} />
    </>
  );
}
