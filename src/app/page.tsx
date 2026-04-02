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
  const isSold = property.status === "terjual" || property.status === "booked";

  return (
    <Link
      href={`/listings/${property.slug}`}
      // Hapus rounded, tambahkan border tegas dan efek hard-shadow kotak pas di-hover
      className="group bg-white rounded-none border border-[#343270] hover:shadow-[8px_8px_0px_#1E1E40] hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
    >
      {/* Image Container (Tajam, ada border bawah) */}
      <div className="relative aspect-[4/3] bg-[#F7F7FB] overflow-hidden border-b border-[#343270]">
        {primaryImage ? (
          <Image
            src={primaryImage.url} // Pastikan pakai .url
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isSold ? "grayscale contrast-125 opacity-80" : ""
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E40]">
            <span className="text-[#2E9AB8] text-[10px] uppercase tracking-widest font-bold">
              NO IMAGE
            </span>
          </div>
        )}

        {/* Status Badge ala Label Koran */}
        <span
          className={`absolute top-0 left-0 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border-r border-b border-[#343270] ${
            isSold ? "bg-[#1E1E40] text-white" : "bg-[#2E9AB8] text-white"
          }`}
        >
          {property.status}
        </span>

        {/* Featured Badge */}
        {property.is_featured && (
          <span className="absolute top-0 right-0 text-[10px] font-bold px-3 py-1.5 bg-[#EEEDF8] text-[#1E1E40] uppercase tracking-widest border-l border-b border-[#343270]">
            Unggulan
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col gap-4 flex-1 bg-white">
        {/* Lokasi (Micro-copy Cerulean) & Judul (Serif Navy) */}
        <div>
          {property.location && (
            <p className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#2E9AB8] rounded-none"></span>
              {property.location.district}, {property.location.city}
            </p>
          )}
          <h3 className="font-serif font-bold text-[#1E1E40] text-[20px] leading-snug line-clamp-2 group-hover:text-[#2E9AB8] transition-colors">
            {property.title}
          </h3>
        </div>

        {/* Spesifikasi (Kaku dengan garis pemisah vertikal) */}
        <div className="flex items-center justify-between text-[11px] font-bold text-[#1E1E40] border-t border-b border-[#343270] py-2.5 uppercase tracking-widest">
          <span>{property.bedrooms} KT</span>
          <span className="w-px h-4 bg-[#343270]"></span>
          <span>{property.bathrooms} KM</span>
          <span className="w-px h-4 bg-[#343270]"></span>
          <span>{property.building_area} M²</span>
        </div>

        {/* Harga & Label Pembayaran */}
        <div className="mt-auto pt-2">
          <p className="font-serif text-[24px] font-black text-[#1E1E40]">
            {property.price_label ?? formatPrice(property.price)}
          </p>

          {/* Label Pembayaran yang Kaku */}
          {(property.is_kpr ||
            property.is_cash_keras ||
            property.is_subsidi) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {property.is_kpr && (
                <span className="text-[9px] font-bold px-2 py-1 border border-[#343270] text-[#1E1E40] uppercase tracking-widest">
                  KPR
                </span>
              )}
              {property.is_cash_keras && (
                <span className="text-[9px] font-bold px-2 py-1 bg-[#1E1E40] text-white uppercase tracking-widest">
                  CASH KERAS
                </span>
              )}
              {property.is_subsidi && (
                <span className="text-[9px] font-bold px-2 py-1 bg-[#2E9AB8] text-white uppercase tracking-widest">
                  SUBSIDI
                </span>
              )}
            </div>
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
      // Kotak kaku, border kaku, efek hard shadow khas majalah
      className="group relative border border-[#343270] aspect-[3/2] bg-[#1E1E40] flex flex-col justify-end hover:shadow-[8px_8px_0px_#2E9AB8] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300"
    >
      {/* Gambar dengan filter cinematic */}
      {image && (
        <Image
          src={image}
          alt={cluster.name}
          fill
          className="object-cover opacity-60 grayscale-[50%] group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {/* Gradient keras (bukan soft blur) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E40] via-[#1E1E40]/60 to-transparent" />

      {/* Konten Area */}
      <div className="relative p-6 border-t-[3px] border-transparent group-hover:border-[#2E9AB8] transition-colors duration-300">
        {cluster.is_promo && cluster.promo_label && (
          <span className="inline-block text-[10px] font-bold px-3 py-1.5 bg-[#EEEDF8] text-[#1E1E40] mb-3 uppercase tracking-widest border border-[#343270]">
            {cluster.promo_label}
          </span>
        )}

        <h3 className="font-serif text-white text-[24px] font-black leading-tight uppercase">
          {cluster.name}
        </h3>

        <p className="text-[#2E9AB8] text-[11px] font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
          <span className="w-4 h-px bg-[#2E9AB8]"></span>
          {cluster.developer}
        </p>

        {cluster.description && (
          <p className="text-[#EEEDF8] text-[13px] mt-3 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
            {cluster.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white border border-[#343270] p-8 flex flex-col gap-6 hover:shadow-[8px_8px_0px_#2E9AB8] transition-all duration-300 relative group">
      {/* Quote Mark Aksen Ala Editorial */}
      <div className="absolute top-4 right-4 text-[#EEEDF8] font-serif text-6xl leading-none font-black group-hover:text-[#2E9AB8] transition-colors">
        &rdquo;
      </div>

      <div className="flex gap-1 relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < (testimonial.rating ?? 5) ? "text-[#343270]" : "text-[#E4E4F0]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {/* Bintangnya dibuat bersudut kaku */}
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>

      <p className="text-[#1E1E40] font-serif text-[16px] italic leading-relaxed flex-1 relative z-10">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <div className="flex items-center gap-4 pt-5 border-t-2 border-[#1E1E40] relative z-10">
        {/* Avatar Kotak Tajam (No Rounded) */}
        <div className="w-12 h-12 bg-[#343270] border border-[#1E1E40] flex items-center justify-center text-white font-black text-[16px] shadow-[3px_3px_0px_#2E9AB8]">
          {testimonial.name?.charAt(0) ?? "A"}
        </div>
        <div>
          <p className="text-[13px] font-black text-[#1E1E40] uppercase tracking-wider">
            {testimonial.name}
          </p>
          {testimonial.property_bought && (
            <p className="text-[10px] text-[#2E9AB8] font-bold uppercase tracking-widest mt-0.5">
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
      {/* ── BOLD ASYMMETRIC EDITORIAL HERO ────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col lg:flex-row pt-16 lg:pt-0 bg-[#1E1E40] overflow-hidden">
        {/* Gambar Mobile (Muncul di layar kecil, posisi paling atas) */}
        <div
          data-aos="fade-in"
          data-aos-duration="1200"
          className="w-full h-[45vh] lg:hidden relative border-b-4 border-[#2E9AB8]"
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Hero Rumah Andalan"
              fill
              priority
              className="object-cover grayscale-[20%] contrast-125"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#343270]" />
          )}
        </div>

        {/* Kolom Kiri: Teks & Aksi (Solid Navy) */}
        <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center px-6 sm:px-12 py-12 lg:py-32 relative z-10">
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
            {/* Editorial Micro-copy */}
            <div data-aos="fade-right" className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-[#2E9AB8]" />
              <span className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.3em]">
                Koleksi Hunian Eksklusif
              </span>
            </div>

            {/* Headline Raksasa */}
            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] mb-8 uppercase tracking-tight"
            >
              Temukan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#EEEDF8]">
                Hunian
              </span>
              <br />
              <span className="text-[#2E9AB8] italic font-bold capitalize tracking-normal">
                Impian.
              </span>
            </h1>

            {/* Subheadline dengan aksen garis vertikal */}
            <p
              data-aos="fade-up"
              data-aos-delay="400"
              className="text-[#EEEDF8] text-[14px] sm:text-[15px] leading-relaxed mb-10 border-l-2 border-[#2E9AB8] pl-5 max-w-md"
            >
              Kami mengurasi properti terbaik di Depok dengan nilai investasi
              tinggi. Desain arsitektur modern, lokasi strategis, tanpa
              kompromi.
            </p>

            {/* Search Component */}
            <div
              data-aos="fade-in"
              data-aos-delay="600"
              className="w-full mb-12 shadow-2xl"
            >
              <HeroSearch />
            </div>

            {/* Stats Minimalis */}
            <div
              data-aos="fade-up"
              data-aos-delay="800"
              className="grid grid-cols-3 gap-6 pt-8 border-t border-[#343270]"
            >
              {[
                { value: "200+", label: "Properti" },
                { value: "50+", label: "Cluster" },
                { value: "1K+", label: "Klien" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-serif text-3xl sm:text-4xl font-black text-white">
                    {value}
                  </p>
                  <p className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Gambar Full-Bleed (Hanya Desktop) */}
        <div
          data-aos="fade-in"
          data-aos-duration="1200"
          className="hidden lg:block lg:w-[50%] xl:w-[55%] relative border-l border-[#343270]"
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Hero Rumah Andalan"
              fill
              priority
              className="object-cover grayscale-[15%] contrast-110"
              sizes="50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#343270]" />
          )}

          {/* Aksen Label Melayang di atas gambar (Gaya Majalah) */}
          <div
            data-aos="fade-left"
            data-aos-delay="1000"
            className="absolute bottom-16 right-0 bg-[#EEEDF8] px-8 py-5 border-l-4 border-[#1E1E40] shadow-2xl"
          >
            <p className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              Featured Property
            </p>
            <p className="font-serif text-[#1E1E40] text-2xl font-black uppercase">
              Kawasan Depok
            </p>
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
            {promoClusters.map((cluster, index) => (
              <div
                key={cluster.id}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <ClusterCard cluster={cluster} />
              </div>
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
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <PropertyCard property={property} />
              </div>
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
      <section className="bg-[#1E1E40] py-16 md:py-24 border-t-8 border-[#2E9AB8]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div data-aos="fade-right">
              <p className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#2E9AB8]"></span>
                Keunggulan Kami
              </p>
              <h2 className="font-serif text-white text-4xl md:text-5xl font-black uppercase leading-[1.1]">
                Kenapa Rumah <br className="hidden md:block" />{" "}
                <span className="text-[#2E9AB8] italic">Andalan?</span>
              </h2>
            </div>
            <div
              data-aos="fade-left"
              className="text-[#EEEDF8] text-[14px] max-w-sm border-l-2 border-[#2E9AB8] pl-5"
            >
              Komitmen kami memberikan layanan properti terbaik dengan standar
              profesionalisme tertinggi, transparan, tanpa kompromi.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#343270]">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                ),
                title: "Terpercaya",
                desc: "Pengalaman bertahun-tahun di pasar properti Depok dengan rekam jejak yang terverifikasi kuat.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                ),
                title: "Transparan",
                desc: "Informasi utuh, jujur, dan terperinci tentang spesifikasi properti tanpa biaya tersembunyi.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                ),
                title: "Profesional",
                desc: "Tim agen properti ahli yang siap mendampingi setiap langkah proses pembelian Anda.",
              },
            ].map(({ icon, title, desc }, index) => (
              <div
                key={title}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="p-8 border-b border-r border-[#343270] hover:bg-[#343270]/30 transition-colors group"
              >
                <div className="w-16 h-16 bg-[#1E1E40] border border-[#2E9AB8] flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-[4px_4px_0px_#2E9AB8]">
                  <svg
                    className="w-8 h-8 text-[#2E9AB8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="font-serif text-white text-[22px] font-black mb-3 uppercase tracking-wide">
                  {title}
                </h3>
                <p className="text-[#EEEDF8] text-[14px] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      {/* ── BOLD EDITORIAL TESTIMONIALS ────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div data-aos="fade-right">
              <p className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                Kisah Nyata
              </p>
              <h2 className="font-serif text-[#1E1E40] text-3xl md:text-5xl font-black uppercase">
                Kata <span className="text-[#2E9AB8] italic">Mereka</span>
              </h2>
            </div>
            <div
              data-aos="fade-left"
              className="h-px w-32 bg-[#343270] mb-3 hidden md:block"
            ></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t: any, index: number) => (
              <div key={t.id} data-aos="fade-up" data-aos-delay={index * 150}>
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BOLD EDITORIAL CTA ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 pb-24">
        <div
          data-aos="zoom-in"
          className="bg-[#2E9AB8] border-2 border-[#1E1E40] p-10 md:p-16 text-center relative shadow-[12px_12px_0px_#1E1E40]"
        >
          <div className="relative z-10">
            <p className="text-[#1E1E40] text-[12px] font-black uppercase tracking-[0.3em] mb-4">
              Ambil Langkah Pertama
            </p>
            <h2 className="font-serif text-[#1E1E40] text-4xl md:text-5xl font-black uppercase leading-[1.1] mb-6">
              Siap Memiliki <br /> Hunian{" "}
              <span className="text-white italic">Impian?</span>
            </h2>
            <p className="text-[#1E1E40] font-medium text-[15px] mb-10 max-w-lg mx-auto leading-relaxed border-l-2 border-[#1E1E40] pl-4">
              Konsultasikan kebutuhan properti Anda dengan tim eksekutif kami.
              Gratis, tanpa biaya tersembunyi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1E1E40] text-white text-[13px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#1E1E40] hover:shadow-[6px_6px_0px_#1E1E40] transition-all border border-[#1E1E40]"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.51 5.832L.057 23.37a.75.75 0 00.926.926l5.538-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.95-1.354l-.355-.21-3.685.967.983-3.591-.231-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                Konsultasi WhatsApp
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#1E1E40] text-[#1E1E40] text-[13px] font-bold uppercase tracking-widest hover:bg-[#1E1E40] hover:text-white transition-all"
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
