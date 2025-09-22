// app/components/category/CategoryCoupons.server.tsx
import React from "react";
import { API_URL } from "../utils/BASE_URL";
import CategoryCouponsClient from "./CategoryCoupons.client";

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

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories/all`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error("Error fetching categories (server):", err);
    return [];
  }
}

async function fetchCouponsForCategory(categoryId?: string | number): Promise<Coupon[]> {
  if (!categoryId) return [];
  try {
    const res = await fetch(`${API_URL}/categories/${categoryId}/coupons`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json)) return json;
    if (json?.coupons && Array.isArray(json.coupons)) return json.coupons;
    if (json?.data && Array.isArray(json.data)) return json.data;
    return [];
  } catch (err) {
    console.error("Error fetching coupons for category (server):", err);
    return [];
  }
}

export default async function CategoryCouponsServer({
  data,
}: {
  data?: { id?: string; heading2?: string; categoryDescription?: string } | null;
}) {
  // Server fetch: categories + initial coupons (either the data.id or first category)
  const categories = await fetchCategories();
  const initialCategoryId = data?.id ?? (categories.length > 0 ? categories[0].id : null);
  const initialCoupons = initialCategoryId ? await fetchCouponsForCategory(initialCategoryId) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryCouponsClient
        initialCategories={categories}
        initialCoupons={initialCoupons}
        initialSelectedCategoryId={initialCategoryId ?? null}
        initialCategoryMeta={{
          heading2: data?.heading2 ?? "",
          categoryDescription: data?.categoryDescription ?? "",
        }}
      />
    </div>
  );
}
