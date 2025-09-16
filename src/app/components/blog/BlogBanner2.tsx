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
    <div className="max-w-7xl mx-auto px-2 md:px-4 pt-0 md:pt-12">
      <article className="space-y-4 md:space-y-6">
        {/* Title */}
        <h1 className="text-[25px] text-3xl text-gray-800 md:text-4xl font-bold tracking-tight">
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
        <div className="relative w-full h-[110px] md:h-[442px]">
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

      <div className="w-full custom-class mt-[65px] md:mt-[40px]">
        {data?.content && <div dangerouslySetInnerHTML={{ __html: data.content }} />}

      </div>

      <div className="flex flex-row items-center sm:items-start gap-6 mt-2 md:mt-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={convertToSecureUrl(authorDetails?.imageUrl) || "/placeholder.svg?height=100&width=100"}
            alt="Author profile"
            // fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className='hidden md:block'>
          <h2 className="text-green-600 font-medium text-lg mb-1">{authorDetails?.name || "MARIA LALONDE"}</h2>
          <p className="text-gray-800 leading-relaxed">
            {authorDetails?.description ||
              "A globe-trotting, Topo Chico-swilling and ukulele-pickin' writer, Maria Cristina Lalonde loves saving money as much as she hates Oxford commas."}
          </p>
        </div>
        <div className='block md:hidden'>
          <h2 className="text-green-600 font-[700] text-[12.44px] mb-1">{authorDetails?.name || "MARIA LALONDE"}<span className="text-gray-800 leading-relaxed font-[400] ">
            {authorDetails?.description ||
              "A globe-trotting, Topo Chico-swilling and ukulele-pickin' writer, Maria Cristina Lalonde loves saving money as much as she hates Oxford commas."}
          </span></h2>

        </div>
      </div>
    </div>
  )
}
