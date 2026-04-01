import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus, Edit2, MessageSquare, Star } from "lucide-react";

export default async function AdminTestimonialsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Data Testimonial
          </h1>
          <p className="text-[#8E8EA8] text-[14px] mt-1.5">
            Kelola ulasan dan testimoni dari pembeli properti.
          </p>
        </div>

        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 bg-[#2E9AB8] hover:bg-[#2589a4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimonial</span>
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
                  Pembeli
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">
                  Properti
                </th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">Rating</th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8]">Status</th>
                <th className="px-6 py-4 font-medium text-[#8E8EA8] text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.06]">
              {!testimonials || testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#8E8EA8]">
                      <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                      <p>Belum ada data testimonial.</p>
                      <Link
                        href="/admin/testimonials/new"
                        className="text-[#2E9AB8] hover:text-white mt-2 transition-colors"
                      >
                        Tambah sekarang →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-[#8E8EA8]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {testimonial.name}
                          </p>
                          <p
                            className="text-[12px] text-[#8E8EA8] mt-0.5 max-w-[200px] truncate"
                            title={testimonial.content}
                          >
                            {testimonial.content}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[#EEEDF8]">
                      {testimonial.property_bought || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-medium">
                          {testimonial.rating}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {testimonial.is_published ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border bg-white/5 text-[#8E8EA8] border-white/10">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
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
