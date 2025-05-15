import type { Metadata } from "next"
import { API_URL } from "@/app/components/utils/BASE_URL"
import Link from "next/link"
import BlogsContent from "../components/blog/BlogsContent"

export const metadata: Metadata = {
  title: "Blogs | Latest Money-Saving Tips & Coupon Updates | LiveOffCoupon",
  description:
    "Stay updated with LiveOffCoupon's latest blogs featuring expert shopping tips, discount hacks, and trending promo code news.",
  openGraph: {
    title: "LiveOffCoupon Blogs - Promo Tips & Deals Insight",
    description:
      "Explore expert shopping tips, saving guides, and insider coupon updates in the LiveOffCoupon blog section.",
    type: "website",
    url: "https://liveoffcoupon.com/blogs",
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
    canonical: "https://liveoffcoupon.com/blogs",
  },
  other: {
    "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMB73W68lVU-h6M",
  },
}

// Server-side data fetching
async function getBlogs() {
  try {
    const response = await fetch(`${API_URL}/blogs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}

export default async function Page() {
  // Fetch data on the server
  const blogData = await getBlogs()
  
  return (
    <>
      {/* Add hidden links for SEO crawling */}
      <div className="hidden">
        {blogData && blogData.map((blog: any) => (
          blog.slug && (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              {blog.title}
            </Link>
          )
        ))}
      </div>
      
      {/* Pass the pre-fetched data to your client component */}
      <BlogsContent initialBlogData={blogData} />
    </>
  )
}