// src/app/components/store/StoresContent.server.tsx
import React from "react";
import Link from "next/link";
import { API_URL } from "@/app/components/utils/BASE_URL";
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl";

type Props = {
  stores?: any[] | null;
  searchParams?: Record<string, string | string[]>;
  // optional override
  itemsPerPage?: number;
};

function normalizeStores(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.list && Array.isArray(raw.list)) return raw.list;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  return [];
}

async function fetchStoresServer(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/store`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeStores(json);
  } catch (err) {
    console.error("Stores fetch error:", err);
    return [];
  }
}

/**
 * Server-rendered StoresContent
 * - Controlled by `searchParams.page` and `searchParams.letter`
 */
export default async function StoresContent({ stores, searchParams = {}, itemsPerPage = 30 }: Props) {
  // If caller didn't pass stores, fetch them on the server
  const allStores = normalizeStores(stores ?? (await fetchStoresServer()));

  // read page + letter from searchParams (strings or arrays)
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : (searchParams.page as string | undefined);
  const letterRaw = Array.isArray(searchParams.letter) ? searchParams.letter[0] : (searchParams.letter as string | undefined);

  const currentPage = Math.max(0, Number.isFinite(Number(pageRaw)) ? Math.max(0, parseInt(pageRaw || "0", 10)) : 0);
  const selectedLetter = letterRaw && letterRaw.length === 1 ? letterRaw.toUpperCase() : null;

  // Filter (if letter selected)
  const filtered = selectedLetter
    ? allStores.filter((s: any) => typeof s?.name === "string" && s.name.trim().toUpperCase().startsWith(selectedLetter))
    : allStores;

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages - 1);
  const visibleStores = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Helper to build query string for links
  const qs = (p: number, letter?: string | null) => {
    const params = new URLSearchParams();
    if (typeof letter === "string" && letter) params.set("letter", letter);
    if (p && p > 0) params.set("page", String(p));
    const s = params.toString();
    return s ? `?${s}` : "";
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mt-[200px] md:mt-[110px] max-w-[1440px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 w-full">
        <h2 className="text-2xl font-bold flex-1 text-gray-800 text-center">Save Big with Coupons for Every Store!</h2>

        <div className="gap-2 hidden md:flex">
          <a
            href={`/stores${qs(Math.max(0, page - 1), selectedLetter)}`}
            aria-label="Previous page"
            className="w-10 h-10 rounded-full bg-[#96C121] text-white flex items-center justify-center hover:bg-[#86AD1E] transition-colors"
          >
            ‹
          </a>
          <a
            href={`/stores${qs(Math.min(totalPages - 1, page + 1), selectedLetter)}`}
            aria-label="Next page"
            className="w-10 h-10 rounded-full bg-[#96C121] text-white flex items-center justify-center hover:bg-[#86AD1E] transition-colors"
          >
            ›
          </a>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        {visibleStores.length > 0 ? (
          visibleStores.map((store: any, idx: number) => (
            <a
              key={store?.id ?? `${idx}-${store?.slug ?? idx}`}
              href={`/coupons/${store?.slug ?? "no-slug"}`}
              className={`${store?.bgColor || "bg-white"} w-[166px] md:w-[206px] h-[146px] md:h-[166px] cursor-pointer aspect-square rounded-lg flex items-center justify-center p-2 md:p-6 transition-transform hover:scale-105 shadow-md`}
            >
              <img
                src={convertToSecureUrl(store?.logoUrl) || "/images/default_store_img.png"}
                alt={`${store?.name ?? "Store"} logo`}
                className="w-[150px] h-[150px] object-contain"
              />
            </a>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No stores available.</p>
        )}
      </div>

      {/* Mobile Prev/Next (visible on small screens) */}
      <div className="w-full justify-center my-4 gap-2 flex md:hidden">
        <a
          href={`/stores${qs(Math.max(0, page - 1), selectedLetter)}`}
          aria-label="Previous page"
          className="w-10 h-10 rounded-full bg-[#96C121] text-white flex items-center justify-center hover:bg-[#86AD1E] transition-colors"
        >
          ‹
        </a>
        <a
          href={`/stores${qs(Math.min(totalPages - 1, page + 1), selectedLetter)}`}
          aria-label="Next page"
          className="w-10 h-10 rounded-full bg-[#96C121] text-white flex items-center justify-center hover:bg-[#86AD1E] transition-colors"
        >
          ›
        </a>
      </div>

      {/* Alphabet filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {alphabet.map((letter) => {
          const active = selectedLetter === letter;
          const href = `/stores${qs(0, active ? null : letter)}`;
          return (
            <a
              key={letter}
              href={href}
              className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${active ? "text-[#96C121]" : "text-gray-600 hover:text-[#96C121]"} transition-colors`}
            >
              {letter}
            </a>
          );
        })}
      </div>

      {/* Description (static, server-side) */}
      <div className="space-y-4 text-gray-600 text-sm">
        <p className="text-[14px] md:text-[16px] leading-6">
          Browse our directory of discounts, promo codes, and coupons for your favorite stores! Whether you're shopping for fashion, electronics, groceries, pet supplies, baby products, or travel, we’ve gathered the best money-saving coupons in one place. With new deals added daily, you will always find fresh ways to save on top brands.
        </p>

        <h2 className="text-[20px] md:text-[24px] font-bold leading-8">Why Check Our Store Coupons List?</h2>
        <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[16px] leading-6">
          <li>All stores have 100% verified promo codes, which we update regularly.</li>
          <li>We have coupons from a wide variety of stores where you can find discounts for every shopping need.</li>
          <li>Some promo codes are available only through our website, which gives you extra savings.</li>
          <li>We also share holiday sales, time-limited discounts, or flash promotions offered by different stores.</li>
        </ul>
      </div>
    </div>
  );
}
