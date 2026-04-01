import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus, Edit2, Map, MapPin } from "lucide-react";

export default async function AdminClustersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: clusters } = await supabase
    .from("clusters")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Data Cluster
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1.5">
            {clusters?.length ?? 0} cluster terdaftar dalam sistem.
          </p>
        </div>

        <Link
          href="/admin/clusters/new"
          className="flex items-center gap-2 bg-[#2E9AB8] hover:bg-[#2589a4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Cluster</span>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {/* Table Head */}
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">
                  Cluster
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8] hidden md:table-cell">
                  Developer
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">Promo</th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8] text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.06]">
              {!clusters || clusters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#8E8EA8]">
                      <Map className="w-10 h-10 mb-3 opacity-20" />
                      <p>Belum ada data cluster.</p>
                      <Link
                        href="/admin/clusters/new"
                        className="text-[#2E9AB8] hover:text-white mt-2 transition-colors"
                      >
                        Tambah sekarang →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                clusters.map((cluster) => (
                  <tr
                    key={cluster.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                          <Map className="w-4 h-4 text-[#8E8EA8]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {cluster.name}
                          </p>
                          <p className="text-[12px] text-[#8E8EA8] mt-0.5">
                            {cluster.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell text-[#EEEDF8]">
                      {cluster.developer || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {cluster.is_promo ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {cluster.promo_label}
                        </span>
                      ) : (
                        <span className="text-[#8E8EA8]">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/clusters/${cluster.id}/edit`}
                          className="p-2 text-[#8E8EA8] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
