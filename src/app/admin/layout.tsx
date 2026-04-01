import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#05050A] text-[#EEEDF8] flex overflow-hidden font-sans selection:bg-[#2E9AB8] selection:text-white">
      {/* BACKGROUND EFFECTS: Sci-fi Grid Hologram */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* AMBIENT NEON LIGHTS */}
      <div className="absolute top-[-10%] left-1/3 w-[40%] h-[40%] bg-[#285090] rounded-full blur-[150px] opacity-20 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-[#2E9AB8] rounded-full blur-[150px] opacity-10 pointer-events-none z-0" />

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 relative z-10 h-screen overflow-hidden flex flex-col">
        {/* Top HUD Laser Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2E9AB8]/60 to-transparent opacity-70 shadow-[0_0_10px_#2E9AB8]" />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
          {/* HUD Corner Brackets (Decorative) */}
          <div className="fixed top-6 left-[17rem] w-12 h-12 border-t-2 border-l-2 border-[#2E9AB8]/30 rounded-tl-lg pointer-events-none z-20" />
          <div className="fixed top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#2E9AB8]/30 rounded-tr-lg pointer-events-none z-20" />
          <div className="fixed bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#2E9AB8]/30 rounded-br-lg pointer-events-none z-20" />

          {children}
        </div>
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1E1E2E",
            color: "#EEEDF8",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "13px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "#1E1E2E" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#1E1E2E" } },
        }}
      />

      {/* GLOBAL SCI-FI SCROLLBAR STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 15, 34, 0.3);
          border-left: 1px solid rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(46, 154, 184, 0.4);
          border-radius: 10px;
          box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(46, 154, 184, 0.9);
        }
      `}</style>
    </div>
  );
}
