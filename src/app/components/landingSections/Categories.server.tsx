// components/landingSections/Categories.server.tsx
import React from "react";
import Image from "next/image";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { FaBuilding, FaTshirt, FaLeaf, FaHome, FaHeart } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";

const categoryIcons: Record<string, React.ReactNode> = {
  Travel: <FaBuilding className="w-5 h-5" />,
  "Women's Clothing": <FaLeaf className="w-5 h-5" />,
  "Mens Clothing": <FaTshirt className="w-5 h-5" />,
  "Home & Garden": <FaHome className="w-5 h-5" />,
  "Health & Beauty": <FaHeart className="w-5 h-5" />,
};

type CategoryRaw = {
  categoryName?: string;
  categoryTitle?: string;
  coupons?: any[];
};

const VISIBLE_COUNT = 6; // <-- show first 6 categories on homepage

function formatCategories(data: any): Array<any> {
  if (!data) return [];
  const raw: CategoryRaw[] = Array.isArray(data) ? data : data?.list ?? [];
  return raw.map((category) => {
    const coupons = Array.isArray(category?.coupons) ? category.coupons : [];
    const uniqueCoupons = Array.from(
      new Map((coupons || []).map((c: any) => [c?.store?.id ?? c?.store?._id ?? Math.random(), c])).values()
    );
    return {
      name: category?.categoryName ?? category?.categoryTitle ?? "General",
      // ensure we always index with a string (never undefined)
      icon: (() => {
        const titleKey: string = (category?.categoryTitle ?? category?.categoryName ?? "General") as string;
        return categoryIcons[titleKey] ?? <FaBuilding className="w-5 h-5" />;
      })(),
      deals: uniqueCoupons.map((coupon: any) => ({
        store: coupon?.store ?? null,
        slug: coupon?.store?.slug ?? null,
        storeId: coupon?.store?.id ?? coupon?.store?._id ?? coupon?.store?.slug ?? Math.random(),
        logo: coupon?.store?.logoUrl ?? "/placeholder.svg",
        offer: coupon?.name ?? "No details available",
      })),
    };
  });
}

export default function Categories({ data }: { data: any }) {
  const allCategories = formatCategories(data);
  const categories = allCategories.slice(0, VISIBLE_COUNT); // only render first 6 here

  // Default sizes for the small category/deal logos
  const DEAL_LOGO_WIDTH = 120;
  const DEAL_LOGO_HEIGHT = 40;

  return (
    <section id="categories-section" className="max-w-[1440px] mx-auto px-4 py-8 bg-[#7EA842] mt-4">
      <h2 className="text-[35px] font-bold mb-8" style={{ fontSize: "clamp(30px, 2vw, 35px)" }}>
        Categories
      </h2>

      {/* Mobile horizontal list */}
      <div className="lg:hidden mb-8">
        <div className="flex overflow-x-auto gap-4 pb-4">
          {categories.map((category, i) => {
            const isSelected = i === 0; // currently first item is active; swap this for state when adding interactivity
            return (
              <div
                key={i}
                data-category-index={i}
                className={`category-mobile-tab flex flex-col items-center min-w-[80px] cursor-pointer ${isSelected ? "selected" : ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-full border-2 border-[#14303B] flex items-center justify-center mb-2 ${
                    isSelected ? "bg-[#14303B] text-white" : "bg-white text-[#14303B]"
                  }`}
                >
                  {/* icon color adapts to selected state */}
                  <span className="flex items-center justify-center">{category.icon}</span>
                </div>
                <span className={`text-xs text-center ${isSelected ? "text-white font-semibold" : "text-gray-800"}`}>
                  {category.name}
                </span>
              </div>
            );
          })}

          {allCategories.length > VISIBLE_COUNT && (
            <div className="pl-4 mt-4">
              <a
                href="/categories"
                className="text-[#14303b] text-sm font-medium flex items-center gap-1 hover:text-[#fff] transition-colors"
              >
                View More
                <MdChevronRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop vertical list */}
        <div className="w-full lg:w-64 relative hidden lg:block">
          <div className="absolute left-[17px] top-[24px] w-[2px] bg-gray-200 categories-vertical-line" style={{ height: "0px" }} />
          <div className="space-y-6 categories-list-ref">
            {categories.map((category, i) => {
              const isSelected = i === 0;
              return (
                <div
                  key={i}
                  data-category-index={i}
                  // when selected, highlight the row (text color + font weight)
                  className={`category-desktop-tab flex items-center gap-4 cursor-pointer ${isSelected ? "bg-opacity-0" : ""}`}
                >
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full z-10 flex items-center justify-center relative ${
                        isSelected ? "bg-white" : "bg-[#14303B]"
                      }`}
                    >
                      <div className={`${isSelected ? "text-[#14303B]" : "text-white"}`}>{category.icon}</div>
                    </div>
                  </div>
                  <span className={`text-sm ${isSelected ? "text-[#14303B] font-semibold" : "text-sm font-medium"}`}>
                    {category.name}
                  </span>
                </div>
              );
            })}

            {allCategories.length > VISIBLE_COUNT && (
              <div className="pl-12">
                <a
                  href="/categories"
                  className="text-[#14303b] text-sm font-medium flex items-center gap-1 hover:text-[#fff] transition-colors"
                >
                  View More
                  <MdChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Deals area: only render deals for categories shown above */}
        <div className="w-full overflow-y-auto pr-2">
          {categories.map((category, idx) => (
            <div key={idx} data-deals-index={idx} className={`category-deals ${idx === 0 ? "" : "hidden"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.deals && category.deals.length > 0 ? (
                  category.deals.slice(0, 10).map((deal: any, j: number) => {
                    const logoSrc = convertToSecureUrl(deal.logo) || "/placeholder.svg";
                    // Note: leave logos non-priority to avoid lots of preloads
                    return (
                      <a key={j} href={`/coupons/${deal?.slug ?? "no-slug"}`} className="flex items-stretch cursor-pointer">
                        <div className="bg-white flex items-center justify-center w-[120px] md:w-[120px] shrink-0 border border-[#14303b] rounded-l-lg shadow-sm relative z-10">
                          <Image
                            src={logoSrc}
                            alt={`${deal.offer} logo`}
                            width={DEAL_LOGO_WIDTH}
                            height={DEAL_LOGO_HEIGHT}
                            loading="lazy"
                            sizes="(max-width: 768px) 80px, 120px"
                            className="max-w-[120px] max-h-full object-contain category-logo"
                          />
                        </div>

                        <div className="bg-white flex-1 flex items-center border border-l-0 border-[#14303b] rounded-r-lg pl-4 pr-3 py-4 my-[4px]">
                          <p className="text-sm text-gray-700" style={{ fontSize: "clamp(12px, 1vw, 18px)" }}>
                            {deal.offer}
                          </p>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No deals available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}