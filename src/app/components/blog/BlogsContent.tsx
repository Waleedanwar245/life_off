"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import SplashScreen from "../utils/SplashSvreen"
import BlogFeaturedSection from "./BlogFeaturedSection"
import BlogLayout from "./BlogLayout"

export default function BlogsContent() {
  const [blogData, setBlogData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch blog data
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
         const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        const response = await fetch(`${apiUrl}/blogs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("data:::", data)
        setBlogData(data)
      } catch (error) {
        console.error("Error fetching blogs:", error)
        setBlogData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div>
      <Script id="schema-script" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "LiveOffCoupon Blogs",
          url: "https://liveoffcoupon.com/blogs",
          description:
            "LiveOffCoupon's blog section covers smart saving techniques, coupon usage guides, shopping tips, and industry trends.",
          publisher: {
            "@type": "Organization",
            name: "LiveOffCoupon",
            url: "https://liveoffcoupon.com/",
            logo: {
              "@type": "ImageObject",
              url: "https://liveoffcoupon.com/logo.png", // replace with your actual logo
            },
          },
        })}
      </Script>

      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          {/* <BlogIcons /> */}
          <div className="mt-[250px] md:mt-[100px]">
            <BlogFeaturedSection data={blogData} />
          </div>
          <BlogLayout data={blogData} />
          {/* <BlogNewsLayout data={data} />
          <FooterSection /> */}
        </>
      )}
    </div>
  )
}
