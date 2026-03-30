import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminClustersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: clusters } = await supabase
    .from("clusters")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[#141422] text-2xl font-bold">
            Cluster
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1">
            {clusters?.length ?? 0} cluster terdaftar
          </p>
        </div>
        <Link
          href="/admin/clusters/new"
          className="px-4 py-2.5 bg-[#343270] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2E9AB8] transition-colors"
        >
          + Tambah Cluster
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E4F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4F0]">
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Cluster
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide hidden md:table-cell">
                Developer
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Promo
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {clusters?.map((cluster) => (
              <tr
                key={cluster.id}
                className="border-b border-[#F0F0F8] hover:bg-[#F7F7FB] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-[14px] font-semibold text-[#141422]">
                    {cluster.name}
                  </p>
                  <p className="text-[12px] text-[#8E8EA8] mt-0.5">
                    {cluster.slug}
                  </p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-[14px] text-[#3E3E58]">
                    {cluster.developer}
                  </p>
                </td>
                <td className="px-5 py-4">
                  {cluster.is_promo ? (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2E9AB8] text-white">
                      {cluster.promo_label}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#8E8EA8]">-</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/clusters/${cluster.id}/edit`}
                    className="text-[13px] font-semibold text-[#343270] hover:text-[#2E9AB8] transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!clusters || clusters.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-[#8E8EA8] text-[14px]"
                >
                  Belum ada cluster.{" "}
                  <Link
                    href="/admin/clusters/new"
                    className="text-[#343270] font-semibold hover:text-[#2E9AB8]"
                  >
                    Tambah sekarang →
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
