// app/components/CouponTabs.server.tsx
import React from "react";
import CouponTabsClient from "./CouponTabs.client";
import { API_URL } from "@/app/components/utils/BASE_URL";

type Props = {
  data: any;
};

export default async function CouponTabsServer({ data }: Props) {
  // Fetch latest stores (server-side)
  let latestStores: any[] = [];
  try {
    const res = await fetch(`${API_URL}/store`);
    if (res.ok) {
      const json = await res.json();
      latestStores = (json || [])
        .filter((store: any) => store?.logoUrl && store?.createdAt)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);
    }
  } catch (err) {
    console.error("Server: error fetching latestStores", err);
  }

  // Fetch similar coupons/stores based on category (server-side)
  const categoryId = data?.store?.categoryIds?.[0];
  let similarCoupons: any[] = [];
  let similarStores: any[] = [];

  if (categoryId) {
    try {
      const res = await fetch(`${API_URL}/categories/${categoryId}/coupons`);
      if (res.ok) {
        const json = await res.json();
        // Keep same structure as your client code expects
        similarCoupons = json || [];
        similarStores = json || [];
      }
    } catch (err) {
      console.error("Server: error fetching similar data", err);
    }
  }

  // Pass pre-fetched data to the client component
  return (
    <CouponTabsClient data={data}/>
  );
}
