"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { API_URL } from "@/app/components/utils/BASE_URL"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

const FavoriteDeal = () => {
  const [eventData, setEventData] = useState<any>(null)
  const [productData, setProductData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, productsResponse] = await Promise.all([
          axios.get(`${API_URL}/events`),
          axios.get(`${API_URL}/product`),
        ])
        setEventData(eventsResponse.data)
        setProductData(productsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const showOnEventPageProducts =
    productData?.filter((product: any) => product?.isShowEventPage)?.slice(0, 3) || []

  const trendingDeals = eventData?.filter((item: any) => item?.isTrending)?.slice(0, 1) || []

  const trendingDeal = trendingDeals?.[0]

  const handleNavigateToTrending = () => {
    if (trendingDeal?.slug) {
      router.push(`/seasonal/${trendingDeal.slug}`)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-8 bg-[#14303B] my-8">
        <h2 className="text-[35px] font-bold text-center mb-8" style={{ fontSize: "clamp(24px, 5vw, 35px)" }}>
          Favorite Deal
        </h2>
        <p className="text-center py-8">Loading favorite deals...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 bg-[#14303B] my-8">
      <h2 className="text-[35px] font-bold text-center mb-8" style={{ fontSize: "clamp(24px, 5vw, 35px)" }}>
        Favorite Deal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trending Deal Image */}
        {trendingDeal && trendingDeal?.bannerImage && (
          <div className="md:col-span-2 relative group cursor-pointer" onClick={handleNavigateToTrending}>
            <div className="relative w-full md:h-[420px]">
              <img
                src={convertToSecureUrl(trendingDeal.bannerImage) || "/placeholder.svg"}
                alt={trendingDeal?.title || "Trending Deal"}
                 className="w-full h-[270px] md:h-[420px] object-cover rounded-lg"
                // unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          </div>
        )}

        {/* Product Cards */}
        <div className="space-y-4">
          {showOnEventPageProducts.map((product: any) => (
            <div
              key={product?.id}
              className="flex rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => window.open(product?.htmlUrl, "_blank")}
            >
              {product?.imageUrl && (
                <div className="w-1/2 relative h-32">
                  <img
                    src={convertToSecureUrl(product.imageUrl) || "/placeholder.svg"}
                    alt={product?.name || "Product Image"}
                    className="object-fill rounded-[10px]"
                  />
                </div>
              )}
              <div className="w-1/2 px-3 flex flex-col justify-center">
                <span
                  className="text-sm font-semibold pt-1 rounded w-fit"
                  style={{ fontSize: "clamp(14px, 1vw, 20px)" }}
                >
                  {product?.name || ""}
                </span>
                <p className="text-sm font-medium" style={{ fontSize: "clamp(14px, 1vw, 20px)" }}>
                  {product?.detail || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      {trendingDeal && (
        <div className="mt-6 text-center">
          <h2
            onClick={handleNavigateToTrending}
            className="cursor-pointer text-[30px] font-bold mt-2 mb-3"
            style={{ fontSize: "clamp(22px, 1vw, 30px)" }}
          >
            {trendingDeal?.heading3 || ""}
          </h2>
          <p
            onClick={handleNavigateToTrending}
            className="text-[17.23px] cursor-pointer"
            style={{ fontSize: "clamp(14px, 1vw, 17.23px)" }}
          >
            {trendingDeal?.description3 || ""}
          </p>
        </div>
      )}
    </div>
  )
}

export default FavoriteDeal
