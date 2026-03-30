import { createSupabaseServerClient } from "@/lib/supabase-server";
import LocationForm from "@/components/admin/LocationForm";
import { notFound } from "next/navigation";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: location } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();
  if (!location) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Edit Lokasi
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">{location.district}</p>
      </div>
      <LocationForm initialData={location} />
    </div>
  );
}
