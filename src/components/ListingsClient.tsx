"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Property, Location, Cluster } from "@/types";

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} M`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

// ─── Property Card (Editorial Style) ──────────────────────────────────────────
function PropertyCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
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
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-bg-surface to-border-light">
            <svg
              className="w-10 h-10 text-text-primary/10 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-text-primary/30 text-[10px] uppercase tracking-[0.3em] font-bold">
              Rumah Andalan
            </span>
          </div>
        )}
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

// ─── Main Component ────────────────────────────────────────────────────────────
type Props = {
  properties: Property[];
  locations: Location[];
  clusters: Cluster[];
};
type SortKey = "terbaru" | "termurah" | "termahal" | "az" | "za";

export default function ListingsClient({
  properties,
  locations,
  clusters,
}: Props) {
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [district, setDistrict] = useState(searchParams.get("district") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [clusterId, setClusterId] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("terbaru");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (type || district || maxPrice) setShowFilter(true);
  }, [type, district, maxPrice]);

  const filtered = useMemo(() => {
    let result = [...properties];
    if (type) result = result.filter((p) => p.type === type);
    if (district)
      result = result.filter((p) => p.location?.district === district);
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
    if (clusterId) result = result.filter((p) => p.cluster_id === clusterId);
    if (bedrooms)
      result = result.filter((p) =>
        bedrooms === "4" ? p.bedrooms >= 4 : p.bedrooms === Number(bedrooms),
      );
    if (status) result = result.filter((p) => p.status === status);

    switch (sortBy) {
      case "termurah":
        result.sort((a, b) => a.price - b.price);
        break;
      case "termahal":
        result.sort((a, b) => b.price - a.price);
        break;
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }
    return result;
  }, [
    properties,
    type,
    district,
    maxPrice,
    clusterId,
    bedrooms,
    status,
    sortBy,
  ]);

  function resetFilters() {
    setType("");
    setDistrict("");
    setMaxPrice("");
    setClusterId("");
    setBedrooms("");
    setStatus("");
    setSortBy("terbaru");
  }

  const selectClass =
    "w-full border-b border-border-dark bg-transparent py-2 text-[13px] font-medium text-text-primary focus:outline-none focus:border-accent appearance-none rounded-none cursor-pointer";
  const labelClass =
    "text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 block";

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 min-h-screen bg-bg-page">
      <div data-aos="fade-down" className="mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-4">
          Katalog
        </p>
        <h1 className="font-display text-5xl lg:text-6xl text-text-primary mb-4">
          Galeri <span className="italic text-accent">Properti.</span>
        </h1>
      </div>

      {/* Toolbar */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 border-b border-border-dark pb-6"
      >
        <p className="text-text-secondary text-[14px]">
          Menampilkan {filtered.length} kurasi properti
        </p>

        <div className="flex items-center gap-6 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-transparent border-none text-[12px] font-bold uppercase tracking-widest text-text-primary cursor-pointer focus:outline-none"
          >
            <option value="terbaru">Urutan: Terbaru</option>
            <option value="termurah">Urutan: Termurah</option>
            <option value="termahal">Urutan: Termahal</option>
          </select>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="text-[12px] font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors"
          >
            {showFilter ? "Tutup Filter" : "Buka Filter"}
          </button>
        </div>
      </div>

      {showFilter && (
        <div
          data-aos="fade-down"
          className="mb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10"
        >
          <div>
            <label className={labelClass}>Tipe</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
            >
              <option value="">Semua</option>
              <option value="rumah">Rumah</option>
              <option value="apartemen">Apartemen</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Lokasi</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={selectClass}
            >
              <option value="">Semua</option>
              {locations.map((l) => (
                <option key={l.id} value={l.district}>
                  {l.district}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Maks Harga</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={selectClass}
            >
              <option value="">Semua Harga</option>
              <option value="500000000">Maks Rp 500 Juta</option>
              <option value="1000000000">Maks Rp 1 Miliar</option>
              <option value="2000000000">Maks Rp 2 Miliar</option>
              <option value="3000000000">Maks Rp 3 Miliar</option>
              <option value="5000000000">Maks Rp 5 Miliar</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Kamar Tidur</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className={selectClass}
            >
              <option value="">Semua</option>
              <option value="1">1 KT</option>
              <option value="2">2 KT</option>
              <option value="3">3 KT</option>
              <option value="4">4+ KT</option>
            </select>
          </div>

          <div className="col-span-full flex justify-end">
            <button
              onClick={resetFilters}
              className="text-[10px] text-text-muted hover:text-text-primary font-bold uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-text-primary pb-1"
            >
              Reset Kriteria
            </button>
          </div>
        </div>
      )}

      {/* Grid Properti */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filtered.map((property, index) => (
            <div
              key={property.id}
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-32 px-5 text-center bg-bg-surface border border-text-primary/10"
          data-aos="fade-in"
        >
          <svg
            className="w-16 h-16 text-text-primary/20 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth={1}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
            Koleksi <span className="italic text-accent">Belum Tersedia.</span>
          </h3>
          <p className="text-text-secondary font-body max-w-md mx-auto mb-8">
            Kami belum menemukan properti yang sesuai dengan kriteria spesifik
            Anda. Coba sesuaikan filter pencarian atau jelajahi seluruh koleksi
            kami.
          </p>
          <button
            onClick={resetFilters}
            className="px-8 py-4 bg-text-primary text-bg-page text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors"
          >
            Tampilkan Semua Properti
          </button>
        </div>
      )}
    </div>
  );
}
