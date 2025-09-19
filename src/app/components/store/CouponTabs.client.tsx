// components/store/CouponTabs.client.tsx
"use client";

import React, { useEffect, useState } from "react";
import CouponDialog from "./CouponDialog";

export default function CouponTabsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState({
    code: "",
    couponName: "",
    logo: "",
    storeName: "",
    htmlCode: "",
  });

  useEffect(() => {
    // Read couponData from localStorage (same behaviour as before)
    const stored = localStorage.getItem("couponData");
    if (stored) {
      try {
        setCouponCode(JSON.parse(stored));
        setIsModalOpen(true);
        localStorage.removeItem("couponData");
      } catch (e) {
        // ignore
      }
    }

    // Attach click listener to all actionable coupon anchors (rendered on server)
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-coupon-action]"));

    const handler = (ev: MouseEvent) => {
      const target = ev.currentTarget as HTMLElement;
      // preserve ctrl/meta / middle click
      if ((ev as any).metaKey || (ev as any).ctrlKey || (ev as any).button === 1) return;
      ev.preventDefault();

      const code = target.dataset.couponCode ?? "";
      const title = target.dataset.couponTitle ?? "";
      const logo = target.dataset.couponLogo ?? "";
      const html = target.dataset.couponHtml ?? target.getAttribute("href") ?? "#";

      // store to localStorage for previous behaviour and open modal
      const payload = {
        code,
        couponName: title,
        logo,
        storeName: "",
        htmlCode: html,
      };
      localStorage.setItem("couponData", JSON.stringify(payload));
      setCouponCode(payload);
      setIsModalOpen(true);

      // open the store URL in a new tab (preserve original UX)
      try {
        window.open(html, "_blank");
      } catch (err) {
        // fallback: change location
        window.location.href = html;
      }
    };

    const unsub: Array<() => void> = [];
    els.forEach((el) => {
      el.addEventListener("click", handler);
      unsub.push(() => el.removeEventListener("click", handler));
    });

    // Toggle details
    const toggles = Array.from(document.querySelectorAll<HTMLElement>("[data-coupon-toggle-details]"));
    toggles.forEach((t) => {
      const id = t.dataset.couponToggleDetails!;
      const detailEl = document.querySelector<HTMLElement>(`[data-coupon-details="${id}"]`);
      const clicker = () => {
        if (!detailEl) return;
        const wasHidden = detailEl.classList.contains("hidden");
        if (wasHidden) {
          detailEl.classList.remove("hidden");
          t.querySelector("span:last-child")!.textContent = "−";
        } else {
          detailEl.classList.add("hidden");
          t.querySelector("span:last-child")!.textContent = "+";
        }
      };
      t.addEventListener("click", clicker);
      unsub.push(() => t.removeEventListener("click", clicker));
    });

    return () => unsub.forEach((u) => u());
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(couponCode.code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => setCopied(false), 300);
  };

  return (
    <CouponDialog
      isModalOpen={isModalOpen}
      handleCancel={handleCancel}
      copyToClipboard={copyToClipboard}
      copied={copied}
      couponCode={couponCode}
    />
  );
}
