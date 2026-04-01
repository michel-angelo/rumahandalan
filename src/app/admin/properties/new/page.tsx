import { createSupabaseServerClient } from "@/lib/supabase-server";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NewPropertyPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: clusters }, { data: locations }] = await Promise.all([
    supabase.from("clusters").select("id, name").order("name"),
    supabase.from("locations").select("*").order("district"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Tambah Properti
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1.5">
          Isi form berikut untuk menambah listing properti baru.
        </p>
      </div>

      <PropertyForm clusters={clusters ?? []} locations={locations ?? []} />
    </div>
  );
}
