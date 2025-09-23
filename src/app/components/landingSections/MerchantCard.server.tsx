// components/landingSections/MerchantCard.server.tsx
import React from "react";
import Image from "next/image";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";

export default function MerchantCard({ data }: { data: any }) {
  const stores = Array.isArray(data) ? data : data?.list ?? [];
  const topMerchants = stores.filter((s: any) => s?.isFeatureStore || s?.isPopularStore).slice(0, 8);
  const duplicated = [...topMerchants, ...topMerchants];

  const CARD_GAP_PX = 40;

  // sensible default size for logos (adjust if you have real logo dimensions)
  const LOGO_WIDTH = 140;
  const LOGO_HEIGHT = 80;

  return (
    <section className="w-full mx-auto py-16 px-4" style={{ backgroundColor: "#F5F5F5" }}>
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-12">Our Favorite Merchants</h2>

      <div className="relative flex items-center justify-center">
        <button
          type="button"
          className="absolute left-0 z-10 p-[5px] md:p-2 hero-merchant-prev shadow-lg transition-all duration-200 hover:shadow-xl"
          style={{ backgroundColor: "#96C121" }}
          aria-label="Previous merchants"
        >
          <span className="text-white">‹</span>
        </button>

        <div className="overflow-hidden mx-16 merchant-slider" aria-roledescription="carousel">
          <div
            className="flex merchant-slider-inner transition-transform duration-300 ease-in-out"
            style={{ gap: `${CARD_GAP_PX}px`, transform: "translateX(0)" }}
          >
            {duplicated.map((merchant: any, idx: number) => {
              const src = convertToSecureUrl(merchant?.logoUrl) || "/placeholder.svg";
              return (
                <div
                  key={idx}
                  className="merchant-card cursor-pointer flex-shrink-0 w-48 h-32 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center p-6"
                  data-slug={merchant?.slug || ""}
                  data-name={merchant?.name || ""}
                  aria-label={merchant?.name || `merchant-${idx}`}
                >
                  {/* next/image replaces img here */}
                  <Image
                    src={src}
                    alt={merchant?.name || ""}
                    width={LOGO_WIDTH}
                    height={LOGO_HEIGHT}
                    // next/image lazy loads by default for non-priority images
                    loading="lazy"
                    // ensure the image fits the box and doesn't distort
                    className="max-w-full max-h-full object-contain coupon-img"
                    // sizes helps the browser pick the right image if responsive, adjust as needed
                    sizes="(max-width: 768px) 120px, 140px"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="absolute right-0 z-10 p-[5px] md:p-2 hero-merchant-next shadow-lg transition-all duration-200 hover:shadow-xl"
          style={{ backgroundColor: "#96C121" }}
          aria-label="Next merchants"
        >
          <span className="text-white">›</span>
        </button>
      </div>

      <div className="flex justify-center mt-8 space-x-2 merchant-dots" aria-hidden={false} />

    </section>
  );
}
