import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Property } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyJsonLd from "@/components/PropertyJsonLd";

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

  // 1. Inisialisasi Supabase Server Client di sini
  const supabase = await createSupabaseServerClient();

  // 2. Baru jalankan query-nya
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

  return (
    <>
      {/* MINIMALIST HEADER UNTUK ADS (Tanpa Navigasi, Mencegah Leak) */}
      <header className="w-full bg-bg-page border-b border-text-primary/10 py-4 px-5 flex justify-center sticky top-0 z-40">
        <Image
          src="/logo-nav.png"
          alt="Rumah Andalan"
          width={140}
          height={32}
          className="object-contain"
        />
      </header>

      <main className="bg-bg-page min-h-screen pb-32">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 flex flex-col gap-10">
          {/* HEADER: URGENCY & FOMO */}
          <div className="text-center flex flex-col items-center">
            {property.is_promo && (
              <span className="inline-block bg-red-500 text-white text-[11px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] animate-pulse mb-6">
                🔥 Promo Terbatas
              </span>
            )}
            <h1 className="font-display text-text-primary text-4xl md:text-5xl leading-[1.1] mb-4">
              {property.title}
            </h1>
            <p className="text-text-secondary text-[15px] font-medium tracking-wide">
              {property.location?.district}, {property.location?.city}
            </p>
          </div>

          {/* GALLERY */}
          <div className="w-full -mx-5 sm:mx-0 sm:w-auto">
            <PropertyGallery images={allImages} />
          </div>

          {/* THE HOOK: HARGA & PROMO BADGES (Munculkan data dari Admin!) */}
          <div className="bg-bg-surface border border-text-primary/10 p-8 flex flex-col items-center text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold mb-2">
              Nilai Investasi
            </p>
            <p className="font-display text-4xl lg:text-5xl text-text-primary mb-2 text-accent">
              {property.price_label ?? formatPrice(property.price)}
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
                <div className="w-full max-w-md bg-white border border-red-500/30 p-5 mb-8 text-left shadow-lg">
                  <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-3 border-b border-red-100 pb-2">
                    Benefit Khusus Iklan Ini:
                  </p>
                  <ul className="flex flex-col gap-2">
                    {property.promo_labels.map((promo: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-text-primary text-[14px] font-medium"
                      >
                        <span className="text-green-500">✔️</span> {promo}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-[#25D366] hover:bg-[#1DA851] text-white text-[13px] font-bold uppercase tracking-[0.2em] transition-colors shadow-xl flex items-center justify-center gap-3"
            >
              Klaim Promo via WhatsApp
            </a>
            <p className="text-[10px] text-text-muted mt-4">
              *Konsultasi & Survei 100% Gratis
            </p>
          </div>

          {/* SPECS & NARRATIVE (Dipadatkan) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-text-primary/10">
            <div className="text-center">
              <p className="font-display text-2xl text-text-primary">
                {property.bedrooms}
              </p>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Kamar Tidur
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-text-primary">
                {property.building_area}m²
              </p>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Luas Bangunan
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-text-primary">
                {property.land_area}m²
              </p>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Luas Tanah
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-text-primary">
                {property.certificate?.toUpperCase()}
              </p>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Legalitas
              </p>
            </div>
          </div>

          <div className="prose prose-p:text-text-secondary prose-p:leading-relaxed max-w-none font-body text-[15px]">
            <p className="whitespace-pre-line">{property.description}</p>
          </div>
        </div>
      </main>

      {/* STICKY CTA BOTTOM - SUPER AGGRESSIVE FOR MOBILE ADS */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-text-primary/10 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
            Promo Terbatas
          </p>
          <p className="font-display text-xl text-accent leading-none font-bold">
            {property.price_label ?? formatPrice(property.price)}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-4 bg-[#25D366] text-white text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-center rounded-sm"
        >
          Hubungi Tim Kami
        </a>
      </div>

      <PropertyJsonLd property={property} />
    </>
  );
}
