import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminTestimonialsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[#141422] text-2xl font-bold">
            Testimonial
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1">
            {testimonials?.length ?? 0} testimonial terdaftar
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2.5 bg-[#343270] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2E9AB8] transition-colors"
        >
          + Tambah Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E4F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E4E4F0]">
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Nama
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide hidden md:table-cell">
                Properti
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-semibold text-[#8E8EA8] uppercase tracking-wide">
                Rating
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
            {testimonials?.map((t) => (
              <tr
                key={t.id}
                className="border-b border-[#F0F0F8] hover:bg-[#F7F7FB] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-[14px] font-semibold text-[#141422]">
                    {t.name}
                  </p>
                  <p className="text-[12px] text-[#8E8EA8] mt-0.5 line-clamp-1">
                    {t.content}
                  </p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-[14px] text-[#3E3E58]">
                    {t.property_bought ?? "-"}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[14px] text-[#3E3E58]">
                    {"⭐".repeat(t.rating ?? 5)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  {t.is_published ? (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      Tayang
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F0F0F8] text-[#8E8EA8]">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/testimonials/${t.id}/edit`}
                    className="text-[13px] font-semibold text-[#343270] hover:text-[#2E9AB8] transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!testimonials || testimonials.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-[#8E8EA8] text-[14px]"
                >
                  Belum ada testimonial.{" "}
                  <Link
                    href="/admin/testimonials/new"
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
