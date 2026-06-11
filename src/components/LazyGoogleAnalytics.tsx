"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function LazyGoogleAnalytics({ gaId }: { gaId: string }) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setLoad(true);
      cleanListeners();
    };

    const events = ["pointermove", "scroll", "touchstart", "keydown", "click"];

    const addListeners = () => {
      events.forEach((event) => {
        window.addEventListener(event, handleInteraction, { passive: true });
      });
    };

    const cleanListeners = () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };

    // Fallback load after 4 seconds if no interaction occurs
    const timeoutId = setTimeout(() => {
      setLoad(true);
      cleanListeners();
    }, 4000);

    addListeners();

    return () => {
      clearTimeout(timeoutId);
      cleanListeners();
    };
  }, []);

  if (!load) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
