import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AosInit from "@/components/AosInit";

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
    "Agensi butik yang mengkurasi mahakarya arsitektur dan properti bernilai tinggi di Depok. Melayani dengan integritas, transparansi, dan standar tanpa kompromi.",
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
      "Agensi butik yang mengkurasi mahakarya arsitektur dan properti bernilai tinggi di Depok.",
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
      "Agensi butik yang mengkurasi mahakarya arsitektur dan properti bernilai tinggi di Depok.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
      </body>
    </html>
  );
}
