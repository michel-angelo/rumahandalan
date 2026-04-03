// src/app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AosInit from "@/components/AosInit";
import { GoogleAnalytics } from "@next/third-parties/google"; // <-- 1. Import GA

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rumahandalan.com"),
  title: {
    default: "Rumah Andalan | Kurator Properti Eksklusif di Depok",
    template: "%s | Rumah Andalan",
  },
  description:
    "Kami tim 4 orang yang sudah membantu 30+ keluarga menemukan rumah yang tepat di Depok sejak 2022. Tanpa mark-up, tanpa biaya tersembunyi.",
  keywords: [
    "properti premium depok",
    "rumah eksklusif depok",
    "kurator properti",
    "agen properti depok",
    "rumah andalan",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.rumahandalan.com",
    siteName: "Rumah Andalan",
    title: "Rumah Andalan | Kurator Properti Eksklusif",
    description:
      "Tim kurator properti Depok. 30+ transaksi selesai, pendampingan dari survei sampai AJB.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rumah Andalan - Kurator Properti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumah Andalan | Kurator Properti Eksklusif",
    description:
      "Tim kurator properti Depok. 30+ transaksi selesai, pendampingan dari survei sampai AJB.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // 2. TAMBAHKAN META VERIFIKASI GOOGLE SEARCH CONSOLE DI SINI
  verification: {
    google: "3zIB7Wo09DzzyWvZHFysesxTZvQ78Z-a0aMQhUTe9BA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${dmSans.variable} ${lora.variable} font-body bg-bg-page text-text-primary antialiased`}
        suppressHydrationWarning
      >
        <AosInit />
        <Navbar />
        {/* Hapus class pt-20 karena halaman (page.tsx) sudah mengatur padding/margin secara individual */}
        <main>{children}</main>
        <Footer />

        {/* 3. PASANG SCRIPT GOOGLE ANALYTICS DI SINI */}
        <GoogleAnalytics gaId="G-2XSM5XF1BY" />
      </body>
    </html>
  );
}
