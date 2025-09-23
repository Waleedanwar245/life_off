// components/landingSections/Categories.client.tsx
"use client";
import { useEffect } from "react";

/**
 * Client behaviour:
 * - Toggle only utility classes (don't overwrite full className) so inner SVG/icon classes stay intact
 * - Ensure icon wrapper gets the correct color (via style.color) so SVG (currentColor) is visible
 * - Show/hide .category-deals and update vertical line height
 */

export default function CategoriesClient() {
  useEffect(() => {
    const section = document.getElementById("categories-section");
    if (!section) return;

    const mobileTabs = Array.from(section.querySelectorAll<HTMLElement>(".category-mobile-tab"));
    const desktopTabs = Array.from(section.querySelectorAll<HTMLElement>(".category-desktop-tab"));
    const dealsBlocks = Array.from(section.querySelectorAll<HTMLElement>(".category-deals"));
    const categoriesListRef = section.querySelector<HTMLElement>(".categories-list-ref");
    const verticalLine = section.querySelector<HTMLElement>(".categories-vertical-line");

    // toggle helper for mobile tab circle and label
    const setMobileTabSelected = (el: HTMLElement, selected: boolean) => {
      // circle is the first inner div (per server markup)
      const circle = el.querySelector<HTMLElement>("div");
      const label = el.querySelector<HTMLElement>("span");

      if (circle) {
        circle.classList.toggle("bg-[#14303B]", selected);
        circle.classList.toggle("bg-white", !selected);

        circle.classList.toggle("text-white", selected);
        circle.classList.toggle("text-[#14303B]", !selected);
      }

      if (label) {
        label.classList.toggle("text-white", selected);
        label.classList.toggle("font-semibold", selected);
        label.classList.toggle("text-gray-800", !selected);
      }

      // color the icon by using the svg parent's color (react-icons use currentColor)
      const svg = el.querySelector<SVGElement>("svg");
      if (svg && svg.parentElement) {
        (svg.parentElement as HTMLElement).style.color = selected ? "#14303B" : "#ffffff";
      }

      el.classList.toggle("selected", selected);
    };

    // toggle helper for desktop tab circle and label
    const setDesktopTabSelected = (el: HTMLElement, selected: boolean) => {
      // circle has class w-9 in server markup
      const circle = el.querySelector<HTMLElement>(".w-9");
      const label = el.querySelector<HTMLElement>("span");

      if (circle) {
        circle.classList.toggle("bg-white", selected);
        circle.classList.toggle("bg-[#14303B]", !selected);
      }

      if (label) {
        label.classList.toggle("text-[#14303B]", selected);
        label.classList.toggle("font-semibold", selected);
        label.classList.toggle("font-medium", !selected);
      }

      // set svg / icon color via parent element style (safe and reliable)
      const svg = el.querySelector<SVGElement>("svg");
      if (svg && svg.parentElement) {
        (svg.parentElement as HTMLElement).style.color = selected ? "#14303B" : "#ffffff";
      }

      el.classList.toggle("selected", selected);
    };

    const setSelected = (index: number) => {
      mobileTabs.forEach((el) => {
        const idx = Number(el.dataset.categoryIndex ?? -1);
        setMobileTabSelected(el, idx === index);
      });

      desktopTabs.forEach((el) => {
        const idx = Number(el.dataset.categoryIndex ?? -1);
        setDesktopTabSelected(el, idx === index);
      });

      dealsBlocks.forEach((block) => {
        const idx = Number(block.dataset.dealsIndex ?? -1);
        if (idx === index) {
          block.classList.remove("hidden");
          block.setAttribute("aria-hidden", "false");
        } else {
          block.classList.add("hidden");
          block.setAttribute("aria-hidden", "true");
        }
      });

      updateLineHeight();
    };

    // attach click handlers
    const mobileUnsubs: Array<() => void> = [];
    mobileTabs.forEach((el) => {
      const idx = Number(el.dataset.categoryIndex ?? -1);
      const handler = () => setSelected(idx);
      el.addEventListener("click", handler);
      mobileUnsubs.push(() => el.removeEventListener("click", handler));
    });

    const desktopUnsubs: Array<() => void> = [];
    desktopTabs.forEach((el) => {
      const idx = Number(el.dataset.categoryIndex ?? -1);
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
        try {
          if (!img.src.includes(fallback)) img.src = fallback;
        } catch (e) {}
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

    // initial selected
    const firstIndex = mobileTabs.length ? Number(mobileTabs[0].dataset.categoryIndex ?? 0) : 0;
    setSelected(firstIndex);

    // keep the line height accurate on resize
    let resizeTimer: number | undefined;
    const onResize = () => {
      if (typeof window === "undefined") return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => updateLineHeight(), 120);
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
