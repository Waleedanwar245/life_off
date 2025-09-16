// components/landingSections/TrendingDeals.client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrendingDealsClient() {
  const router = useRouter();

  useEffect(() => {
    const container = document.getElementById("trending-deals-section");
    if (!container) return;

    // Attach image error handlers
    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>("img.trending-img"));
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

    // Intercept coupon anchors to use client side router.push for SPA navigation
    // (keeps ctrl/meta/new-tab behavior intact)
    const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="/coupons/"]'));
    const anchorUnsubs: Array<() => void> = [];
    anchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const handler = (ev: MouseEvent) => {
        // let new-tab / ctrl/meta clicks behave normally
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
