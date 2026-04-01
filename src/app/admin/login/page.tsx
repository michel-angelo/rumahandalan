"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { Fingerprint } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Email dan password harus diisi!");
      return;
    }

    const toastId = toast.loading("Memverifikasi kredensial...");
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Akses ditolak. Email atau password salah.", { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Login berhasil! Mengalihkan...", { id: toastId });
    router.push("/admin");
    router.refresh();
  }

  return (
    // Trik z-[100] ini yang bikin Sidebar admin ketutup rapat!
    <div className="fixed inset-0 z-[100] bg-[#05050A] flex items-center justify-center px-5 selection:bg-[#2E9AB8] selection:text-white">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#2E9AB8]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(46,154,184,0.15)]">
            <Fingerprint className="w-8 h-8 text-[#2E9AB8]" />
          </div>
          <h1 className="font-serif text-white text-3xl font-bold tracking-wide">
            RUMAH
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E9AB8] to-[#6DC4D8]">
              ANDALAN
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]" />
            <p className="text-[#8E8EA8] text-[11px] uppercase tracking-widest font-mono">
              Secure System Access
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#12121C]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          <div>
            <label className="text-[11px] font-semibold text-[#8E8EA8] uppercase tracking-wider mb-2 block">
              Email Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rumahandalan.com"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white placeholder-[#8E8EA8]/40 focus:outline-none focus:border-[#2E9AB8] focus:ring-1 focus:ring-[#2E9AB8] transition-all text-[14px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8E8EA8] uppercase tracking-wider mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white placeholder-[#8E8EA8]/40 focus:outline-none focus:border-[#2E9AB8] focus:ring-1 focus:ring-[#2E9AB8] transition-all text-[14px]"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#2E9AB8] to-[#2589a4] hover:from-[#2589a4] hover:to-[#1e738a] text-white font-bold tracking-wide rounded-xl text-[13px] transition-all shadow-[0_0_20px_rgba(46,154,184,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
          </button>
        </div>
      </div>
    </div>
  );
}
