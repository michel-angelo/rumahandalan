"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

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
  const [error, setError] = useState("");

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

  function addPromoLabel() {
    setForm((prev) => ({ ...prev, promo_labels: [...prev.promo_labels, ""] }));
  }

  function updatePromoLabel(index: number, value: string) {
    setForm((prev) => {
      const updated = [...prev.promo_labels];
      updated[index] = value;
      return { ...prev, promo_labels: updated };
    });
  }

  function removePromoLabel(index: number) {
    setForm((prev) => ({
      ...prev,
      promo_labels: prev.promo_labels.filter((_: string, i: number) => i !== index),
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();

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
    };

    const { error } = isEdit
      ? await supabase
          .from("properties")
          .update(payload)
          .eq("id", initialData.id)
      : await supabase.from("properties").insert(payload);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/properties");
    router.refresh();
  }

  const inputClass =
    "w-full border border-[#E4E4F0] rounded-xl px-4 py-2.5 text-[14px] text-[#141422] focus:outline-none focus:border-[#343270] transition-colors";
  const labelClass = "text-[12px] font-semibold text-[#5A5A78] mb-1 block";

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Informasi Dasar
        </h2>
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
                <option value="rumah">Rumah</option>
                <option value="apartemen">Apartemen</option>
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
                <option value="tersedia">Tersedia</option>
                <option value="inden">Inden</option>
                <option value="terjual">Terjual</option>
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
                <option value="baru">Baru</option>
                <option value="second">Second</option>
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
                <option value="shm">SHM</option>
                <option value="hgb">HGB</option>
                <option value="ajb">AJB</option>
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
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Harga
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Harga (Rp)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="750000000"
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
              placeholder="5000000"
            />
          </div>
        </div>
      </div>

      {/* Spesifikasi */}
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Spesifikasi
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Luas Tanah (m²)</label>
            <input
              name="land_area"
              type="number"
              value={form.land_area}
              onChange={handleChange}
              className={inputClass}
              placeholder="72"
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
              placeholder="60"
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
              placeholder="2"
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
              placeholder="3"
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
              placeholder="2"
            />
          </div>
        </div>
      </div>

      {/* Lokasi & Cluster */}
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Lokasi & Cluster
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Lokasi (Kecamatan)</label>
            <select
              name="location_id"
              value={form.location_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih Lokasi</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
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
              <option value="">Pilih Cluster</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nomor WhatsApp Agen</label>
            <input
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleChange}
              className={inputClass}
              placeholder="6281234567890"
            />
          </div>
        </div>
      </div>

      {/* Opsi */}
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Opsi Tambahan
        </h2>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { name: "is_featured", label: "Properti Unggulan" },
            { name: "is_kpr", label: "KPR" },
            { name: "is_cash_keras", label: "Cash Keras" },
            { name: "is_subsidi", label: "Subsidi" },
          ].map(({ name, label }) => (
            <label
              key={name}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <input
                type="checkbox"
                name={name}
                checked={form[name as keyof typeof form] as boolean}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#343270]"
              />
              <span className="text-[14px] text-[#3E3E58] font-medium">
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Promo */}
        <div className="border-t border-[#F0F0F8] pt-5">
          <label className="flex items-center gap-2.5 cursor-pointer mb-4">
            <input
              type="checkbox"
              name="is_promo"
              checked={form.is_promo}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-[#343270]"
            />
            <span className="text-[14px] text-[#3E3E58] font-medium">
              Properti Sedang Promo
            </span>
          </label>

          {form.is_promo && (
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Label Promo</label>
              {form.promo_labels.map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={label}
                    onChange={(e) => updatePromoLabel(index, e.target.value)}
                    className={inputClass}
                    placeholder="DP 0%, Free BPHTB, Cashback 10 Jt, dll"
                  />
                  <button
                    onClick={() => removePromoLabel(index)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addPromoLabel}
                className="mt-1 px-4 py-2 rounded-xl border border-dashed border-[#C8C7E8] text-[#343270] text-[13px] font-semibold hover:bg-[#EEEDF8] transition-colors"
              >
                + Tambah Label Promo
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-[14px] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions */}
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
              : "Tambah Properti"}
        </button>
      </div>
    </div>
  );
}
