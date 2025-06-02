import type { Metadata } from "next"
import { API_URL } from "@/app/components/utils/BASE_URL"
import axios from "axios"
import Link from "next/link"
import CategoriesCarousel from "@/app/components/category/CategoriesCarousel"
import CategoryGrid from "@/app/components/category/CategoryGrid"

export const metadata: Metadata = {
  title: "All Categories | LiveOffCoupon",
  description: "Explore a wide range of categories on LiveOffCoupon, offering amazing deals and discounts across various product categories.",
  alternates: {
    canonical: "https://liveoffcoupon.com/categories",
  },
  openGraph: {
    title: "All Categories | LiveOffCoupon",
    description: "Discover discounts in all product categories available on LiveOffCoupon.",
    url: "https://liveoffcoupon.com/categories",
    type: "website",
    images: [
      {
        url: "https://liveoffcoupon.com/logo.svg", // Use the correct path from IMAGES.STORE_LOGO
        width: 800,
        height: 600,
        alt: "LiveOffCoupon Store Logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
  },
};

// Server-side data fetching
async function getCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`)
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function Page() {
  // Fetch data on the server
  const categoriesData = await getCategories()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "All Categories | LiveOffCoupon",
            description: "Explore all categories and find exclusive deals and discounts on LiveOffCoupon.",
            url: "https://liveoffcoupon.com/categories",
          }),
        }}
      />

      {/* Breadcrumb Schema */}
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
                name: "Categories",
                item: "https://liveoffcoupon.com/categories",
              },
            ],
          }),
        }}
      />

      {/* Optional: CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "All Categories | LiveOffCoupon",
            url: "https://liveoffcoupon.com/categories",
            description: "Explore categories to find promo codes and deals across products and services.",
            hasPart: categoriesData.map((cat: any) => ({
              "@type": "WebPage",
              name: cat.categoryTitle || cat.categoryName,
              url: `https://liveoffcoupon.com/category/${cat.slug}`,
            })),
          }),
        }}
      />

      <div className="mt-[100px]">
        {/* Pass data directly to your components */}
        <CategoriesCarousel data={categoriesData} />
        <CategoryGrid data={categoriesData} />

        {/* Add this section to ensure links are in the HTML */}
        <div className="hidden">
          {categoriesData.map((category: any) => (
            category.slug && (
              <Link key={category.id} href={`/category/${category.slug}`}>
                {category.categoryTitle || category.categoryName}
              </Link>
            )
          ))}
        </div>
      </div>
    </>
  )
}