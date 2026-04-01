import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  Building2,
  Map,
  MapPin,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  // Ambil total data dari masing-masing tabel (pake metode 'head' biar enteng & cepet)
  const [
    { count: propertyCount },
    { count: clusterCount },
    { count: locationCount },
    { count: testimonialCount },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("clusters").select("*", { count: "exact", head: true }),
    supabase.from("locations").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      title: "Total Properti",
      count: propertyCount || 0,
      icon: Building2,
      color: "text-[#2E9AB8]",
      bg: "bg-[#2E9AB8]/10",
      link: "/admin/properties",
    },
    {
      title: "Total Cluster",
      count: clusterCount || 0,
      icon: Map,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      link: "/admin/clusters",
    },
    {
      title: "Total Lokasi",
      count: locationCount || 0,
      icon: MapPin,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      link: "/admin/locations",
    },
    {
      title: "Testimonial",
      count: testimonialCount || 0,
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      link: "/admin/testimonials",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1.5">
          Selamat datang di panel admin. Berikut adalah ringkasan data saat ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col relative group overflow-hidden hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Link
                  href={stat.link}
                  className="p-2 bg-white/[0.03] hover:bg-white/[0.1] rounded-lg transition-colors text-[#8E8EA8] hover:text-white"
                  title={`Lihat ${stat.title}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div>
                <p className="text-[#8E8EA8] text-[13px] font-medium uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-white">{stat.count}</h3>
              </div>
              {/* Efek Cahaya Dekoratif di pojok kanan bawah kartu */}
              <div
                className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[50px] opacity-20 pointer-events-none ${stat.bg.replace("/10", "")}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
