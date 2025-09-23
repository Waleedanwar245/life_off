// components/landingSections/TopDealsSlider.server.tsx
import React from "react";
import Image from "next/image";
import { API_URL } from "../utils/BASE_URL";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

type RawProduct = any;
type Product = {
  id: string | number;
  title: string;
  image: string;
  discount: string;
  storeName: string;
  rating: number;
  originalPrice: string;
  salePrice: string;
  htmlUrl: string;
  category: string;
};

function parseNumber(val: any) {
  const cleaned = String(val ?? "").replace(/[^0-9.]/g, "");
  const n = Number.parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/product`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.list ?? json?.data ?? [];

    const products: Product[] =
      (list || []).map((item: RawProduct, idx: number) => {
        const oldPrice = item?.oldPrice ?? item?.previousPrice ?? "";
        const currentPrice = item?.currentPrice ?? item?.salePrice ?? item?.price ?? "";
        const oldN = parseNumber(oldPrice);
        const curN = parseNumber(currentPrice);
        const discount =
          oldN > 0 ? `-${Math.round(((oldN - curN) / oldN) * 100)}%` : item?.discountText ?? "0%";

        return {
          id: item?.id ?? item?.slug ?? idx,
          title: item?.name ?? item?.title ?? "Unknown Product",
          image: item?.imageUrl ?? item?.image ?? "/placeholder.svg",
          discount,
          storeName: item?.store?.name ?? item?.storeName ?? "Unknown",
          rating: Math.max(0, Math.min(5, Number(item?.rating ?? 0) || 0)),
          originalPrice: String(oldPrice ?? ""),
          salePrice: String(currentPrice ?? ""),
          htmlUrl: item?.htmlUrl ?? item?.url ?? "#",
          category: item?.category ?? "General",
        };
      }) ?? [];

    const hasFeaturedFlag = (list || []).some((it: any) => !!it?.isFeatured);
    if (hasFeaturedFlag) {
      return (list || [])
        .map((it: RawProduct, idx: number): Product | undefined => products[idx])
        .filter((p: Product | undefined): p is Product => Boolean(p))
        .filter((p: Product, i: number) => Boolean((list as any[])[i]?.isFeatured))
        .slice(0, 24);
    }

    return products.slice(0, 24);
  } catch (err) {
    console.error("TopDeals fetch error:", err);
    return [];
  }
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const fraction = rating - full;
  const half = fraction >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const stars = [];
  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 inline-block mr-0.5" />);
  if (half) stars.push(<FaStarHalfAlt key={`half`} className="text-yellow-400 inline-block mr-0.5" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400 inline-block mr-0.5" />);

  return <span aria-hidden className="inline-flex items-center">{stars}</span>;
}

export default async function TopDealsSlider() {
  const products = await fetchProducts();

  return (
    <section id="top-deals-section" className="bg-gray-50 max-w-[1440px] mx-auto px-4 pt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Deals</h2>
            <p className="text-gray-500">Discover the best offers from your favorite stores</p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="relative">
              <select
                aria-label="Sort top deals"
                defaultValue="featured"
                className="appearance-none bg-white border text-gray-800 border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7FA842] shadow-sm w-full"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <p>Loading deals...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <a
                  href={product.htmlUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label={product.title}
                >
                  <div className="relative overflow-hidden h-60">
                    {/* next/image fill so it covers the parent .h-60 container */}
                    <Image
                      src={convertToSecureUrl(product.image)}
                      alt={product.title}
                      fill
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 top-deal-img"
                      data-fallback="/placeholder.svg"
                      sizes="(max-width: 768px) 100vw, 360px"
                      loading="lazy"
                      unoptimized
                      priority={false}
                    />

                    <div className="absolute top-3 right-3 bg-[#7FA842] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
                      {product.discount}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                      {product.storeName}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-gray-800 font-medium mb-3 line-clamp-2 min-h-[3rem] text-sm">
                      {product.title}
                    </h3>

                    <div className="flex items-center mb-3 gap-1" aria-label={`Rating: ${product.rating} out of 5`}>
                      {renderStars(product.rating)}
                      <span className="sr-only">{product.rating.toFixed(1)} out of 5</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 line-through text-xs mr-2">{product.originalPrice}</span>
                        <span className="text-gray-900 font-bold">{product.salePrice}</span>
                      </div>

                      <span className="inline-block">
                        <button
                          type="button"
                          className="bg-[#7CB342] hover:bg-[#8BC34A] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                          aria-label={`Get deal for ${product.title}`}
                        >
                          Get Deal
                        </button>
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
