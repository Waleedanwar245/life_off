// app/components/store/CouponTabs.server.tsx
import React from "react";
import dayjs from "dayjs";
import ProductSlider from "./ProductSlider"; // server-safe markup
import CouponTabsClient from "./CouponTabs.client"; // client enhancer (keeps modal/copy behavior)
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { Row, Col } from "antd";

type Props = { data: any };

function isValidDateString(dateStr: any) {
  if (!dateStr) return false;
  const d = dayjs(dateStr);
  return d.isValid();
}

function mapCouponsForServer(apiStore: any) {
  const apiCoupons = apiStore || {};
  const today = new Date();
  const coupons = (apiCoupons?.coupons || []).slice(); // ensure array

  return coupons
    .sort((a: any, b: any) => {
      if (a.rank == null) return 1;
      if (b.rank == null) return -1;
      return a.rank - b.rank;
    })
    .map((coupon: any) => {
      const endDate = coupon?.endDate ? new Date(coupon.endDate) : null;
      const isExpired = endDate ? endDate < today : false;

      const expiry = isExpired
        ? "Expired"
        : coupon.endDate
        ? isValidDateString(coupon.endDate)
          ? `Expires ${dayjs(coupon.endDate).format("MMM D, YYYY")}`
          : `Expires ${coupon.endDate}`
        : "N/A";

      return {
        id: coupon.id,
        title: coupon.name || coupon.title || "Deal",
        discount: coupon?.mainImage || "DEAL",
        codeorDeal: coupon?.codeimg3 || "",
        code: coupon?.code || "",
        htmlCode: coupon?.htmlCodeUrl || apiStore?.htmlCode || coupon?.redirectUrl || "#",
        second_img: coupon?.secondaryImage || "",
        expiry,
        verified: !!coupon.isVerified,
        isExclusive: !!coupon.isExclusive,
        description: coupon.detail || "",
        buttonText: isExpired ? "Expired" : coupon?.code ? "Reveal Code" : "Get Deal",
        logo: apiStore?.logoUrl || apiStore?.logo || "",
      };
    });
}

export default function CouponTabs({ data }: Props) {
  const store = data?.store ?? {};
  const couponsList = mapCouponsForServer(store);

  const activeCoupons = couponsList.filter((c: any) => c.buttonText !== "Expired");
  const activeCouponCount = activeCoupons.length;
  const activeDealsCount = activeCoupons.filter((c: any) => !c.code).length;
  const activeCodesCount = activeCoupons.filter((c: any) => c.code).length;

  // For similar stores/coupons: server can render placeholders and client will fetch/enhance
  const formattedSimilarStores: { storeId: string; name: string; logo: string }[] = (data?.similarStores || [])
    .map((item: any, i: number) => ({
      storeId: item?.store?.slug || item?.slug || "",
      name: item?.store?.name || item?.name || "No Name",
      logo: item?.store?.logoUrl || item?.logo || "/default-logo.png",
    }))
    .slice(0, 8);

  const latestStores: any[] = (data?.latestStores || []).slice(0, 8);

  // IMPORTANT: We use anchor links + CSS scroll-margin-top to preserve offset for sticky header.
  // No client JS required for the basic scrolling behavior.
  return (
    <div className="max-w-[1280px] font-sans mx-auto px-4 py-8">
      {/* Inline CSS: smooth scrolling + offset for sticky header (adjust offset if needed) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { scroll-behavior: smooth; }
            /* Adjust top offset for different viewports to account for your header height */
            #coupons, #store-info, #faqs { scroll-margin-top: 140px; }
            @media (max-width: 768px) {
              #coupons, #store-info, #faqs { scroll-margin-top: 110px; }
            }
            @media (max-width: 480px) {
              #coupons, #store-info, #faqs { scroll-margin-top: 90px; }
            }
          `,
        }}
      />

      {/* Sticky Tabs: use anchor links so clicking them navigates to section and CSS keeps offset */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex">
          <a href="#coupons" className="px-4 py-2 text-sm font-medium text-green-600 border-b-2 border-green-600">
            Coupons
          </a>
          <a href="#store-info" className="px-4 py-2 text-sm font-medium text-gray-600">
            Store Info
          </a>
          <a href="#faqs" className="px-4 py-2 text-sm font-medium text-gray-600">
            FAQs
          </a>
        </div>
      </div>

      {/* Main content */}
      <div>
        <div id="coupons" className="py-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Coupons */}
            <div className="w-full lg:w-2/3">
              {["Active", "Similar", "Expired"].map((section: string) => {
                const sectionCoupons =
                  section === "Active"
                    ? activeCoupons
                    : section === "Similar"
                    ? (data?.similarCoupons || []).slice(0, 8)
                    : couponsList.filter((c: any) => c.buttonText === "Expired");

                return (
                  <div key={section}>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">{section} Coupons</h2>
                    {sectionCoupons.length === 0 ? (
                      <div className="text-gray-500 text-sm">No coupons available in this category.</div>
                    ) : (
                      sectionCoupons.map((coupon: any) => (
                        <article key={coupon.id} className="border rounded-md p-0 mb-4 px-4">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <div className="flex-1">
                              <div className="flex items-start">
                                <div className="text-center py-4 min-w-[70px] max-w-[90px] w-full overflow-hidden">
                                  <div
                                    className="font-bold leading-tight text-center"
                                    style={{
                                      fontSize: "clamp(16px, 2vw, 20px)",
                                      color: section === "Expired" ? "#4B5563" : "#7FA842",
                                    }}
                                  >
                                    {coupon.discount}
                                  </div>
                                  <div
                                    className="font-bold leading-tight text-center"
                                    style={{
                                      fontSize: "clamp(16px, 2vw, 18px)",
                                      color: section === "Expired" ? "#4B5563" : "#7FA842",
                                    }}
                                  >
                                    {coupon.second_img}
                                  </div>
                                </div>

                                <div className="h-[] self-stretch w-px bg-gray-300 mx-2" />

                                <div className="flex-1 pl-2 py-4">
                                  <div className="text-[9.32px] md:text-[13px] text-[#7FA842] font-[800]">
                                    {coupon.codeorDeal}{" "}
                                    {coupon.isExclusive && (
                                      <span style={{ marginLeft: 10 }}>
                                        <span style={{ background: "#789A1A", color: "white", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>
                                          Exclusive
                                        </span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[12.9px] md:text-[16px] text-gray-800">{coupon.title}</div>

                                  <div className="flex items-center text-xs mt-1">
                                    <span className="text-gray-500 mr-2 hidden md:block">{coupon.expiry}</span>
                                    {coupon.verified && <span className="text-green-500">Verified</span>}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action as anchor (server-rendered + accessible) */}
                            <div className="mt-3 md:mt-0 relative md:block hidden">
                              <a
                                href={coupon.htmlCode || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-coupon-action
                                data-coupon-id={String(coupon.id ?? "")}
                                data-coupon-code={String(coupon.code ?? "")}
                                data-coupon-title={String(coupon.title ?? "")}
                                data-coupon-logo={String(coupon.logo ?? "")}
                                data-coupon-html={String(coupon.htmlCode ?? "")}
                                className={`inline-flex items-center justify-center border px-4 py-1.5 rounded-full text-white ${
                                  section === "Expired" ? "bg-gray-400" : coupon.code ? "bg-[#7FA842]" : "bg-gray-800 hover:bg-gray-700"
                                }`}
                                aria-label={coupon.buttonText}
                              >
                                {coupon.buttonText}
                              </a>
                            </div>

                            {/* Mobile action */}
                            <div className="mt-3 md:mt-0 block md:hidden relative">
                              <a
                                href={coupon.htmlCode || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-coupon-action
                                data-coupon-id={String(coupon.id ?? "")}
                                data-coupon-code={String(coupon.code ?? "")}
                                data-coupon-title={String(coupon.title ?? "")}
                                data-coupon-logo={String(coupon.logo ?? "")}
                                data-coupon-html={String(coupon.htmlCode ?? "")}
                                className={`inline-flex items-center justify-center px-3 py-1 rounded text-white ${
                                  section === "Expired" ? "bg-gray-400" : coupon.code ? "bg-[#7FA842]" : "bg-gray-800"
                                }`}
                                aria-label={coupon.buttonText}
                              >
                                {coupon.code ? "Get Code" : "Get Deal"}
                              </a>
                            </div>
                          </div>

                          {/* See details toggle - server renders as text and data attribute for client to enhance */}
                          <div className="text-xs text-gray-600 flex items-center mt-0 p-2 border-t cursor-pointer" data-coupon-toggle-details={String(coupon.id ?? "")}>
                            <span>See Details</span>
                            <span className="ml-1">+</span>
                          </div>

                          {/* Hidden details container - client may toggle */}
                          <div className="mb-4 text-sm text-gray-700 hidden" data-coupon-details={String(coupon.id ?? "")}>
                            {coupon.description || "No additional details available."}
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="mb-4 text-center hidden md:block">
                <div className="text-xl font-bold mb-4 text-gray-800">{activeCouponCount} Active Offers Available</div>
              </div>

              {/* Filters */}
              <div className="mb-6 hidden md:block">
                <h3 className="text-sm font-bold mb-2 text-gray-800">Filters Offers</h3>
                <div className="space-y-2">
                  <button className={`w-full transition-colors rounded-full py-2 font-medium text-sm bg-[#7FA842] text-white`}>All ({activeCouponCount})</button>
                  <button className={`w-full transition-colors rounded-full py-2 font-medium text-sm bg-gray-100 text-gray-700`}>Deals ({activeDealsCount})</button>
                  <button className={`w-full transition-colors rounded-full py-2 font-medium text-sm bg-gray-100 text-gray-700`}>Codes ({activeCodesCount})</button>
                </div>
              </div>

              <div className="custom-class border rounded-lg p-5 mb-6 bg-white shadow-lg">
                {store?.storeDescription ? <div dangerouslySetInnerHTML={{ __html: store.storeDescription }} /> : <p className="text-gray-500">No Description to show</p>}
              </div>

              {/* Similar stores */}
              <div className="max-w-3xl mx-auto p-4 font-sans">
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-[#14303B] p-4">
                  <h2 className="text-lg font-medium text-center mb-4 text-gray-800">Similar Stores</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {formattedSimilarStores.length > 0 ? (
                      formattedSimilarStores.map((s: { storeId: string; name: string; logo: string }, i: number) => (
                        <a key={i} href={`/coupons/${s.storeId}`} className="bg-white rounded-md border border-[#7FA842] p-4 flex items-center justify-center h-[140px]">
                          <img src={convertToSecureUrl(s.logo)} alt={s.name} className="object-contain w-[120px] h-[120px]" />
                        </a>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">No records found</div>
                    )}
                  </div>
                </div>

                {/* Latest stores */}
                <div className="bg-gray-50 rounded-xl p-6 max-w-[500px] shadow">
                  <h2 className="text-2xl font-bold text-center mb-6">Latest Stores</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {latestStores.length > 0 ? (
                      latestStores.map((s: any, i: number) => (
                        <a key={i} href={`/coupons/${s.slug}`} className="bg-white rounded-md border border-[#7FA842] p-4 flex items-center justify-center h-[140px]">
                          <img src={convertToSecureUrl(s.logoUrl)} alt={s.name} className="object-contain w-[120px] h-[120px]" />
                        </a>
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500">No recent stores found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products carousel area (server-rendered) */}
        <Row>
          <Col xs={24} md={18}>
            {store?.products?.length > 0 && (
              <div className="my-16">
                <p className="text-[25px] md:text-[35px] font-bold mb-4">{store?.name} Products</p>
                <ProductSlider data={data} />
              </div>
            )}
          </Col>
        </Row>

        {/* Store Info & FAQs */}
        <Row>
          <Col id="store-info" xs={24} md={16}>
            <div className="pt-8 border-t">
              <div className="custom-class prose lg:prose-xl">
                {store?.storeArticle ? <div dangerouslySetInnerHTML={{ __html: store?.storeArticle }} /> : <p className="text-gray-500">No article available at the moment.</p>}
              </div>
            </div>
          </Col>

          <Col id="faqs" xs={24} md={16}>
            <div>
              <h2 className="font-bold py-12 text-[20px] md:text-[25px] text-gray-800">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {(store?.faqs || []).map((faq: any, idx: number) => (
                  <div key={idx} className="border-b pb-4">
                    <details className="group">
                      <summary className="text-[14px] md:text-[20px] flex justify-between items-center w-full text-left font-bold cursor-pointer">
                        {faq.question}
                      </summary>
                      <p className="mt-2 text-gray-700">{faq.answer}</p>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Include client enhancer for interactivity (modal/copy/keyboard toggles etc.) */}
      <CouponTabsClient />
    </div>
  );
}
