"use client"

import { useState } from "react"
import Script from "next/script"
import SplashScreen from "../utils/SplashSvreen"
import BlogFeaturedSection from "./BlogFeaturedSection"
import BlogLayout from "./BlogLayout"

// Update the props to accept initialBlogData
interface BlogsContentProps {
  initialBlogData: any
}

export default function BlogsContent({ initialBlogData }: BlogsContentProps) {
  // Use the data passed from the server component
  const [blogData] = useState(initialBlogData)
  const [isLoading, setIsLoading] = useState(false)

  // No need for useEffect to fetch data anymore since we're getting it from props

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
              url: "https://liveoffcoupon.com/logo.png",
            },
          },
        })}
      </Script>

      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          <div className="mt-[200px] md:mt-[100px]">
            <BlogFeaturedSection data={blogData} />
          </div>
          <BlogLayout data={blogData} />
        </>
      )}
    </div>
  )
}