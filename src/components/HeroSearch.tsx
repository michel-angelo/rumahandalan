"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const districts = [
  "Beji",
  "Bojongsari",
  "Cimanggis",
  "Cinere",
  "Cipayung",
  "Cilodong",
  "Limo",
  "Pancoran Mas",
  "Sawangan",
  "Sukmajaya",
  "Tapos",
];

const propertyTypes = [
  { value: "", label: "Semua Tipe" },
  { value: "rumah", label: "Rumah" },
  { value: "apartemen", label: "Apartemen" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [district, setDistrict] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (district) params.set("district", district);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/listings?${params.toString()}`);
  }

  // Desain Editorial: Tanpa border di select, mengandalkan border parent
  const selectClass =
    "w-full bg-transparent border-none py-2 text-xl font-display text-text-primary focus:outline-none appearance-none cursor-pointer";

  // Tipografi untuk label mikro
  const labelClass =
    "text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-1 block";

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row border-t border-b border-text-primary/20 divide-y lg:divide-y-0 lg:divide-x divide-text-primary/20">
        {/* Input: Tipe */}
        <div className="flex-1 py-4 lg:py-6 lg:pr-6">
          <label className={labelClass}>Tipe Properti</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Input: Lokasi */}
        <div className="flex-1 py-4 lg:py-6 lg:px-6">
          <label className={labelClass}>Kawasan</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={selectClass}
          >
            <option value="">Seluruh Depok</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Input: Harga */}
        <div className="flex-1 py-4 lg:py-6 lg:px-6">
          <label className={labelClass}>Anggaran Maksimal</label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={selectClass}
          >
            <option value="">Tanpa Batasan</option>
            <option value="500000000">Rp 500 Juta</option>
            <option value="1000000000">Rp 1 Miliar</option>
            <option value="2000000000">Rp 2 Miliar</option>
            <option value="5000000000">Rp 5 Miliar</option>
          </select>
        </div>
      </div>

      {/* Tombol CTA (Tegas, Tajam, Lebar Penuh) */}
      <button
        onClick={handleSearch}
        className="w-full mt-6 bg-text-primary hover:bg-accent text-bg-page py-5 px-8 font-bold text-[11px] uppercase tracking-[0.3em] transition-colors duration-300"
      >
        Tampilkan Properti
      </button>
    </div>
  );
}
