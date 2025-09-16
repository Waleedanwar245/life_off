// components/landingSections/TopDealsSlider.client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TopDealsSliderClient() {
  const router = useRouter();

  useEffect(() => {
    const container = document.getElementById("top-deals-section");
    if (!container) return;

    // Attach image fallback handlers
    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>("img.top-deal-img"));
    const imgUnsubs: Array<() => void> = [];
    imgs.forEach((img) => {
      const onError = () => {
        const fallback = img.dataset.fallback || "/placeholder.svg";
        if (img.src !== fallback) img.src = fallback;
        img.onerror = null;
      };
      img.addEventListener("error", onError);
      imgUnsubs.push(() => img.removeEventListener("error", onError));
    });

    // Optional: Intercept internal links (href starting with "/") and use router.push for SPA navigation
    // Keep external links (http/https) opening in new tab as originally intended.
    const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'));
    const anchorUnsubs: Array<() => void> = [];

    anchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      // if link is internal to this site, intercept
      const isInternal = href.startsWith("/");
      if (!isInternal) return;

      const handler = (ev: MouseEvent) => {
        // allow ctrl/meta/middle click to open a new tab
        if (ev.metaKey || ev.ctrlKey || ev.button === 1) return;
        ev.preventDefault();
        router.push(href);
      };
      a.addEventListener("click", handler);
      anchorUnsubs.push(() => a.removeEventListener("click", handler));
    });

    return () => {
      imgUnsubs.forEach((u) => u());
      anchorUnsubs.forEach((u) => u());
    };
  }, [router]);

  return null;
}
