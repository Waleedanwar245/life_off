import Link from "next/link"
import Image from "next/image"
import { FaCalendarAlt } from "react-icons/fa"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

// Types
interface BlogPost {
  id: string
  title: string
  slug: string
  featuredImage: string
  createdAt: string
  category?: {
    categoryTitle: string
  }
}

interface BlogsResponse {
  list: BlogPost[]
}

// Fetch latest blogs
async function getLatestBlogs(): Promise<any> {
  try {
     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
    const res = await fetch(`${apiUrl}/blogs/latest`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch latest blogs")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching latest blogs:", error)
    return { list: [] }
  }
}

export default async function BlogLayout({ data }: { data: any }) {
  const latestBlogData = await getLatestBlogs()
  const posts = latestBlogData || []
  const authorDetails = data?.__author__ || null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Author Profile Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 my-12">
        <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={convertToSecureUrl(authorDetails?.imageUrl) || "/placeholder.svg?height=100&width=100"}
            alt="Author profile"
            // fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div>
          <h2 className="text-green-600 font-medium text-lg mb-1">{authorDetails?.name || "MARIA LALONDE"}</h2>
          <p className="text-gray-800 leading-relaxed">
            {authorDetails?.description ||
              "A globe-trotting, Topo Chico-swilling and ukulele-pickin' writer, Maria Cristina Lalonde loves saving money as much as she hates Oxford commas."}
          </p>
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="my-8">
        <h2 className="text-center text-[19.03px] font-semibold uppercase tracking-wider mb-8">Latest Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post: BlogPost) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug || "no-slug"}`}
              className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={convertToSecureUrl(post.featuredImage) || "/placeholder.svg?height=192&width=384"}
                  alt={post.title}
                  // fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 transition-colors">{post.title}</h3>
                <div className="text-sm font-medium mb-2 text-[#7FA842]">
                  {post?.category?.categoryTitle || "General"}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  <span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
