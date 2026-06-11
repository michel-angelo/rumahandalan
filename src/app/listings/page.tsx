import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Properti Depok | Pilihan Rumah Siap Huni",
  description:
    "Jelajahi koleksi rumah pilihan di lokasi strategis Depok. Semua properti sudah melewati tahap verifikasi dan kurasi ketat tim kami.",
  openGraph: {
    title: "Cari Rumah Pilihan Anda di Depok",
    description:
      "Lihat daftar rumah terbaik yang tersedia saat ini. Cek harga, lokasi, dan detail legalitas secara transparan.",
    url: "https://rumahandalan.com/listings",
    images: [{ url: "/og-listings.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} Miliar`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Juta`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    district?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  // Tangkap parameter dari URL
  const resolvedParams = await searchParams;
  const { type, district, maxPrice, page } = resolvedParams;

  const currentPage = Number(page) || 1;
  const pageSize = 12; // Menampilkan 12 properti per halaman
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // Siapkan Query Dasar
  let query = supabase
    .from("properties")
    .select("*, location:locations!inner(*), images:property_images(*)", { count: 'exact' })
    .order("created_at", { ascending: false });

  // 1. Filter Tipe Properti
  if (type) query = query.eq("type", type);

  // 2. Filter Kawasan
  if (district) query = query.eq("locations.district", district);

  // 3. Filter Harga Maksimal
  if (maxPrice) query = query.lte("price", Number(maxPrice));

  // 4. Pagination Range
  query = query.range(from, to);

  const { data: properties, count, error } = await query;

  if (error) {
    console.error("Supabase Error (ListingsPage):", error.message);
  }

  const filteredProperties = (properties ?? []) as Property[];
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Helper for generating pagination links
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (district) params.set("district", district);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", pageNumber.toString());
    return `/listings?${params.toString()}`;
  };

  return (
    <div className="bg-bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              Koleksi Properti
            </p>
            <h1 className="font-display text-text-primary text-4xl lg:text-5xl">
              Kurasi <span className="italic text-accent">Hunian.</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-text-secondary font-medium tracking-wide">
              Menemukan {totalCount} properti{" "}
              {district ? `di ${district}` : "tersedia"}
            </p>
            {totalPages > 1 && (
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
                Halaman {currentPage} dari {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* ── DAFTAR PROPERTI ── */}
        {filteredProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProperties.map((property) => {
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
                          className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 ${
                            isSold ? "grayscale opacity-70" : ""
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}

                      {/* Label Status */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] backdrop-blur-md ${
                            isSold
                              ? "bg-text-primary text-white"
                              : "bg-bg-page/90 text-text-primary"
                          }`}
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

            {/* ── PAGINATION UI ── */}
            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                {currentPage > 1 && (
                  <Link
                    href={createPageUrl(currentPage - 1)}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary hover:bg-white/10 transition-colors"
                  >
                    Sebelumnya
                  </Link>
                )}
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = pageNum === currentPage;
                    
                    // Show only first, last, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Link
                          key={pageNum}
                          href={createPageUrl(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center text-[11px] font-bold transition-colors ${
                            isCurrent
                              ? "bg-text-primary text-bg-page"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    }
                    
                    if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNum} className="text-text-muted text-[10px]">...</span>;
                    }
                    
                    return null;
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={createPageUrl(currentPage + 1)}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary hover:bg-white/10 transition-colors"
                  >
                    Selanjutnya
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 border-t border-text-primary/20">
            <p className="font-display text-2xl text-text-muted mb-4 italic">
              Tidak ada properti yang sesuai dengan kriteria pencarian Anda.
            </p>
            <Link
              href="/listings"
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-primary border-b border-text-primary pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              Reset Pencarian
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
