"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

type Props = {
  initialData?: any;
};

export default function TestimonialForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    content: initialData?.content ?? "",
    rating: initialData?.rating ?? 5,
    property_bought: initialData?.property_bought ?? "",
    is_published: initialData?.is_published ?? false,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const payload = { ...form, rating: Number(form.rating) };
    const { error } = isEdit
      ? await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", initialData.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin/testimonials");
    router.refresh();
  }

  const inputClass =
    "w-full border border-[#E4E4F0] rounded-xl px-4 py-2.5 text-[14px] text-[#141422] focus:outline-none focus:border-[#343270] transition-colors";
  const labelClass = "text-[12px] font-semibold text-[#5A5A78] mb-1 block";

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Informasi Testimonial
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Nama</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Budi Santoso"
            />
          </div>
          <div>
            <label className={labelClass}>Isi Testimonial</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Pelayanan sangat memuaskan..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rating</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Properti yang Dibeli</label>
              <input
                name="property_bought"
                value={form.property_bought}
                onChange={handleChange}
                className={inputClass}
                placeholder="Rumah di Beji"
              />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-[#343270]"
            />
            <span className="text-[14px] text-[#3E3E58] font-medium">
              Tayangkan di website
            </span>
          </label>
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
              : "Tambah Testimonial"}
        </button>
      </div>
    </div>
  );
}
