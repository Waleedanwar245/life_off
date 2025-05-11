import type { Metadata, ResolvingMetadata } from 'next'
import axios from "axios"
import CategoryBanner from "@/app/components/category/categoryBanner"
import CategoryCoupons from "@/app/components/category/CategoryCoupons"
import { API_URL } from "@/app/components/utils/BASE_URL"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Read route params
  const { slug } = await params
  
  try {
    // Fetch data
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
    const res = await axios.get(`${API_URL}/categories/slug/by/${slug}`)
    const data = res.data
    
    // Optionally access and extend parent metadata
    const previousImages = (await parent).openGraph?.images || []
    const previousDescription = (await parent).description || ''
    
    // If no data is returned, use fallbacks
    if (!data) {
      return {
        title: "Category | LiveOffCoupon",
        description: previousDescription || "Find the best coupons and promo codes",
      }
    }
    
    // Prepare image for OpenGraph
    const ogImage = data.image 
      ? [{ url: data.image, width: 1200, height: 630, alt: data.categoryName || "Category image" }, ...previousImages]
      : [{ url: "https://liveoffcoupon.com/default.jpg", width: 1200, height: 630, alt: "LiveOffCoupon" }, ...previousImages]
    
    return {
      title: data.categoryTitle || "Category | LiveOffCoupon",
      description: data.metaDescription || data.categoryDescription || "Find the best coupons and promo codes",
      openGraph: {
        title: data.categoryTitle || "Category | LiveOffCoupon",
        description: data.metaDescription || data.categoryDescription || "Find the best coupons and promo codes",
        url: `https://liveoffcoupon.com/category/${data.slug}`,
        siteName: "LiveOffCoupon",
        images: ogImage,
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: data.categoryTitle || "Category | LiveOffCoupon",
        description: data.metaDescription || data.categoryDescription || "Find the best coupons and promo codes",
        images: data.image ? [data.image] : ["https://liveoffcoupon.com/default.jpg"],
      },
      alternates: {
        canonical: `https://liveoffcoupon.com/category/${data.slug}`,
      },
      other: {
        "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMB73W68lVU-h6M",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    // Fallback metadata in case of error
    const previousDescription = (await parent).description || ''
    return {
      title: "Category | LiveOffCoupon",
      description: previousDescription || "Find the best coupons and promo codes",
    }
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  // Read route params
  const { slug } = await params

  try {
    const res = await axios.get(`${API_URL}/categories/slug/by/${slug}`)
    const data = res.data

    if (!data) {
      throw new Error("No data returned from API")
    }

    return (
      <div>
        <div className="mt-[100px]">
          <CategoryBanner data={data} />
        </div>
        <CategoryCoupons data={data} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching category data:", error)
    return (
      <div className="mt-[100px] p-4 text-center">
        <h1>Category not found</h1>
        <p>Sorry, we couldn't find the category you're looking for.</p>
      </div>
    )
  }
}