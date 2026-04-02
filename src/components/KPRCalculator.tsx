"use client";

import { useState } from "react";

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function KPRCalculator({ price }: { price: number }) {
  const [dpPercent, setDpPercent] = useState(20);
  const [tenor, setTenor] = useState(15);
  const annualInterestRate = 7; // Asumsi bunga 7% per tahun

  // Rumus KPR
  const dpAmount = (price * dpPercent) / 100;
  const principal = price - dpAmount;
  const monthlyInterest = annualInterestRate / 100 / 12;
  const totalMonths = tenor * 12;

  const monthlyInstallment =
    (principal * monthlyInterest * Math.pow(1 + monthlyInterest, totalMonths)) /
    (Math.pow(1 + monthlyInterest, totalMonths) - 1);

  return (
    <div className="bg-white border-2 border-[#1E1E40] p-6 shadow-[8px_8px_0px_#1E1E40]">
      <h3 className="font-serif text-[#1E1E40] text-[20px] font-black uppercase mb-6 flex items-center gap-3">
        <svg
          className="w-6 h-6 text-[#2E9AB8]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Estimasi Cicilan KPR
      </h3>

      <div className="flex flex-col gap-5">
        {/* Slider DP */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[11px] font-black text-[#8E8EA8] uppercase tracking-widest">
              Uang Muka (DP)
            </label>
            <span className="text-[13px] font-bold text-[#1E1E40]">
              {dpPercent}% ({formatCurrency(dpAmount)})
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={dpPercent}
            onChange={(e) => setDpPercent(Number(e.target.value))}
            className="w-full h-2 bg-[#E4E4F0] appearance-none cursor-pointer accent-[#2E9AB8]"
          />
        </div>

        {/* Slider Tenor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[11px] font-black text-[#8E8EA8] uppercase tracking-widest">
              Tenor Pinjaman
            </label>
            <span className="text-[13px] font-bold text-[#1E1E40]">
              {tenor} Tahun
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="5"
            value={tenor}
            onChange={(e) => setTenor(Number(e.target.value))}
            className="w-full h-2 bg-[#E4E4F0] appearance-none cursor-pointer accent-[#2E9AB8]"
          />
        </div>

        <div className="border-t-2 border-dashed border-[#E4E4F0] pt-5 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-[10px] text-[#2E9AB8] font-black uppercase tracking-widest mb-1">
              Perkiraan Cicilan
            </p>
            <p className="text-[10px] text-[#8E8EA8] font-semibold">
              *Asumsi Bunga {annualInterestRate}%
            </p>
          </div>
          <p className="font-serif text-[24px] font-black text-[#1E1E40]">
            {formatCurrency(Math.round(monthlyInstallment))}{" "}
            <span className="text-[12px] text-[#8E8EA8] font-sans font-bold">
              / bln
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
