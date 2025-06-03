import BlogBanner from "@/app/components/blog/BlogBanner2"
import BlogLayout from "@/app/components/blog/BlogLayout2"
import RelatedBlogs from "@/app/components/blog/RelatedBlogs2"
import { API_URL } from "@/app/components/utils/BASE_URL"
import SplashScreen from "@/app/components/utils/SplashSvreen"
import { Col, Row } from "antd"
import axios from "axios"
// import RelatedBlogs from '@/app/components/blog/RelatedBlogs2'
// import SplashScreen from '@/app/components/utils/SplashSvreen'
import type { Metadata, ResolvingMetadata } from "next"
import { notFound, redirect } from "next/navigation"
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

export async function generateStaticParams() {
  try {
    // Fetch all blog posts to generate static paths
    const res = await axios.get(`${API_URL}/blogs`)
    const blogs = res.data

    // Filter out blogs with null slugs
    const validBlogs = blogs.filter((blog: any) => blog.slug !== null);

    console.log(`Found ${validBlogs.length} blog posts with valid slugs out of ${blogs.length} total`);

    // Return an array of objects with the slug parameter
    return validBlogs.map((blog: any) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for blogs:", error)
    return [] // Return empty array if there's an error
  }
}

// Fetch blog data
async function getBlogBySlug(slug: string): Promise<any> {
  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
    const res = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 10 }, // Revalidate every hour
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
function generateBreadcrumbList(blogPost: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://liveoffcoupon.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://liveoffcoupon.com/blogs"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blogPost.title,
        item: `https://liveoffcoupon.com/blog/${blogPost.slug}`
      }
    ]
  }
}

function generateViewActionSchema(blogPost: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "ViewAction",
    name: `Read blog: ${blogPost.title}`,
    target: `https://liveoffcoupon.com/blog/${blogPost.slug}`,
    description: blogPost.metaDescription || blogPost.content?.slice(0, 160) || "Read the blog post"
  }
}



export default async function BlogPage({ params, searchParams }: Props) {
  try {
    // Await the params to get the slug
    const { slug } = await params
    const data = await getBlogBySlug(slug)

    if (!data) {
      redirect('/blogs')
    }

    return (
      <div className="max-w-[1440px] mx-auto px-4 py-8 md:pt-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(data)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbList(data)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateViewActionSchema(data)),
          }}
        />
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={16}>
            <div className="mt-[175px] md:mt-[50px]">
              <BlogBanner data={data} />
            </div>

          </Col>
          <Col xs={24} sm={24} md={8}>
            <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">Loading related blogs...</div>}>
              <div className=" md:mt-[120px] sticky top-20"> <RelatedBlogs blogData={data} /></div>
            </Suspense>
          </Col>
        </Row>
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">Loading more content...</div>}>
          <BlogLayout data={data} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error rendering blog page:", error)
    return redirect('/blogs')
  }
}
