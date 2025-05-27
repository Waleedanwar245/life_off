import type { Metadata } from "next"
import FreeShippingContent from "../components/freeShipping/FreeShippingContent"

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
  return <FreeShippingContent />
}

