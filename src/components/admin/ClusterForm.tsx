"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import Image from "next/image";

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

  // State File & Preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image_url ?? "");

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    developer: initialData?.developer ?? "",
    description: initialData?.description ?? "",
    image_url: initialData?.image_url ?? "",
    is_promo: initialData?.is_promo ?? false,
    promo_label: initialData?.promo_label ?? "",
  });

  // Cleanup memori browser biar nggak bocor
  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile, previewUrl]);

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit() {
    const toastId = toast.loading(
      isEdit ? "Menyimpan perubahan..." : "Menyimpan cluster & foto...",
    );
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    try {
      let uploadedImageUrl = form.image_url;

      // 1. Upload Gambar dulu kalau ada file baru
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const fileName = `clusters/cluster-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(fileName);
        uploadedImageUrl = publicUrl;
      }

      // 2. Simpan Data ke Database
      const payload = { ...form, image_url: uploadedImageUrl };

      const { error } = isEdit
        ? await supabase
            .from("clusters")
            .update(payload)
            .eq("id", initialData.id)
        : await supabase.from("clusters").insert(payload);

      if (error) throw error;

      toast.success(
        isEdit
          ? "Perubahan berhasil disimpan!"
          : "Cluster berhasil ditambahkan!",
        { id: toastId },
      );
      router.push("/admin/clusters");
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
      {/* Informasi Cluster */}
      <div className={cardClass}>
        <h2 className={titleClass}>Informasi Cluster</h2>
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
          <div className="grid grid-cols-2 gap-4">
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

          {/* UPLOAD FOTO SECTION */}
          <div className="mt-2">
            <label className={labelClass}>Foto Cover Cluster</label>
            {previewUrl ? (
              <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-white/[0.08] group bg-white/[0.02]">
                <Image
                  src={previewUrl}
                  alt="Preview Cluster"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#0B0B12]/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
                  <label className="px-4 py-2 bg-white/[0.1] border border-white/[0.2] text-white rounded-lg text-[12px] font-medium hover:bg-white/[0.2] transition-colors cursor-pointer">
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl("");
                      setForm((prev) => ({ ...prev, image_url: "" }));
                    }}
                    className="px-4 py-2 bg-red-500/80 border border-red-500 text-white rounded-lg text-[12px] font-medium hover:bg-red-500 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 w-full h-48 sm:h-64 border-2 border-dashed border-white/[0.1] bg-white/[0.01] rounded-xl cursor-pointer hover:border-[#2E9AB8] hover:bg-[#2E9AB8]/5 transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg
                  className="w-10 h-10 text-[#8E8EA8] group-hover:text-[#2E9AB8] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[14px] font-medium text-white mt-2">
                  Klik untuk upload foto cover
                </span>
                <span className="text-[12px] text-[#8E8EA8]">
                  Format JPG, PNG, atau WebP
                </span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Promo */}
      <div className={cardClass}>
        <h2 className={titleClass}>Pengaturan Promo</h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer group w-max">
            <input
              type="checkbox"
              name="is_promo"
              checked={form.is_promo}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#2E9AB8] focus:ring-[#2E9AB8] transition-all"
            />
            <span className="text-[14px] text-[#EEEDF8] font-medium group-hover:text-white transition-colors">
              Tampilkan sebagai promo di homepage
            </span>
          </label>
          {form.is_promo && (
            <div className="mt-1">
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
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
              : "Simpan Cluster"}
        </button>
      </div>
    </div>
  );
}
