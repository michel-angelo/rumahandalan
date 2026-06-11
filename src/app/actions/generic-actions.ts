"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function saveGenericAction(table: string, payload: any, id?: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (id) {
    const { error } = await supabase.from(table).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from(table).insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/${table}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteGenericAction(table: string, id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${table}`);
  revalidatePath("/");
  return { success: true };
}
