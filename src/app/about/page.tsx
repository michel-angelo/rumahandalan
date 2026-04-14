// src/app/about/page.tsx
import { Metadata } from "next";
import AboutAndalan from "@/components/AboutAndalan";

export const metadata: Metadata = {
  title: 'Tentang Kami | Tim di Balik Rumah Andalan',
  description: 'Kenali tim kurator kami: Abdullah (Founder), Kim (Spesialis Area), Aji (Hubungan Klien), dan Basthatan (Legalitas). Kami hadir untuk mengubah industri properti menjadi lebih ramah dan transparan.',
  openGraph: {
    title: 'Kenali Tim Rumah Andalan',
    description: 'Bertemu dengan para spesialis yang siap membantu Anda menemukan hunian terbaik di Depok dengan jujur dan profesional.',
    url: 'https://rumahandalan.com/about',
    images: [{ url: '/about-team.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutAndalan />;
}