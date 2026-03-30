import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminPropertiesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*, cluster:clusters(name), location:locations(district)")
    .order("created_at", { ascending: false });

  const statusConfig: Record<string, { label: string; className: string }> = {
    tersedia: {
      label: "Tersedia",
      className: "bg-emerald-50 text-emerald-700",
    },
    inden: { label: "Inden", className: "bg-amber-50 text-amber-700" },
    terjual: { label: "Terjual", className: "bg-red-50 text-red-600" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[#141422] text-2xl font-bold">
            Properti
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1">
            {properties?.length ?? 0} properti terdaftar
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="px-4 py-2.5 bg-[#343270] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2E9AB8] transition-colors"
        >
          + Tambah Properti
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E4F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4F0]">
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Properti
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide hidden md:table-cell">
                Lokasi
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide hidden lg:table-cell">
                Harga
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {properties?.map((property) => {
              const status =
                statusConfig[property.status] ?? statusConfig["tersedia"];
              return (
                <tr
                  key={property.id}
                  className="border-b border-[#F0F0F8] hover:bg-[#F7F7FB] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-[14px] font-semibold text-[#141422] line-clamp-1">
                      {property.title}
                    </p>
                    <p className="text-[12px] text-[#8E8EA8] mt-0.5">
                      {property.cluster?.name ?? "-"}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-[14px] text-[#3E3E58]">
                      {property.location?.district ?? "-"}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-[14px] text-[#3E3E58]">
                      {property.price_label}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-[13px] font-semibold text-[#343270] hover:text-[#2E9AB8] transition-colors"
                      >
                        Edit
                      </Link>
                      <span className="text-[#E4E4F0]">|</span>
                      <Link
                        href={`/listings/${property.slug}`}
                        target="_blank"
                        className="text-[13px] font-semibold text-[#8E8EA8] hover:text-[#343270] transition-colors"
                      >
                        Lihat
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!properties || properties.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-[#8E8EA8] text-[14px]"
                >
                  Belum ada properti.{" "}
                  <Link
                    href="/admin/properties/new"
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
