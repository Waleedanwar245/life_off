"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

const MerchantCard = ({ data }: { data: any }) => {
  const [duplicatedMerchants, setDuplicatedMerchants] = useState<any[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Memoize to avoid recomputing every render
  const topMerchants = useMemo(() => {
    return data?.filter((store: any) => store?.isFeatureStore || store?.isPopularStore).slice(0, 8) || []
  }, [data])

  // Duplicate merchants for smooth infinite scroll
  useEffect(() => {
    if (topMerchants.length > 0) {
      setDuplicatedMerchants([...topMerchants, ...topMerchants])
    }
  }, [topMerchants])

  // Smooth infinite scroll
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let animationFrame: number
    const scrollSpeed = 0.5 // pixels per frame (adjust for smoothness)

    const scroll = () => {
      slider.scrollLeft += scrollSpeed

      // Loop back to start when halfway through
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0
      }

      animationFrame = requestAnimationFrame(scroll)
    }

    animationFrame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrame)
  }, [duplicatedMerchants])

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 overflow-hidden">
      {/* Heading */}
      <h2
        className="text-3xl font-bold text-center text-gray-900 mb-10"
        style={{ fontSize: "clamp(20px, 2vw, 51.2px)" }}
      >
        Our Favorite Merchants
      </h2>

      {/* States */}
      {!data && <p className="text-center text-gray-500 text-lg">Loading merchants...</p>}
      {!data && <p className="text-center text-red-500 text-lg">Failed to load merchants.</p>}
      {data && topMerchants.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No merchants available.</p>
      )}

      {/* Slider */}
      {data && duplicatedMerchants.length > 0 && (
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth"
          style={{ width: "100%", height: "125px" }}
        >
          {duplicatedMerchants.map((merchant: any, index: number) => (
            <div key={index} className="flex-shrink-0 w-[25%]">
              <button
                onClick={() => router.push(`/coupons/${merchant?.slug || "no-slug"}`)}
                className="bg-[#ffffff] shadow-md hover:shadow-lg !h-[120px] w-full min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] text-black flex items-center justify-center px-4 py-3 rounded-[10px] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  {merchant?.logoUrl ? (
                    <div className="relative w-auto h-[76px] sm:h-[40px] lg:h-[50px]">
                      <Image
                        src={convertToSecureUrl(merchant.logoUrl) || "/placeholder.svg"}
                        alt={`${merchant?.name} logo`}
                        width={100}
                        height={50}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base lg:text-lg font-medium px-2 text-center">
                      {merchant?.name || "Unknown Merchant"}
                    </span>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MerchantCard
