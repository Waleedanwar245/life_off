// components/landingSections/TrendingDeals.server.tsx
import React from "react";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { API_URL } from "../utils/BASE_URL";
import { BsLightning } from "react-icons/bs";

type Deal = {
  store?: any;
  storeId?: string | number;
  slug?: string | null;
  couponName?: string;
  logo?: string;
  name?: string;
  cashback?: string | null;
  offer?: string;
  isDeal?: boolean;
};

async function fetchTrending(): Promise<Deal[]> {
  try {
    const res = await fetch(`${API_URL}/coupons`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.list ?? (json?.data ?? []);
    return (
      (list || [])
        .filter((item: any) => item?.isTrending === true)
        .map((item: any) => ({
          store: item?.store,
          storeId: item?.store?.id,
          slug: item?.store?.slug,
          couponName: item?.name,
          logo: item?.store?.logoUrl || "/placeholder.svg",
          name: item?.store?.name || "Unknown Store",
          cashback: item?.mainImage || null,
          offer: `${item?.mainImage || ""} ${item?.secondaryImage || ""}`.trim() || "0% Percentage",
          isDeal: !item?.code,
        }))
        .slice(0, 8)
    );
  } catch (err) {
    console.error("Trending fetch error:", err);
    return [];
  }
}

export default async function TrendingDeals() {
  const deals = await fetchTrending();

  return (
    <section id="trending-deals-section" className="max-w-[1440px] mx-auto px-4 py-6" aria-labelledby="trending-deals-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="trending-deals-heading" className="text-2xl text-gray-800 font-bold">
          Trending Deals
        </h2>

        <a href="/coupons" className="text-sm text-[#7FA842] font-medium hover:underline">
          View All
        </a>
      </div>

      {deals.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No trending deals at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((deal, idx) => (
            <article
              key={deal.storeId ?? idx}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative flex items-center justify-center p-4 border-b border-gray-100">
                {deal.offer && deal.offer !== "0% Percentage" && (
                  <div className="absolute top-3 left-3 bg-[#7FA842] text-white px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1 shadow-sm">
                    <BsLightning className="w-3 h-3" />
                    <span>{deal.offer}</span>
                  </div>
                )}

                <div className="w-56 h-56 flex items-center justify-center">
                  <img
                    src={convertToSecureUrl(deal.logo) || "/placeholder.svg"}
                    alt={`${deal.name} logo`}
                    className="object-contain p-2 mb-4 trending-img"
                    data-fallback="/placeholder.svg"
                  />
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{deal.couponName}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-[40px]">{deal.name}</p>

                <a
                  href={`/coupons/${deal.slug || "no-slug"}`}
                  className={`block text-center w-full py-2 rounded text-sm font-medium transition-all duration-300 ${
                    deal.isDeal ? "bg-[#14303B] text-white hover:bg-[#0f2530]" : "bg-[#96C121] text-white hover:bg-[#86AD1E]"
                  }`}
                  aria-label={deal.couponName || `Open ${deal.name}`}
                >
                  {deal.isDeal ? "Show Coupon Deal" : "Show Coupon Code"}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
