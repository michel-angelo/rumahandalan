"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function deletePropertyAction(id: string) {
  const supabase = await createSupabaseServerClient();

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Get image URLs first to delete from storage
  const { data: images } = await supabase
    .from("property_images")
    .select("url")
    .eq("property_id", id);

  // 2. Delete from storage if any
  if (images && images.length > 0) {
    const paths = images.map(img => {
      const parts = img.url.split("/property-images/");
      return parts.length > 1 ? parts[1] : null;
    }).filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from("property-images").remove(paths);
    }
  }

  // 3. Delete property (cascading should handle property_images if DB is configured correctly, 
  // but we can be explicit if needed)
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/properties");
  revalidatePath("/listings");
  return { success: true };
}

export async function savePropertyAction(payload: any, id?: string) {
  const supabase = await createSupabaseServerClient();

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  let propertyId = id;
  let finalSlug = payload.slug;

  // 1. Slug Collision Protection (Defensive Engineering)
  const { data: existing } = await supabase
    .from("properties")
    .select("id")
    .eq("slug", finalSlug)
    .neq("id", id || "00000000-0000-0000-0000-000000000000") // Skip self if editing
    .maybeSingle();

  if (existing) {
    // Append short unique hash to prevent collision
    finalSlug = `${finalSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const finalPayload = { ...payload, slug: finalSlug };

  if (id) {
    const { error } = await supabase
      .from("properties")
      .update(finalPayload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("properties")
      .insert(finalPayload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    propertyId = data.id;
  }

  revalidatePath("/admin/properties");
  revalidatePath("/listings");
  return { success: true, id: propertyId, slug: finalSlug };
}

export async function updatePropertyImagesAction(images: any[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  for (const img of images) {
    const { error } = await supabase
      .from("property_images")
      .update({ is_primary: img.is_primary })
      .eq("id", img.id);
    if (error) console.error("Error updating image:", error);
  }
}

export async function deletePropertyImagesAction(images: any[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  for (const img of images) {
    const pathParts = img.url.split("/property-images/");
    if (pathParts.length > 1) {
      await supabase.storage.from("property-images").remove([pathParts[1]]);
    }
    await supabase.from("property_images").delete().eq("id", img.id);
  }
}

export async function addPropertyImageAction(propertyId: string, url: string, isPrimary: boolean) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("property_images").insert({
    property_id: propertyId,
    url,
    is_primary: isPrimary,
    order: 0,
  });
  if (error) throw new Error(error.message);
}
