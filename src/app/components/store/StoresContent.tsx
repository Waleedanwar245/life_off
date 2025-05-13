"use client"

import { useState, useEffect } from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Script from "next/script"
import SplashScreen from "../utils/SplashSvreen"
import { API_URL } from "../utils/BASE_URL"

// Define paths object to replace the imported PATH
const PATH = {
    SINGLE_STORE: "/coupons/:id",
}

// Helper function to convert URLs to secure URLs
const convertToSecureUrl = (url: string | undefined) => {
    if (!url) return undefined
    return url.replace(/^http:\/\//i, "https://")
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function StoresContent() {
    const [stores, setStores] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
    const itemsPerPage = 30
    const router = useRouter()

    // Fetch stores data
    useEffect(() => {
        const fetchStores = async () => {
            setIsLoading(true)
            try {
                // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
                // const apiUrl =  "https://liveoffcoupon.com/api"
                const response = await fetch(`${API_URL}/store`)

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`)
                }

                const data = await response.json()
                setStores(data || [])
            } catch (error) {
                console.error("Error fetching stores:", error)
                setStores([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchStores()
    }, [])

    const totalPages = Math.ceil(stores.length / itemsPerPage)

    const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages)
    const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)

    // Filter stores based on the selected letter
    const filteredStores = selectedLetter
        ? stores.filter((store: any) => store.name.toUpperCase().startsWith(selectedLetter))
        : stores

    const visibleStores = filteredStores.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

    return (
        <>
            <Script id="schema-script" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "Stores on Offers | LiveOffCoupon",
                    description: "Discover a wide range of stores offering exclusive discounts and coupons on LiveOffCoupon.",
                    url: "https://liveoffcoupon.com/stores",
                })}
            </Script>

            {isLoading ? (
                <SplashScreen />
            ) : (
                <>
                    <div className="mt-[250px] md:mt-[110px] max-w-[1440px] mx-auto px-4 py-8">
                        {/* Header with Navigation */}
                        <div className="flex items-center justify-between mb-8 w-full">
                            <h2 className="text-2xl font-bold flex-1 text-center">Stores on Offers</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevPage}
                                    className="w-10 h-10 rounded-full bg-[#96C121] text-white flex items-center justify-center hover:bg-[#86AD1E] transition-colors"
                                    aria-label="Previous page"
                                >
                                    <MdChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextPage}
                                    className="w-10 h-10 rounded-full bg-[#96C121] text-white flex items-center justify-center hover:bg-[#86AD1E] transition-colors"
                                    aria-label="Next page"
                                >
                                    <MdChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Stores Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                            {visibleStores.length > 0 ? (
                                visibleStores.map((store: any, index: number) => (
                                    <div
                                        key={index}
                                        onClick={() => router.push(PATH.SINGLE_STORE.replace(":id", store?.slug || "no-slug"))}
                                        className={`${store.bgColor || "bg-white"
                                            } w-[206px] h-[166px] cursor-pointer aspect-square rounded-lg flex items-center justify-center p-6 transition-transform hover:scale-105 shadow-md`}
                                    >
                                        {store?.logoUrl ? (
                                            <img
                                                src={convertToSecureUrl(store?.logoUrl) || "/images/default_store_img.png"}
                                                alt={`${store.name} logo`}
                                                width={150}
                                                height={150}
                                                className="w-full h-full object-contain"
                                                // unoptimized // Use this for external images
                                            />
                                        ) : (
                                            <img
                                                src="/images/default_store_img.png"
                                                alt="Default store logo"
                                                width={150}
                                                height={150}
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center col-span-full">No stores available.</p>
                            )}
                        </div>

                        {/* Alphabet Navigation */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {alphabet.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-[#96C121] transition-colors ${selectedLetter === letter ? "text-[#96C121]" : ""
                                        }`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-4 text-gray-600 text-sm">
                            <p>
                                Here at liveoffcoupon, we strive to help you save on everything, from food and fashion to toys and
                                travel. This starts with sourcing the best coupon codes, promotions, and bargain shopping tips for you
                                to use at your favorite retailers.
                            </p>
                            <p>
                                From well-established big box stores, like Walmart and Target, to online shopping marketplaces, like
                                Etsy and eBay, to digital services, like Spotify and Netflix, to eateries, like Starbucks and Pizza Hut,
                                to travel institutions, like Hilton and Booking.com, you'll find almost every brand, retailer,
                                restaurant, and digital service under the sun featured here on liveoffcoupon.com.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
