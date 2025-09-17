// BlogLayout2.tsx
import Link from "next/link"
import { FaCalendarAlt } from "react-icons/fa"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

// Types
interface BlogPost {
  id: string
  title: string
  slug: string
  featuredImage?: string
  createdAt: string
  category?: {
    categoryTitle: string
  }
}

type ApiResult = BlogPost[] | { list?: BlogPost[] } | any

// Fetch latest blogs (server-side)
async function getLatestBlogs(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
    const res = await fetch(`${apiUrl}/blogs/latest`, {
      // adjust revalidate as needed (seconds)
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error("Failed to fetch latest blogs")

    const data: ApiResult = await res.json()
    // Accept both array or { list: [...] } shapes:
    const posts: BlogPost[] = Array.isArray(data) ? data : data?.list ?? []
    return posts
  } catch (err) {
    console.error("Error fetching latest blogs:", err)
    return []
  }
}

export default async function BlogLayout({ data }: { data: any }) {
  const latestBlogData = await getLatestBlogs()
  // normalize
  const posts: BlogPost[] = latestBlogData || []

  // Sort newest -> oldest by createdAt just to be safe
  posts.sort((a, b) => {
    const da = new Date(a.createdAt).getTime()
    const db = new Date(b.createdAt).getTime()
    return db - da
  })

  const authorDetails = data?.__author__ || null

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* (Optional) Author section could go here */}

      <div className="my-8">
        <h2 className="text-center text-[19.03px] text-gray-800 font-semibold uppercase tracking-wider mb-8">Latest Posts</h2>

        {/* Grid: 3 per row on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug || "no-slug"}`}
              className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={convertToSecureUrl(post.featuredImage) || "/placeholder.svg?height=192&width=384"}
                  alt={post.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 transition-colors">{post.title}</h3>
                <div className="text-sm font-medium mb-2 text-[#7FA842]">
                  {post?.category?.categoryTitle || "General"}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  <span>
                    Published{" "}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
