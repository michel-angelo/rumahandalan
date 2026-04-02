"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Property, Location, Cluster } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  if (price >= 1_000_000_000)
    return `Rp ${(price / 1_000_000_000).toFixed(price % 1_000_000_000 === 0 ? 0 : 1)} M`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${price.toLocaleString("id-ID")}`;
}

// ─── Property Card (Sama Persis Kayak di Beranda) ─────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const primaryImage =
    property.images?.find((img) => img.is_primary) ?? property.images?.[0];
  const isSold = property.status === "terjual" || property.status === "booked";

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group bg-white rounded-none border border-[#343270] hover:shadow-[8px_8px_0px_#1E1E40] hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
    >
      <div className="relative aspect-[4/3] bg-[#F7F7FB] overflow-hidden border-b border-[#343270]">
        {primaryImage ? (
          <Image
            src={primaryImage.url} // <-- Sudah diperbaiki pakai .url
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isSold ? "grayscale contrast-125 opacity-80" : ""
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E40]">
            <span className="text-[#2E9AB8] text-[10px] uppercase tracking-widest font-bold">
              NO IMAGE
            </span>
          </div>
        )}

        <span
          className={`absolute top-0 left-0 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border-r border-b border-[#343270] ${
            isSold ? "bg-[#1E1E40] text-white" : "bg-[#2E9AB8] text-white"
          }`}
        >
          {property.status}
        </span>

        {property.is_featured && (
          <span className="absolute top-0 right-0 text-[10px] font-bold px-3 py-1.5 bg-[#EEEDF8] text-[#1E1E40] uppercase tracking-widest border-l border-b border-[#343270]">
            Unggulan
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1 bg-white">
        <div>
          {property.location && (
            <p className="text-[#2E9AB8] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#2E9AB8] rounded-none"></span>
              {property.location.district}, {property.location.city}
            </p>
          )}
          <h3 className="font-serif font-bold text-[#1E1E40] text-[20px] leading-snug line-clamp-2 group-hover:text-[#2E9AB8] transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-[#1E1E40] border-t border-b border-[#343270] py-2.5 uppercase tracking-widest">
          <span>{property.bedrooms} KT</span>
          <span className="w-px h-4 bg-[#343270]"></span>
          <span>{property.bathrooms} KM</span>
          <span className="w-px h-4 bg-[#343270]"></span>
          <span>{property.building_area} M²</span>
        </div>

        <div className="mt-auto pt-2">
          <p className="font-serif text-[24px] font-black text-[#1E1E40]">
            {property.price_label ?? formatPrice(property.price)}
          </p>
          {(property.is_kpr ||
            property.is_cash_keras ||
            property.is_subsidi) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {property.is_kpr && (
                <span className="text-[9px] font-bold px-2 py-1 border border-[#343270] text-[#1E1E40] uppercase tracking-widest">
                  KPR
                </span>
              )}
              {property.is_cash_keras && (
                <span className="text-[9px] font-bold px-2 py-1 bg-[#1E1E40] text-white uppercase tracking-widest">
                  CASH KERAS
                </span>
              )}
              {property.is_subsidi && (
                <span className="text-[9px] font-bold px-2 py-1 bg-[#2E9AB8] text-white uppercase tracking-widest">
                  SUBSIDI
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

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
  const [bathrooms, setBathrooms] = useState("");
  const [floors, setFloors] = useState("");
  const [status, setStatus] = useState("");
  const [certificate, setCertificate] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("terbaru");
  const [showFilter, setShowFilter] = useState(false);

  // Munculkan filter otomatis kalau ada parameter dari Homepage
  useEffect(() => {
    if (type || district || maxPrice) {
      setShowFilter(true);
    }
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
    if (bathrooms)
      result = result.filter((p) =>
        bathrooms === "3"
          ? p.bathrooms >= 3
          : p.bathrooms === Number(bathrooms),
      );
    if (floors) result = result.filter((p) => p.floors === Number(floors));
    if (status) result = result.filter((p) => p.status === status);
    if (certificate)
      result = result.filter((p) => p.certificate === certificate);
    if (condition) result = result.filter((p) => p.condition === condition);

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
    bathrooms,
    floors,
    status,
    certificate,
    condition,
    sortBy,
  ]);

  function resetFilters() {
    setType("");
    setDistrict("");
    setMaxPrice("");
    setClusterId("");
    setBedrooms("");
    setBathrooms("");
    setFloors("");
    setStatus("");
    setCertificate("");
    setCondition("");
    setSortBy("terbaru");
  }

  const activeFilterCount = [
    type,
    district,
    maxPrice,
    clusterId,
    bedrooms,
    bathrooms,
    floors,
    status,
    certificate,
    condition,
  ].filter(Boolean).length;

  const selectClass =
    "w-full border-b border-[#343270] bg-transparent py-2 text-[12px] font-bold text-[#1E1E40] uppercase tracking-widest focus:outline-none focus:border-[#2E9AB8] appearance-none rounded-none cursor-pointer";
  const labelClass =
    "text-[10px] font-black text-[#2E9AB8] uppercase tracking-[0.2em] mb-1 block";

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 min-h-screen">
      {/* Editorial Heading untuk Halaman */}
      <div data-aos="fade-down" className="mb-10">
        <h1 className="font-serif text-[#1E1E40] text-4xl md:text-5xl font-black uppercase mb-4 border-l-4 border-[#2E9AB8] pl-5">
          Jelajahi <br />{" "}
          <span className="italic text-[#2E9AB8]">Properti</span>
        </h1>
      </div>

      {/* Toolbar (Kaku & Solid) */}
      <div
        data-aos="fade-up"
        className="flex items-center justify-between gap-4 mb-8 flex-wrap border-b-2 border-[#1E1E40] pb-4"
      >
        <p className="text-[#1E1E40] text-[12px] font-bold uppercase tracking-widest">
          Menampilkan{" "}
          <span className="text-[#2E9AB8] text-[18px]">{filtered.length}</span>{" "}
          properti
        </p>
        <div className="flex items-center gap-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="border border-[#1E1E40] rounded-none px-4 py-2 text-[11px] font-bold text-[#1E1E40] uppercase tracking-widest focus:outline-none bg-transparent cursor-pointer"
          >
            <option value="terbaru">TERBARU</option>
            <option value="termurah">TERMURAH</option>
            <option value="termahal">TERMAHAL</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-6 py-2 border rounded-none text-[11px] font-bold uppercase tracking-widest transition-all ${
              showFilter || activeFilterCount > 0
                ? "bg-[#1E1E40] text-white border-[#1E1E40] shadow-[4px_4px_0px_#2E9AB8]"
                : "bg-transparent text-[#1E1E40] border-[#1E1E40] hover:bg-[#1E1E40] hover:text-white"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            FILTER {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Filter Panel (Hard Shadow, Kaku) */}
      {showFilter && (
        <div
          data-aos="fade-down"
          className="bg-[#F7F7FB] border border-[#343270] p-6 sm:p-8 mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 shadow-[8px_8px_0px_#1E1E40] relative"
        >
          <div>
            <label className={labelClass}>Tipe</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              <option value="rumah">RUMAH</option>
              <option value="apartemen">APARTEMEN</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Kecamatan</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              {locations.map((l) => (
                <option key={l.id} value={l.district}>
                  {l.district.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Cluster</label>
            <select
              value={clusterId}
              onChange={(e) => setClusterId(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Maks. Harga</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              <option value="300000000">300 JUTA</option>
              <option value="500000000">500 JUTA</option>
              <option value="750000000">750 JUTA</option>
              <option value="1000000000">1 MILIAR</option>
              <option value="2000000000">2 MILIAR</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Kamar Tidur</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              <option value="1">1 KT</option>
              <option value="2">2 KT</option>
              <option value="3">3 KT</option>
              <option value="4">4+ KT</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Kamar Mandi</label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              <option value="1">1 KM</option>
              <option value="2">2 KM</option>
              <option value="3">3+ KM</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              <option value="">SEMUA</option>
              <option value="tersedia">TERSEDIA</option>
              <option value="inden">INDEN</option>
              <option value="terjual">TERJUAL</option>
            </select>
          </div>

          {/* Reset Button (Editorial Link Style) */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#1E1E40] border-b-2 border-[#1E1E40] hover:text-red-600 hover:border-red-600 transition-colors font-black uppercase tracking-widest pb-1"
            >
              HAPUS SEMUA FILTER
            </button>
          </div>
        </div>
      )}

      {/* Grid Properti */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property, index) => (
            <div
              key={property.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div
          data-aos="fade-in"
          className="text-center py-32 border border-[#343270] bg-[#EEEDF8] shadow-[8px_8px_0px_#1E1E40]"
        >
          <span className="text-[#1E1E40] text-6xl font-serif font-black block mb-4">
            ?
          </span>
          <p className="text-[18px] font-serif font-black text-[#1E1E40] uppercase tracking-widest mb-2">
            PROPERTI TIDAK DITEMUKAN
          </p>
          <p className="text-[12px] font-bold text-[#343270] uppercase tracking-[0.2em]">
            Coba ubah kriteria pencarian Anda
          </p>
          <button
            onClick={resetFilters}
            className="mt-8 px-8 py-3 rounded-none border border-[#1E1E40] bg-[#1E1E40] text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1E1E40] hover:shadow-[4px_4px_0px_#2E9AB8] transition-all"
          >
            RESET FILTER
          </button>
        </div>
      )}
    </div>
  );
}
