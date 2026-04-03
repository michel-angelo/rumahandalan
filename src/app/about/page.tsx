//src/app/about/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    image: "/about-person2.jpg",
    title: "Kim Arvino",
    subtitle: "Legalitas & KPR",
    description:
      "Kim adalah orang yang akan membaca dokumen properti Anda sebelum Anda sempat bertanya. SHM, SHGB, IMB, PBG — ia yang pastikan semuanya bersih. Ia juga yang mendampingi proses KPR dari awal sampai approval, bukan sekadar merekomendasikan bank lalu pergi.",
  },
  {
    id: "person3",
    image: "/about-person3.jpg",
    title: "Aji Adzdzikri",
    subtitle: "Spesialis Area · Depok",
    description:
      "Tanya Aji soal kawasan mana yang rawan banjir, mana yang tata kotanya sedang berkembang, mana yang harganya masih wajar tapi nilainya akan naik — ia punya jawabannya. Pengetahuan lapangan ini yang membuat klien kami tidak menyesal soal lokasi.",
  },
  {
    id: "person4",
    image: "/about-person4.jpg",
    title: "Basthatan Fi Al Illmi",
    subtitle: "Hubungan Klien",
    description:
      "Basthatan yang memastikan tidak ada klien yang merasa ditinggal di tengah proses. Dari jadwal survei pertama sampai hari tanda tangan AJB, ia yang menjaga komunikasi tetap jernih — semua pertanyaan dijawab dengan data, bukan dengan janji yang terdengar meyakinkan.",
  },
  {
    id: "activity",
    image: "/about-activity.jpg",
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
            Kecil, Gesit, dan <br />
            <span className="italic font-light text-accent">
              Sangat Personal.
            </span>
          </h1>
        </div>

        {/* ── E-Commerce Product Display Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kiri: Super Image & Thumbnails */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Super Image (Aspek Rasio Editorial 4:5 atau 1:1) */}
            <div className="relative w-full aspect-[4/5] md:aspect-square bg-bg-surface overflow-hidden transition-all duration-700">
              <Image
                key={activeItem.id} // Memaksa re-render animasi saat diganti
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-cover animate-fade-in"
                priority
              />
            </div>

            {/* Gallery Thumbnails (Bisa di-scroll nyamping kalau di mobile) */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {galleryData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 transition-all duration-500 overflow-hidden ${
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

          {/* Kanan: Deskripsi (Product Details) */}
          <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-32 lg:py-10">
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

            <Link
              href="/contact"
              className="inline-flex justify-center border border-text-primary text-text-primary px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-text-primary hover:text-white transition-colors self-start"
            >
              Mulai Konsultasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
