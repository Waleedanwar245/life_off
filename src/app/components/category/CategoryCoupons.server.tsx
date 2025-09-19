// app/components/category/CategoryCoupons.tsx
import React from "react";
import Link from "next/link";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { API_URL } from "../utils/BASE_URL";
import CouponActions from "./CategoryCoupons.client";
import ClientImage from "../ui/ClientImage"; 


type Props = {
  data: any;
};

export default async function CategoryCoupons({ data }: Props) {
  // Server-side fetches
  const [categoriesRes, couponsRes] = await Promise.all([
    fetch(`${API_URL}/categories/all`, { cache: "no-store" }).catch(() => null),
    fetch(`${API_URL}/categories/${data?.id}/coupons`, { cache: "no-store" }).catch(() => null),
  ]);

  const categories = categoriesRes ? await categoriesRes.json().catch(() => []) : [];
  const coupons = couponsRes ? await couponsRes.json().catch(() => []) : [];

  const selectedCategoryId = data?.id;
  const currentCategory = categories.find((cat: any) => cat.id === selectedCategoryId);
  const categoryDescription = data?.categoryDescription || currentCategory?.categoryDescription || "";
  const categoryHeading2 = currentCategory?.heading2 || data?.heading2 || "heading2";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {categoryDescription && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h2 className="text-xl font-bold mb-3 text-gray-800">{categoryHeading2}</h2>
              <div dangerouslySetInnerHTML={{ __html: categoryDescription }} />
            </div>
          )}

          <div className="sticky top-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">Categories</h2>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((category: any) => (
                    <li key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        className={`block w-full text-left px-4 py-3 rounded-md transition-colors ${selectedCategoryId === category.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          {category.image && (
                            <div className="w-8 h-8 mr-3 flex-shrink-0">
                              {/* use client image component so onError lives on client */}
                              <ClientImage
                                src={convertToSecureUrl(category.image) || "/placeholder.svg"}
                                alt={category.categoryName}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          )}
                          <span>{category.categoryName}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No categories available.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategoryId && categories.find((cat: any) => cat.id === selectedCategoryId)?.heading1}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons && coupons.length > 0 ? (
              coupons.map((coupon: any) => (
                <div
                  key={coupon.id}
                  className="border border-gray-200 rounded-md p-6 flex flex-col relative h-full group hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-8 relative">
                    <div className="flex flex-col items-center w-full">
                      <ClientImage
                        src={convertToSecureUrl(coupon.store?.logoUrl) || "/placeholder.svg"}
                        alt={coupon.store?.name || "Store logo"}
                        className="h-56 w-auto object-contain"
                      />
                    </div>

                    <div className="absolute right-0 top-0 border border-gray-300 rounded px-3 py-1 text-sm group-hover:bg-[#7FA842] group-hover:text-white group-hover:border-[#7FA842] transition-all duration-300">
                      {coupon?.mainImage + " " + coupon?.secondaryImage}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2 min-h-[3rem] line-clamp-2">{coupon.name}</h3>

                  <div className="mt-auto flex justify-center">
                    <div className="w-[60%]">
                      <CouponActions coupon={coupon} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No coupons available for this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
