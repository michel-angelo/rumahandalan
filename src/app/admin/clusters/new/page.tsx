import ClusterForm from "@/components/admin/ClusterForm";

export default function NewClusterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-[#141422] text-2xl font-bold">
          Tambah Cluster
        </h1>
        <p className="text-[#8E8EA8] text-[14px] mt-1">
          Isi form berikut untuk menambah cluster baru.
        </p>
      </div>
      <ClusterForm />
    </div>
  );
}
