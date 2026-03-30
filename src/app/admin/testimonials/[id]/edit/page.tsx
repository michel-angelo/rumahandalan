import { createSupabaseServerClient } from "@/lib/supabase-server";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();
  if (!testimonial) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Edit Testimonial
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">{testimonial.name}</p>
      </div>
      <TestimonialForm initialData={testimonial} />
    </div>
  );
}
