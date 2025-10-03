// app/components/category/CategoriesCarousel.server.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl";
import CategoriesCarouselClient from "./CategoriesCarousel.client";

type Category = {
  id: string | number;
  image?: string;
  categoryTitle?: string;
  categoryName?: string;
  slug?: string;
};

export default function CategoriesCarousel({ data }: { data?: Category[] | any }) {
  const categories: Category[] =
    (data || [])
      .filter((c: any) => c && c.id !== "92270548-c8fe-496f-aefb-4c948a4b6e23")
      .map((category: any) => ({
        id: category.id,
        image: category.image,
        categoryName: category.categoryName,
        categoryTitle: category.categoryTitle,
        slug: category.slug,
      })) || [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl text-gray-800 font-bold mb-8 text-center">Top Coupons & Deals Categories</h1>

      {/* visually hide native scrollbar but keep accessible */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-cat-scroll] { -ms-overflow-style: none; scrollbar-width: none; }
            [data-cat-scroll]::-webkit-scrollbar { display: none; }
          `,
        }}
      />

      <div className="relative">
        {/* Left Arrow */}
        <button
          data-carousel-prev
          aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white rounded-full p-2 shadow-md border border-gray-200 text-green-600 hover:text-green-700 transition-colors w-10 h-10 flex items-center justify-center"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 6L9 12L15 18" stroke="#2F8B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          data-carousel-next
          aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white rounded-full p-2 shadow-md border border-gray-200 text-green-600 hover:text-green-700 transition-colors w-10 h-10 flex items-center justify-center"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6L15 12L9 18" stroke="#2F8B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* wrapper hides native scrollbar */}
        <div className="overflow-hidden px-8">
          {/* inner scroller: paddingInline ensures first/last items are visible beyond arrows */}
          <div
            data-cat-scroll
            role="list"
            aria-label="Categories"
            className="flex gap-16 items-center overflow-x-auto scroll-smooth py-6"
            style={{ scrollBehavior: "smooth", paddingInline: "3rem" }} // <-- padding from edges so first/last visible
          >
            {categories.map((category) => (
              <div
                key={category.id}
                role="listitem"
                data-cat-item
                className="cursor-pointer flex-none w-full xs:w-1/2 sm:w-1/4 md:w-1/6 lg:w-1/6 xl:w-1/6 flex flex-col items-center"
              >
                <Link href={`/category/${category.slug || "no-slug"}`} className="block text-center">
                  <div
                    className="
                      relative
                      rounded-full overflow-hidden border-2 border-gray-100
                      flex items-center justify-center
                      w-[150px] h-[150px]
                      sm:w-[190px] sm:h-[190px]
                      md:w-[240px] md:h-[240px]
                      lg:w-[260px] lg:h-[260px]
                    "
                  >
                    {category.image ? (
                      <Image
                        src={convertToSecureUrl(category.image)}
                        alt={category.categoryTitle || category.categoryName || "Category"}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>

                  <h3 className="text-xs font-medium text-center text-gray-800 uppercase mt-3">
                    {category.categoryName || category.categoryTitle}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* client script that wires arrows & keyboard */}
      <CategoriesCarouselClient />
    </section>
  );
}
