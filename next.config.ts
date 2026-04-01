import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "venewqaomxlhdujcakcy.supabase.co",
      },
    ],
  },
};

export default nextConfig;
