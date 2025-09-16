// components/landingSections/CouponTabs.client.tsx
"use client";

import { useEffect } from "react";

export default function CouponTabsClient() {
  useEffect(() => {
    const section = document.getElementById("coupon-tabs");
    if (!section) return;

    const grid = section.querySelector<HTMLElement>(".coupon-tabs-grid");
    if (!grid) return;

    // Create tabs container
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "mb-6 flex flex-wrap justify-center gap-3 coupon-tabs-controls";
    const heading = section.querySelector("h2");
    if (heading && heading.parentNode) heading.parentNode.insertBefore(tabsContainer, heading.nextSibling);
    else section.insertBefore(tabsContainer, grid);

    // Items (cards)
    const items = Array.from(grid.querySelectorAll<HTMLElement>(".coupon-card"));

    // Build store list from img alt or card text
    const storeMap = new Map<string, string>();
    items.forEach((it) => {
      const img = it.querySelector<HTMLImageElement>("img.coupon-img");
      let name = "";
      if (img && img.alt) name = img.alt.replace(/\s*logo$/i, "").trim();
      if (!name) name = (it.textContent || "").trim().split("\n")[0].trim();
      if (!name) return;
      const key = name.toLowerCase();
      if (!storeMap.has(key)) storeMap.set(key, name);
    });
    const storeNames = Array.from(storeMap.values());

    // Helper to create a tab button
    const makeTab = (label: string, active = false) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = [
        "px-3", "py-1", "rounded", "text-sm", "transition",
        active ? "bg-[#96C121] text-white" : "bg-white border border-gray-200 text-gray-800"
      ].join(" ");
      btn.textContent = label;
      return btn;
    };

    // Show/hide helpers
    const showAll = () => items.forEach((it) => (it.style.display = ""));
    const filterBy = (label: string) => {
      const norm = label.toLowerCase();
      items.forEach((it) => {
        const img = it.querySelector<HTMLImageElement>("img.coupon-img");
        let name = "";
        if (img && img.alt) name = img.alt.replace(/\s*logo$/i, "").trim();
        if (!name) name = (it.textContent || "").trim().split("\n")[0].trim();
        it.style.display = name.toLowerCase().includes(norm) ? "" : "none";
      });
    };

    // Build tabs
    const unlisteners: Array<() => void> = [];
    const allBtn = makeTab("All", true);
    tabsContainer.appendChild(allBtn);
    const allHandler = () => { showAll(); setActive(allBtn); };
    allBtn.addEventListener("click", allHandler);
    unlisteners.push(() => allBtn.removeEventListener("click", allHandler));

    const tabButtons: HTMLButtonElement[] = [];
    storeNames.forEach((s) => {
      const b = makeTab(s, false);
      tabsContainer.appendChild(b);
      const handler = () => { filterBy(s); setActive(b); };
      b.addEventListener("click", handler);
      unlisteners.push(() => b.removeEventListener("click", handler));
      tabButtons.push(b);
    });

    const setActive = (activeBtn: HTMLElement | null) => {
      Array.from(tabsContainer.children).forEach((c) => {
        if (c === activeBtn) {
          c.classList.remove("bg-white", "border", "border-gray-200", "text-gray-800");
          c.classList.add("bg-[#96C121]", "text-white");
        } else {
          c.classList.remove("bg-[#96C121]", "text-white");
          c.classList.add("bg-white", "border", "border-gray-200", "text-gray-800");
        }
      });
    };

    // Attach onerror fallback to images (client-side)
    const imgs = Array.from(section.querySelectorAll<HTMLImageElement>("img.coupon-img"));
    const imgUnlisteners: Array<() => void> = [];
    imgs.forEach((img) => {
      const handler = () => {
        const fallback = img.dataset.fallback || "/placeholder.svg";
        if (img.src !== fallback) img.src = fallback;
        img.onerror = null;
      };
      img.addEventListener("error", handler);
      imgUnlisteners.push(() => img.removeEventListener("error", handler));
    });

    // Cleanup
    return () => {
      // remove tab listeners + DOM
      unlisteners.forEach((u) => { try { u(); } catch {} });
      try { tabsContainer.remove(); } catch {}
      // remove image listeners
      imgUnlisteners.forEach((u) => { try { u(); } catch {} });
    };
  }, []);

  return null;
}
