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

  const [{ data: property }, { data: clusters }, { data: locations }] =
    await Promise.all([
      supabase.from("properties").select("*").eq("id", id).single(),
      supabase.from("clusters").select("id, name").order("name"),
      supabase.from("locations").select("*").order("district"),
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
    </div>
  );
}
