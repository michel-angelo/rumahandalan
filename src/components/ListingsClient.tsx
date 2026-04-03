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
            className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 ${isSold ? "grayscale opacity-70" : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-border-light">
            <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold">
              Tak Ada Gambar
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

      {/* Filter Panel (Sleek, No Box Shadows) */}
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
              <option value="">Semua</option>
              <option value="500000000">500 Juta</option>
              <option value="1000000000">1 Miliar</option>
              <option value="3000000000">3 Miliar</option>
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
        <div className="text-center py-32" data-aos="fade-in">
          <p className="font-display text-3xl text-text-muted mb-4 italic">
            Pencarian tidak membuahkan hasil.
          </p>
          <button
            onClick={resetFilters}
            className="text-[12px] font-bold uppercase tracking-widest text-text-primary border-b border-text-primary pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Kembali ke Semua Koleksi
          </button>
        </div>
      )}
    </div>
  );
}
