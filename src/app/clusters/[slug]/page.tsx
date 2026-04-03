import { supabase } from "@/lib/supabase";
import { Property, Cluster } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
import { SITE_CONFIG } from "@/lib/constants";

const getCluster = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("clusters")
    .select("*, images:cluster_images(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching cluster:", error);
  }
  return data as Cluster | null;
});

async function getClusterProperties(clusterId: string) {
  const { data } = await supabase
    .from("properties")
    .select("*, location:locations(*), images:property_images(*)")
    .eq("cluster_id", clusterId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Property[];
}

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} Miliar`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Juta`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cluster = await getCluster(slug);
  if (!cluster) return { title: "Cluster Tidak Ditemukan" };
  return {
    title: `Koleksi ${cluster.name} | Rumah Andalan`,
    description: cluster.description,
  };
}

export default async function ClusterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cluster = await getCluster(slug);
  if (!cluster) notFound();

  const properties = await getClusterProperties(cluster.id);
  const coverImage =
    cluster.images?.find((img) => img.is_primary) ?? cluster.images?.[0];

  const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Halo, saya ingin menjadwalkan kunjungan untuk melihat cluster *${cluster.name}*.`)}`;

  return (
    <div className="bg-bg-page min-h-screen pt-24 pb-32">
      {/* ── HEADER CLUSTER (EDITORIAL SPLIT) ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-20">
        <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-12">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link
            href="/clusters"
            className="hover:text-text-primary transition-colors"
          >
            Cluster
          </Link>
          <span>/</span>
          <span className="text-text-primary">{cluster.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end">
          <div className="lg:col-span-6 z-10">
            {cluster.is_promo && cluster.promo_label && (
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6 border-l border-accent pl-4">
                {cluster.promo_label}
              </p>
            )}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.05] mb-6">
              {cluster.name}
            </h1>
            <div className="flex flex-col gap-8 border-t border-text-primary/20 pt-8 mt-8">
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">
                  Pengembang
                </p>
                <p className="font-display text-2xl text-text-primary">
                  {cluster.developer}
                </p>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b border-text-primary pb-1 self-start text-[11px] font-bold uppercase tracking-[0.3em] text-text-primary hover:text-accent hover:border-accent transition-colors"
              >
                Jadwalkan Kunjungan Area
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] w-full bg-bg-surface overflow-hidden">
            {coverImage && (
              <Image
                src={coverImage.image_url}
                alt={cluster.name}
                fill
                className="object-cover grayscale-[10%]"
                priority
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ── DESKRIPSI CLUSTER ── */}
        {cluster.description && (
          <div className="max-w-3xl mb-24">
            <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-6">
              Naratif Lingkungan
            </h2>
            <p className="text-[16px] text-text-secondary leading-relaxed font-body">
              {cluster.description}
            </p>
          </div>
        )}

        {/* ── DAFTAR PROPERTI DI DALAM CLUSTER ── */}
        <div className="border-t border-text-primary/20 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="font-display text-4xl text-text-primary">
              Unit <span className="italic text-accent">Tersedia.</span>
            </h2>
            <p className="text-[12px] text-text-secondary font-medium tracking-wide">
              Menampilkan {properties.length} kurasi hunian
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {properties.map((property) => {
                const primaryImage =
                  property.images?.find((img) => img.is_primary) ??
                  property.images?.[0];
                const isSold =
                  property.status === "terjual" || property.status === "booked";

                return (
                  <Link
                    key={property.id}
                    href={`/listings/${property.slug}`}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-surface">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={property.title}
                          fill
                          className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 ${isSold ? "grayscale opacity-70" : ""}`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}

                      {/* Label Minimalis tanpa Box Warna Warni */}
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

                      {/* Typografi Spek tanpa Emoji */}
                      <div className="flex items-center gap-3 text-[11px] font-bold text-text-muted uppercase tracking-widest mt-1">
                        {property.location && (
                          <span>{property.location.district}</span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-border-dark"></span>
                        <span>{property.bedrooms} Bed</span>
                        <span className="w-1 h-1 rounded-full bg-border-dark"></span>
                        <span>{property.building_area} M²</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-text-muted mb-4 italic">
                Saat ini belum ada properti yang diunggah untuk cluster ini.
              </p>
              <Link
                href="/listings"
                className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-primary border-b border-text-primary pb-1 hover:text-accent hover:border-accent transition-colors"
              >
                Lihat Koleksi Lainnya
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
