import Image from 'next/image'
import { FaCalendarAlt } from "react-icons/fa"
import { convertToSecureUrl } from '../utils/convertToSecureUrl'
import { formatDate } from '../utils/formatDate'
import SafeHtml from '../utils/SafeHtml'

interface BlogBannerProps {
  data: {
    list: {
      title?: string
      featuredImage?: string
      createdAt?: string
      __author__?: {
        name?: string
      }
    }
  }
}

export default function BlogBanner({ data }: any) {
  const formattedDate = data?.createdAt ? formatDate(data?.createdAt) : "February 28, 2025"

  // Fallback static data
  const defaultTitle = "11 Size-Inclusive Fashion Brands That Should Be on Your Radar"
  const defaultAuthor = "Maria Lalonde"
  const defaultDate = "February 28, 2025"
  
  const authorDetails = data?.__author__ || null
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <article className="space-y-6">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {data?.title || defaultTitle}
        </h1>

        {/* Author and Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            By{" "}
            <a href="#" className="font-medium text-black hover:underline">
              {data?.__author__?.name ?? defaultAuthor}
            </a>
          </span>
          <span className="text-gray-400">•</span>
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="h-4 w-4" />
            {formattedDate || defaultDate}
          </span>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[506px]">
          {data?.featuredImage ? (
            <img
              src={convertToSecureUrl(data?.featuredImage) || "/placeholder.svg"}
              alt={data?.title || "Blog Image"}

              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          ) : (
            <img
              src="/placeholder.svg?height=506&width=1200"
              alt="Blog Image"
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          )}
        </div>
      </article>

      <div className="w-full  mt-6 custom-class">
        {data?.content && <div dangerouslySetInnerHTML={{ __html: data.content }} />}

      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-6">
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
    </div>
  )
}
