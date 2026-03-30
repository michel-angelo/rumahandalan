"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

type Props = {
  initialData?: any;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ClusterForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    developer: initialData?.developer ?? "",
    description: initialData?.description ?? "",
    image_url: initialData?.image_url ?? "",
    is_promo: initialData?.is_promo ?? false,
    promo_label: initialData?.promo_label ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();

    const { error } = isEdit
      ? await supabase.from("clusters").update(form).eq("id", initialData.id)
      : await supabase.from("clusters").insert(form);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/clusters");
    router.refresh();
  }

  const inputClass =
    "w-full border border-[#E4E4F0] rounded-xl px-4 py-2.5 text-[14px] text-[#141422] focus:outline-none focus:border-[#343270] transition-colors";
  const labelClass = "text-[12px] font-semibold text-[#5A5A78] mb-1 block";

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Informasi Cluster
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Nama Cluster</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Grand Depok City"
            />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className={inputClass}
              placeholder="grand-depok-city"
            />
          </div>
          <div>
            <label className={labelClass}>Developer</label>
            <input
              name="developer"
              value={form.developer}
              onChange={handleChange}
              className={inputClass}
              placeholder="PT Ciputra"
            />
          </div>
          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="Deskripsi cluster..."
            />
          </div>
          <div>
            <label className={labelClass}>URL Gambar</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Promo
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="is_promo"
              checked={form.is_promo}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-[#343270]"
            />
            <span className="text-[14px] text-[#3E3E58] font-medium">
              Tampilkan sebagai promo di homepage
            </span>
          </label>
          {form.is_promo && (
            <div>
              <label className={labelClass}>Label Promo</label>
              <input
                name="promo_label"
                value={form.promo_label}
                onChange={handleChange}
                className={inputClass}
                placeholder="DP 0%, Free BPHTB, dll"
              />
            </div>
          )}
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
              : "Tambah Cluster"}
        </button>
      </div>
    </div>
  );
}
