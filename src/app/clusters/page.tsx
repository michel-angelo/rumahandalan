// src/app/clusters/page.tsx
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Eksplorasi Cluster | Rumah Andalan",
  description: "Temukan berbagai pilihan cluster premium di Depok.",
};

export default async function ClustersPage() {
  // Fetch semua data cluster beserta gambar utamanya
  const { data: clusters, error } = await supabase
    .from("clusters")
    .select("*, images:cluster_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (ClustersPage):", error.message);
  }

  return (
    <div className="bg-bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header Section */}
        <div className="mb-16">
          <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            Kawasan Pilihan
          </p>
          <h1 className="font-display text-text-primary text-4xl lg:text-5xl mb-4">
            Eksplorasi <span className="italic text-accent">Cluster</span>
          </h1>
          <p className="font-body text-text-secondary max-w-xl text-[15px] leading-relaxed">
            Temukan lingkungan hunian terpadu yang dilengkapi dengan fasilitas
            terbaik dan keamanan terjamin untuk kenyamanan keluarga Anda.
          </p>
        </div>

        {/* Grid Clusters */}
        {clusters && clusters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clusters.map((cluster) => {
              const mainImage =
                cluster.image_url || cluster.images?.[0]?.image_url;

              return (
                <Link
                  key={cluster.id}
                  href={`/clusters/${cluster.slug}`}
                  className="group relative block aspect-square bg-bg-surface overflow-hidden"
                >
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={cluster.name}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-border-light">
                      <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold">
                        Tak Ada Gambar
                      </span>
                    </div>
                  )}

                  {/* Overlay Gradient biar teks kebaca */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Info Cluster */}
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    {cluster.is_promo && cluster.promo_label && (
                      <span className="inline-block text-[10px] font-bold px-3 py-1 bg-white text-text-primary mb-4 uppercase tracking-[0.2em]">
                        {cluster.promo_label}
                      </span>
                    )}
                    <h2 className="font-display text-white text-3xl font-light tracking-wide mb-1 group-hover:text-accent transition-colors">
                      {cluster.name}
                    </h2>
                    <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.3em]">
                      Oleh {cluster.developer || "Developer"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-border-light">
            <p className="text-text-secondary">
              Belum ada data cluster yang tersedia saat ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
