import { createSupabaseServerClient } from "@/lib/supabase-server";
import PropertyForm from "@/components/admin/PropertyForm";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [
    { data: property },
    { data: clusters },
    { data: locations },
    { data: images },
  ] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).single(),
    supabase.from("clusters").select("id, name").order("name"),
    supabase.from("locations").select("*").order("district"),
    supabase
      .from("property_images")
      .select("*")
      .eq("property_id", id)
      .order("order"),
  ]);

  if (!property) notFound();

  // Gabungkan data gambar ke property agar bisa dibaca oleh PropertyForm
  const propertyWithImages = {
    ...property,
    images: images || [],
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Edit Properti
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">{property.title}</p>
      </div>

      {/* Kirim propertyWithImages yang sudah berisi foto ke dalam form */}
      <PropertyForm
        clusters={clusters ?? []}
        locations={locations ?? []}
        initialData={propertyWithImages}
      />

      {/* BAGIAN <ImageUploader /> YANG LAMA DI SINI DIHAPUS SAJA
        KARENA SUDAH DI-HANDLE OLEH <PropertyForm /> 
      */}
    </div>
  );
}
