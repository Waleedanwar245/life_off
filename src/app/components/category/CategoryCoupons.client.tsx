// app/components/category/CouponActions.client.tsx
"use client";

import React, { useState } from "react";
import CouponDialog from "../store/CouponDialog"; // your existing client-side dialog component

export default function CouponActions({ coupon }: { coupon: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState({
    code: "",
    couponName: "",
    logo: "",
    storeName: "",
    htmlCode: "",
  });

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => setCopied(false), 300);
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(couponCode.code || coupon.code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard error", err);
    }
  };

  const handleClick = () => {
    const payload = {
      code: coupon?.code,
      couponName: coupon?.title || coupon?.name,
      logo: coupon?.store?.logoUrl,
      storeName: coupon?.store?.name,
      htmlCode: coupon?.htmlCodeUrl ? coupon?.htmlCodeUrl : coupon?.store?.htmlCode,
    };

    // Save to localStorage (same behavior as before)
    try {
      localStorage.setItem("couponData", JSON.stringify(payload));
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }

    setCouponCode(payload);
    showModal();

    // Open store coupon page in new tab and redirect current window to htmlCode (like original)
    if (typeof window !== "undefined") {
      if (coupon?.store?.slug) {
        window.open(`${window.location.origin}/coupons/${coupon?.store?.slug}`, "_blank");
      }
      if (payload.htmlCode) {
        // redirect to target (could be external)
        window.location.href = payload.htmlCode;
      }
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-[#7FA842] hover:bg-[#6a8e38] text-white font-bold py-3 px-1 rounded w-full mb-4 transition-colors duration-300"
      >
        {coupon?.code ? `Reveal Code` : "Get Deal"}
      </button>

      {coupon.endDate && (
        <p className="text-sm text-gray-500 text-center">
          Expires On: {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : ""}
        </p>
      )}

      <CouponDialog
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        copyToClipboard={copyToClipboard}
        copied={copied}
        couponCode={couponCode}
      />
    </>
  );
}
