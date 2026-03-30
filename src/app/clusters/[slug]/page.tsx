import { supabase } from "@/lib/supabase";
import { Property, Cluster } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

async function getCluster(slug: string) {
  const { data } = await supabase
    .from("clusters")
    .select("*, images:cluster_images(*)")
    .eq("slug", slug)
    .single();
  return data as Cluster | null;
}

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
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cluster = await getCluster(slug);
  if (!cluster) return { title: "Cluster Tidak Ditemukan" };
  return {
    title: `${cluster.name} | Rumah Andalan`,
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

  const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya tertarik dengan cluster *${cluster.name}*. Boleh info lebih lanjut?`)}`;

  return (
    <div className="bg-[#F7F7FB] min-h-screen">
      {/* Header */}
      <div className="relative bg-[#1E1E40] min-h-[300px] flex items-end">
        {coverImage && (
          <Image
            src={coverImage.image_url}
            alt={cluster.name}
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E40] to-transparent" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-10 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[13px] text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/listings"
              className="hover:text-white transition-colors"
            >
              Properti
            </Link>
            <span>/</span>
            <span className="text-white/80">{cluster.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              {cluster.is_promo && cluster.promo_label && (
                <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2E9AB8] text-white mb-3">
                  {cluster.promo_label}
                </span>
              )}
              <h1 className="font-serif text-white text-3xl md:text-4xl font-bold">
                {cluster.name}
              </h1>
              <p className="text-white/60 text-[14px] mt-1">
                by {cluster.developer}
              </p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[14px] transition-colors"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {/* Description */}
        {cluster.description && (
          <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6 mb-8">
            <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-3">
              Tentang Cluster
            </h2>
            <p className="text-[#3E3E58] text-[14px] leading-relaxed">
              {cluster.description}
            </p>
          </div>
        )}

        {/* Properties */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-[#141422] text-2xl font-bold">
              Properti di {cluster.name}
            </h2>
            <p className="text-[#8E8EA8] text-[14px]">
              {properties.length} properti
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => {
                const primaryImage =
                  property.images?.find((img) => img.is_primary) ??
                  property.images?.[0];
                const status =
                  statusConfig[property.status] ?? statusConfig["tersedia"];

                return (
                  <Link
                    key={property.id}
                    href={`/listings/${property.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#E4E4F0] hover:border-[#9D9BCF] hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-[#F7F7FB] overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url}
                          alt={property.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
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
                      <span
                        className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {property.is_promo &&
                        property.promo_labels &&
                        property.promo_labels.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {property.promo_labels.map(
                              (label: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#2E9AB8] text-white"
                                >
                                  {label}
                                </span>
                              ),
                            )}
                          </div>
                        )}

                      <div>
                        <h3 className="font-semibold text-[#141422] text-[15px] leading-snug line-clamp-2 group-hover:text-[#343270] transition-colors">
                          {property.title}
                        </h3>
                        {property.location && (
                          <p className="text-[13px] text-[#8E8EA8] mt-1">
                            📍 {property.location.district},{" "}
                            {property.location.city}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[12px] text-[#5A5A78] border-t border-[#F0F0F8] pt-3">
                        <span>🛏 {property.bedrooms} KT</span>
                        <span>🚿 {property.bathrooms} KM</span>
                        <span>📐 {property.building_area} m²</span>
                      </div>

                      <div className="mt-auto pt-1">
                        <p className="font-serif text-[18px] font-bold text-[#343270]">
                          {property.price_label ?? formatPrice(property.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-[#8E8EA8]">
              <p className="text-[15px] font-semibold mb-1">
                Belum ada properti di cluster ini.
              </p>
              <Link
                href="/listings"
                className="text-[#343270] font-semibold hover:text-[#2E9AB8] transition-colors"
              >
                Lihat semua properti →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
