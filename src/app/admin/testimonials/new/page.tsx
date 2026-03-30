import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Tambah Testimonial
        </h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
