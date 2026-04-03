import { supabase } from "@/lib/supabase";
import ListingsClient from "@/components/ListingsClient";
import { Property, Location, Cluster } from "@/types";
import { Metadata } from "next";

// ─── SEO METADATA ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Koleksi Kurasi Properti | Rumah Andalan",
  description:
    "Eksplorasi portofolio hunian pilihan di kawasan Depok. Kami menyeleksi properti dengan legalitas aman, spesifikasi solid, dan nilai investasi yang logis.",
};

// Disable caching untuk halaman listings agar data selalu fresh
export const revalidate = 0;

// ─── DATA FETCHING ───────────────────────────────────────────────────────────
export default async function ListingsPage() {
  // Fetching data secara paralel biar loadingnya ngebut
  const [
    { data: properties, error: propError },
    { data: locations, error: locError },
    { data: clusters, error: clusError },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select(
        "*, cluster:clusters(*), location:locations(*), images:property_images(*)",
      )
      .order("created_at", { ascending: false }), // Default urutkan dari yang terbaru
    supabase
      .from("locations")
      .select("*")
      .order("district", { ascending: true }),
    supabase.from("clusters").select("*").order("name", { ascending: true }),
  ]);

  // Logging error di server
  if (propError) console.error("Error fetching properties:", propError);
  if (locError) console.error("Error fetching locations:", locError);
  if (clusError) console.error("Error fetching clusters:", clusError);

  return (
    // Memastikan background menggunakan warna tema eksklusif kita
    <main className="bg-bg-page min-h-screen">
      <ListingsClient
        properties={(properties as Property[]) ?? []}
        locations={(locations as Location[]) ?? []}
        clusters={(clusters as Cluster[]) ?? []}
      />
    </main>
  );
}
