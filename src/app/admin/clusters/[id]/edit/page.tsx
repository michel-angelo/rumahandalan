import { createSupabaseServerClient } from "@/lib/supabase-server";
import ClusterForm from "@/components/admin/ClusterForm";
import { notFound } from "next/navigation";

export default async function EditClusterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: cluster } = await supabase
    .from("clusters")
    .select("*")
    .eq("id", id)
    .single();
  if (!cluster) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Edit Cluster
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">{cluster.name}</p>
      </div>
      <ClusterForm initialData={cluster} />
    </div>
  );
}
