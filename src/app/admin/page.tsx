import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Map,
  MessageSquare,
  Plus,
  Globe,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalProperties },
    { count: availableProperties },
    { count: totalClusters },
    { count: totalTestimonials },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("status", "tersedia"),
    supabase.from("clusters").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Total Properti",
      value: totalProperties ?? 0,
      icon: <Building2 className="w-5 h-5 text-[#AADDE9]" />,
      iconBg: "bg-[#285090]/20",
    },
    {
      label: "Properti Tersedia",
      value: availableProperties ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Total Cluster",
      value: totalClusters ?? 0,
      icon: <Map className="w-5 h-5 text-[#9D9BCF]" />,
      iconBg: "bg-[#6764A8]/20",
    },
    {
      label: "Testimonial",
      value: totalTestimonials ?? 0,
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      iconBg: "bg-amber-500/10",
    },
  ];

  const quickActions = [
    {
      label: "Tambah Properti",
      href: "/admin/properties/new",
      icon: <Plus className="w-4 h-4" />,
      primary: true,
    },
    {
      label: "Tambah Cluster",
      href: "/admin/clusters/new",
      icon: <Plus className="w-4 h-4" />,
      primary: false,
    },
    {
      label: "Lihat Website",
      href: "/",
      icon: <Globe className="w-4 h-4" />,
      primary: false,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1.5">
          Pantau performa properti dan kelola data sistem Rumah Andalan.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, iconBg }) => (
          <div
            key={label}
            className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}
              >
                {icon}
              </div>
            </div>
            <div>
              <p className="text-[#8E8EA8] text-[13px] font-medium mb-1">
                {label}
              </p>
              <p className="text-3xl font-bold text-white tracking-tight">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-[16px] text-white font-bold mb-5 tracking-tight">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(({ label, href, icon, primary }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-[13px] font-medium transition-all duration-200 border ${
                primary
                  ? "bg-[#2E9AB8] hover:bg-[#2589a4] text-white border-transparent shadow-sm"
                  : "bg-white/[0.03] hover:bg-white/[0.08] text-[#EEEDF8] border-white/[0.06]"
              }`}
            >
              <span className={primary ? "text-white" : "text-[#8E8EA8]"}>
                {icon}
              </span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
