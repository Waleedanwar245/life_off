"use client"

import { useState, useEffect } from "react"
import { FaCalendarAlt } from "react-icons/fa"
// import Image from "next/image"
import { useRouter } from "next/navigation"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import { API_URL } from "../utils/BASE_URL"

// Define paths object to replace the imported PATH
const PATH = {
  SINGLE_BLOG: "/blog/:id",
}

export default function BlogLayout({ data }: any) {
  const [latestPosts, setLatestPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch latest blog posts
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(${API_URL}/blogs/latest)

        if (!response.ok) {
          throw new Error(API responded with status: ${response.status})
        }

        const data = await response.json()
        setLatestPosts(data || [])
      } catch (error) {
        console.error("Error fetching latest blogs:", error)
        setLatestPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestBlogs()
  }, [])

  const posts = latestPosts || []
  const authorDetails = data?.[0]?.__author__ || null

  // Function to navigate to a blog post
  const navigateToBlog = (slug: string) => {
    router.push(PATH.SINGLE_BLOG.replace(":id", slug || "no-slug"))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Author Profile Section */}
      {/* <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 relative">
          <img
            src={convertToSecureUrl(authorDetails?.imageUrl) || "/images/placeholder.svg?height=100&width=100"}
            alt="Author profile"
            // fill
            className="object-cover"
            // unoptimized // Use this for external images
          />
        </div>
        <div>
          <h2 className="text-green-600 font-medium text-lg mb-1">{authorDetails?.name || "MARIA LALONDE"}</h2>
          <p className="text-gray-800 leading-relaxed">
            {authorDetails?.description ||
              "MARIA LALONDE A globe-trotting, Topo Chico-swilling and ukulele-pickin' writer, Maria Cristina Lalonde loves saving money as much as she hates Oxford commas."}
          </p>
        </div>
      </div> */}

      {/* Latest Posts Section */}
      <div className="my-8">
        <h2 className="text-center text-[19.03px] font-semibold uppercase tracking-wider mb-8">Latest Posts</h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#7FA842] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 100).map((post: any) => (
              <div
                key={post.id}
                onClick={() => navigateToBlog(post?.slug || "no-slug")}
                className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="overflow-hidden relative h-48">
                  <img
                    src={convertToSecureUrl(post.featuredImage) || "/images/placeholder.svg"}
                    alt={post.title}
                    // fill
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    // unoptimized // Use this for external images
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
