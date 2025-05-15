"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import { API_URL } from "../utils/BASE_URL"

// Define paths object to replace the imported PATH
const PATH = {
  SINGLE_BLOG: "/blog/:id",
}

export default function RelatedBlogs({ SingBlogdata }: any) {
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([])
  const router = useRouter()

  // Get the current blog's category ID to find related blogs
  const currentBlog = SingBlogdata || {}
  const categoryId = currentBlog?.category?.id

  // Fetch related blogs based on category
  useEffect(() => {
    if (!categoryId) return

    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs?categoryId=${categoryId}`)

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        // Filter out the current blog
        const filteredBlogs = data?.filter((blog: any) => blog.id !== currentBlog.id) || []
        setRelatedBlogs(filteredBlogs.slice(0, 3))
      } catch (error) {
        console.error("Error fetching related blogs:", error)
        setRelatedBlogs([])
      }
    }

    fetchRelatedBlogs()
  }, [categoryId, currentBlog.id])

  if (relatedBlogs.length === 0) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog: any) => (
          <div
            key={blog.id}
            onClick={() => router.push(PATH.SINGLE_BLOG.replace(":id", blog?.slug || "no-slug"))}
            className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="overflow-hidden relative h-48">
              <Image
                src={convertToSecureUrl(blog.featuredImage || blog.bannerImage) || "/images/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                unoptimized // Use this for external images
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 transition-colors">{blog.title}</h3>
              <div className="text-sm font-medium mb-2 text-[#7FA842]">
                {blog?.category?.categoryTitle || "General"}
              </div>
              <div className="text-gray-500 text-sm">
                <span>Published {new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
