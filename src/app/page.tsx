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

// ─── Sub-components (Editorial Style) ────────────────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const primaryImage =
    property.images?.find((img) => img.is_primary) ?? property.images?.[0];
  const isSold = property.status === "terjual" || property.status === "booked";

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-surface">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 ${
              isSold ? "grayscale opacity-70" : ""
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-border-light">
            <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold">
              Tak Ada Gambar
            </span>
          </div>
        )}

        {/* Status Badge - Minimalist */}
        <div className="absolute top-4 left-4">
          <span
            className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] backdrop-blur-md ${isSold ? "bg-text-primary text-white" : "bg-bg-page/90 text-text-primary"}`}
          >
            {property.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display font-medium text-text-primary text-2xl leading-snug group-hover:text-accent transition-colors">
            {property.title}
          </h3>
          <p className="font-body text-[17px] font-medium text-text-primary whitespace-nowrap">
            {property.price_label ?? formatPrice(property.price)}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold text-text-muted uppercase tracking-widest mt-1">
          {property.location && <span>{property.location.district}</span>}
          <span className="w-1 h-1 rounded-full bg-border-dark"></span>
          <span>{property.bedrooms} Bed</span>
          <span className="w-1 h-1 rounded-full bg-border-dark"></span>
          <span>{property.building_area} M²</span>
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
      className="group relative block aspect-square bg-bg-surface overflow-hidden"
    >
      {image && (
        <Image
          src={image}
          alt={cluster.name}
          fill
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-8 w-full">
        {cluster.is_promo && cluster.promo_label && (
          <span className="inline-block text-[10px] font-bold px-3 py-1 bg-white text-text-primary mb-4 uppercase tracking-[0.2em]">
            {cluster.promo_label}
          </span>
        )}
        <h3 className="font-display text-white text-3xl font-light tracking-wide mb-1">
          {cluster.name}
        </h3>
        <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.3em]">
          Oleh {cluster.developer}
        </p>
      </div>
    </Link>
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
    <div className="bg-bg-page min-h-screen">
      {/* ── HERO SECTION (SPLIT ASIMETRIS) ── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Kolom Teks Hero */}
          <div className="lg:col-span-5 flex flex-col items-start z-10 order-2 lg:order-1">
            <p
              data-aos="fade-up"
              className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-accent mb-6 border-l border-accent pl-4"
            >
              Properti Depok & Sekitarnya
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.05] text-text-primary mb-8"
            >
              Menemukan Hunian <br />
              <span className="italic font-light text-accent">Yang Tepat.</span>
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="font-body text-lg text-text-secondary leading-relaxed max-w-md mb-12"
            >
              Kami menyeleksi rumah dan cluster dengan legalitas aman, lokasi
              strategis, dan harga yang transparan. Tanpa mark-up, tanpa biaya
              tersembunyi.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="w-full max-w-lg mb-10"
            >
              <HeroSearch />
            </div>
          </div>

          <div
            className="lg:col-span-7 relative h-[50vh] lg:h-[80vh] w-full order-1 lg:order-2"
            data-aos="fade-left"
            data-aos-duration="1500"
          >
            <div className="absolute inset-0 bg-accent-wash translate-x-4 -translate-y-4 lg:translate-x-8 lg:-translate-y-8"></div>
            <Image
              src={heroImage || "/og-image.jpg"}
              alt="Interior arsitektur elegan"
              fill
              className="object-cover relative z-10"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24 border-t border-border-light">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              Katalog Terbaru
            </p>
            <h2 className="font-display text-text-primary text-4xl lg:text-5xl">
              Properti <span className="italic text-accent">Pilihan</span>
            </h2>
          </div>
          <Link
            href="/listings"
            className="group flex items-center gap-3 border-b border-text-primary pb-1 hover:border-accent transition-colors"
          >
            <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary group-hover:text-accent transition-colors">
              Lihat Semua Properti
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featuredProperties.map((property, index) => (
            <div
              key={property.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US (EDITORIAL NUMBERS) ── */}
      <section className="bg-accent py-24 lg:py-32 text-bg-page">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4" data-aos="fade-right">
              <p className="text-accent-tint text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                Nilai Kerja Kami
              </p>
              <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
                Fokus Pada <br />
                <span className="italic font-light">Keamanan Transaksi.</span>
              </h2>
              <p className="text-accent-tint/80 text-[15px] leading-relaxed">
                Membeli properti adalah keputusan besar. Kami mendampingi Anda
                memastikan setiap aspek legal dan finansial berjalan aman.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {[
                {
                  num: "01",
                  title: "Verifikasi Legalitas",
                  desc: "Setiap properti yang kami pasarkan telah melalui pengecekan sertifikat (SHM/SHGB), IMB/PBG, dan bebas sengketa.",
                },
                {
                  num: "02",
                  title: "Harga Transparan",
                  desc: "Kami mempertemukan Anda langsung dengan harga dari pemilik atau developer. Tidak ada mark-up sepihak.",
                },
                {
                  num: "03",
                  title: "Pengurusan KPR",
                  desc: "Bekerja sama dengan bank rekanan, kami membantu proses pemberkasan hingga KPR Anda disetujui.",
                },
                {
                  num: "04",
                  title: "Pendampingan Penuh",
                  desc: "Mulai dari survei lokasi perdana, negosiasi harga, hingga tanda tangan AJB di hadapan Notaris.",
                },
              ].map(({ num, title, desc }, idx) => (
                <div
                  key={num}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="border-t border-accent-light pt-6"
                >
                  <span className="font-display text-3xl text-accent-light block mb-4">
                    {num}.
                  </span>
                  <h3 className="font-body text-lg font-medium text-white mb-3 tracking-wide">
                    {title}
                  </h3>
                  <p className="text-accent-tint/70 text-[14px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL CTA ── */}
      <section className="py-32">
        <div
          className="max-w-4xl mx-auto px-5 sm:px-8 text-center"
          data-aos="zoom-in"
        >
          <p className="text-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-6">
            Jadwalkan Kunjungan
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-text-primary mb-10 leading-tight">
            Mulai Pencarian <br className="hidden sm:block" />{" "}
            <span className="italic text-accent">Properti Anda.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              className="px-8 py-4 bg-accent text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-text-primary transition-colors"
            >
              Hubungi via WhatsApp
            </Link>
            <Link
              href="/listings"
              className="px-8 py-4 border border-text-primary text-text-primary text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-white transition-colors"
            >
              Cari Properti Sendiri
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
