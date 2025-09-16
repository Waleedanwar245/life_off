// components/landingSections/Blogs.client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogsClient() {
  const router = useRouter();

  useEffect(() => {
    const container = document.getElementById("blogs-section");
    if (!container) return;

    // Image fallback handlers
    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>("img.blog-img"));
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

    // Intercept internal /blog/ anchors to use next/router for SPA navigation
    const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="/blog/"]'));
    const anchorUnsubs: Array<() => void> = [];

    anchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const handler = (ev: MouseEvent) => {
        // preserve ctrl/meta / middle click
        if (ev.metaKey || ev.ctrlKey || ev.button === 1) return;
        ev.preventDefault();
        router.push(href);
      };
      a.addEventListener("click", handler);
      anchorUnsubs.push(() => a.removeEventListener("click", handler));
    });

    return () => {
      imgUnsubs.forEach((u) => { try { u(); } catch {} });
      anchorUnsubs.forEach((u) => { try { u(); } catch {} });
    };
  }, [router]);

  return null;
}
