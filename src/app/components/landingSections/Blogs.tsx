"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import Image from "next/image"
import dayjs from "dayjs"
import axios from "axios"
import { API_URL } from "@/app/components/utils/BASE_URL"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

function Blogs() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs`, {
          params: {
            filters: {},
            pagination: {
              page: 1,
              pageSize: 100,
            },
          },
        })
        setData(response.data)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const formatedData =
    data
      ?.filter((item: any) => item?.isFeatured)
      ?.map((item: any) => {
        const fullDescription =
          item?.content ||
          "The Walmart Deals Event is a great excuse to stock up on all the gear and accessories needed to build an awesome game room"

        const trimmedDescription =
          fullDescription.length > 400 ? fullDescription.slice(0, 200).trimEnd() + "..." : fullDescription

        return {
          id: item.id,
          title: item.title,
          author: item?.__author__?.name || "Shannon Flynn",
          date: item?.createdAt || "October 22, 2025",
          description: trimmedDescription,
          image: item?.featuredImage || "/placeholder.svg",
          slug: item?.slug || "no-slug",
        }
      })
      .slice(0, 6) || []

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto p-4 md:p-8">
        <h1 className="text-[35px] font-bold mb-8" style={{ fontSize: "clamp(24px, 1vw, 35px)" }}>
          Blogs
        </h1>
        <p className="text-center py-8">Loading blogs...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      <div className="h-full mx-auto">
        <h1 className="text-[35px] font-bold mb-8" style={{ fontSize: "clamp(24px, 1vw, 35px)" }}>
          Blogs
        </h1>

        {/* Safety Check - If no blogs available */}
        {formatedData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No Blogs Available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formatedData.map((post: any) => (
              <div
                onClick={() => router.push(`/blog/${post.slug || "no-slug"}`)}
                key={post.id}
                className="cursor-pointer flex bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Container */}
                {/* <div className="w-1/3 bg-purple-100 relative">
                  <img
                    src={convertToSecureUrl(post.image) || "/placeholder.svg"}
                    alt={post.title}
                    // fill
                    className="object-cover rounded-[10px]"
                    // unoptimized
                  />
                </div> */}
                  <div className="w-1/3 bg-purple-100 relative">
                  <img
                    src={convertToSecureUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>

                {/* Content Container */}
                <div className="w-2/3 p-6">
                  <h2
                    className="text-[18.18px] font-semibold mb-2 line-clamp-2"
                    style={{ fontSize: "clamp(14px, 1vw, 18.18px)" }}
                  >
                    {post.title}
                  </h2>

                  <div
                    className="flex items-center gap-2 text-[12.73px] text-gray-600 mb-3"
                    style={{ fontSize: "clamp(10px, 1vw, 12px)" }}
                  >
                    <span className="capitalize">{post.author}</span>
                    <span>•</span>
                    <span>{dayjs(post.date).format("MMMM D, YYYY")}</span>
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

export default Blogs
