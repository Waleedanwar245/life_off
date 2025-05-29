import { API_URL } from "@/app/components/utils/BASE_URL"
import SplashScreen from "@/app/components/utils/SplashSvreen"
import { Suspense } from "react"
import type { Metadata } from "next"
import HeroBanner from "./components/landingSections/HeroBanner"
import MerchantCard from "./components/landingSections/MerchantCard"
import CouponTabs from "./components/landingSections/CouponTabs"
import Categories from "./components/landingSections/Categories"
import TrendingDeals from "./components/landingSections/TrendingDeals"
import TopDealsSlider from "./components/landingSections/TopDealsSlider"
import Blogs from "./components/landingSections/Blogs"
import FAQ from "./components/landingSections/FAQ"
import FavoriteDeal from "./components/landingSections/FavoriteDeal"


// Fetch landing page data
async function getLandingPageData() {
  try {
    const res = await fetch(`${API_URL}/landings/1`, {
      next: { revalidate: 10 }, // Revalidate every hour
    })
    console.log("data====res:::",res);

    if (!res.ok) {
      throw new Error("Failed to fetch landing page data")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching landing page data:", error)
    return { list: { banners: [], faqs: [], description: "" } }
  }
}

// Fetch stores data
async function getStoresData() {
  try {
    const res = await fetch(`${API_URL}/store`, {
      next: { revalidate: 10 },
    })
console.log("stireDAta::::",res);
    if (!res.ok) {
      throw new Error("Failed to fetch stores")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching stores:", error)
    return { list: [] }
  }
}

// Fetch coupons data
async function getCouponsData() {
  try {
    const res = await fetch(`${API_URL}/coupons`, {
      next: { revalidate: 10 },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch coupons")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return { list: [] }
  }
}

// Fetch categories data
async function getCategoriesData() {
  try {
    const res = await fetch(`${API_URL}/categories/all`, {
      next: { revalidate: 10 },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch categories")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { list: [] }
  }
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "LiveOff Coupon - Free Online Coupon Codes & Discounts",
    description:
      "Browse our free online coupon codes to get amazing discounts on a wide range of products. Save money with the latest deals, discounts, and promo codes!",
    alternates: {
      canonical: "https://liveoffcoupon.com/",
    },
  }
}

export default async function Home() {
  // Fetch data in parallel
  const [bannerData, allStores, allCoupons, categoryData] = await Promise.all([
    getLandingPageData(),
    getStoresData(),
    getCouponsData(),
    getCategoriesData(),
  ])

  // Generate JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LiveOffCoupon",
    url: "https://liveoffcoupon.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://liveoffcoupon.com/search?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Google verification */}
      <meta name="google-site-verification" content="jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M" />

      <div className="mt-[220px] md:mt-[140px]">
        <HeroBanner data={bannerData} />
      </div>

      <Suspense fallback={<SplashScreen />}>
      <MerchantCard data={allStores} />
      <CouponTabs data={allCoupons} />
      <Categories data={categoryData} /> 
      <TrendingDeals />
      <FavoriteDeal />
      <TopDealsSlider />
      <Blogs />
      <FAQ data={bannerData} /> 
      </Suspense>
    </>
  )
}
