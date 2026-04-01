"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";

type Props = {
  initialData?: any;
};

export default function TestimonialForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);

  // State untuk nyimpen list properti dari DB
  const [properties, setProperties] = useState<{ id: string; title: string }[]>(
    [],
  );

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    content: initialData?.content ?? "",
    rating: initialData?.rating ?? 5,
    property_bought: initialData?.property_bought ?? "",
    is_published: initialData?.is_published ?? false,
  });

  // Fetch data properti pas halaman diload
  useEffect(() => {
    async function fetchProperties() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("properties")
        .select("id, title")
        .order("title");
      if (data) setProperties(data);
    }
    fetchProperties();
  }, []);

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
    const toastId = toast.loading(
      isEdit ? "Menyimpan perubahan..." : "Menyimpan testimonial...",
    );
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const payload = { ...form, rating: Number(form.rating) };

    try {
      const { error } = isEdit
        ? await supabase
            .from("testimonials")
            .update(payload)
            .eq("id", initialData.id)
        : await supabase.from("testimonials").insert(payload);

      if (error) throw error;

      toast.success(
        isEdit
          ? "Perubahan berhasil disimpan!"
          : "Testimonial berhasil ditambahkan!",
        { id: toastId },
      );
      router.push("/admin/testimonials");
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
      <div className={cardClass}>
        <h2 className={titleClass}>Informasi Testimonial</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Nama Pembeli</label>
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
                <option value={5} className="bg-[#12121C]">
                  ⭐⭐⭐⭐⭐ (5)
                </option>
                <option value={4} className="bg-[#12121C]">
                  ⭐⭐⭐⭐ (4)
                </option>
                <option value={3} className="bg-[#12121C]">
                  ⭐⭐⭐ (3)
                </option>
                <option value={2} className="bg-[#12121C]">
                  ⭐⭐ (2)
                </option>
                <option value={1} className="bg-[#12121C]">
                  ⭐ (1)
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Properti yang Dibeli</label>
              <select
                name="property_bought"
                value={form.property_bought}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" className="bg-[#12121C]">
                  -- Pilih Properti --
                </option>
                {properties.map((p) => (
                  <option key={p.id} value={p.title} className="bg-[#12121C]">
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2">
            <label className="flex items-center gap-2.5 cursor-pointer group w-max">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#2E9AB8] focus:ring-[#2E9AB8] transition-all"
              />
              <span className="text-[14px] text-[#EEEDF8] font-medium group-hover:text-white transition-colors">
                Tayangkan di website
              </span>
            </label>
          </div>
        </div>
      </div>

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
              : "Tambah Testimonial"}
        </button>
      </div>
    </div>
  );
}
