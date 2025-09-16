"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BsLightning } from "react-icons/bs"
import axios from "axios"
import { API_URL } from "@/app/components/utils/BASE_URL"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

export default function TrendingDeals() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`${API_URL}/coupons`)
                setData(response.data)
            } catch (error) {
                console.error("Error fetching coupons:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCoupons()
    }, [])

    const formatedData =
        data
            ?.filter((item: any) => item.isTrending === true)
            .map((item: any) => ({
                store: item?.store,
                storeId: item?.store?.id,
                slug: item?.store?.slug,
                couponName: item?.name,
                logo: item?.store?.logoUrl || "/placeholder.svg",
                name: item?.store?.name || "Unknown Store",
                cashback: item?.mainImage || "No Cashback Available",
                offer: `${item?.mainImage || ""} ${item?.secondaryImage || ""}`.trim() || "0% Percentage",
                bgColor: "bg-white",
                buttonType: "show",
                buttonText: item?.code ? "Show Coupon Code" : "Show Coupon Deal",
                isDeal: item?.code ? false : true, // If there's a code, set isDeal to false; otherwise, true
            }))
            .slice(0, 8) || []

    if (loading) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-gray-800 font-bold">Trending Deals</h2>
                </div>
                <p className="text-center py-8">Loading trending deals...</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1440px] mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-800 font-bold">Trending Deals</h2>
                <button className="text-sm text-[#7FA842] font-medium hover:underline">View All</button>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formatedData.map((deal: any, index: any) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Logo Container - Reduced height */}
                        <div
                            className={`relative ${deal.bgColor}  flex items-center justify-center p-4 border-b border-gray-100`}
                        >
                            {/* Discount Badge - Improved styling */}
                            {deal.offer && deal.offer !== "0% Percentage" && (
                                <div className="absolute top-3 left-3 bg-[#7FA842] text-white px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1 shadow-sm">
                                    <BsLightning className="w-3 h-3" />
                                    <span>{deal.offer}</span>
                                </div>
                            )}

                            {/* Logo - Better sizing */}
                            <div className="w-56 h-56 ">
                                {/* <Image
                                                                        src={convertToSecureUrl(coupon.logo) || "/placeholder.svg"}
                                                                        alt={coupon.altText}
                                                                        fill
                                                                        className="object-contain p-2"
                                                                        unoptimized
                                                                    /> */}
                                <img
                                    src={convertToSecureUrl(deal?.logo) || "/placeholder.svg"}
                                    alt={`${deal.name} logo`}
                                    className="object-contain p-2 mb-4"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.onerror = null
                                        target.src = "/placeholder.svg"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content - Optimized spacing */}
                        <div className="p-4">
                            {/* Brand Name */}
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{deal?.couponName}</h3>

                            {/* Offer - Fixed height with ellipsis */}
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-[40px]">{deal?.name}</p>

                            {/* Button - Improved styling */}
                            <button
                                onClick={() => router.push(`/coupons/${deal?.store?.slug || "no-slug"}`)}
                                className={`w-full py-2 rounded text-sm font-medium transition-all duration-300
                  ${deal.isDeal
                                        ? "bg-[#14303B] text-white hover:bg-[#0f2530]"
                                        : "bg-[#96C121] text-white hover:bg-[#86AD1E]"
                                    }`}
                            >
                                {deal.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
