import { supabase } from "@/lib/supabase";
import { Property, Cluster } from "@/types";
import Link from "next/link";
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
    .limit(5); // Ambil 5 untuk layout asimetris (1 besar, 4 kecil)
  return (data ?? []) as Property[];
}

async function getPromoClusters() {
  const { data } = await supabase
    .from("clusters")
    .select("*, images:cluster_images(*)")
    .eq("is_promo", true)
    .limit(6);
  return (data ?? []) as Cluster[];
}

async function getTestimonials() {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .limit(4);
  return data ?? [];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} M`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

// ─── Server Component ────────────────────────────────────────────────────────

export default async function HomePage() {
  const [featuredProperties, promoClusters, testimonials] = await Promise.all([
    getFeaturedProperties(),
    getPromoClusters(),
    getTestimonials(),
  ]);

  // Fallback image untuk demo Hero
  const heroImage =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";

  return (
    <div className="bg-[#F7F7FB] min-h-screen">
      {/* ─── HERO SECTION (Immersive & Glassmorphism) ─── */}
      <section className="relative min-h-[100svh] md:min-h-[800px] flex items-center justify-center overflow-hidden pt-24 pb-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Menggunakan img standard dengan object-fit agar aman tanpa config Next.js */}
          <img
            src={heroImage}
            alt="Rumah Andalan Hero"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay untuk text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E40]/80 via-[#1E1E40]/60 to-[#1E1E40]/90 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#AADDE9] text-xs font-semibold tracking-widest uppercase mb-6 animate-fade-in-up">
            Eksklusif di Depok
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight max-w-4xl drop-shadow-lg">
            Temukan <span className="text-[#2E9AB8]">Harmoni</span> di Setiap
            Sudut Hunian Anda
          </h1>
          <p className="text-lg md:text-xl text-[#C8C7E8] mb-10 max-w-2xl drop-shadow-md">
            Koleksi properti premium dengan desain modern dan lokasi strategis.
            Kami bantu mewujudkan rumah impian keluarga Anda hari ini.
          </p>

          {/* Search Component (Glassmorphism) */}
          <div className="w-full max-w-4xl transform hover:scale-[1.01] transition-transform duration-300">
            <HeroSearch />
          </div>
        </div>

        {/* Decorative Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-bounce">
          <span className="text-white text-xs font-medium tracking-widest">
            SCROLL
          </span>
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ─── QUICK STATS ─── */}
      <section className="bg-white border-b border-[#E4E4F0] relative z-20 -mt-10 mx-5 sm:mx-8 md:mx-auto max-w-5xl rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#F0F0F8]">
          {[
            { label: "Properti Tersedia", value: "500+" },
            { label: "Lokasi Strategis", value: "11" },
            { label: "Klien Puas", value: "98%" },
            { label: "Mitra Developer", value: "25+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 md:p-8 text-center bg-white hover:bg-[#F7F7FB] transition-colors"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-[#343270] mb-1">
                {stat.value}
              </h3>
              <p className="text-[#8E8EA8] text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PREMIUM CLUSTERS (Horizontal Scroll) ─── */}
      <section className="py-16 max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#141422] mb-3">
              Kawasan Premium
            </h2>
            <p className="text-[#5A5A78]">
              Eksplorasi cluster perumahan eksklusif dengan fasilitas lengkap.
            </p>
          </div>
          <Link
            href="/clusters"
            className="hidden md:flex items-center gap-2 text-[#2E9AB8] font-semibold hover:text-[#2589a4] transition-colors"
          >
            Lihat Semua Kawasan
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {promoClusters.map((cluster) => {
            const primaryImage =
              cluster.images?.find((img) => img.is_primary)?.image_url ??
              "https://images.unsplash.com/photo-1613490900233-141c5560d75d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
            return (
              <Link
                href={`/clusters/${cluster.slug}`}
                key={cluster.id}
                className="group relative min-w-[280px] md:min-w-[360px] h-[320px] md:h-[360px] rounded-3xl overflow-hidden snap-center flex-shrink-0"
              >
                <img
                  src={primaryImage}
                  alt={cluster.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E40] via-[#1E1E40]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {cluster.is_promo && (
                  <div className="absolute top-5 left-5 bg-[#E5F5F9] text-[#0A2B35] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {cluster.promo_label || "PROMO KHUSUS"}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {cluster.name}
                  </h3>
                  <p className="text-[#AADDE9] text-sm mb-4 line-clamp-2">
                    {cluster.description}
                  </p>
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <span>Oleh {cluster.developer}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E9AB8]" />
                    <span className="group-hover:text-white transition-colors">
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES (Asymmetric Grid) ─── */}
      <section className="py-24 bg-white border-y border-[#E4E4F0]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#141422] mb-4">
              Properti Pilihan Bulan Ini
            </h2>
            <p className="text-[#5A5A78] max-w-2xl mx-auto">
              Kami mengurasi properti terbaik dengan nilai investasi tinggi dan
              desain arsitektur memukau yang siap Anda huni.
            </p>
          </div>

          {featuredProperties.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Highlight Property (Kiri - Besar) */}
              <div className="lg:col-span-7">
                <PropertyShowcaseCard
                  property={featuredProperties[0]}
                  isLarge
                />
              </div>

              {/* Grid Property Kecil (Kanan) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {featuredProperties.slice(1, 4).map((prop) => (
                  <PropertyShowcaseCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#343270] hover:bg-[#285090] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Jelajahi Semua Properti
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS (Modern Masonry/Cards) ─── */}
      <section className="py-24 bg-[#1E1E40] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E9AB8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#343270]/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Kepercayaan Mereka Adalah Prioritas Kami
              </h2>
              <p className="text-[#C8C7E8] mb-8">
                Ratusan keluarga telah menemukan kenyamanan bersama Rumah
                Andalan. Dengar pengalaman langsung dari mereka.
              </p>
              <div className="flex gap-2">
                {/* Decorative Stars */}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-[#2E9AB8]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white mt-2 font-semibold">
                4.9/5 Rata-rata Kepuasan
              </p>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className={`bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl ${i % 2 !== 0 ? "sm:mt-8" : ""}`}
                >
                  <div className="flex text-[#2E9AB8] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#EEEDF8] text-[15px] italic mb-6 leading-relaxed">
                    "{t.content}"
                  </p>
                  <div>
                    <p className="text-white font-semibold">{t.name}</p>
                    <p className="text-[#AADDE9] text-xs mt-0.5">
                      Membeli: {t.property_bought}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
}

// ─── Reusable Micro-Component ────────────────────────────────────────────────

function PropertyShowcaseCard({
  property,
  isLarge = false,
}: {
  property: Property;
  isLarge?: boolean;
}) {
  const primaryImg =
    property.images?.find((img) => img.is_primary)?.url ??
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

  // Status & Badges Config
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
  };
  const status = statusConfig[property.status] ?? statusConfig["tersedia"];
  const paymentBadgeClass =
    "bg-[#EEEDF8] text-[#343270] border border-[#C8C7E8]";

  return (
    <Link
      href={`/listings/${property.slug}`}
      className={`group relative flex bg-white rounded-3xl overflow-hidden border border-[#E4E4F0] hover:shadow-2xl transition-all duration-500 ${
        isLarge ? "flex-col h-full" : "flex-col sm:flex-row h-full"
      }`}
    >
      {/* Gambar */}
      <div
        className={`relative overflow-hidden shrink-0 ${
          isLarge
            ? "h-[250px] sm:h-[350px] w-full"
            : "h-[220px] sm:h-auto sm:w-[45%] lg:w-[40%]"
        }`}
      >
        <img
          src={primaryImg}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Status Badge */}
        <span
          className={`absolute top-4 left-4 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>

        {/* Virtual Tour Badge (Simulated) */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Virtual Tour
        </div>
      </div>

      {/* Konten */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-center">
        {/* Payment Badges (KPR, Subsidi, dll) */}
        {(property.is_kpr || property.is_cash_keras || property.is_subsidi) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
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

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#2E9AB8] bg-[#E5F5F9] px-2.5 py-1 rounded-md">
            {property.type.toUpperCase()}
          </span>
          <span className="text-[#8E8EA8] text-xs flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
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
            {property.location?.district}
          </span>
        </div>

        <h3
          className={`font-bold text-[#141422] leading-snug mb-2 group-hover:text-[#343270] transition-colors ${isLarge ? "text-2xl line-clamp-2" : "text-base line-clamp-2"}`}
        >
          {property.title}
        </h3>

        {isLarge && (
          <p className="text-[#5A5A78] text-sm line-clamp-3 mb-4">
            {property.description ||
              "Desain eksklusif dengan pencahayaan alami maksimal, cocok untuk hunian keluarga modern masa kini."}
          </p>
        )}

        {/* Spesifikasi (Kamar & Luas) */}
        <div
          className={`flex items-center gap-3 text-[12px] text-[#5A5A78] ${isLarge ? "mb-6" : "mb-4"}`}
        >
          <span className="flex items-center gap-1">
            🛏 {property.bedrooms} KT
          </span>
          <span className="flex items-center gap-1">
            🚿 {property.bathrooms} KM
          </span>
          <span className="flex items-center gap-1">
            📐 {property.building_area} m²
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-[#F0F0F8] flex items-center justify-between">
          <div>
            <p className="text-[#8E8EA8] text-xs mb-0.5">Mulai dari</p>
            <p
              className={`font-serif font-bold text-[#343270] ${isLarge ? "text-2xl" : "text-lg"}`}
            >
              {property.price_label ?? formatPrice(property.price)}
            </p>
          </div>
          {isLarge && (
            <div className="w-10 h-10 rounded-full bg-[#EEEDF8] text-[#343270] flex items-center justify-center group-hover:bg-[#343270] group-hover:text-white transition-colors shrink-0">
              <svg
                className="w-5 h-5 transform -rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
