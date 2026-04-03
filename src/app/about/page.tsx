"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Data Kurasi Tim & Kegiatan ──────────────────────────────────────────────
// Anda tinggal ganti teks dan path gambarnya nanti
const galleryData = [
  {
    id: "agency",
    image: "/about-team.jpg", // Ganti dengan foto tim berempat
    title: "Rumah Andalan",
    subtitle: "Kurator Properti Depok",
    description:
      "Membeli rumah adalah keputusan finansial terbesar dalam hidup. Kami didirikan dari kegelisahan atas industri properti yang abu-abu. Kami berempat bukan sekadar agen; kami adalah kurator, negosiator, dan pelindung legalitas Anda. Kami bekerja dalam tim kecil agar setiap klien mendapatkan pendampingan yang intens, privat, dan tanpa kompromi.",
  },
  {
    id: "founder",
    image: "/about-person1.jpg", // Ganti dengan foto Anda
    title: "Nama Anda",
    subtitle: "Principal & Kurator Utama",
    description:
      "Mendedikasikan waktunya untuk menyeleksi properti dengan standar ketat. Memastikan setiap rumah yang masuk ke dalam katalog kami tidak hanya memiliki estetika yang baik, tapi juga struktur bangunan yang solid dan nilai investasi yang logis.",
  },
  {
    id: "person2",
    image: "/about-person2.jpg", // Ganti dengan foto tim ke-2
    title: "Nama Anggota 2",
    subtitle: "Pakar Legalitas & KPR",
    description:
      "Garis pertahanan pertama kami melawan sengketa hukum. Bertanggung jawab membedah sertifikat (SHM/SHGB), IMB/PBG, dan memastikan proses KPR klien berjalan mulus bersama bank rekanan tanpa biaya tersembunyi.",
  },
  {
    id: "person3",
    image: "/about-person3.jpg", // Ganti dengan foto tim ke-3
    title: "Nama Anggota 3",
    subtitle: "Spesialis Area Depok",
    description:
      "Lahir dan besar di Depok. Mengenal setiap gang, rencana tata kota, hingga riwayat banjir di setiap kawasan. Wawasannya memastikan klien membeli properti di lokasi yang secara jangka panjang menguntungkan.",
  },
  {
    id: "person4",
    image: "/about-person4.jpg", // Ganti dengan foto tim ke-4
    title: "Nama Anggota 4",
    subtitle: "Manajer Hubungan Klien",
    description:
      "Mendampingi klien dari survei pertama hingga serah terima kunci. Menjaga komunikasi tetap transparan dan memastikan setiap pertanyaan teknis dari klien terjawab dengan data, bukan janji manis.",
  },
  {
    id: "activity",
    image: "/about-activity.jpg", // Ganti dengan foto lagi survei
    title: "Survei Lapangan",
    subtitle: "Verifikasi Tanpa Kompromi",
    description:
      "Kami tidak menjual properti hanya dari brosur. Ini adalah potret saat kami mengecek kualitas material dan sirkulasi udara di salah satu cluster. Jika tidak layak untuk keluarga kami sendiri, maka tidak akan kami tawarkan kepada Anda.",
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
