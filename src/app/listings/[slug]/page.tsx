import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import PropertyJsonLd from "@/components/PropertyJsonLd";
import PropertyGallery from "@/components/PropertyGallery";
import Image from "next/image";
import { cache } from "react";

const getProperty = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, cluster:clusters(*), location:locations(*), images:property_images(*)",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching property:", error);
  }

  return data as Property | null;
});

async function getRelatedProperties(property: Property) {
  const { data } = await supabase
    .from("properties")
    .select("*, location:locations(*), images:property_images(*)")
    .eq("location_id", property.location_id)
    .neq("id", property.id)
    .limit(3);
  return (data ?? []) as Property[];
}

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} Miliar`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Juta`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

// Desain status yang lebih sleek dan elegan
const statusConfig: Record<string, { label: string; className: string }> = {
  tersedia: {
    label: "TERSEDIA",
    className: "border border-text-primary text-text-primary",
  },
  inden: { label: "INDEN", className: "bg-text-muted text-bg-page" },
  terjual: { label: "TERJUAL", className: "bg-text-primary text-white" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) return { title: "Properti Tidak Ditemukan" };

  // Cari gambar primary untuk dijadikan thumbnail saat di-share
  const primaryImg =
    property.images?.find((img) => img.is_primary) ?? property.images?.[0];
  const imageUrl = primaryImg?.url ?? "/og-image.jpg";

  return {
    title: `${property.title} | Kurasi Rumah Andalan`,
    description: property.description,
    openGraph: {
      title: `${property.title} | Rumah Andalan`,
      description: property.description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} | Rumah Andalan`,
      description: property.description,
      images: [imageUrl],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const related = await getRelatedProperties(property);
  const status = statusConfig[property.status] ?? statusConfig["tersedia"];
  const rawImages = property.images ?? [];
  const primaryImg = rawImages.find((img) => img.is_primary);
  const otherImgs = rawImages.filter((img) => !img.is_primary);
  const allImages = primaryImg ? [primaryImg, ...otherImgs] : otherImgs;

  const propertyUrl = `https://www.rumahandalan.com/listings/${property.slug}`;
  const waMessage = encodeURIComponent(
    `Halo Rumah Andalan, saya tertarik dengan properti *${property.title}*.\n\nLink: ${propertyUrl}\n\nApakah saya bisa menjadwalkan kunjungan?`,
  );
  const waLink = `https://wa.me/${property.whatsapp_number}?text=${waMessage}`;

  const labelClass =
    "text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1 block";

  return (
    <>
      <div className="bg-bg-page min-h-screen pb-32 lg:pb-24 pt-24">
        {/* ── BREADCRUMB MINIMALIS ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-8">
          <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            <Link
              href="/"
              className="hover:text-text-primary transition-colors"
            >
              Beranda
            </Link>
            <span>/</span>
            <Link
              href="/listings"
              className="hover:text-text-primary transition-colors"
            >
              Koleksi
            </Link>
            <span>/</span>
            <span className="text-text-primary line-clamp-1">
              {property.title}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* ── LEFT COLUMN (KONTEN UTAMA) ── */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            {/* Header Properti */}
            <div>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.3em] ${status.className}`}
                >
                  {status.label}
                </span>
                {property.is_featured && (
                  <span className="text-[10px] font-bold px-4 py-1.5 bg-accent text-bg-page uppercase tracking-[0.3em]">
                    Koleksi Eksklusif
                  </span>
                )}
              </div>
              <h1 className="font-display text-text-primary text-4xl md:text-5xl lg:text-[4rem] leading-[1.05] mb-6">
                {property.title}
              </h1>
              {property.location && (
                <p className="text-text-secondary text-[14px] font-medium tracking-wide flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-text-primary/30"></span>
                  Kawasan {property.location.district}, {property.location.city}
                </p>
              )}
            </div>

            {/* Galeri - Memanggil komponen gallery lama Anda */}
            <div>
              <PropertyGallery images={allImages} />
            </div>

            {/* Spesifikasi Grid Editorial */}
            <div className="border-t border-text-primary/20 pt-10">
              <h2 className="font-display text-3xl text-text-primary mb-10">
                Detail <span className="italic text-accent">Struktur.</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
                <div>
                  <p className={labelClass}>Tipe Hunian</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.type === "rumah" ? "Rumah Tapak" : "Apartemen"}
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Status Bangunan</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.condition === "baru" ? "Gres / Baru" : "Sekunder"}
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Dokumen Legal</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.certificate?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Kapasitas Ruang</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.bedrooms} Bed / {property.bathrooms} Bath
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Luas Tanah</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.land_area} M²
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Luas Bangunan</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.building_area} M²
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Jumlah Lantai</p>
                  <p className="font-display text-xl text-text-primary">
                    {property.floors} Tingkat
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Asosiasi Cluster</p>
                  <p className="font-display text-xl text-text-primary line-clamp-1">
                    {property.cluster?.name ?? "Independen"}
                  </p>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            {property.description && (
              <div className="border-t border-text-primary/20 pt-10">
                <h2 className="font-display text-3xl text-text-primary mb-8">
                  Naratif <span className="italic text-accent">Properti.</span>
                </h2>
                <div className="prose prose-lg prose-p:text-text-secondary prose-p:leading-relaxed max-w-none font-body text-[15px]">
                  <p className="whitespace-pre-line">{property.description}</p>
                </div>
              </div>
            )}

            {/* Fasilitas (Tanpa Icon Generik) */}
            {property.facilities && property.facilities.length > 0 && (
              <div className="border-t border-text-primary/20 pt-10">
                <h2 className="font-display text-3xl text-text-primary mb-8">
                  Fasilitas <span className="italic text-accent">& Akses.</span>
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.facilities.map((facility, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 text-text-secondary text-[15px] font-medium py-3 border-b border-text-primary/10"
                    >
                      <span className="text-[10px] font-bold mt-1 text-accent tracking-widest">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (STICKY CTA - EDITORIAL) ── */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 flex flex-col gap-10">
              <div className="bg-bg-surface p-10 border border-text-primary/10">
                <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold mb-4">
                  Nilai Investasi
                </p>
                <p className="font-display text-4xl text-text-primary mb-2">
                  {property.price_label ?? formatPrice(property.price)}
                </p>
                {property.price_per_month && (
                  <p className="text-text-secondary text-[13px] mb-8">
                    Estimasi angsuran{" "}
                    <span className="font-bold text-text-primary">
                      {formatPrice(property.price_per_month)}
                    </span>{" "}
                    / bulan
                  </p>
                )}

                <div className="flex flex-col gap-4">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-4 bg-text-primary text-bg-page text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent transition-colors"
                  >
                    Diskusi via WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="w-full text-center py-4 border border-text-primary text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-text-primary hover:text-white transition-colors"
                  >
                    Jadwalkan Kunjungan
                  </Link>
                </div>
              </div>

              {property.cluster && (
                <div className="pt-8 border-t border-text-primary/20">
                  <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold mb-3">
                    Bagian dari Cluster
                  </p>
                  <Link
                    href={`/clusters/${property.cluster.slug}`}
                    className="group block"
                  >
                    <h3 className="font-display text-2xl text-text-primary group-hover:text-accent transition-colors">
                      {property.cluster.name}
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-1 uppercase tracking-widest">
                      Pengembang: {property.cluster.developer}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RELATED PROPERTIES (Gaya Card Tanpa Border) ── */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-24 pt-16 border-t border-text-primary/20">
            <h2 className="font-display text-4xl text-text-primary mb-12">
              Portofolio <span className="italic text-accent">Serupa.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
              {related.map((p) => {
                const img =
                  p.images?.find((i) => i.is_primary) ?? p.images?.[0];
                return (
                  <Link
                    key={p.id}
                    href={`/listings/${p.slug}`}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-surface">
                      {img && (
                        <Image
                          src={img.url}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display font-medium text-text-primary text-xl leading-snug group-hover:text-accent transition-colors">
                          {p.title}
                        </h3>
                        <p className="font-body text-[15px] font-medium text-text-primary whitespace-nowrap">
                          {p.price_label ?? formatPrice(p.price)}
                        </p>
                      </div>
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                        {p.location?.district}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-bg-page border-t border-text-primary/20 p-5 lg:hidden flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mb-1">
            Nilai Investasi
          </p>
          <p className="font-display text-xl text-text-primary leading-none">
            {property.price_label ?? formatPrice(property.price)}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-text-primary text-bg-page text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
        >
          Hubungi Kami
        </a>
      </div>

      <PropertyJsonLd property={property} />
    </>
  );
}
