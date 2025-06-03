"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { FiScissors } from "react-icons/fi"
import Image from "next/image"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

export default function CouponTabs({ data }: { data: any }) {
  const router = useRouter()

  // Safely process coupon data with error handling
  const couponData = useMemo(() => {
    try {
      if (!data || !Array.isArray(data)) {
        return []
      }

      return data
        .filter((item: any) => {
          // Filter out invalid items
          return item && item.store && item.name
        })
        .sort((a: any, b: any) => {
          // Safely sort by creation date
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA // Most recent first
        })
        .reduce((acc: any, current: any) => {
          // Skip items without store
          if (!current?.store) return acc

          const storeId = current.store.id
          // Skip items without store ID
          if (!storeId) return acc

          const alreadyExists = acc.some((item: any) => item.storeid === storeId)

          if (!alreadyExists) {
            acc.push({
              couponName: current.name || "Unnamed Coupon",
              storeid: storeId,
              slug: current.store?.slug || null,
              logo: current.store?.logoUrl || "/placeholder.svg",
              name: current.store?.name || "Unknown Store",
              cashback: current.cashback || "No Cashback Available",
              percentage: (current.mainImage || "") + " " + (current.secondaryImage || ""),
              rank: current.rank || 0,
              createdAt: current.createdAt,
            })
          }

          return acc
        }, [])
        .slice(0, 12)
    } catch (error) {
      console.error("Error processing coupon data:", error)
      return []
    }
  }, [data])

  return (
    <div className="max-w-[1440px] mx-auto px-4 pt-12">
      {/* Title */}
      <h2
        className="text-2xl font-bold mb-10 md:text-start text-center"
        style={{ fontSize: "clamp(20px, 2vw, 51.2px)" }}
      >
        Today's Offers and Coupons
      </h2>

      {/* Loading State */}
      {!data && <p className="text-center text-gray-500 text-lg">Loading coupons...</p>}

      {/* Error State */}
      {!data && <p className="text-center text-red-500 text-lg">Failed to load coupons. Please try again.</p>}

      {/* No Data Found */}
      {data && couponData.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No coupons available at the moment.</p>
      )}

      {/* Coupons Grid */}
      {data && couponData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {couponData.map((coupon: any, index: any) => (
            <div
              key={index}
              onClick={() => router.push(`/coupons/${coupon?.slug || "no-slug"}`)}
              className="relative border border-dashed mx-6 sm:mx-0 border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Scissors Icon */}
              <div className="absolute -top-2 -left-2 bg-white">
                <FiScissors className="w-4 h-4 text-gray-400" />
              </div>

              {/* Logo */}
              <div className="h-32 flex items-center justify-center mb-4">
                  <img
                    src={convertToSecureUrl(coupon.logo) || "/placeholder.svg"}
                    alt={`${coupon.name} logo`}
                    // fill
                    className="max-h-full max-w-[140px] object-contain"
                    // unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.onerror = null
                      target.src = "/placeholder.svg"
                    }}
                  />
              </div>

              {/* Offer Details */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800">{coupon.couponName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
