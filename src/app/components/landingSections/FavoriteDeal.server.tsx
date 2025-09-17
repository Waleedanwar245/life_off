// components/landingSections/FavoriteDeal.server.tsx
import React from "react";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { API_URL } from "../utils/BASE_URL";

type EventItem = any;
type ProductItem = any;

async function fetchData(): Promise<{ events: EventItem[]; products: ProductItem[] }> {
  try {
    const [eventsRes, productsRes] = await Promise.all([
      fetch(`${API_URL}/events`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/product`, { next: { revalidate: 60 } }),
    ]);

    const eventsJson = eventsRes.ok ? await eventsRes.json() : [];
    const productsJson = productsRes.ok ? await productsRes.json() : [];

    const events = Array.isArray(eventsJson) ? eventsJson : eventsJson?.list ?? [];
    const products = Array.isArray(productsJson) ? productsJson : productsJson?.list ?? [];

    return { events, products };
  } catch (err) {
    console.error("FavoriteDeal fetch error:", err);
    return { events: [], products: [] };
  }
}

export default async function FavoriteDeal() {
  const { events, products } = await fetchData();

  // pick trending event (first is fine)
  const trendingDeals = (events || []).filter((e: any) => e?.isTrending).slice(0, 1);
  const trendingDeal = trendingDeals[0] ?? null;

  // products to show on event page (limit 3)
  const showOnEventPageProducts = (products || []).filter((p: any) => p?.isShowEventPage).slice(0, 3);

  return (
    <section id="favorite-deal-section" className="max-w-[1440px] mx-auto px-4 py-8 bg-[#14303B] my-8">
      <h2
        className="text-[35px] font-bold text-center mb-8"
        style={{ fontSize: "clamp(24px, 5vw, 35px)", color: "#ffffff" }}
      >
        Favorite Deal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trending Deal Image - wrap with anchor to seasonal page */}
        {trendingDeal && trendingDeal.bannerImage ? (
          <a
            href={`/seasonal/${trendingDeal.slug || ""}`}
            className="md:col-span-2 relative group block cursor-pointer"
            aria-label={trendingDeal.title || "Trending Deal"}
          >
            <div className="relative w-full md:h-[420px] overflow-hidden rounded-lg">
              <img
                src={convertToSecureUrl(trendingDeal.bannerImage) || "/placeholder.svg"}
                alt={trendingDeal.title || "Trending Deal"}
                className="w-full h-[270px] md:h-[420px] object-cover favorite-img rounded-lg"
                data-fallback="/placeholder.svg"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
          </a>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center bg-gray-100 rounded-lg h-[270px] md:h-[420px]">
            <p className="text-gray-500">No trending deal available</p>
          </div>
        )}

        {/* Product Cards */}
        <div className="space-y-4">
          {showOnEventPageProducts.length > 0 ? (
            showOnEventPageProducts.map((product: any) => (
              <a
                key={product?.id ?? product?.slug ?? Math.random()}
                href={product?.htmlUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex rounded-lg overflow-hidden group bg-white cursor-pointer"
              >
                {product?.imageUrl && (
                  <div className="w-1/2 relative h-32 flex-shrink-0">
                    <img
                      src={convertToSecureUrl(product.imageUrl) || "/placeholder.svg"}
                      alt={product?.name || "Product Image"}
                      className="object-cover w-full h-full favorite-product-img"
                      data-fallback="/placeholder.svg"
                    />
                  </div>
                )}
                <div className="w-1/2 px-3 flex flex-col justify-center">
                  <span
                    className="text-sm font-semibold pt-1 rounded w-fit text-[#14303b]"
                    style={{ fontSize: "clamp(14px, 1vw, 20px)" }}
                  >
                    {product?.name || ""}
                  </span>
                  <p className="text-sm font-medium text-[#0b2d2b]" style={{ fontSize: "clamp(12px, 1vw, 16px)" }}>
                    {product?.detail || ""}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-white">No featured products.</p>
          )}
        </div>
      </div>

      {/* Bottom Section with clickable heading/description (anchor wraps for SEO) */}
      {trendingDeal && (
        <div className="mt-6 text-center">
          <a href={`/seasonal/${trendingDeal.slug || ""}`} className="no-underline">
            <h3
              className="cursor-pointer text-[30px] font-bold mt-2 mb-3 text-white"
              style={{ fontSize: "clamp(22px, 1vw, 30px)" }}
            >
              {trendingDeal.heading3 || ""}
            </h3>
            <p
              className="text-[17.23px] text-white"
              style={{ fontSize: "clamp(14px, 1vw, 17.23px)" }}
            >
              {trendingDeal.description3 || ""}
            </p>
          </a>
        </div>
      )}
    </section>
  );
}
