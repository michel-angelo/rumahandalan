import { supabase } from "@/lib/supabase";
import { SITE_CONFIG } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: cluster, error } = await supabase
    .from("clusters")
    .select("name, slug")
    .eq("id", id)
    .single();

  const clusterName = cluster?.name || "Cluster";
  const clusterUrl = `${SITE_CONFIG.baseUrl}/clusters/${cluster?.slug || ""}`;
  const waMessage = encodeURIComponent(
    `Halo Rumah Andalan, saya ingin menjadwalkan kunjungan untuk melihat cluster *${clusterName}*.\n\nLink: ${clusterUrl}`
  );
  
  const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waMessage}`;

  return NextResponse.redirect(waLink);
}
