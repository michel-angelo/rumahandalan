"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

type Props = {
  initialData?: any;
};

export default function LocationForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    district: initialData?.district ?? "",
    city: initialData?.city ?? "Depok",
    province: initialData?.province ?? "Jawa Barat",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error } = isEdit
      ? await supabase.from("locations").update(form).eq("id", initialData.id)
      : await supabase.from("locations").insert(form);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin/locations");
    router.refresh();
  }

  const inputClass =
    "w-full border border-[#E4E4F0] rounded-xl px-4 py-2.5 text-[14px] text-[#141422] focus:outline-none focus:border-[#343270] transition-colors";
  const labelClass = "text-[12px] font-semibold text-[#5A5A78] mb-1 block";

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Informasi Lokasi
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Kecamatan</label>
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              className={inputClass}
              placeholder="Beji"
            />
          </div>
          <div>
            <label className={labelClass}>Kota</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className={inputClass}
              placeholder="Depok"
            />
          </div>
          <div>
            <label className={labelClass}>Provinsi</label>
            <input
              name="province"
              value={form.province}
              onChange={handleChange}
              className={inputClass}
              placeholder="Jawa Barat"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-[14px] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-[#E4E4F0] rounded-xl text-[14px] font-semibold text-[#5A5A78] hover:border-[#343270] transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-[#343270] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2E9AB8] transition-colors disabled:opacity-50"
        >
          {loading
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Tambah Lokasi"}
        </button>
      </div>
    </div>
  );
}
