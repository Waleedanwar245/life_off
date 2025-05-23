"use client"

import { useState, useEffect } from "react"
import { FaCheck } from "react-icons/fa"
import Image from "next/image"
import Script from "next/script"
import SplashScreen from "../utils/SplashSvreen"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import { API_URL } from "../utils/BASE_URL"
import { useRouter } from "next/navigation"
import PATH from "../utils/path"

export default function FreeShippingContent() {
    const [coupons, setCoupons] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Fetch coupons data
    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoading(true)
            try {
                // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
                // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
                const response = await fetch(`${API_URL}/coupons`)

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`)
                }

                const data = await response.json()

                // Filter and format the coupons data
                const couponData = data || []
                console.log("couponData:::", couponData);
                const formattedData = couponData
                    ?.filter((coupon: any) => coupon?.isFreeShipping)
                    ?.map((item: any) => {
                        return {
                            id: item.id,
                            logo: item?.store?.logoUrl || "/images/placeholder.svg",
                            discount: item.mainImage || "",
                            isCode: item.isCode,
                            verified: item.isVerified,
                            brand: item?.store?.name || "Unknown Brand",
                            description: item.description || "No description available",
                            details: item.detail || "No additional details",
                            altText: item?.store?.name || "Brand logo",
                            slug: item?.store?.slug || 'no-slug'
                        }
                    })

                setCoupons(formattedData || [])
            } catch (error) {
                console.error("Error fetching coupons:", error)
                setCoupons([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchCoupons()
    }, [])

    if (isLoading) {
        return <SplashScreen />
    }

    return (
        <div>
            <Script id="schema-script" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "Free Shipping Coupons & Deals | LiveOffCoupon",
                    description:
                        "Explore the best free shipping coupon codes and deals to save more on your purchases at LiveOffCoupon.",
                    url: "https://liveoffcoupon.com/free-shipping",
                })}
            </Script>

            <div className="mt-[100px] max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">Free Shipping Coupon Codes & Deals</h1>
                <p className="text-gray-700 mb-8">
                    Undoubtedly the biggest shopping holiday for every season, Black Friday stirs up expectations among consumers
                    to save on their luxury purchases. If you are furious about the crowds in stores, we understand you. Accept
                    our open invitation to shop from the most comfortable Black Friday sale ever.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {coupons.length > 0 ? (
                        coupons.map((coupon: any) => (
                            <div key={coupon.id} className="border border-gray-200 rounded-lg p-4 flex flex-col cursor-pointer" onClick={() => router.push(PATH.SINGLE_STORE.replace(":id", coupon?.slug || "no-slug"))}>
                                <div className="flex items-center justify-center  mb-4  rounded overflow-hidden">
                                    <div className="w-56 h-56 relative">
                                        <Image
                                            src={convertToSecureUrl(coupon.logo) || "/placeholder.svg"}
                                            alt={coupon.altText}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="font-bold text-lg">
                                        {coupon.discount} {coupon.isCode ? "CODE" : ""}{" "}
                                        {coupon.verified && (
                                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                                <FaCheck className="mr-1" size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-medium">
                                        {coupon.brand} 
                                    </div>
                                    <div className="font-medium">
                                         {coupon.description}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <button onClick={() => router.push(PATH.SINGLE_STORE.replace(":id", coupon?.slug || "no-slug"))} className="w-full bg-[#7FA842] text-white py-2 px-4 rounded text-sm transition-colors">
                                        Show Coupon Code
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full text-gray-500">No coupons available at the moment.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
