import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { FaCalendarAlt, FaUser } from "react-icons/fa"
import { HiOutlineUser } from "react-icons/hi2"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import PATH from "../utils/path"

export default function BlogFeaturedSection({ data }: any) {
  dayjs.extend(utc)

  // Filter for popular and trending posts
  const popularPost = data?.find((item: any) => item?.isPopular)
  const trendingPosts = data?.filter((item: any) => item?.isTrending)?.slice(0, 4)

const formatDate = (date: string) => {
    return dayjs(date).format("MMM D, YYYY")
  }

  const formatedData =
    data?.filter((item: any) => item?.isFeatured)
      ?.map((item: any) => {
        const fullDescription =
          item?.content ||
          "The Walmart Deals Event is a great excuse to stock up on all the gear and accessories needed to build an awesome game room";

        const trimmedDescription =
          fullDescription.length > 400
            ? fullDescription.slice(0, 200).trimEnd() + "..."
            : fullDescription;


        return {
          id: item.id,
          title: item.title,
          author: item?.__author__?.name || "Shannon Flynn",
          date: item?.createdAt || "October 22, 2025",
          description: trimmedDescription,
          image: item?.featuredImage || "/src/assets/landing/feature-img3.png",
          slug:item?.slug
        };
      })
      .slice(0, 6) || [];

  return (
    <div className="max-w-[1444px] mx-auto px-5 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Popular Post */}
        {popularPost && (
          <div onClick={() => window.open(PATH.SINGLE_BLOG.replace(":id", popularPost?.slug||'no-slug'), "_blank")} className="md:col-span-2 cursor-pointer">
            <div className="relative rounded-lg overflow-hidden border h-full">
              <div className="relative h-[400px] md:h-[500px]">
                <img
                  src={convertToSecureUrl(popularPost?.featuredImage) || "/placeholder.svg?height=500&width=800"}
                  alt={popularPost?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white p-6">
              
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{popularPost?.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>Published {dayjs.utc(popularPost.createdAt).format("MMMM D, YYYY")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    <span>By {popularPost?.__author__?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column - Trending Posts */}
        <div className="space-y-6">
          <span className="px-4 text-lg font-semibold text-black whitespace-nowrap">
          TRENDING
          </span>
          {trendingPosts?.slice(0, 4).map((blog: any, index: number) => (
            <div    onClick={() => window.open(PATH.SINGLE_BLOG.replace(":id", blog.slug || 'no-slug'), "_blank")} key={index} className="cursor-pointer flex gap-4 border rounded-lg overflow-hidden">
              <div className="relative w-1/3">
                <img
                  src={convertToSecureUrl(blog?.featuredImage) || `/placeholder.svg?height=150&width=150`}
                  alt={blog?.title}
                  className="w-full h-full object-cover min-h-[120px]"
                />
                {/* <div className="absolute top-0 right-0 bg-[#7FA842] text-white rounded-[10px] w-6 h-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px]">{formatDate(blog.createdAt)}</span>
                </div> */}
              </div>
              <div className="w-2/3 p-3">
                {/* <div className="text-xs text-blue-600 uppercase tracking-wider mb-1">
                  {blog?.categories?.join(" - ") || "COMMON PROMO CODES - COMMON COUPON CODES"}
                  </div> */}
                <h2 className="text-base font-semibold line-clamp-2">{blog?.title}</h2>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                      <FaCalendarAlt className="mr-1" />
                      <span>Published {formatDate(blog.createdAt)}</span>
                    </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                      <HiOutlineUser className="mr-1" />
                      <span> {blog?.__author__?.name}</span>
                    </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="max-w-[1440px] mx-auto p-4 md:p-8">
        <div className="h-full mx-auto">
          <div className="flex items-center justify-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-lg font-semibold text-black whitespace-nowrap">
              Shopping Guides & Articles
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>


          {/* Safety Check - If no blogs available */}
          {formatedData.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No Blogs Available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formatedData.map((post: any) => (
                <div
                  onClick={() => window.open(PATH.SINGLE_BLOG.replace(":id", post.slug || 'no-slug'), "_blank")}
                  key={post.id}
                  className="cursor-pointer flex bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image Container */}
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
{/* 
                    <p
                      className="text-gray-600 line-clamp-2 text-[15.66px]"
                      style={{ fontSize: "clamp(12px, 1vw, 15.66px)" }}
                    >
                      {post.description}
                    </p> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
