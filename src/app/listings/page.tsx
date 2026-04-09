import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Koleksi Properti | Rumah Andalan",
  description: "Eksplorasi kurasi hunian premium dan eksklusif di Depok.",
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
  }>;
}) {
  // Tangkap parameter dari URL (hasil lemparan dari HeroSearch)
  const resolvedParams = await searchParams;
  const { type, district, maxPrice } = resolvedParams;

  // Siapkan Query Dasar
  // CATATAN PENTING: Pakai !inner pada locations agar kita bisa filter berdasarkan district
  let query = supabase
    .from("properties")
    .select("*, location:locations!inner(*), images:property_images(*)")
    .order("created_at", { ascending: false });

  // 1. Filter Tipe Properti (Rumah / Apartemen)
  if (type) {
    query = query.eq("type", type);
  }

  // 2. Filter Kawasan (District)
  if (district) {
    query = query.eq("locations.district", district);
  }

  // 3. Filter Harga Maksimal
  if (maxPrice) {
    query = query.lte("price", Number(maxPrice));
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Supabase Error (ListingsPage):", error.message);
  }

  const filteredProperties = (properties ?? []) as Property[];

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
          <p className="text-[12px] text-text-secondary font-medium tracking-wide">
            Menemukan {filteredProperties.length} properti{" "}
            {district ? `di ${district}` : "tersedia"}
          </p>
        </div>

        {/* ── DAFTAR PROPERTI ── */}
        {filteredProperties.length > 0 ? (
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
