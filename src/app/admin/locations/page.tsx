import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus, Edit2, MapPin } from "lucide-react";
import DeleteActionButton from "@/components/admin/DeleteActionButton";

export default async function AdminLocationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .order("district");

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Data Lokasi
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1.5">
            {locations?.length ?? 0} lokasi terdaftar dalam sistem.
          </p>
        </div>

        <Link
          href="/admin/locations/new"
          className="flex items-center gap-2 bg-[#2E9AB8] hover:bg-[#2589a4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lokasi</span>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">
                  Kecamatan
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">Kota</th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">
                  Provinsi
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {!locations || locations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#8E8EA8]">
                      <MapPin className="w-10 h-10 mb-3 opacity-20" />
                      <p>Belum ada data lokasi.</p>
                      <Link
                        href="/admin/locations/new"
                        className="text-[#2E9AB8] hover:text-white mt-2 transition-colors"
                      >
                        Tambah sekarang →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                locations.map((location) => (
                  <tr
                    key={location.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-[#8E8EA8]" />
                        </div>
                        <p className="font-medium text-white">
                          {location.district}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#EEEDF8]">
                      {location.city}
                    </td>
                    <td className="px-6 py-4 text-[#8E8EA8]">
                      {location.province}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/locations/${location.id}/edit`}
                          className="p-2 text-[#8E8EA8] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Tombol Hapus Universal */}
                        <DeleteActionButton
                          table="locations"
                          id={location.id}
                          itemName={location.district}
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
