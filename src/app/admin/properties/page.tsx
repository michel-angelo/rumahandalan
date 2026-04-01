import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";

// Nanti lu uncomment import ini kalau file DeletePropertyButton di atas udah lu bikin
import DeletePropertyButton from "@/components/admin/DeleteProperty";

export default async function AdminPropertiesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("*, cluster:clusters(name), location:locations(district)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Data Properti
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1.5">
            Kelola semua listing properti, harga, dan ketersediaan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8EA8]" />
            <input
              type="text"
              placeholder="Cari properti..."
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#8E8EA8] focus:outline-none focus:border-[#2E9AB8] focus:ring-1 focus:ring-[#2E9AB8] transition-all w-full sm:w-64"
            />
          </div>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-[#2E9AB8] hover:bg-[#2589a4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Properti</span>
          </Link>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">
                  Properti
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">
                  Lokasi/Cluster
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">Harga</th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">Status</th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {!properties || properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#8E8EA8]">
                      <Building2 className="w-10 h-10 mb-3 opacity-20" />
                      <p>Belum ada data properti.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-[#8E8EA8]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {property.title}
                          </p>
                          <p className="text-[12px] text-[#8E8EA8] mt-0.5">
                            {property.type || "Standar"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-[#EEEDF8]">
                          <MapPin className="w-3.5 h-3.5 text-[#2E9AB8]" />
                          {property.location?.district || "-"}
                        </span>
                        <span className="text-[12px] text-[#8E8EA8]">
                          {property.cluster?.name || "Non-Cluster"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      Rp {property.price?.toLocaleString("id-ID") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${property.status?.toLowerCase() === "tersedia" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-[#8E8EA8] border-white/10"}`}
                      >
                        {property.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/listings/${property.slug}`}
                          target="_blank"
                          className="p-2 text-[#8E8EA8] hover:text-[#2E9AB8] hover:bg-[#2E9AB8]/10 rounded-lg transition-colors"
                          title="Lihat di Web"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="p-2 text-[#8E8EA8] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Nanti uncomment ini kalau file DeletePropertyButton udah lu bikin */}
                        <DeletePropertyButton
                          id={property.id}
                          title={property.title}
                        />
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
