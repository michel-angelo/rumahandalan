// src/app/about/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | Tim di Balik Rumah Andalan",
  description:
    "Kenali tim kurator kami: Abdullah (Founder), Kim (Spesialis Area), Aji (Hubungan Klien), dan Basthatan (Legalitas). Kami hadir untuk mengubah industri properti menjadi lebih ramah dan transparan.",
  openGraph: {
    title: "Kenali Tim Rumah Andalan",
    description:
      "Bertemu dengan para spesialis yang siap membantu Anda menemukan hunian terbaik di Depok dengan jujur dan profesional.",
    url: "https://rumahandalan.com/about",
    images: [{ url: "/about-team.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

const galleryData = [
  {
    id: "agency",
    image: "/about-team.jpg",
    title: "Rumah Andalan",
    subtitle: "Kurator Properti · Depok",
    description:
      "Kami mulai dari satu orang yang tidak puas dengan cara industri properti bekerja. Harga yang tidak transparan, agen yang menghilang setelah tanda tangan, dokumen yang tidak pernah benar-benar dijelaskan. Abdullah mulai sendiri di 2022. Di 2025, Kim, Aji, dan Basthatan bergabung. Kini kami berempat — dan sudah membantu lebih dari 30 keluarga menemukan rumah yang memang cocok untuk mereka.",
  },
  {
    id: "founder",
    image: "/about-person1.jpg",
    title: "Abdullah Ridwan",
    subtitle: "Founder · Kurator Utama",
    description:
      "Abdullah yang memulai semuanya — sendirian, survei sendiri, negosiasi sendiri, urus KPR sendiri. Dari proses itu ia belajar di mana biasanya transaksi properti mulai bermasalah. Sekarang ia yang menetapkan standar: properti seperti apa yang layak masuk katalog, dan mana yang tidak.",
  },
  {
    id: "person2",
    image: "/thumbnail-kim.webp",
    title: "Kim Arvino",
    subtitle: "Spesialis Area · Depok",
    description:
      "Tanya Kim soal kawasan mana yang rawan banjir, mana yang tata kotanya sedang berkembang, mana yang harganya masih wajar tapi nilainya akan naik — ia punya jawabannya. Pengetahuan lapangan ini yang membuat klien kami tidak menyesal soal lokasi.",
  },
  {
    id: "person3",
    image: "/thumbnail-aji.webp",
    title: "Aji Adzdzikri",
    subtitle: "Hubungan Klien",
    description:
      "Aji yang memastikan tidak ada klien yang merasa ditinggal di tengah proses. Dari jadwal survei pertama sampai hari tanda tangan AJB, ia yang menjaga komunikasi tetap jernih — semua pertanyaan dijawab dengan data, bukan dengan janji yang terdengar meyakinkan.",
  },
  {
    id: "person4",
    image: "/thumbnail-basthatan.jpg",
    title: "Basthatan Fi Al Illmi",
    subtitle: "Legalitas & KPR",
    description:
      "Basthatan adalah orang yang akan membaca dokumen properti Anda sebelum Anda sempat bertanya. SHM, SHGB, IMB, PBG — ia yang pastikan semuanya bersih. Ia juga yang mendampingi proses KPR dari awal sampai approval, bukan sekadar merekomendasikan bank lalu pergi.",
  },
  {
    id: "activity",
    image: "/about-activity.jpeg",
    title: "Survei Lapangan",
    subtitle: "Dilihat Langsung, Bukan dari Brosur",
    description:
      "Setiap properti yang masuk katalog kami sudah kami datangi sendiri. Bukan sekadar cek foto — kami lihat struktur bangunannya, rasakan sirkulasi udaranya, perhatikan lingkungan sekitarnya. Kalau kami sendiri tidak nyaman tinggal di sana, kami tidak akan tawarkan ke Anda.",
  },
];

export default function AboutPage() {
  const [activeItem, setActiveItem] = useState(galleryData[0]);

  return (
    <div className="bg-bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ── Heading Asimetris ── */}
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-6 border-l border-accent pl-4">
            Siapa Kami
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-text-primary leading-[1.1] tracking-tight">
            Modern, Ramah, dan <br />
            <span className="italic font-light text-accent">
              Sangat Profesional.
            </span>
          </h1>
        </div>

        {/* ── E-Commerce Product Display Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kiri: Super Image & Thumbnails (Sticky) */}
          <div className="lg:col-span-7 flex flex-col gap-4 sticky top-20 lg:top-32 z-20 bg-bg-page py-2 -mx-5 px-5 lg:mx-0 lg:px-0 lg:py-0">
            {/* Super Image - Dikecilkan lebarnya di mobile (w-[80%]) tapi tetap rasio 4:5 */}
            <div className="relative w-[80%] mx-auto lg:w-full aspect-[4/5] md:aspect-square bg-bg-surface overflow-hidden transition-all duration-700 shadow-sm lg:shadow-none">
              <Image
                key={activeItem.id}
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-cover animate-fade-in"
                priority
              />
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex justify-center lg:justify-start gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galleryData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    if (window.innerWidth < 1024) {
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }
                  }}
                  className={`relative w-14 h-14 sm:w-28 sm:h-28 flex-shrink-0 transition-all duration-500 overflow-hidden ${
                    activeItem.id === item.id
                      ? "border-b-2 border-text-primary grayscale-0 scale-100"
                      : "grayscale opacity-60 hover:opacity-100 hover:grayscale-0 scale-95"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={`Thumbnail ${item.title}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Kanan: Deskripsi (Dapat di-scroll) */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:py-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-4 animate-fade-in-up">
              {activeItem.subtitle}
            </p>

            <h2
              key={activeItem.title}
              className="font-display text-4xl lg:text-5xl text-text-primary mb-8 animate-fade-in-up"
            >
              {activeItem.title}
            </h2>

            <div className="w-12 h-[1px] bg-accent mb-8"></div>

            <p
              key={activeItem.description}
              className="text-[15px] text-text-secondary leading-relaxed font-body mb-12 animate-fade-in-up"
            >
              {activeItem.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=Halo%20tim%20Rumah%20Andalan,%20saya%20habis%20baca%20profil%20timnya%20dan%20ingin%20konsultasi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center bg-text-primary text-bg-page px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors"
              >
                Chat via WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex justify-center border border-text-primary text-text-primary px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-white transition-colors"
              >
                Jadwal Kunjungan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
