import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rumahandalan.com"),
  title: {
    default: "Rumah Andalan | Properti Terpercaya di Depok",
    template: "%s | Rumah Andalan",
  },
  description:
    "Temukan hunian impian Anda di Depok. Rumah Andalan menyediakan properti terpercaya dengan proses transparan dan profesional.",
  keywords: [
    "properti depok",
    "rumah depok",
    "jual rumah depok",
    "agen properti depok",
    "rumah andalan",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.rumahandalan.com",
    siteName: "Rumah Andalan",
    title: "Rumah Andalan | Properti Terpercaya di Depok",
    description: "Temukan hunian impian Anda di Depok bersama Rumah Andalan.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rumah Andalan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumah Andalan | Properti Terpercaya di Depok",
    description: "Temukan hunian impian Anda di Depok bersama Rumah Andalan.",
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
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
