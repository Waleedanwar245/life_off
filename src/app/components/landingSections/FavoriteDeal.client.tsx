// components/landingSections/FavoriteDeal.client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteDealClient() {
  const router = useRouter();

  useEffect(() => {
    const container = document.getElementById("favorite-deal-section");
    if (!container) return;

    // Attach image fallback handlers (favorite images + product images)
    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>("img.favorite-img, img.favorite-product-img"));
    const imgUnsubs: Array<() => void> = [];

    imgs.forEach((img) => {
      const handler = () => {
        const fallback = img.dataset.fallback || "/placeholder.svg";
        if (img.src !== fallback) img.src = fallback;
        img.onerror = null;
      };
      img.addEventListener("error", handler);
      imgUnsubs.push(() => img.removeEventListener("error", handler));
    });

    // Intercept internal seasonal anchors to use client-side router.push for SPA navigation
    const internalAnchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="/seasonal/"]'));
    const anchorUnsubs: Array<() => void> = [];

    internalAnchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const handler = (ev: MouseEvent) => {
        // allow ctrl/meta / middle-click to open new tab normally
        if (ev.metaKey || ev.ctrlKey || ev.button === 1) return;
        ev.preventDefault();
        router.push(href);
      };
      a.addEventListener("click", handler);
      anchorUnsubs.push(() => a.removeEventListener("click", handler));
    });

    // cleanup on unmount
    return () => {
      imgUnsubs.forEach((u) => {
        try { u(); } catch {}
      });
      anchorUnsubs.forEach((u) => {
        try { u(); } catch {}
      });
    };
  }, [router]);

  return null;
}
