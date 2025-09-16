// components/landingSections/Categories.client.tsx
"use client";
import { useEffect } from "react";

export default function CategoriesClient() {
  useEffect(() => {
    const section = document.getElementById("categories-section");
    if (!section) return;

    const mobileTabs = Array.from(section.querySelectorAll<HTMLElement>(".category-mobile-tab"));
    const desktopTabs = Array.from(section.querySelectorAll<HTMLElement>(".category-desktop-tab"));
    const dealsBlocks = Array.from(section.querySelectorAll<HTMLElement>(".category-deals"));
    const categoriesListRef = section.querySelector<HTMLElement>(".categories-list-ref");
    const verticalLine = section.querySelector<HTMLElement>(".categories-vertical-line");

    const setSelected = (index: number) => {
      mobileTabs.forEach((el) => {
        const idx = Number(el.dataset.categoryIndex);
        if (idx === index) el.classList.add("selected"); else el.classList.remove("selected");
      });
      desktopTabs.forEach((el) => {
        const idx = Number(el.dataset.categoryIndex);
        if (idx === index) el.classList.add("selected"); else el.classList.remove("selected");
      });
      dealsBlocks.forEach((block) => {
        const idx = Number(block.dataset.dealsIndex);
        if (idx === index) block.classList.remove("hidden"); else block.classList.add("hidden");
      });
      updateLineHeight();
    };

    const mobileUnsubs: Array<() => void> = [];
    mobileTabs.forEach((el) => {
      const idx = Number(el.dataset.categoryIndex);
      const handler = () => setSelected(idx);
      el.addEventListener("click", handler);
      mobileUnsubs.push(() => el.removeEventListener("click", handler));
    });

    const desktopUnsubs: Array<() => void> = [];
    desktopTabs.forEach((el) => {
      const idx = Number(el.dataset.categoryIndex);
      const handler = () => setSelected(idx);
      el.addEventListener("click", handler);
      desktopUnsubs.push(() => el.removeEventListener("click", handler));
    });

    // image fallback handlers
    const imgEls = Array.from(section.querySelectorAll<HTMLImageElement>("img.category-logo"));
    const imgUnsubs: Array<() => void> = [];
    imgEls.forEach((img) => {
      const handler = () => {
        const fallback = img.dataset.fallback || "/placeholder.svg";
        if (img.src !== fallback) img.src = fallback;
        img.onerror = null;
      };
      img.addEventListener("error", handler);
      imgUnsubs.push(() => img.removeEventListener("error", handler));
    });

    const updateLineHeight = () => {
      if (!categoriesListRef || !verticalLine) return;
      const height = categoriesListRef.clientHeight || 0;
      verticalLine.style.height = `${Math.max(0, height - 24)}px`;
    };

    setSelected(0);

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => updateLineHeight(), 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mobileUnsubs.forEach((u) => u());
      desktopUnsubs.forEach((u) => u());
      imgUnsubs.forEach((u) => u());
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
