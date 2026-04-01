"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import {
  LayoutDashboard,
  Building2,
  Map,
  MapPin,
  MessageSquare,
  Power,
  Cpu,
  Fingerprint,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properti", href: "/admin/properties", icon: Building2 },
  { label: "Cluster", href: "/admin/clusters", icon: Map },
  { label: "Lokasi", href: "/admin/locations", icon: MapPin },
  { label: "Testimonial", href: "/admin/testimonials", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* AMBIENT GLOW EFFECTS 
        Ini buat ngasih efek cahaya nembus dari belakang glassmorphism
      */}
      <div className="fixed top-0 left-0 w-64 h-full pointer-events-none overflow-hidden z-30">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#2E9AB8]/20 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-[#343270]/30 rounded-full blur-[60px]" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#2E9AB8]/10 rounded-full blur-[80px]" />
      </div>

      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0F0F22]/60 backdrop-blur-2xl border-r border-white/5 flex flex-col z-40 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]">
        {/* LOGO & BRANDING SECTION */}
        <div className="relative px-6 py-8 border-b border-white/5 group">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2E9AB8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <Link href="/" className="flex items-center gap-3 relative z-10">
            {/* Futuristic Hexagon Logo */}
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#2E9AB8]/20 to-[#343270]/20 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(46,154,184,0.15)] group-hover:shadow-[0_0_25px_rgba(46,154,184,0.3)] transition-all duration-500">
              <div className="absolute inset-0 border border-[#2E9AB8]/30 rounded-xl rotate-45 scale-75 opacity-50 transition-transform duration-500 group-hover:rotate-90" />
            </div>

            <div className="flex flex-col">
              <h1 className="font-serif text-white text-xl font-bold tracking-wide">
                RUMAH
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E9AB8] to-[#6DC4D8]">
                  ANDALAN
                </span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]" />
                <span className="text-[#8E8EA8] text-[9px] uppercase tracking-[0.2em] font-mono">
                  SYS.ADMIN_v2
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 px-2">
            Main Interface
          </p>

          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`relative group flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "text-white bg-white/5"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Active Indicator & Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#2E9AB8]/20 to-transparent transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                />
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-r-md bg-[#2E9AB8] transition-all duration-300 shadow-[0_0_10px_#2E9AB8] ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                />

                <Icon
                  className={`relative z-10 w-5 h-5 transition-transform duration-300 ${isActive ? "text-[#AADDE9]" : "group-hover:scale-110"}`}
                />
                <span className="relative z-10 tracking-wide">{label}</span>

                {/* Micro tech-detail on hover */}
                <span
                  className={`absolute right-3 text-[8px] font-mono text-[#2E9AB8]/50 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  [
                  {href.split("/").pop()?.substring(0, 3).toUpperCase() ||
                    "SYS"}
                  ]
                </span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION (User & Logout) */}
        <div className="p-4 mt-auto">
          {/* Security Badge */}
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
            <Fingerprint className="w-8 h-8 text-[#6764A8] opacity-50" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                ADMIN
              </span>
              <span className="text-[12px] text-white font-semibold">
                Rumah Andalan
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-white/[0.06] mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
