import BlogBanner from "@/app/components/blog/BlogBanner2"
import BlogLayout from "@/app/components/blog/BlogLayout2"
import { API_URL } from "@/app/components/utils/BASE_URL"
import SplashScreen from "@/app/components/utils/SplashSvreen"
// import RelatedBlogs from '@/app/components/blog/RelatedBlogs2'
// import SplashScreen from '@/app/components/utils/SplashSvreen'
import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

// Types
interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  featuredImage: string
  bannerImage: string
  metaTitle: string
  metaDescription: string
  createdAt: string
  isTrending: boolean
  category?: {
    categoryTitle: string
  }
  __author__?: {
    name: string
    imageUrl: string
    description: string
  }
}

interface BlogResponse {
  list: BlogPost
}

// Define Props type similar to your CategoryPage
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Fetch blog data
async function getBlogBySlug(slug: string): Promise<any> {
  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
    const res = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch blog post")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching blog post:", error)
    throw error
  }
}

// Generate metadata for the page
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    // Await the params to get the slug
    const { slug } = await params
    const data = await getBlogBySlug(slug)
    const blogPost = data

    if (!blogPost) {
      return {
        title: "Blog Post Not Found | LiveOffCoupon",
        description: "The requested blog post could not be found.",
      }
    }

    const blogTitle = blogPost?.metaTitle || blogPost.title || blogPost.slug || "Blog | LiveOffCoupon"
    const blogDescription =
      blogPost.metaDescription ||
      blogPost.content?.substring(0, 160) ||
      "Learn how to save money on utilities with simple habits and tools. Cut down your bills without sacrificing comfort."

    return {
      title: blogTitle,
      description: blogDescription,
      openGraph: {
        title: blogTitle,
        description: blogDescription,
        url: `https://liveoffcoupon.com/blog/${blogPost.slug}`,
        type: "article",
        images: [
          {
            url: blogPost.bannerImage || "/logo.png",
            width: 1200,
            height: 630,
            alt: blogTitle,
          },
        ],
      },
      alternates: {
        canonical: `https://liveoffcoupon.com/blog/${blogPost.slug}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog | LiveOffCoupon",
      description: "Discover the latest tips and tricks to save money and live better.",
    }
  }
}

// Generate JSON-LD schema
function generateJsonLd(blogPost: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.metaTitle || blogPost.title,
    image: blogPost.bannerImage || "/logo.png",
    author: {
      "@type": "Organization",
      name: blogPost.__author__?.name || "LiveOffCoupon",
    },
    publisher: {
      "@type": "Organization",
      name: blogPost.__author__?.name || "LiveOffCoupon",
      logo: {
        "@type": "ImageObject",
        url: blogPost.__author__?.imageUrl || "https://liveoffcoupon.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://liveoffcoupon.com/blog/${blogPost.slug}`,
    },
    description: blogPost.metaDescription || "Learn how to save money with simple tricks and eco-friendly habits.",
    datePublished: blogPost.createdAt,
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  try {
    // Await the params to get the slug
    const { slug } = await params
    const data = await getBlogBySlug(slug)

    if (!data) {
      notFound()
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(data)),
          }}
        />
        <div className="mt-[200px] md:mt-[100px]">
          <BlogBanner data={data} />
        </div>
        {/* <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">Loading related blogs...</div>}>
          <RelatedBlogs blogData={data} />
        </Suspense> */}
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">Loading more content...</div>}>
          <BlogLayout data={data} />
        </Suspense>
      </>
    )
  } catch (error) {
    console.error("Error rendering blog page:", error)
    return <>loading</>
  }
}
