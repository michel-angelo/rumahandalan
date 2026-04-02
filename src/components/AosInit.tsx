"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosExperimentalInit() {
  useEffect(() => {
    AOS.init({
      once: true, // WAJIB: Biar elegan, animasi cukup jalan sekali pas pertama muncul
      mirror: false, // Matikan mirror biar elemen nggak hilang pas di-scroll ke atas
      offset: 100, // Sedikit dikurangi biar elemen nggak telat muncul di layar HP
      duration: 850, // 850ms itu sweet spot: nggak kelamaan, tapi kesan "mahal"-nya dapet
      delay: 50, // Delay kecil aja biar nggak kerasa lemot
      easing: "ease-out-cubic", // KUNCI UTAMA: Easing ini geraknya cepat di awal, lalu melambat mulus di akhir (nggak ada pantulan)
      anchorPlacement: "top-bottom",
    });
  }, []);

  return null;
}
