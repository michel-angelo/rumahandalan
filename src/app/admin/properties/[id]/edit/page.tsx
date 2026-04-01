import { createSupabaseServerClient } from "@/lib/supabase-server";
import PropertyForm from "@/components/admin/PropertyForm";
import ImageUploader from "@/components/admin/ImageUploader";
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Edit Properti
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">{property.title}</p>
      </div>

      <PropertyForm
        clusters={clusters ?? []}
        locations={locations ?? []}
        initialData={property}
      />

      {/* Foto Properti */}
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-6 mt-6">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-5">
          Foto Properti
        </h2>
        <ImageUploader
          propertyId={id}
          existingImages={(images ?? []).map((img) => ({
            url: img.url, // <-- Ubah jadi img.url
            is_primary: img.is_primary,
            order: img.order,
          }))}
        />
      </div>
    </div>
  );
}
