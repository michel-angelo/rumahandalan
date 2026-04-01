import { supabase } from "@/lib/supabase";
import { Property, Cluster } from "@/types";
import Link from "next/link";
import Image from "next/image";
import HeroSearch from "@/components/HeroSearch";

// ─── Data Fetchers ────────────────────────────────────────────────────────────

async function getFeaturedProperties() {
  const { data } = await supabase
    .from("properties")
    .select(
      "*, cluster:clusters(*), location:locations(*), images:property_images(*)",
    )
    .eq("is_featured", true)
    .eq("status", "tersedia")
    .limit(6);
  return (data ?? []) as Property[];
}

async function getPromoClusters() {
  const { data } = await supabase
    .from("clusters")
    .select("*, images:cluster_images(*)")
    .eq("is_promo", true)
    .limit(4);
  return (data ?? []) as Cluster[];
}

async function getHeroImage() {
  const { data } = await supabase
    .from("property_images")
    .select("url")
    .eq("is_primary", true)
    .limit(1)
    .single();
  return data?.url ?? null;
}

async function getTestimonials() {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .limit(3);
  return data ?? [];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} M`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  tersedia: {
    label: "Tersedia",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  inden: {
    label: "Inden",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  terjual: {
    label: "Terjual",
    className: "bg-red-50 text-red-600 border border-red-200",
  },
  booked: {
    label: "Booked",
    className: "bg-orange-50 text-orange-600 border border-orange-200",
  },
};

const paymentBadgeClass = "bg-[#EEEDF8] text-[#343270] border border-[#C8C7E8]";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const primaryImage =
    property.images?.find((img) => img.is_primary) ?? property.images?.[0];
  const status = statusConfig[property.status] ?? statusConfig["tersedia"];
  const isSold = property.status === "terjual" || property.status === "booked";

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E4E4F0] hover:border-[#9D9BCF] hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#F7F7FB] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? "opacity-60" : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#C8C8DC]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
              />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>

        {/* Featured badge */}
        {property.is_featured && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#343270] text-white">
            Unggulan
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Payment badges */}
        {(property.is_kpr || property.is_cash_keras || property.is_subsidi) && (
          <div className="flex flex-wrap gap-1.5">
            {property.is_kpr && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${paymentBadgeClass}`}
              >
                KPR
              </span>
            )}
            {property.is_cash_keras && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${paymentBadgeClass}`}
              >
                Cash Keras
              </span>
            )}
            {property.is_subsidi && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Subsidi
              </span>
            )}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-[#141422] text-[15px] leading-snug line-clamp-2 group-hover:text-[#343270] transition-colors">
            {property.title}
          </h3>
          {property.location && (
            <p className="text-[13px] text-[#8E8EA8] mt-1 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {property.location.district}, {property.location.city}
            </p>
          )}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-[12px] text-[#5A5A78] border-t border-[#F0F0F8] pt-3">
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {property.bedrooms} KT
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            {property.bathrooms} KM
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {property.building_area} m²
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-1">
          <p className="font-serif text-[18px] font-bold text-[#343270]">
            {property.price_label ?? formatPrice(property.price)}
          </p>
          {property.price_per_month && (
            <p className="text-[11px] text-[#8E8EA8]">
              mulai {formatPrice(property.price_per_month)}/bln
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const image = cluster.images?.[0]?.image_url;

  return (
    <Link
      href={`/clusters/${cluster.slug}`}
      className="group relative rounded-2xl overflow-hidden aspect-[3/2] bg-[#1E1E40] flex flex-col justify-end hover:shadow-xl transition-shadow duration-300"
    >
      {image && (
        <Image
          src={image}
          alt={cluster.name}
          fill
          className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F22]/90 via-[#0F0F22]/30 to-transparent" />

      <div className="relative p-5">
        {cluster.is_promo && cluster.promo_label && (
          <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2E9AB8] text-white mb-2">
            {cluster.promo_label}
          </span>
        )}
        <h3 className="font-serif text-white text-[18px] font-bold leading-tight">
          {cluster.name}
        </h3>
        <p className="text-[#AADDE9] text-[13px] mt-0.5">{cluster.developer}</p>
        {cluster.description && (
          <p className="text-white/70 text-[12px] mt-2 line-clamp-2">
            {cluster.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6 flex flex-col gap-4">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < (testimonial.rating ?? 5) ? "text-amber-400" : "text-[#E4E4F0]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-[#3E3E58] text-[14px] leading-relaxed flex-1">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-[#F0F0F8]">
        <div className="w-9 h-9 rounded-full bg-[#EEEDF8] flex items-center justify-center text-[#343270] font-bold text-[13px]">
          {testimonial.name?.charAt(0) ?? "A"}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#141422]">
            {testimonial.name}
          </p>
          {testimonial.property_bought && (
            <p className="text-[11px] text-[#8E8EA8]">
              {testimonial.property_bought}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const [featuredProperties, promoClusters, heroImage, testimonials] =
    await Promise.all([
      getFeaturedProperties(),
      getPromoClusters(),
      getHeroImage(),
      getTestimonials(),
    ]);

  return (
    <div className="bg-[#F7F7FB] min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center">
        {/* Background */}
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1E1E40]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F22]/70 via-[#0F0F22]/50 to-[#0F0F22]/80" />

        <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 py-24">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2E9AB8] animate-pulse" />
              <span className="text-white/90 text-[13px] font-medium">
                Properti Terpercaya di Depok
              </span>
            </div>

            <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-5">
              Temukan Hunian
              <br />
              <span className="text-[#2E9AB8]">Impian Anda</span>
              <br />
              di Depok
            </h1>
            <p className="text-white/70 text-[16px] sm:text-[17px] leading-relaxed mb-10 max-w-xl">
              Rumah Andalan hadir membantu Anda menemukan properti terbaik
              sesuai kebutuhan dan budget.
            </p>
          </div>

          {/* Search box */}
          <HeroSearch />

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { value: "200+", label: "Properti Tersedia" },
              { value: "50+", label: "Cluster Partner" },
              { value: "1.000+", label: "Keluarga Puas" },
            ].map(({ value, label }) => (
              <div key={label} className="text-white">
                <p className="font-serif text-2xl font-bold">{value}</p>
                <p className="text-white/60 text-[13px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO CLUSTERS ───────────────────────────────────────── */}
      {promoClusters.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">
                Penawaran Terbatas
              </p>
              <h2 className="font-serif text-[#141422] text-3xl md:text-4xl font-bold">
                Cluster Promo
              </h2>
            </div>
            <Link
              href="/clusters"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#343270] text-[14px] font-semibold hover:text-[#2E9AB8] transition-colors"
            >
              Lihat Semua
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoClusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURED PROPERTIES ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">
              Pilihan Terbaik
            </p>
            <h2 className="font-serif text-[#141422] text-3xl md:text-4xl font-bold">
              Properti Unggulan
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#343270] text-[14px] font-semibold hover:text-[#2E9AB8] transition-colors"
          >
            Lihat Semua
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#8E8EA8]">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
              />
            </svg>
            <p>Belum ada properti unggulan.</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#343270] text-white text-[14px] font-semibold hover:bg-[#2E9AB8] transition-colors"
          >
            Lihat Semua Properti
          </Link>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────── */}
      <section className="bg-[#1E1E40] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">
              Keunggulan Kami
            </p>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-bold">
              Kenapa Rumah Andalan?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                ),
                title: "Terpercaya",
                desc: "Pengalaman bertahun-tahun di pasar properti Depok dengan rekam jejak yang terverifikasi.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                ),
                title: "Transparan",
                desc: "Informasi lengkap dan jujur tentang properti tanpa biaya tersembunyi atau kejutan.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                ),
                title: "Profesional",
                desc: "Tim agen berpengalaman siap mendampingi setiap langkah proses pembelian rumah Anda.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#285090]/40 border border-[#285090]/40 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#2E9AB8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="font-serif text-white text-[18px] font-bold mb-2">
                  {title}
                </h3>
                <p className="text-white/60 text-[14px] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[#2E9AB8] text-[13px] font-semibold uppercase tracking-widest mb-2">
              Cerita Mereka
            </p>
            <h2 className="font-serif text-[#141422] text-3xl md:text-4xl font-bold">
              Yang Mereka Katakan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t: any) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 pb-24">
        <div className="bg-gradient-to-br from-[#343270] to-[#285090] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative">
            <p className="text-[#AADDE9] text-[13px] font-semibold uppercase tracking-widest mb-3">
              Mulai Sekarang
            </p>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-bold mb-4">
              Siap Menemukan
              <br />
              Rumah Impian?
            </h2>
            <p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto leading-relaxed">
              Konsultasikan kebutuhan properti Anda dengan tim kami. Gratis,
              tanpa komitmen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#343270] text-[14px] font-bold hover:bg-[#EEEDF8] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.51 5.832L.057 23.37a.75.75 0 00.926.926l5.538-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.95-1.354l-.355-.21-3.685.967.983-3.591-.231-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                Hubungi via WhatsApp
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-[14px] font-semibold hover:bg-white/20 transition-colors"
              >
                Jelajahi Properti
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
