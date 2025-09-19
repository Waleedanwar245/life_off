import type { Metadata } from "next"
import FreeShippingContent from "../components/freeShipping/FreeShippingContent.server"

export const metadata: Metadata = {
  title: "Free Shipping Coupons & Deals | LiveOffCoupon",
  description:
    "Save instantly with the best free shipping codes and coupons from top brands. Verified, updated, and always 100% free. Shop now and skip the delivery fees!",
  openGraph: {
    title: "Free Shipping Coupons & Deals | LiveOffCoupon",
    description:
      "Discover the best free shipping deals and exclusive coupons to save on your purchases. Shop with confidence on LiveOffCoupon.",
    type: "website",
    url: "https://liveoffcoupon.com/free-shipping",
    images: [
      {
        url: "https://liveoffcoupon.com/logo.svg",
        width: 1200,
        height: 630,
        alt: "LiveOffCoupon",
      },
    ],
  },
  alternates: {
    canonical: "https://liveoffcoupon.com/free-shipping",
  },
  other: {
    "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMB73W68lVU-h6M",
  },
}

export default function Page() {
  {/* JSON-LD: WebPage Schema */ }
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Free Shipping Coupons & Deals | LiveOffCoupon",
        description:
          "Find the latest free shipping coupon codes and save on every order. LiveOffCoupon offers verified free delivery deals daily.",
        url: "https://liveoffcoupon.com/free-shipping",
      }),
    }}
  />

  {/* JSON-LD: Breadcrumb Schema */ }
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://liveoffcoupon.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Free Shipping",
            item: "https://liveoffcoupon.com/free-shipping",
          },
        ],
      }),
    }}
  />

  return <FreeShippingContent />
}

