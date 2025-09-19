// app/components/freeShipping/FreeShippingContent.server.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/app/components/utils/BASE_URL";
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl";

// Server component — no "use client"
type Coupon = {
  id: string;
  logo: string;
  mainImage?: string;
  secondImage?: string;
  isCode?: string | null;
  verified?: boolean;
  brand?: string;
  name?: string;
  details?: string;
  altText?: string;
  slug?: string;
};

async function fetchFreeShippingCoupons(): Promise<Coupon[]> {
  try {
    const res = await fetch(`${API_URL}/coupons`, {
      // Set revalidation as you wish; use no-store / force-dynamic if you want always fresh.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch coupons:", res.status);
      return [];
    }

    const data = await res.json();
    const couponData = Array.isArray(data) ? data : [];
    const formatted: Coupon[] = couponData
      .filter((c: any) => c?.isFreeShipping)
      .map((item: any) => ({
        id: String(item.id),
        logo: item?.store?.logoUrl || "/images/placeholder.svg",
        mainImage: item.mainImage || "",
        secondImage: item.secondaryImage || "",
        isCode: item.code || null,
        verified: !!item.isVerified,
        brand: item?.store?.name || "Unknown Brand",
        name: item.name || "No description available",
        details: item.detail || "",
        altText: item?.store?.name || "Brand logo",
        slug: item?.store?.slug || "no-slug",
      }));

    return formatted;
  } catch (err) {
    console.error("Error fetching coupons:", err);
    return [];
  }
}

export default async function FreeShippingContent() {
  const coupons = await fetchFreeShippingCoupons();

  // JSON-LD data prepared server-side
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Shipping Coupons & Deals | LiveOffCoupon",
    description:
      "Explore the best free shipping coupon codes and deals to save more on your purchases at LiveOffCoupon.",
    url: "https://liveoffcoupon.com/free-shipping",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://liveoffcoupon.com" },
      { "@type": "ListItem", position: 2, name: "Free Shipping", item: "https://liveoffcoupon.com/free-shipping" },
    ],
  };

  return (
    <div>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mt-[170px] md:mt-[100px] max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-[22px] md:text-[24px] text-gray-800 font-bold mb-4 custom-class">
          Free Shipping Coupons for Top Brands Today
        </h1>

        <p className="text-gray-700 mb-8 text-[14px] md:text-[16px] custom-class">
          Stop Wasting Money on Shipping! Every dollar counts, and LiveOffCoupons is here to help you save. Grab free shipping coupons now and get your orders delivered without paying a penny extra! No tricks, just real deals from your favorite brands. Don’t miss these limited-time opportunities to shop smarter and keep more of your money. Whether picking up everyday essentials, sending a gift, or treating yourself to something new, shipping fees shouldn’t stand in the way. Our free shipping coupons help you cut those extra costs so your budget goes further. Enjoy the satisfaction of checkout totals that don’t include surprise delivery fees. Shop smart, save big!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <article
                key={coupon.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow"
              >
                <Link href={`/coupons/${coupon.slug}`} className="block">
                  <div className="flex items-center justify-center mb-4 rounded overflow-hidden">
                    {/* container ensures consistent image sizes */}
                    <div className="relative w-56 h-56">
                      <Image
                        src={convertToSecureUrl(coupon.logo)}
                        alt={coupon.altText || coupon.brand || "Brand"}
                        fill
                        style={{ objectFit: "contain", padding: "8px" }}
                        unoptimized // keep if external domains not configured
                        priority={false}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="font-bold text-lg flex items-center gap-2 text-gray-800">
                      {coupon.mainImage} {coupon.secondImage}
                      {coupon.verified && (
                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <div className="font-medium text-gray-800">{coupon.brand}</div>
                    <div className="text-sm text-gray-600">{coupon.name}</div>
                  </div>
                </Link>

                <div className="mt-auto">
                  <Link
                    href={`/coupons/${coupon.slug}`}
                    className={`inline-block w-full text-center ${
                      coupon.isCode ? "bg-[#7FA842]" : "bg-[#0E222A]"
                    } text-white py-2 px-4 rounded text-sm`}
                  >
                    {coupon.isCode ? `Reveal Code` : "Get Deal"}
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500">No free-shipping coupons available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
}
