"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";

type Props = {
  initialData?: any;
};

export default function LocationForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    district: initialData?.district ?? "",
    city: initialData?.city ?? "Depok",
    province: initialData?.province ?? "Jawa Barat",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    const toastId = toast.loading(
      isEdit ? "Menyimpan perubahan..." : "Menyimpan lokasi...",
    );
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    try {
      const { error } = isEdit
        ? await supabase.from("locations").update(form).eq("id", initialData.id)
        : await supabase.from("locations").insert(form);

      if (error) throw error;

      toast.success(
        isEdit
          ? "Perubahan berhasil disimpan!"
          : "Lokasi berhasil ditambahkan!",
        { id: toastId },
      );
      router.push("/admin/locations");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // UI Variables Dark Mode
  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[14px] text-white placeholder:text-[#8E8EA8] focus:outline-none focus:border-[#2E9AB8] focus:ring-1 focus:ring-[#2E9AB8] transition-all";
  const labelClass =
    "text-[12px] font-semibold text-[#8E8EA8] mb-1.5 block uppercase tracking-wider";
  const cardClass =
    "bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6";
  const titleClass = "text-white text-[16px] font-bold mb-5 tracking-tight";

  return (
    <div className="flex flex-col gap-6">
      {/* Informasi Lokasi */}
      <div className={cardClass}>
        <h2 className={titleClass}>Informasi Lokasi</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Kecamatan</label>
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              className={inputClass}
              placeholder="Sawangan"
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[14px] font-medium text-white hover:bg-white/[0.08] transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-[#2E9AB8] border border-transparent text-white rounded-xl text-[14px] font-semibold hover:bg-[#2589a4] transition-colors disabled:opacity-50"
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
