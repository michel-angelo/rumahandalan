"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import ImageUploader, { PendingImage, UploadedImage } from "./ImageUploader";

type Cluster = { id: string; name: string };
type Location = { id: string; district: string; city: string };

type Props = {
  clusters: Cluster[];
  locations: Location[];
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

export default function PropertyForm({
  clusters,
  locations,
  initialData,
}: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);

  // --- IMAGE STATES ---
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [existingImages, setExistingImages] = useState<UploadedImage[]>(
    initialData?.property_images || initialData?.images || [],
  );
  const [imagesToDelete, setImagesToDelete] = useState<UploadedImage[]>([]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [pendingImages]);

  const [facilitiesInput, setFacilitiesInput] = useState(
    initialData?.facilities?.join("\n") || "",
  );

  const [promosInput, setPromosInput] = useState(
    initialData?.promo_labels?.join("\n") || "",
  );

  // --- FORM STATE ---
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    type: initialData?.type ?? "rumah",
    status: initialData?.status ?? "tersedia",
    condition: initialData?.condition ?? "baru",
    certificate: initialData?.certificate ?? "shm",
    price: initialData?.price ?? "",
    price_label: initialData?.price_label ?? "",
    price_per_month: initialData?.price_per_month ?? "",
    land_area: initialData?.land_area ?? "",
    building_area: initialData?.building_area ?? "",
    floors: initialData?.floors ?? "",
    bedrooms: initialData?.bedrooms ?? "",
    bathrooms: initialData?.bathrooms ?? "",
    description: initialData?.description ?? "",
    whatsapp_number: initialData?.whatsapp_number ?? "",
    is_featured: initialData?.is_featured ?? false,
    is_kpr: initialData?.is_kpr ?? false,
    is_cash_keras: initialData?.is_cash_keras ?? false,
    is_subsidi: initialData?.is_subsidi ?? false,
    cluster_id: initialData?.cluster_id ?? "",
    location_id: initialData?.location_id ?? "",
    is_promo: initialData?.is_promo ?? false,
    promo_labels: initialData?.promo_labels ?? [],
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
      ...(name === "title" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  // --- IMAGE HANDLERS ---
  function handleFilesSelected(files: FileList) {
    const newPending = Array.from(files).map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      // Jadikan primary kalau ini gambar pertama kali yang dimasukkan
      is_primary:
        existingImages.length === 0 && pendingImages.length === 0 && i === 0,
    }));
    setPendingImages((prev) => [...prev, ...newPending]);
  }

  function handleSetPrimary(type: "existing" | "pending", index: number) {
    if (type === "existing") {
      setExistingImages((prev) =>
        prev.map((img, i) => ({ ...img, is_primary: i === index })),
      );
      setPendingImages((prev) =>
        prev.map((img) => ({ ...img, is_primary: false })),
      );
    } else {
      setPendingImages((prev) =>
        prev.map((img, i) => ({ ...img, is_primary: i === index })),
      );
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_primary: false })),
      );
    }
  }

  function handleRemove(type: "existing" | "pending", index: number) {
    if (type === "existing") {
      const imgToRemove = existingImages[index];
      setImagesToDelete((prev) => [...prev, imgToRemove]); // Masukin antrian hapus
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPendingImages((prev) => {
        const newArr = [...prev];
        URL.revokeObjectURL(newArr[index].preview); // Cleanup memory
        newArr.splice(index, 1);
        return newArr;
      });
    }
  }

  // --- MAIN SUBMIT ACTION ---
  async function handleSubmit() {
    const toastId = toast.loading(
      isEdit ? "Menyimpan perubahan..." : "Menyimpan properti & upload foto...",
    );
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        price_per_month: form.price_per_month
          ? Number(form.price_per_month)
          : null,
        land_area: Number(form.land_area),
        building_area: Number(form.building_area),
        floors: Number(form.floors),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        cluster_id: form.cluster_id || null,
        location_id: form.location_id || null,
        facilities: facilitiesInput
          .split("\n")
          .map((f: string) => f.trim())
          .filter(Boolean),
        promo_labels: form.is_promo
          ? promosInput
              .split("\n")
              .map((p: string) => p.trim())
              .filter(Boolean)
          : [], // Kalau is_promo false, otomatis dikosongin
      };
      let propertyId = initialData?.id;
      if (isEdit) {
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", propertyId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("properties")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        propertyId = data.id;
      }

      // 2. UPLOAD PENDING IMAGES
      if (pendingImages.length > 0) {
        for (const img of pendingImages) {
          const ext = img.file.name.split(".").pop();
          const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(fileName, img.file);

          if (!uploadError) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("property-images").getPublicUrl(fileName);
            await supabase.from("property_images").insert({
              property_id: propertyId,
              url: publicUrl,
              is_primary: img.is_primary,
              order: 0,
            });
          }
        }
      }

      // 3. UPDATE EXISTING IMAGES (Cuma update kalau is_primary nya berubah)
      if (isEdit && existingImages.length > 0) {
        for (const img of existingImages) {
          if (img.id) {
            await supabase
              .from("property_images")
              .update({ is_primary: img.is_primary })
              .eq("id", img.id);
          } else {
            await supabase
              .from("property_images")
              .update({ is_primary: img.is_primary })
              .eq("url", img.url);
          }
        }
      }

      // 4. DELETE REMOVED IMAGES (Hapus dari storage & DB)
      if (isEdit && imagesToDelete.length > 0) {
        for (const img of imagesToDelete) {
          const pathParts = img.url.split("/property-images/");
          if (pathParts.length > 1) {
            await supabase.storage
              .from("property-images")
              .remove([pathParts[1]]);
          }
          await supabase.from("property_images").delete().eq("url", img.url);
        }
      }

      toast.success(
        isEdit ? "Perubahan berhasil disimpan!" : "Properti berhasil dibuat!",
        { id: toastId },
      );
      router.push("/admin/properties");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // UI Variables
  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[14px] text-white placeholder:text-[#8E8EA8] focus:outline-none focus:border-[#2E9AB8] focus:ring-1 focus:ring-[#2E9AB8] transition-all";
  const labelClass =
    "text-[12px] font-semibold text-[#8E8EA8] mb-1.5 block uppercase tracking-wider";
  const cardClass =
    "bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6";
  const titleClass = "text-white text-[16px] font-bold mb-5 tracking-tight";

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Info */}
      <div className={cardClass}>
        <h2 className={titleClass}>Informasi Dasar</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Judul Properti</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Rumah Minimalis Modern Beji"
            />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className={inputClass}
              placeholder="rumah-minimalis-modern-beji"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipe</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="rumah" className="bg-[#12121C]">
                  Rumah
                </option>
                <option value="apartemen" className="bg-[#12121C]">
                  Apartemen
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="tersedia" className="bg-[#12121C]">
                  Tersedia
                </option>
                <option value="inden" className="bg-[#12121C]">
                  Inden
                </option>
                <option value="terjual" className="bg-[#12121C]">
                  Terjual
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Kondisi</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="baru" className="bg-[#12121C]">
                  Baru
                </option>
                <option value="second" className="bg-[#12121C]">
                  Second
                </option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Sertifikat</label>
              <select
                name="certificate"
                value={form.certificate}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="shm" className="bg-[#12121C]">
                  SHM
                </option>
                <option value="hgb" className="bg-[#12121C]">
                  HGB
                </option>
                <option value="ajb" className="bg-[#12121C]">
                  AJB
                </option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Deskripsi lengkap properti..."
            />
          </div>
        </div>
      </div>

      {/* Harga */}
      <div className={cardClass}>
        <h2 className={titleClass}>Harga</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Harga (Rp)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Label Harga</label>
            <input
              name="price_label"
              value={form.price_label}
              onChange={handleChange}
              className={inputClass}
              placeholder="Rp 750 Jt"
            />
          </div>
          <div>
            <label className={labelClass}>Cicilan/Bulan (Rp)</label>
            <input
              name="price_per_month"
              type="number"
              value={form.price_per_month}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Spesifikasi */}
      <div className={cardClass}>
        <h2 className={titleClass}>Spesifikasi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Luas Tanah (m²)</label>
            <input
              name="land_area"
              type="number"
              value={form.land_area}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Luas Bangunan (m²)</label>
            <input
              name="building_area"
              type="number"
              value={form.building_area}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Jumlah Lantai</label>
            <input
              name="floors"
              type="number"
              value={form.floors}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kamar Tidur</label>
            <input
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kamar Mandi</label>
            <input
              name="bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Lokasi & Cluster */}
      <div className={cardClass}>
        <h2 className={titleClass}>Lokasi & Cluster</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Lokasi (Kecamatan)</label>
            <select
              name="location_id"
              value={form.location_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" className="bg-[#12121C]">
                Pilih Lokasi
              </option>
              {locations.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#12121C]">
                  {l.district}, {l.city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Cluster</label>
            <select
              name="cluster_id"
              value={form.cluster_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" className="bg-[#12121C]">
                Pilih Cluster
              </option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#12121C]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nomor WhatsApp</label>
            <input
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* --- FASILITAS & AKSES --- */}
      <div className={cardClass}>
        <h2 className={titleClass}>Fasilitas & Akses</h2>
        <div>
          <label className={labelClass}>
            Fasilitas & Akses Terdekat (Pisahkan dengan Enter)
          </label>
          <textarea
            value={facilitiesInput}
            onChange={(e) => setFacilitiesInput(e.target.value)}
            rows={4}
            placeholder="Contoh:&#10;10 Menit ke Tol Margonda&#10;5 Menit ke Stasiun Depok Baru&#10;Keamanan 24 Jam & CCTV"
            className={inputClass}
          />
        </div>
      </div>

      {/* --- FOTO PROPERTI (Dipindah ke Sini) --- */}
      <div className={cardClass}>
        <h2 className={titleClass}>Foto Properti</h2>
        <ImageUploader
          pendingImages={pendingImages}
          existingImages={existingImages}
          onFilesSelected={handleFilesSelected}
          onSetPrimary={handleSetPrimary}
          onRemove={handleRemove}
        />
      </div>

      {/* Opsi */}
      <div className={cardClass}>
        <h2 className={titleClass}>Opsi Tambahan</h2>

        <div className="border-t border-white/[0.06] pt-5">
          <label className="flex items-center gap-2.5 cursor-pointer mb-4 group">
            <input
              type="checkbox"
              name="is_promo"
              checked={form.is_promo}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#2E9AB8] focus:ring-[#2E9AB8]"
            />
            <span className="text-[14px] text-[#EEEDF8] font-medium group-hover:text-white transition-colors">
              Properti Sedang Promo
            </span>
          </label>

          {/* TEXTAREA MUNCUL OTOMATIS KALAU DICENTANG */}
          {form.is_promo && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className={labelClass}>
                Daftar Promo (Pisahkan dengan Enter)
              </label>
              <textarea
                value={promosInput}
                onChange={(e) => setPromosInput(e.target.value)}
                rows={3}
                placeholder="Contoh:&#10;Free Biaya KPR & Surat-surat&#10;Kanopi Gratis&#10;Cashback 10 Juta"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-10">
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
              : "Simpan Properti"}
        </button>
      </div>
    </div>
  );
}
