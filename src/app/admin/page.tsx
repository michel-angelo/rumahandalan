import { createSupabaseServerClient } from "@/lib/supabase-server";

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
      icon: "🏠",
      color: "bg-[#EEEDF8] text-[#343270]",
    },
    {
      label: "Properti Tersedia",
      value: availableProperties ?? 0,
      icon: "✅",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Cluster",
      value: totalClusters ?? 0,
      icon: "🏘️",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Testimonial",
      value: totalTestimonials ?? 0,
      icon: "💬",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Dashboard
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">
          Selamat datang di admin panel Rumah Andalan.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-[#E4E4F0] p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mb-3`}
            >
              {icon}
            </div>
            <p className="font-serif text-[28px] font-bold text-[#141422]">
              {value}
            </p>
            <p className="text-[#8E8EA8] text-[13px] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-[#E4E4F0] p-5">
        <h2 className="font-serif text-[#141422] text-[17px] font-bold mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Tambah Properti",
              href: "/admin/properties/new",
              icon: "➕",
            },
            {
              label: "Tambah Cluster",
              href: "/admin/clusters/new",
              icon: "➕",
            },
            { label: "Lihat Website", href: "/", icon: "🌐" },
          ].map(({ label, href, icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E4E4F0] hover:border-[#343270] hover:bg-[#EEEDF8] transition-colors text-[14px] font-semibold text-[#343270]"
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
