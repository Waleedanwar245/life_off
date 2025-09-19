// app/components/category/CategoriesCarousel.client.tsx
"use client";

import { useEffect } from "react";

export default function CategoriesCarouselClient() {
  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>("[data-cat-scroll]");
    const prevBtn = document.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const nextBtn = document.querySelector<HTMLButtonElement>("[data-carousel-next]");

    // if any required element is missing, bail out (safe)
    if (!scroller || !prevBtn || !nextBtn) return;

    // Narrowed non-null references for TypeScript
    const scrollerEl = scroller as HTMLElement;
    const prevBtnEl = prevBtn as HTMLButtonElement;
    const nextBtnEl = nextBtn as HTMLButtonElement;

    // compute scroll based on first item width + gap (gap-16 ~ 64px)
    function computeScrollAmount(): number {
      const item = scrollerEl.querySelector<HTMLElement>("[data-cat-item]");
      if (!item) return scrollerEl.clientWidth;
      const gap = 64; // matches gap-16 in server markup
      return item.offsetWidth + gap;
    }

    function updateButtons(): void {
      prevBtnEl.disabled = scrollerEl.scrollLeft <= 5;
      nextBtnEl.disabled = scrollerEl.scrollLeft + scrollerEl.clientWidth >= scrollerEl.scrollWidth - 5;
      prevBtnEl.classList.toggle("opacity-50", prevBtnEl.disabled);
      nextBtnEl.classList.toggle("opacity-50", nextBtnEl.disabled);
    }

    let scrollAmount = computeScrollAmount();

    const onNext = (): void => {
      scrollAmount = computeScrollAmount();
      scrollerEl.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    const onPrev = (): void => {
      scrollAmount = computeScrollAmount();
      scrollerEl.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    };

    const onScroll = (): void => updateButtons();

    const onResize = (): void => {
      scrollAmount = computeScrollAmount();
      updateButtons();
    };

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    // Attach listeners
    nextBtnEl.addEventListener("click", onNext);
    prevBtnEl.addEventListener("click", onPrev);
    scrollerEl.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);

    // initial state
    updateButtons();

    // Cleanup
    return () => {
      nextBtnEl.removeEventListener("click", onNext);
      prevBtnEl.removeEventListener("click", onPrev);
      scrollerEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
