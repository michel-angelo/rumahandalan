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
  { value: "", label: "SEMUA TIPE" },
  { value: "rumah", label: "RUMAH" },
  { value: "apartemen", label: "APARTEMEN" },
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

  // Class untuk input: kotak tegas, tanpa rounded, border tipis
  const selectClass =
    "flex-1 bg-transparent border-b sm:border-b-0 sm:border-r border-[#343270] px-4 py-4 text-white text-[12px] font-bold tracking-widest uppercase focus:outline-none focus:bg-[#343270]/20 appearance-none rounded-none cursor-pointer transition-colors";

  return (
    <div className="flex flex-col border border-[#343270] bg-[#1E1E40]">
      {/* Baris Atas */}
      <div className="flex flex-col sm:flex-row border-b border-[#343270]">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass}
        >
          {propertyTypes.map((t) => (
            <option
              key={t.value}
              value={t.value}
              className="bg-[#1E1E40] text-white"
            >
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-[#1E1E40] text-white">
            SEMUA LOKASI
          </option>
          {districts.map((d) => (
            <option key={d} value={d} className="bg-[#1E1E40] text-white">
              {d.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Baris Bawah */}
      <div className="flex flex-col sm:flex-row">
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-[#1E1E40] text-white">
            SEMUA HARGA
          </option>
          <option value="300000000" className="bg-[#1E1E40] text-white">
            MAKS. 300 JT
          </option>
          <option value="500000000" className="bg-[#1E1E40] text-white">
            MAKS. 500 JT
          </option>
          <option value="750000000" className="bg-[#1E1E40] text-white">
            MAKS. 750 JT
          </option>
          <option value="1000000000" className="bg-[#1E1E40] text-white">
            MAKS. 1 M
          </option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-[#2E9AB8] hover:bg-white text-white hover:text-[#1E1E40] px-8 py-4 font-bold text-[13px] uppercase tracking-[0.2em] transition-colors rounded-none w-full sm:w-auto flex-shrink-0"
        >
          CARI PROPERTI
        </button>
      </div>
    </div>
  );
}
