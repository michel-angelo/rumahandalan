import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminLocationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .order("district");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[#141422] text-2xl font-bold">
            Lokasi
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1">
            {locations?.length ?? 0} lokasi terdaftar
          </p>
        </div>
        <Link
          href="/admin/locations/new"
          className="px-4 py-2.5 bg-[#343270] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2E9AB8] transition-colors"
        >
          + Tambah Lokasi
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E4F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4F0]">
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Kecamatan
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Kota
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Provinsi
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {locations?.map((location) => (
              <tr
                key={location.id}
                className="border-b border-[#F0F0F8] hover:bg-[#F7F7FB] transition-colors"
              >
                <td className="px-5 py-4 text-[14px] font-semibold text-[#141422]">
                  {location.district}
                </td>
                <td className="px-5 py-4 text-[14px] text-[#3E3E58]">
                  {location.city}
                </td>
                <td className="px-5 py-4 text-[14px] text-[#3E3E58]">
                  {location.province}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/locations/${location.id}/edit`}
                    className="text-[13px] font-semibold text-[#343270] hover:text-[#2E9AB8] transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!locations || locations.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-[#8E8EA8] text-[14px]"
                >
                  Belum ada lokasi.{" "}
                  <Link
                    href="/admin/locations/new"
                    className="text-[#343270] font-semibold"
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
