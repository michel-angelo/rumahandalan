import { supabase } from "@/lib/supabase";
import { MetadataRoute } from "next";

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

  // Dynamic property pages
  const { data: properties } = await supabase
    .from("properties")
    .select("slug, updated_at");

  const propertyPages: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `${baseUrl}/listings/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic cluster pages
  const { data: clusters } = await supabase
    .from("clusters")
    .select("slug, created_at");

  const clusterPages: MetadataRoute.Sitemap = (clusters ?? []).map((c) => ({
    url: `${baseUrl}/clusters/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages, ...clusterPages];
}
