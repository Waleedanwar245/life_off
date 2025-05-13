import type { Metadata } from "next"
import { API_URL } from "@/app/components/utils/BASE_URL"
import axios from "axios"
import Link from "next/link"
import CategoriesCarousel from "@/app/components/category/CategoriesCarousel"
import CategoryGrid from "@/app/components/category/CategoryGrid"

export const metadata: Metadata = {
  title: "All Categories | LiveOffCoupon",
  description:
    "Explore a wide range of categories on LiveOffCoupon, offering amazing deals and discounts across various product categories.",
  // Rest of your metadata stays the same
}

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
            url: "https://liveoffcoupon.com/category/all",
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