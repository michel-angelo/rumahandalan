"use client";

import { Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  table: "clusters" | "locations" | "testimonials";
  id: string;
  itemName: string;
};

export default function DeleteActionButton({ table, id, itemName }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function executeDelete(toastId: string) {
    toast.dismiss(toastId);
    setIsDeleting(true);

    const loadingToast = toast.loading(`Menghapus data...`);
    const supabase = createSupabaseBrowserClient();

    try {
      if (table === "clusters") {
        const { data: clusterData } = await supabase
          .from("clusters")
          .select("image_url")
          .eq("id", id)
          .single();

        if (clusterData?.image_url) {
          const parts = clusterData.image_url.split("/property-images/");
          if (parts.length > 1) {
            await supabase.storage.from("property-images").remove([parts[1]]);
          }
        }
      }

      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;

      toast.success(`"${itemName}" berhasil dihapus!`, { id: loadingToast });
      router.refresh();
    } catch (error: any) {
      console.error("Gagal menghapus:", error);
      toast.error(`Gagal: ${error.message || "Akses ditolak"}`, {
        id: loadingToast,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteClick() {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[220px]">
          <div>
            <p className="font-semibold text-white mb-1">Hapus Data?</p>
            <p className="text-[#8E8EA8] text-xs">
              Yakin hapus <b>{itemName}</b>?
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => executeDelete(t.id)}
              className="flex-1 px-3 py-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-md text-xs font-medium transition-colors"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        icon: "⚠️",
      },
    );
  }

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isDeleting}
      className={`p-2 rounded-lg transition-colors ${
        isDeleting
          ? "text-red-400 bg-red-500/10 opacity-50 cursor-not-allowed"
          : "text-[#8E8EA8] hover:text-red-400 hover:bg-red-500/10"
      }`}
      title="Hapus"
    >
      <Trash2 className={`w-4 h-4 ${isDeleting ? "animate-pulse" : ""}`} />
    </button>
  );
}
