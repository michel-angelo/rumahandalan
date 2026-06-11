"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function saveClusterAction(payload: any, id?: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (id) {
    const { error } = await supabase.from("clusters").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("clusters").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/clusters");
  revalidatePath("/clusters");
  return { success: true };
}

export async function deleteClusterAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Get image to delete from storage
  const { data: cluster } = await supabase.from("clusters").select("image_url").eq("id", id).single();
  
  if (cluster?.image_url) {
    const parts = cluster.image_url.split("/property-images/");
    if (parts.length > 1) {
      await supabase.storage.from("property-images").remove([parts[1]]);
    }
  }

  const { error } = await supabase.from("clusters").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/clusters");
  revalidatePath("/clusters");
  return { success: true };
}
