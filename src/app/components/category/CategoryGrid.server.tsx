// app/components/category/CategoryGrid.server.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl";

type Category = {
  id: string | number;
  image?: string;
  categoryTitle?: string;
  categoryName?: string;
  slug?: string;
};

export default function CategoryGrid({ data }: { data?: Category[] | any }) {
  const categories: Category[] =
    (data || [])
      .filter((c: any) => c && c.id !== "92270548-c8fe-496f-aefb-4c948a4b6e23")
      .map((category: any) => ({
        id: category.id,
        image: category.image,
        categoryTitle: category.categoryTitle,
        categoryName: category.categoryName,
        slug: category.slug,
      })) || [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl text-gray-800 font-bold mb-8">All Coupons & Deals Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {categories.map(({ id, image, categoryTitle, categoryName, slug }) => (
          <Link
            key={id}
            href={`/category/${slug || "no-slug"}`}
            className="flex flex-col items-center group cursor-pointer rounded-full"
          >
            <div className="relative w-[119px] h-[119px] rounded-full overflow-hidden mb-3 bg-gray-50 shadow-lg">
              <div className="absolute inset-0 border-2 border-gray-100 rounded-full overflow-hidden">
                {image ? (
                  <Image
                    src={convertToSecureUrl(image)}
                    alt={categoryTitle || categoryName || "Category"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
            </div>

            <h3 className="text-xs font-medium text-center text-gray-800">{categoryName || categoryTitle}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
