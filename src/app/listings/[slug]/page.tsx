import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PropertyJsonLd from "@/components/PropertyJsonLd";

async function getProperty(slug: string) {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, cluster:clusters(*), location:locations(*), images:property_images(*)",
    )
    .eq("slug", slug)
    .single();

  console.log("data:", data);
  console.log("error:", error);

  return data as Property | null;
}

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
  const property = await getProperty(slug);
  if (!property) return { title: "Properti Tidak Ditemukan" };
  return {
    title: `${property.title} | Rumah Andalan`,
    description: property.description,
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
  const images = property.images ?? [];
  const coverImage = images.find((img) => img.is_primary) ?? images[0];
  const otherImages = images.filter((img) => img.id !== coverImage?.id);

  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan properti *${property.title}* yang saya lihat di website Rumah Andalan. Boleh info lebih lanjut?`,
  );
  const waLink = `https://wa.me/${property.whatsapp_number}?text=${waMessage}`;

  return (
    <>
    <div className="bg-[#F7F7FB] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-[13px] text-[#8E8EA8]">
          <Link href="/" className="hover:text-[#343270] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/listings"
            className="hover:text-[#343270] transition-colors"
          >
            Properti
          </Link>
          <span>/</span>
          <span className="text-[#141422] font-medium line-clamp-1">
            {property.title}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            {coverImage ? (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#E4E4F0]">
                <Image
                  src={coverImage.image_url}
                  alt={property.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-2xl bg-[#E4E4F0] flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[#C8C8DC]"
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

            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.slice(0, 4).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#E4E4F0]"
                  >
                    <Image
                      src={img.image_url}
                      alt={property.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                  {property.is_featured && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#343270] text-white">
                      Unggulan
                    </span>
                  )}
                  {property.is_kpr && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EEEDF8] text-[#343270] border border-[#C8C7E8]">
                      KPR
                    </span>
                  )}
                  {property.is_subsidi && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Subsidi
                    </span>
                  )}
                  {property.is_promo &&
                    property.promo_labels &&
                    property.promo_labels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {property.promo_labels.map(
                          (label: string, i: number) => (
                            <span
                              key={i}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2E9AB8] text-white"
                            >
                              {label}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                </div>
                <h1 className="font-serif text-[#141422] text-2xl md:text-3xl font-bold leading-tight">
                  {property.title}
                </h1>
                {property.location && (
                  <p className="text-[#8E8EA8] text-[14px] mt-2 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 shrink-0"
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
                    {property.location.district}, {property.location.city},{" "}
                    {property.location.province}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-[#E4E4F0] p-5">
            <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-4">
              Spesifikasi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Tipe",
                  value: property.type === "rumah" ? "Rumah" : "Apartemen",
                },
                {
                  label: "Kondisi",
                  value: property.condition === "baru" ? "Baru" : "Second",
                },
                {
                  label: "Sertifikat",
                  value: property.certificate?.toUpperCase(),
                },
                { label: "Luas Tanah", value: `${property.land_area} m²` },
                {
                  label: "Luas Bangunan",
                  value: `${property.building_area} m²`,
                },
                { label: "Jumlah Lantai", value: property.floors },
                { label: "Kamar Tidur", value: property.bedrooms },
                { label: "Kamar Mandi", value: property.bathrooms },
                { label: "Cluster", value: property.cluster?.name ?? "-" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-[11px] text-[#8E8EA8] uppercase tracking-wide font-semibold">
                    {label}
                  </p>
                  <p className="text-[14px] text-[#141422] font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-2xl border border-[#E4E4F0] p-5">
              <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-3">
                Deskripsi
              </h2>
              <p className="text-[#3E3E58] text-[14px] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Related Properties */}
          {related.length > 0 && (
            <div>
              <h2 className="font-serif text-[#141422] text-[20px] font-bold mb-4">
                Properti Serupa
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((p) => {
                  const img =
                    p.images?.find((i) => i.is_primary) ?? p.images?.[0];
                  return (
                    <Link
                      key={p.id}
                      href={`/listings/${p.slug}`}
                      className="bg-white rounded-xl border border-[#E4E4F0] overflow-hidden hover:border-[#9D9BCF] hover:shadow-md transition-all group"
                    >
                      <div className="relative aspect-[4/3] bg-[#F7F7FB]">
                        {img && (
                          <Image
                            src={img.image_url}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="33vw"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-[13px] font-semibold text-[#141422] line-clamp-2">
                          {p.title}
                        </h3>
                        <p className="text-[12px] text-[#8E8EA8] mt-0.5">
                          {p.location?.district}
                        </p>
                        <p className="text-[14px] font-bold text-[#343270] mt-1">
                          {p.price_label ?? formatPrice(p.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN (Sticky) ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 flex flex-col gap-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl border border-[#E4E4F0] p-5">
              <p className="text-[12px] text-[#8E8EA8] uppercase tracking-wide font-semibold mb-1">
                Harga
              </p>
              <p className="font-serif text-[28px] font-bold text-[#343270]">
                {property.price_label ?? formatPrice(property.price)}
              </p>
              {property.price_per_month && (
                <p className="text-[13px] text-[#8E8EA8] mt-1">
                  mulai {formatPrice(property.price_per_month)}/bulan
                </p>
              )}

              <div className="h-px bg-[#F0F0F8] my-4" />

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[14px] transition-colors"
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
              </a>

              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E4E4F0] text-[#343270] font-semibold text-[14px] hover:border-[#343270] transition-colors mt-2"
              >
                Jadwalkan Survey
              </Link>
            </div>

            {/* Cluster Info */}
            {property.cluster && (
              <div className="bg-white rounded-2xl border border-[#E4E4F0] p-5">
                <p className="text-[12px] text-[#8E8EA8] uppercase tracking-wide font-semibold mb-2">
                  Cluster
                </p>
                <h3 className="font-serif text-[#141422] text-[16px] font-bold">
                  {property.cluster.name}
                </h3>
                <p className="text-[13px] text-[#8E8EA8] mt-0.5">
                  {property.cluster.developer}
                </p>
                {property.cluster.description && (
                  <p className="text-[13px] text-[#3E3E58] mt-2 leading-relaxed line-clamp-3">
                    {property.cluster.description}
                  </p>
                )}
                {property.cluster.is_promo && property.cluster.promo_label && (
                  <span className="inline-block mt-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2E9AB8] text-white">
                    {property.cluster.promo_label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <PropertyJsonLd property={property} />
    </>
  );
}
