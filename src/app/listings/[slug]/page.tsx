import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import PropertyJsonLd from "@/components/PropertyJsonLd";
import PropertyGallery from "@/components/PropertyGallery";
import Image from "next/image";

async function getProperty(slug: string) {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, cluster:clusters(*), location:locations(*), images:property_images(*)",
    )
    .eq("slug", slug)
    .single();

  if (error) console.error("Error fetching property:", error);
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
    label: "TERSEDIA",
    className: "bg-[#2E9AB8] text-white border border-[#1E1E40]",
  },
  inden: {
    label: "INDEN",
    className: "bg-[#1E1E40] text-white border border-[#343270]",
  },
  terjual: {
    label: "TERJUAL",
    className: "bg-red-600 text-white border border-[#1E1E40]",
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
  const rawImages = property.images ?? [];
  const primaryImg = rawImages.find((img) => img.is_primary);
  const otherImgs = rawImages.filter((img) => !img.is_primary);
  const allImages = primaryImg ? [primaryImg, ...otherImgs] : otherImgs;

  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan properti *${property.title}* yang saya lihat di website Rumah Andalan. Boleh info lebih lanjut?`,
  );
  const waLink = `https://wa.me/${property.whatsapp_number}?text=${waMessage}`;

  return (
    <>
      {/* Tambah pb-32 biar konten nggak ketutup sticky bar di mobile */}
      <div className="bg-[#F7F7FB] min-h-screen pb-32 lg:pb-24">
        {/* ── BREADCRUMB ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 pb-6 border-b-2 border-[#1E1E40]">
          <div className="flex items-center gap-3 text-[11px] font-black text-[#1E1E40] uppercase tracking-widest">
            <Link href="/" className="hover:text-[#2E9AB8] transition-colors">
              Beranda
            </Link>
            <span className="text-[#2E9AB8]">/</span>
            <Link
              href="/listings"
              className="hover:text-[#2E9AB8] transition-colors"
            >
              Koleksi Properti
            </Link>
            <span className="text-[#2E9AB8]">/</span>
            <span className="text-[#8E8EA8] line-clamp-1 border-b border-[#8E8EA8]">
              {property.title}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div data-aos="fade-down">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className={`text-[10px] font-black px-3 py-1.5 uppercase tracking-widest ${status.className}`}
                >
                  {status.label}
                </span>
                {property.is_featured && (
                  <span className="text-[10px] font-black px-3 py-1.5 bg-[#EEEDF8] text-[#1E1E40] border border-[#1E1E40] uppercase tracking-widest">
                    Unggulan
                  </span>
                )}
              </div>
              <h1 className="font-serif text-[#1E1E40] text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] mb-4">
                {property.title}
              </h1>
              {property.location && (
                <p className="text-[#2E9AB8] text-[13px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#1E1E40] flex items-center justify-center text-white p-0.5">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </span>
                  {property.location.district}, {property.location.city}
                </p>
              )}
            </div>

            <div data-aos="fade-up">
              <PropertyGallery images={allImages} />
            </div>

            {/* ── HIGHLIGHT NILAI JUAL (VALUE PROPOSITION) ── */}
            <div data-aos="fade-up" className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.certificate && (
                  <div className="p-4 border-l-4 border-[#2E9AB8] bg-white shadow-sm flex flex-col gap-1">
                    <span className="text-[#1E1E40] font-black uppercase text-[13px] tracking-wider">
                      Legalitas Terjamin
                    </span>
                    <span className="text-[#8E8EA8] text-[12px] font-medium">
                      Sertifikat berstatus {property.certificate.toUpperCase()}{" "}
                      yang aman untuk investasi.
                    </span>
                  </div>
                )}
                {property.is_kpr && (
                  <div className="p-4 border-l-4 border-[#1E1E40] bg-white shadow-sm flex flex-col gap-1">
                    <span className="text-[#1E1E40] font-black uppercase text-[13px] tracking-wider">
                      Kemudahan Pembiayaan
                    </span>
                    <span className="text-[#8E8EA8] text-[12px] font-medium">
                      Tersedia opsi pembayaran KPR dengan berbagai bank pilihan.
                    </span>
                  </div>
                )}
                {property.condition === "baru" && (
                  <div className="p-4 border-l-4 border-[#2E9AB8] bg-white shadow-sm flex flex-col gap-1">
                    <span className="text-[#1E1E40] font-black uppercase text-[13px] tracking-wider">
                      Kondisi Bangunan Baru
                    </span>
                    <span className="text-[#8E8EA8] text-[12px] font-medium">
                      Hunian gres yang siap huni tanpa perlu renovasi tambahan.
                    </span>
                  </div>
                )}
                {property.location && (
                  <div className="p-4 border-l-4 border-[#1E1E40] bg-white shadow-sm flex flex-col gap-1">
                    <span className="text-[#1E1E40] font-black uppercase text-[13px] tracking-wider">
                      Kawasan Strategis
                    </span>
                    <span className="text-[#8E8EA8] text-[12px] font-medium">
                      Berlokasi di {property.location.district}, area yang terus
                      berkembang.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              data-aos="fade-up"
              className="mt-6 border-t-4 border-[#1E1E40] pt-8"
            >
              <h2 className="font-serif text-[#1E1E40] text-3xl font-black uppercase mb-8 flex items-center gap-4">
                Spesifikasi <span className="h-0.5 flex-1 bg-[#1E1E40]"></span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 border-l border-t border-[#1E1E40]">
                {[
                  {
                    label: "Tipe",
                    value: property.type === "rumah" ? "RUMAH" : "APARTEMEN",
                  },
                  {
                    label: "Kondisi",
                    value: property.condition === "baru" ? "BARU" : "SECOND",
                  },
                  {
                    label: "Sertifikat",
                    value: property.certificate?.toUpperCase(),
                  },
                  { label: "L. Tanah", value: `${property.land_area} M²` },
                  {
                    label: "L. Bangunan",
                    value: `${property.building_area} M²`,
                  },
                  { label: "Lantai", value: property.floors },
                  { label: "K. Tidur", value: property.bedrooms },
                  { label: "K. Mandi", value: property.bathrooms },
                  {
                    label: "Cluster",
                    value: property.cluster?.name ?? "NON-CLUSTER",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="p-4 border-r border-b border-[#1E1E40] bg-white"
                  >
                    <p className="text-[10px] text-[#2E9AB8] font-black uppercase tracking-[0.2em] mb-1">
                      {label}
                    </p>
                    <p className="text-[16px] text-[#1E1E40] font-bold uppercase tracking-wider line-clamp-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FASILITAS & AKSES (EDITORIAL STYLE) ── */}
            {property.facilities && property.facilities.length > 0 && (
              <div
                data-aos="fade-up"
                className="mt-4 border-t-4 border-[#1E1E40] pt-8"
              >
                <h2 className="font-serif text-[#1E1E40] text-3xl font-black uppercase mb-6 flex items-center gap-4">
                  Akses &{" "}
                  <span className="text-[#2E9AB8] italic">Fasilitas</span>
                  <span className="h-0.5 flex-1 bg-[#1E1E40]"></span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-white border-2 border-[#1E1E40] shadow-[4px_4px_0px_#1E1E40] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2E9AB8] transition-all"
                    >
                      {/* Icon Arrow Tajam */}
                      <span className="text-[#2E9AB8] mt-0.5">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L10.59 3.41 18.17 11H2v2h16.17l-7.59 7.59L12 22l10-10L12 2z" />
                        </svg>
                      </span>
                      <p className="text-[#1E1E40] font-black text-[14px] uppercase tracking-wider leading-snug">
                        {facility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.description && (
              <div
                data-aos="fade-up"
                className="mt-4 border-t-4 border-[#1E1E40] pt-8"
              >
                <h2 className="font-serif text-[#1E1E40] text-3xl font-black uppercase mb-6 flex items-center gap-4">
                  Deskripsi <span className="h-0.5 flex-1 bg-[#1E1E40]"></span>
                </h2>
                <div className="bg-white border-2 border-[#1E1E40] p-8 shadow-[8px_8px_0px_#1E1E40]">
                  <p className="text-[#1E1E40] text-[15px] leading-[1.8] whitespace-pre-line font-medium">
                    {property.description}
                  </p>
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div
                data-aos="fade-up"
                className="mt-10 border-t-4 border-[#1E1E40] pt-8"
              >
                <h2 className="font-serif text-[#1E1E40] text-3xl font-black uppercase mb-8">
                  Properti <span className="text-[#2E9AB8] italic">Serupa</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {related.map((p) => {
                    const img =
                      p.images?.find((i) => i.is_primary) ?? p.images?.[0];
                    return (
                      <Link
                        key={p.id}
                        href={`/listings/${p.slug}`}
                        className="group bg-white border border-[#1E1E40] hover:shadow-[6px_6px_0px_#1E1E40] hover:-translate-y-1 transition-all flex flex-col"
                      >
                        <div className="relative aspect-[4/3] border-b border-[#1E1E40] bg-[#1E1E40]">
                          {img && (
                            <Image
                              src={img.url}
                              alt={p.title}
                              fill
                              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                              sizes="33vw"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-[9px] text-[#2E9AB8] font-black uppercase tracking-[0.2em] mb-1">
                            {p.location?.district}
                          </p>
                          <h3 className="font-serif text-[16px] font-black text-[#1E1E40] line-clamp-2 uppercase leading-snug">
                            {p.title}
                          </h3>
                          <p className="text-[16px] font-black text-[#1E1E40] mt-3 border-t border-[#1E1E40] pt-2">
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

          {/* ── RIGHT COLUMN (STICKY CTA - ELEGAN & KAKU) ── */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-8">
              {/* Card Harga Baru yang Clean */}
              <div
                data-aos="fade-left"
                className="bg-white border-2 border-[#1E1E40] p-8 shadow-[8px_8px_0px_#1E1E40]"
              >
                <h3 className="text-[#1E1E40] font-black uppercase tracking-[0.3em] text-[12px] border-b-2 border-[#1E1E40] pb-3 mb-6">
                  Investasi Properti
                </h3>

                <p className="font-serif text-[38px] xl:text-[46px] font-black text-[#1E1E40] leading-none mb-2">
                  {property.price_label ?? formatPrice(property.price)}
                </p>
                {property.price_per_month && (
                  <p className="text-[#8E8EA8] font-bold text-[13px] uppercase tracking-wider mb-6">
                    Estimasi Mulai{" "}
                    <span className="text-[#2E9AB8]">
                      {formatPrice(property.price_per_month)}
                    </span>{" "}
                    / Bln
                  </p>
                )}

                <div className="flex flex-col gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#1E1E40] border border-[#1E1E40] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#2E9AB8] hover:border-[#2E9AB8] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    Tanya via WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-4 border border-[#1E1E40] bg-transparent text-[#1E1E40] font-black text-[12px] uppercase tracking-widest hover:bg-[#EEEDF8] transition-colors"
                  >
                    Jadwalkan Survey
                  </Link>
                </div>
              </div>

              {property.cluster && (
                <div
                  data-aos="fade-left"
                  data-aos-delay="200"
                  className="bg-[#EEEDF8] border border-[#1E1E40] p-6 shadow-[8px_8px_0px_#1E1E40]"
                >
                  <p className="text-[10px] text-[#2E9AB8] uppercase tracking-[0.3em] font-black mb-2">
                    Cluster Info
                  </p>
                  <h3 className="font-serif text-[#1E1E40] text-[20px] font-black uppercase">
                    {property.cluster.name}
                  </h3>
                  <p className="text-[12px] font-bold text-[#1E1E40] mt-1 border-b border-[#1E1E40] inline-block pb-1 uppercase tracking-wider">
                    Dev: {property.cluster.developer}
                  </p>
                  {property.cluster.is_promo &&
                    property.cluster.promo_label && (
                      <span className="block mt-4 text-[10px] font-black px-3 py-1.5 bg-[#1E1E40] text-white text-center uppercase tracking-widest">
                        {property.cluster.promo_label}
                      </span>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR KHUSUS MOBILE ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t-2 border-[#1E1E40] px-5 py-4 lg:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] text-[#8E8EA8] font-black uppercase tracking-widest mb-0.5">
            Investasi
          </p>
          <p className="font-serif text-[18px] sm:text-[22px] font-black text-[#1E1E40] leading-none line-clamp-1">
            {property.price_label ?? formatPrice(property.price)}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#1E1E40] text-white font-black text-[11px] sm:text-[12px] uppercase tracking-widest active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
          Tanya WA
        </a>
      </div>

      <PropertyJsonLd property={property} />
    </>
  );
}
