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

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 max-w-3xl">
      {/* Tipe Properti */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#2E9AB8] transition-colors appearance-none"
      >
        {propertyTypes.map((t) => (
          <option key={t.value} value={t.value} className="text-[#141422]">
            {t.label}
          </option>
        ))}
      </select>

      {/* Lokasi */}
      <select
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#2E9AB8] transition-colors appearance-none"
      >
        <option value="" className="text-[#141422]">
          Semua Lokasi
        </option>
        {districts.map((d) => (
          <option key={d} value={d} className="text-[#141422]">
            {d}
          </option>
        ))}
      </select>

      {/* Max Harga */}
      <select
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#2E9AB8] transition-colors appearance-none"
      >
        <option value="" className="text-[#141422]">
          Semua Harga
        </option>
        <option value="300000000" className="text-[#141422]">
          Maks. 300 Jt
        </option>
        <option value="500000000" className="text-[#141422]">
          Maks. 500 Jt
        </option>
        <option value="750000000" className="text-[#141422]">
          Maks. 750 Jt
        </option>
        <option value="1000000000" className="text-[#141422]">
          Maks. 1 M
        </option>
        <option value="2000000000" className="text-[#141422]">
          Maks. 2 M
        </option>
      </select>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="px-6 py-3 bg-[#2E9AB8] hover:bg-[#2589a4] text-white font-semibold rounded-xl text-[14px] transition-colors flex items-center justify-center gap-2 shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Cari
      </button>
    </div>
  );
}
