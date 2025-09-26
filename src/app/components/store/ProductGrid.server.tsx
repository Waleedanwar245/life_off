// app/components/ProductGrid.server.tsx
import React from "react";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";

type Store = { name?: string; logoUrl?: string };
type ProductRaw = {
  id: string | number;
  name?: string;
  imageUrl?: string;
  image?: string;
  rating?: number;
  currentPrice?: string | number;
  oldPrice?: string | number;
  htmlUrl?: string;
  store?: Store;
};

type Props = { data: { store?: { products?: ProductRaw[] } } | any };

function formatPrice(price: any) {
  if (typeof price !== "string" && typeof price !== "number") return "0.00";
  const clean = String(price).replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(clean);
  return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
}

function calculateDiscount(currentPrice: string, oldPrice: string) {
  if (!currentPrice || !oldPrice) return null;
  const current = Number.parseFloat(currentPrice);
  const original = Number.parseFloat(oldPrice);
  if (isNaN(current) || isNaN(original) || original <= current) return null;
  const discount = Math.round(((original - current) / original) * 100);
  return `-${discount}%`;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const star = (key: string) => (
    <svg key={key} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const halfStar = (
    <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 2.5l1.176 3.616a1 1 0 00.95.69h3.804l-3.078 2.234a1 1 0 00-.364 1.118L14.9 14.4 10 11.9V2.5z" />
    </svg>
  );

  return (
    <>
      {Array.from({ length: full }).map((_, i) => star(`full-${i}`))}
      {half ? halfStar : null}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-yellow-400 opacity-30" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </>
  );
}

export default function ProductGridServer({ data }: Props) {
  const products: ProductRaw[] = data?.store?.products || [];

  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-500">No products available at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const currentPrice = formatPrice(p.currentPrice);
          const originalPrice = p.oldPrice ? formatPrice(p.oldPrice) : null;
          const discount = originalPrice ? calculateDiscount(currentPrice, originalPrice) : null;

          const product = {
            id: p.id,
            title: p.name ?? "Unknown Product",
            image: convertToSecureUrl(p.imageUrl || p.image || "/placeholder.svg"),
            rating: p.rating ?? 5,
            currentPrice,
            originalPrice,
            discount,
            htmlUrl: p.htmlUrl || "#",
            store: { name: p.store?.name ?? "Store" },
          };

          return (
            <a
              key={product.id}
              href={product.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <div className="relative w-full h-[200px]">
                  <img src={product.image} alt={product.title} className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full" loading="lazy" />
                </div>

                {product.discount && (
                  <div className="absolute top-3 right-3 bg-[#7FA842] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
                    {product.discount}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-gray-800 font-medium mb-3 line-clamp-2 min-h-[3rem] text-sm">{product.title}</h3>

                <div className="flex mb-3 gap-0.5">
                  <Stars rating={product.rating} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {product.originalPrice && <span className="text-gray-400 line-through text-xs mr-2">${product.originalPrice}</span>}
                    <span className="text-gray-900 font-bold">${product.currentPrice}</span>
                  </div>

                  <span className="bg-[#8BC34A] hover:bg-[#7CB342] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">Get Deal</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
