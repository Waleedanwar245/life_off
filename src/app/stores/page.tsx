import { Metadata } from "next"
import StoresContent from "../components/store/StoresContent"

export const metadata: Metadata = {
  title: "Stores on Offers | LiveOffCoupon",
  description: "Discover a wide range of stores offering exclusive discounts and coupons on LiveOffCoupon. Shop smart and save more!",
  openGraph: {
    title: "Stores on Offers",
    description: "Find amazing deals from your favorite brands, all in one place.",
    type: "website",
    url: "https://liveoffcoupon.com/stores",
    images: [
      {
        url: "/images/footer-logo.png",
        width: 1200,
        height: 630,
        alt: "LiveOffCoupon",
      },
    ],
  },
  alternates: {
    canonical: "https://liveoffcoupon.com/stores",
  },
  other: {
    "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMB73W68lVU-h6M",
  },
}

export default function Page() {
  return <StoresContent />
}
