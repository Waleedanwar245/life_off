"use client"

import { useState, useEffect } from "react"
import { FaCalendarAlt } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import { API_URL } from "../utils/BASE_URL"

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
        const response = await fetch(`${API_URL}/blogs/latest`)

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
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
      {/* Latest Posts Section */}
      <div className="my-8">
        <h2 className="text-center text-[19.03px] font-semibold uppercase tracking-wider mb-8">
          Latest Posts
        </h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#7FA842] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post: any) => (
              <div
                key={post.id}
                onClick={() => navigateToBlog(post?.slug || "no-slug")}
                className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="overflow-hidden relative h-48">
                  <img
                    src={convertToSecureUrl(post.featuredImage) || "/images/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 transition-colors">
                    {post.title}
                  </h3>
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
