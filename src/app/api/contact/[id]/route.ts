import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch only the whatsapp number and title for the message
  const { data: property, error } = await supabase
    .from("properties")
    .select("whatsapp_number, title, slug")
    .eq("id", id)
    .single();

  if (error || !property || !property.whatsapp_number) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const propertyUrl = `${SITE_CONFIG.baseUrl}/listings/${property.slug}`;
  const waMessage = encodeURIComponent(
    `Halo Rumah Andalan, saya tertarik dengan properti *${property.title}*.\n\nLink: ${propertyUrl}\n\nApakah saya bisa menjadwalkan kunjungan?`
  );
  
  const waLink = `https://wa.me/${property.whatsapp_number}?text=${waMessage}`;

  return NextResponse.redirect(waLink);
}
