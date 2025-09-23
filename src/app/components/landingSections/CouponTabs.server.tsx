// components/landingSections/CouponTabs.server.tsx
import React from "react";
import Image from "next/image";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { FiScissors } from "react-icons/fi";

type Coupon = any;

function normalizeAndPrepare(data: any): Array<any> {
  const raw: any[] = Array.isArray(data) ? data : data?.list ?? data?.data ?? [];

  try {
    const filtered = raw
      .filter((item: Coupon) => !!item && !!item.store && !!item.name)
      .sort((a: any, b: any) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

    const seen = new Set<string | number>();
    const result: any[] = [];

    for (const current of filtered) {
      const store = current.store;
      if (!store) continue;
      const storeId = store.id ?? store._id ?? store.slug;
      if (!storeId) continue;
      if (seen.has(storeId)) continue;
      seen.add(storeId);

      result.push({
        couponName: current.name || "Unnamed Coupon",
        storeid: storeId,
        slug: store.slug || null,
        logo: store.logoUrl || "/placeholder.svg",
        name: store.name || "Unknown Store",
        cashback: current.cashback || null,
        percentage: (current.mainImage || "") + " " + (current.secondaryImage || ""),
        rank: current.rank ?? 0,
        createdAt: current.createdAt,
      });

      if (result.length >= 12) break;
    }

    return result;
  } catch (err) {
    console.error("CouponTabs normalize error:", err);
    return [];
  }
}

export default function CouponTabs({ data }: { data: any }) {
  const couponData = normalizeAndPrepare(data);

  // sensible default size for logos (adjust if you have exact dims)
  const LOGO_WIDTH = 140;
  const LOGO_HEIGHT = 80;

  return (
    <section id="coupon-tabs" className="max-w-[1440px] mx-auto px-4 pt-12">
      <h2
        className="text-2xl font-bold mb-10 md:text-start text-gray-800 text-center"
        style={{ fontSize: "clamp(20px, 2vw, 51.2px)" }}
      >
        Today's Offers and Coupons
      </h2>

      {(!data || couponData.length === 0) ? (
        <div className="text-center text-gray-500">
          { !data ? <p>Loading coupons...</p> : <p>No coupons available at the moment.</p> }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 coupon-tabs-grid">
          {couponData.map((coupon: any, index: number) => {
            const slug = coupon?.slug || "no-slug";
            // convertToSecureUrl or fallback to placeholder
            const rawSrc = convertToSecureUrl(coupon.logo);
            const imgSrc = rawSrc && typeof rawSrc === "string" ? rawSrc : "/placeholder.svg";

            return (
              <a
                key={coupon.storeid ?? index}
                href={`/coupons/${slug}`}
                className="relative border border-dashed mx-6 sm:mx-0 border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow group coupon-card"
              >
                {/* Scissors Icon */}
                <div className="absolute -top-2 -left-2 bg-white">
                  <FiScissors className="w-4 h-4 text-gray-400" />
                </div>

                {/* Logo using next/image */}
                <div className="h-32 flex items-center justify-center mb-4">
                  <Image
                    src={imgSrc}
                    alt={`${coupon.name} logo`}
                    width={LOGO_WIDTH}
                    height={LOGO_HEIGHT}
                    loading="lazy"                 // default for non-priority images
                    sizes="(max-width: 768px) 120px, 140px"
                    className="max-h-full max-w-[140px] object-contain coupon-img"
                    // NOTE: next/image renders optimized image via /_next/image?url=...
                  />
                </div>

                {/* Offer Details */}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{coupon.couponName}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
