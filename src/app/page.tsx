import { API_URL } from "@/app/components/utils/BASE_URL"
import SplashScreen from "@/app/components/utils/SplashSvreen"
import { Suspense } from "react"
import type { Metadata } from "next"
import { sanitizeHomeData } from "@/app/components/utils/sanitizeHomeData";
// import HeroBanner from "./components/landingSections/HeroBanner"
import HeroBanner from "./components/landingSections/HeroBanner.server"
import HeroBannerClient from "./components/landingSections/HeroBanner.client"
// import MerchantCard from "./components/landingSections/MerchantCard"
import MerchantCard from "./components/landingSections/MerchantCard.server"
import MerchantCardClient from "./components/landingSections/MerchantCard.client"
// import CouponTabs from "./components/landingSections/CouponTabs"
import CouponTabs from "./components/landingSections/CouponTabs.server";
import CouponTabsClient from "./components/landingSections/CouponTabs.client";
// import Categories from "./components/landingSections/Categories"
import Categories from "./components/landingSections/Categories.server";
import CategoriesClient from "./components/landingSections/Categories.client";
// import TrendingDeals from "./components/landingSections/TrendingDeals"
import TrendingDeals from "./components/landingSections/TrendingDeals.server";
import TrendingDealsClient from "./components/landingSections/TrendingDeals.client";
// import TopDealsSlider from "./components/landingSections/TopDealsSlider"
import TopDealsSlider from "./components/landingSections/TopDealsSlider.server";
import TopDealsSliderClient from "./components/landingSections/TopDealsSlider.client";
// import Blogs from "./components/landingSections/Blogs"
import Blogs from "./components/landingSections/Blogs.server";
import BlogsClient from "./components/landingSections/Blogs.client";
// import FAQ from "./components/landingSections/FAQ";
import FAQ from "./components/landingSections/FAQ.server";
import FAQClient from "./components/landingSections/FAQ.client";
// import FavoriteDeal from "./components/landingSections/FavoriteDeal"
import FavoriteDeal from "./components/landingSections/FavoriteDeal.server";
import FavoriteDealClient from "./components/landingSections/FavoriteDeal.client";



// Fetch landing page data
async function getLandingPageData() {
  try {
    const res = await fetch(`${API_URL}/landings/1`, {
      next: { revalidate: 10 }, // Revalidate every hour
    })
    console.log("data====res:::", res);

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
    console.log("stireDAta::::", res);
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
  const [bannerDataRaw, allStoresRaw, allCouponsRaw, categoryDataRaw] = await Promise.all([
    getLandingPageData(),
    getStoresData(),
    getCouponsData(),
    getCategoriesData(),
  ])

  // Use your canonical site origin here
  const SITE_ORIGIN = "https://liveoffcoupon.com";

  // Sanitize (remove nofollow only for internal links) recursively from the fetched raw data:
  const bannerData = sanitizeHomeData(bannerDataRaw, SITE_ORIGIN);
  const allStores = sanitizeHomeData(allStoresRaw, SITE_ORIGIN);
  const allCoupons = sanitizeHomeData(allCouponsRaw, SITE_ORIGIN);
  const categoryData = sanitizeHomeData(categoryDataRaw, SITE_ORIGIN);

  // Generate JSON-LD schema
  const jsonLdWebsite = {
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

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "LiveOff Coupon - Free Online Coupon Codes & Discounts",
    description:
      "Browse our free online coupon codes to get amazing discounts on a wide range of products. Save money with the latest deals, discounts, and promo codes!",
    url: "https://liveoffcoupon.com/",
  }

  const jsonLdBreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://liveoffcoupon.com/",
      },
    ],
  }

  const jsonLdViewAction = {
    "@context": "https://schema.org",
    "@type": "ViewAction",
    target: "https://liveoffcoupon.com/",
    name: "View the homepage of LiveOffCoupon",
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdViewAction) }}
      />

      {/* Google verification */}
      <meta name="google-site-verification" content="jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M" />

      <div className="mt-[220px] md:mt-[140px]">
        <HeroBanner data={bannerData} />
        <HeroBannerClient />
      </div>

      <Suspense fallback={<SplashScreen />}>
        <MerchantCard data={allStores} />
        <MerchantCardClient />
        <CouponTabs data={allCoupons} />
        <CouponTabsClient />
        <Categories data={categoryData} />
        <CategoriesClient />
        <TrendingDeals />
        <TrendingDealsClient />
        <FavoriteDeal />
        <FavoriteDealClient />
        <TopDealsSlider />
        <TopDealsSliderClient />
        <Blogs />
        <BlogsClient />
        <FAQ data={bannerData} />
        <FAQClient />
      </Suspense>
    </>
  )
}
