import { supabase } from "@/lib/supabase";
import { MetadataRoute } from "next";

// WAJIB ADA: Biar sitemap di-generate ulang setiap 1 jam (3600 detik)
// Kalau nggak ada ini, Next.js bakal nge-cache sitemap ini selamanya sejak build
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.rumahandalan.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    // Dynamic property pages (Ambil yang statusnya masih relevan saja)
    const { data: properties } = await supabase
      .from("properties")
      .select("slug, updated_at")
      // Opsional: Cuma masukin ke sitemap kalau belum terjual (biar kuota crawling Google efektif)
      .neq("status", "terjual");

    const propertyPages: MetadataRoute.Sitemap = (properties ?? []).map(
      (p) => ({
        url: `${baseUrl}/listings/${p.slug}`,
        lastModified: new Date(p.updated_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );

    // Dynamic cluster pages
    const { data: clusters } = await supabase
      .from("clusters")
      .select("slug, created_at");

    const clusterPages: MetadataRoute.Sitemap = (clusters ?? []).map((c) => ({
      url: `${baseUrl}/clusters/${c.slug}`,
      lastModified: new Date(c.created_at || new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...propertyPages, ...clusterPages];
  } catch (error) {
    console.error("Gagal generate sitemap:", error);
    return staticPages;
  }
}
