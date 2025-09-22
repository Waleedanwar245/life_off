// app/components/category/CategoryCoupons.client.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CouponDialog from "../store/CouponDialog";
import { API_URL } from "../utils/BASE_URL";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";

type Category = {
  id: string | number;
  image?: string;
  categoryTitle?: string;
  categoryName?: string;
  slug?: string;
  heading1?: string;
  heading2?: string;
  categoryDescription?: string;
};

type Coupon = {
  id: string | number;
  name?: string;
  mainImage?: string;
  secondaryImage?: string;
  endDate?: string;
  code?: string | null;
  htmlCodeUrl?: string | null;
  htmlCode?: string | null;
  store?: {
    logoUrl?: string | undefined;
    logo?: string | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    htmlCode?: string | null | undefined;
  } | null;
};

export default function CategoryCouponsClient({
  initialCategories = [],
  initialCoupons = [],
  initialSelectedCategoryId = null,
  initialCategoryMeta = { heading2: "", categoryDescription: "" },
}: {
  initialCategories?: Category[];
  initialCoupons?: Coupon[];
  initialSelectedCategoryId?: string | number | null;
  initialCategoryMeta?: { heading2?: string; categoryDescription?: string };
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(initialSelectedCategoryId);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(initialCategories.length === 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState<any>({ code: "", couponName: "", logo: "", storeName: "", htmlCode: "" });
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load categories client-side if server didn't provide them
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
      setCategoriesLoading(false);
      return;
    }

    (async () => {
      setCategoriesLoading(true);
      try {
        const resp = await axios.get(`${API_URL}/categories/all`);
        setCategories(Array.isArray(resp.data) ? resp.data : []);
      } catch (err: any) {
        console.error("Failed to fetch categories (client):", err);
        setCategories([]);
        setFetchError(String(err?.message ?? err));
      } finally {
        setCategoriesLoading(false);
      }
    })();
  }, [initialCategories]);

  // Fetch coupons by category id using axios (matches your original working code)
  async function fetchCoupons(categoryId: string | number | null) {
    if (!categoryId) {
      setCoupons([]);
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    try {
      const resp = await axios.get(`${API_URL}/categories/${categoryId}/coupons`);
      // Accept either array or { coupons: [] } or { data: [] }
      const payload = Array.isArray(resp.data) ? resp.data : resp.data?.coupons ?? resp.data?.data ?? [];
      setCoupons(Array.isArray(payload) ? payload : []);
    } catch (err: any) {
      console.error("Error fetching coupons (client):", err);
      setCoupons([]);
      setFetchError(String(err?.message ?? err));
    } finally {
      setIsLoading(false);
    }
  }

  // Initialize coupons: use server-provided initialCoupons if present, otherwise fetch
  useEffect(() => {
    if (initialSelectedCategoryId && (!initialCoupons || initialCoupons.length === 0)) {
      fetchCoupons(initialSelectedCategoryId);
    } else if (initialCoupons && initialCoupons.length > 0) {
      setCoupons(initialCoupons);
    }
    // set selected category initially
    setSelectedCategory(initialSelectedCategoryId ?? null);
  }, [initialSelectedCategoryId, initialCoupons]);

  // Handle category click - **by id** (exactly like your original client-side code)
  const handleCategoryClick = (categoryId: string | number) => {
    setSelectedCategory(categoryId);
    fetchCoupons(categoryId);
    // Do NOT add ?category=... query param; we only fetch by id.
  };

  // Coupon action: localStorage + show modal + open store slug in new tab + navigate to htmlCode
  const onCouponAction = (coupon: Coupon) => {
    const store = coupon.store ?? {};
    const payload = {
      code: coupon.code ?? "",
      couponName: coupon.name ?? "",
      logo: store.logoUrl ?? store.logo ?? "",
      storeName: store.name ?? "",
      htmlCode: coupon.htmlCodeUrl ?? coupon.htmlCode ?? store.htmlCode ?? "",
    };

    try {
      localStorage.setItem("couponData", JSON.stringify(payload));
    } catch (e) {
      // ignore localStorage write errors
    }

    setCouponCode(payload);
    setIsModalOpen(true);

    if (store?.slug) {
      try {
        window.open(`${window.location.origin}/coupons/${store.slug}`, "_blank", "noopener");
      } catch (err) { /* ignore */ }
    }
    if (payload.htmlCode) {
      window.location.href = payload.htmlCode;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(couponCode.code ?? "");
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

  const currentCategory = categories.find((c) => String(c.id) === String(selectedCategory));
  const categoryDescription = initialCategoryMeta?.categoryDescription ?? currentCategory?.categoryDescription ?? "";
  const categoryHeading2 = currentCategory?.heading2 ?? initialCategoryMeta?.heading2 ?? "Category";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {categoryDescription && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h2 className="text-xl font-bold mb-3 text-gray-800">{categoryHeading2}</h2>
              <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: categoryDescription }} />
            </div>
          )}

          <div className="sticky top-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg text-gray-800">Categories</h2>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {categoriesLoading ? (
                <div className="p-4 text-center">Loading categories...</div>
              ) : categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={String(category.id)}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                          String(selectedCategory) === String(category.id) ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-100"
                        }`}
                        aria-pressed={String(selectedCategory) === String(category.id)}
                      >
                        <div className="flex items-center">
                          {category.image && (
                            <div className="w-8 h-8 mr-3 flex-shrink-0">
                              <img
                                src={convertToSecureUrl(category.image) || "/placeholder.svg"}
                                alt={category.categoryName || category.categoryTitle || "Category"}
                                className="w-full h-full object-cover rounded"
                                onError={(e: any) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                          )}
                          <span className="text-gray-800">{category.categoryName || category.categoryTitle}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No categories available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Coupons */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedCategory && (currentCategory?.heading1 ?? currentCategory?.categoryName ?? "Coupons & Deals")}
          </h2>

          {isLoading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => {
                  const store = coupon.store ?? {};
                  const logoSrc = convertToSecureUrl(store.logoUrl ?? (store as any).logo ?? "/placeholder.svg");
                  const mainLabel = `${coupon.mainImage ?? ""} ${coupon.secondaryImage ?? ""}`.trim();

                  return (
                    <div key={String(coupon.id)} className="border border-gray-200 rounded-md p-6 flex flex-col relative h-full group hover:shadow-md transition-shadow duration-300">
                      <div className="flex justify-between items-start mb-8 relative">
                        <div className="flex flex-col items-center w-full">
                          <img src={logoSrc} alt={store.name ?? "Store logo"} className="h-56 w-auto object-contain" />
                        </div>

                        {mainLabel && (
                          <div className="absolute right-0 top-0 border border-gray-300 rounded text-gray-800 px-3 py-1 text-sm group-hover:bg-[#7FA842] group-hover:text-white group-hover:border-[#7FA842] transition-all duration-300">
                            {mainLabel}
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-2 min-h-[3rem] line-clamp-2 text-gray-800">{coupon.name}</h3>

                      <div className="mt-auto flex justify-center text-gray-800">
                        <div className="w-[60%]">
                          <button onClick={() => onCouponAction(coupon)} className={`w-full ${coupon.code ? "bg-[#7FA842]" : "bg-[#0E222A]"} text-white font-bold py-3 px-1 rounded mb-4 transition-colors`}>
                            {coupon.code ? "Reveal Code" : "Get Deal"}
                          </button>

                          {coupon.endDate && (
                            <p className="text-sm text-gray-500 text-center">
                              Expires On: {new Date(String(coupon.endDate)).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {coupons.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  No coupons available for this category.
                  {fetchError && <div className="text-red-600 mt-4">Fetch error: {fetchError}</div>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <CouponDialog isModalOpen={isModalOpen} handleCancel={handleCancel} copyToClipboard={copyToClipboard} copied={copied} couponCode={couponCode} />
    </>
  );
}
