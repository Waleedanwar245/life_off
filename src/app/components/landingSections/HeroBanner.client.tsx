// components/landingSections/HeroBanner.client.tsx
"use client";

import { useEffect, useRef } from "react";

export default function HeroBannerClient() {
  const autoplayRef = useRef<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const slider = document.querySelector<HTMLDivElement>(".hero-slider");
    if (!slider) return;

    const inner = slider.querySelector<HTMLDivElement>(".hero-slider-inner");
    const slides = Array.from(slider.querySelectorAll<HTMLElement>(".hero-slide"));
    const prevBtn = slider.querySelector<HTMLElement>(".hero-prev");
    const nextBtn = slider.querySelector<HTMLElement>(".hero-next");
    const dotButtons = Array.from(slider.querySelectorAll<HTMLElement>(".hero-dots [data-dot-index]"));
    const ctas = Array.from(slider.querySelectorAll<HTMLElement>(".hero-cta"));

    if (!inner || slides.length === 0) return;

    const slideCount = slides.length;

    const update = (idx: number) => {
      const safe = ((idx % slideCount) + slideCount) % slideCount;
      indexRef.current = safe;
      inner.style.transform = `translateX(-${safe * 100}%)`;

      // update dots visual
      dotButtons.forEach((d) => d.classList.remove("bg-white"));
      const activeDot = slider.querySelector<HTMLElement>(`.hero-dots [data-dot-index="${safe}"]`);
      if (activeDot) activeDot.classList.add("bg-white");
    };

    // Named handlers so we can remove them later
    const onNext = () => update(indexRef.current + 1);
    const onPrev = () => update(indexRef.current - 1);
    const dotHandlers: Array<() => void> = [];
    dotButtons.forEach((d) => {
      const handler = () => {
        const n = Number(d.dataset.dotIndex ?? 0);
        update(n);
      };
      dotHandlers.push(handler);
      d.addEventListener("click", handler);
    });

    // CTA handlers
    const ctaHandlers: Array<() => void> = [];
    ctas.forEach((btn) => {
      const handler = () => {
        const url = btn.getAttribute("data-slide-link");
        if (url) window.open(url, "_blank");
      };
      ctaHandlers.push(handler);
      btn.addEventListener("click", handler);
    });

    // Attach prev/next
    nextBtn?.addEventListener("click", onNext);
    prevBtn?.addEventListener("click", onPrev);

    // Autoplay
    const startAutoplay = () => {
      stopAutoplay();
      autoplayRef.current = window.setInterval(() => {
        update(indexRef.current + 1);
      }, 5000);
    };
    const stopAutoplay = () => {
      if (autoplayRef.current !== null) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    // initialize
    update(0);
    startAutoplay();

    // cleanup
    return () => {
      nextBtn?.removeEventListener("click", onNext);
      prevBtn?.removeEventListener("click", onPrev);
      dotButtons.forEach((d, i) => d.removeEventListener("click", dotHandlers[i]));
      ctas.forEach((btn, i) => btn.removeEventListener("click", ctaHandlers[i]));
      slider.removeEventListener("mouseenter", stopAutoplay);
      slider.removeEventListener("mouseleave", startAutoplay);
      stopAutoplay();
    };
  }, []);

  return null;
}
