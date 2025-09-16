// components/landingSections/MerchantCard.client.tsx
"use client";

import { useEffect, useRef } from "react";

export default function MerchantCardClient() {
  const intervalRef = useRef<number | null>(null);
  const pageIndexRef = useRef(0);
  const cleanupRefs = useRef<{ dotHandlers: (() => void)[]; cardHandlers: (() => void)[] }>({
    dotHandlers: [],
    cardHandlers: [],
  });

  useEffect(() => {
    const wrapper = document.querySelector<HTMLElement>(".merchant-slider");
    if (!wrapper) return;

    const inner = wrapper.querySelector<HTMLElement>(".merchant-slider-inner");
    const prevBtn = document.querySelector<HTMLElement>(".hero-merchant-prev");
    const nextBtn = document.querySelector<HTMLElement>(".hero-merchant-next");
    const cardEls = Array.from(wrapper.querySelectorAll<HTMLElement>(".merchant-card"));
    const dotsContainer = document.querySelector<HTMLElement>(".merchant-dots");

    if (!inner || cardEls.length === 0 || !dotsContainer) return;

    // original count is half because server duplicated list
    const originalCount = Math.max(1, Math.floor(cardEls.length / 2));

    // measure sizes
    const measure = () => {
      const first = cardEls[0];
      const rect = first.getBoundingClientRect();
      const style = window.getComputedStyle(inner);
      const gap = parseFloat(style.gap || "24") || 24;
      const slideWidth = rect.width + gap;
      const visibleCount = Math.max(1, Math.floor(wrapper.clientWidth / slideWidth));
      return { slideWidth, visibleCount };
    };

    let { slideWidth, visibleCount } = measure();

    // compute pages
    let pages = Math.max(1, Math.ceil(originalCount / visibleCount));
    const buildDots = () => {
      // clear existing
      while (dotsContainer.firstChild) dotsContainer.removeChild(dotsContainer.firstChild);
      cleanupRefs.current.dotHandlers = [];

      for (let p = 0; p < pages; p++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.pageIndex = String(p);
        btn.className = p === 0 ? "w-3 h-3 rounded-full bg-gray-600" : "w-3 h-3 rounded-full bg-gray-300";
        btn.style.margin = "0 6px";
        btn.addEventListener("click", () => gotoPage(p));
        cleanupRefs.current.dotHandlers.push(() => btn.removeEventListener("click", () => gotoPage(p)));
        dotsContainer.appendChild(btn);
      }
    };

    const updateActiveDot = (page: number) => {
      const children = Array.from(dotsContainer.children) as HTMLElement[];
      children.forEach((c, i) => {
        c.className = i === page ? "w-3 h-3 rounded-full bg-gray-600" : "w-3 h-3 rounded-full bg-gray-300";
      });
    };

    const gotoPage = (page: number) => {
      pageIndexRef.current = ((page % pages) + pages) % pages;
      const targetIndex = pageIndexRef.current * visibleCount;
      inner.style.transform = `translateX(-${targetIndex * slideWidth}px)`;
      updateActiveDot(pageIndexRef.current);
    };

    const onNext = () => gotoPage(pageIndexRef.current + 1);
    const onPrev = () => gotoPage(pageIndexRef.current - 1);

    // Attach prev/next
    nextBtn?.addEventListener("click", onNext);
    prevBtn?.addEventListener("click", onPrev);

    // Card click navigation (use dataset slug)
    cleanupRefs.current.cardHandlers = [];
    cardEls.forEach((card) => {
      const handler = () => {
        const slug = card.dataset.slug;
        if (slug) {
          // Prefer client-side routing if you later swap in next/router inside client component.
          window.location.href = `/coupons/${slug}`;
        }
      };
      card.addEventListener("click", handler);
      cleanupRefs.current.cardHandlers.push(() => card.removeEventListener("click", handler));
    });

    // Auto-play, page based
    const startAuto = () => {
      stopAuto();
      intervalRef.current = window.setInterval(() => {
        gotoPage(pageIndexRef.current + 1);
      }, 4000);
    };
    const stopAuto = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // rebuild on resize
    const onResize = () => {
      const measured = measure();
      slideWidth = measured.slideWidth;
      visibleCount = measured.visibleCount;
      pages = Math.max(1, Math.ceil(originalCount / visibleCount));
      // ensure pageIndexRef within range
      if (pageIndexRef.current >= pages) pageIndexRef.current = 0;
      buildDots();
      gotoPage(pageIndexRef.current);
    };
    window.addEventListener("resize", onResize);

    // initialize
    buildDots();
    gotoPage(0);
    startAuto();

    // Pause on hover
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);

    // cleanup
    return () => {
      nextBtn?.removeEventListener("click", onNext);
      prevBtn?.removeEventListener("click", onPrev);
      cleanupRefs.current.dotHandlers.forEach((un) => un());
      cleanupRefs.current.cardHandlers.forEach((un) => un());
      wrapper.removeEventListener("mouseenter", stopAuto);
      wrapper.removeEventListener("mouseleave", startAuto);
      window.removeEventListener("resize", onResize);
      stopAuto();
    };
  }, []);

  return null;
}
