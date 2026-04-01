"use client";

import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    toast.success("Berhasil logout", { id: toastId });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-3 px-4 py-3 w-full text-left text-[14px] font-medium text-[#8E8EA8] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group disabled:opacity-50"
    >
      <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
      <span>{isLoggingOut ? "Keluar..." : "Log Out"}</span>
    </button>
  );
}
