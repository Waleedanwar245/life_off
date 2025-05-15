"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { FiClock, FiCheck, FiPlus } from "react-icons/fi"
import axios from "axios"
import { API_URL } from "@/app/components/utils/BASE_URL"
import Link from "next/link"
import Image from "next/image"
import ProductSlider from "./ProductSlider"
import CouponDialog from "./CouponDialog"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

export default function CouponTabs({ data }: { data: any }) {
  const couponsRef = useRef<HTMLDivElement>(null)
  const storeInfoRef = useRef<HTMLDivElement>(null)
  const faqsRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [couponCode, setCouponCode] = useState({
    code: "",
    couponName: "",
    logo: "",
    storeName: "",
    htmlCode: "",
  })

  // State for API data
  const [latestStores, setLatestStores] = useState<any[]>([])
  const [similarCoupons, setSimilarCoupons] = useState<any[]>([])
  const [similarStores, setSimilarStores] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState({
    similarCoupons: false,
    similarStores: false,
    latestStores: false,
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    // Reset copied state when modal closes
    setTimeout(() => setCopied(false), 300)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode.code)
    setCopied(true)

    // Reset the button text after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Fetch latest stores
  useEffect(() => {
    const fetchLatestStores = async () => {
      setIsLoading((prev) => ({ ...prev, latestStores: true }))
      try {
        const response = await axios.get(`${API_URL}/store`)
        if (response.data) {
          const stores = response.data
            .filter((store: any) => store?.logoUrl && store?.createdAt)
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6)
          setLatestStores(stores)
        }
      } catch (error) {
        console.error("Error fetching latest stores:", error)
      } finally {
        setIsLoading((prev) => ({ ...prev, latestStores: false }))
      }
    }

    fetchLatestStores()
  }, [])

  // Fetch similar coupons and stores based on category
  useEffect(() => {
    const categoryId = data?.store?.categoryIds?.[0]
    if (!categoryId) return

    const fetchSimilarCoupons = async () => {
      setIsLoading((prev) => ({ ...prev, similarCoupons: true }))
      try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/couponsAttachment`)
        setSimilarCoupons(response.data)
      } catch (error) {
        console.error("Error fetching similar coupons:", error)
      } finally {
        setIsLoading((prev) => ({ ...prev, similarCoupons: false }))
      }
    }

    const fetchSimilarStores = async () => {
      setIsLoading((prev) => ({ ...prev, similarStores: true }))
      try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/coupons`)
        console.log("response::::",response);
        setSimilarStores(response.data)
      } catch (error) {
        console.error("Error fetching similar stores:", error)
      } finally {
        setIsLoading((prev) => ({ ...prev, similarStores: false }))
      }
    }

    fetchSimilarCoupons()
    fetchSimilarStores()
  }, [data?.store?.categoryIds])

  function mapCoupons(apiCoupons: any) {
    if (!apiCoupons) return []

    const today = new Date()

    return (
      apiCoupons?.coupons?.map((coupon: any) => {
        const endDate = coupon.endDate ? new Date(coupon.endDate) : null
        const isExpired = endDate ? endDate < today : false
        const isActive = !isExpired
        const type = isExpired ? "Expired" : isActive ? "Active" : "Similar"

        return {
          storeName: apiCoupons?.storeId,
          logo: apiCoupons?.logoUrl,
          id: coupon.id,
          type: type,
          discount: coupon?.mainImage || "DEAL",
          codeorDeal: coupon?.codeimg3 || "",
          code: coupon?.code || "",
          htmlCode: apiCoupons?.htmlCode || "",
          second_img: coupon?.secondaryImage,
          title: coupon.name,
          expiry: isExpired ? "Expired" : `Expires ${endDate ? endDate.toLocaleDateString() : "N/A"}`,
          verified: coupon.isVerified,
          description: coupon.detail,
          buttonText: isExpired ? "Expired" : coupon?.code ? "Reveal Code" : "Get Deal",
        }
      }) || []
    )
  }

  // Map similar coupons with their different structure
  function mapSimilarCoupons(similarCouponsData: any) {
    if (!similarCouponsData || !Array.isArray(similarCouponsData)) return []

    const today = new Date()
    const currentStoreId = data?.store?.id

    return similarCouponsData
      .filter((coupon: any) => coupon?.store?.id !== currentStoreId)
      .slice(0, 4)
      .map((coupon: any) => {
        const endDate = coupon.endDate ? new Date(coupon.endDate) : null
        const isExpired = endDate ? endDate < today : false
        const storeInfo = coupon.store || {}

        return {
          storeName: storeInfo.storeId || "",
          logo: storeInfo.logoUrl || "",
          id: coupon.id || "",
          type: "Similar",
          discount: coupon.mainImage || "DEAL",
          codeorDeal: coupon.codeimg3 || "",
          code: coupon.code || "",
          htmlCode: coupon.htmlCodeUrl || storeInfo.htmlCode || "",
          second_img: coupon.secondaryImage || "",
          title: coupon.name || "",
          expiry: isExpired ? "Expired" : `Expires ${endDate ? endDate.toLocaleDateString() : "N/A"}`,
          verified: coupon.isVerified || false,
          description: coupon.detail || "",
          buttonText: isExpired ? "Expired" : coupon.code ? "Reveal Code" : "Get Deal",
        }
      })
  }

  const coupons = mapCoupons(data?.store || [])
  const mappedSimilarCoupons = mapSimilarCoupons(similarCoupons)

  // Get only active coupons
  const activeCoupons = coupons.filter((coupon: any) => coupon.type === "Active")

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      // Scroll to the section with some offset for the header
      window.scrollTo({
        top: ref.current.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  // Format similar stores
  const currentStoreId = data?.store?.id
  const formattedSimilarStores = Array.from(
    new Map(
      (similarStores  || [])
        .filter((item: any) => item?.store?.id && item.store.id !== currentStoreId)
        .map((item: any) => [item.store.id, item]),
    ).values(),
  )
    .map((item: any) => ({
      storeId: item.store.slug,
      name: item.store.name || "No Name",
      logo: item.store.logoUrl || "/default-logo.png",
    }))
    .slice(0, 6)

  const [expandedId, setExpandedId] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState("all")

  // Calculate counts for filter buttons
  const activeCouponCount = activeCoupons.length
  const activeDealsCount = activeCoupons.filter((c: any) => !c.code).length
  const activeCodesCount = activeCoupons.filter((c: any) => c.code).length

  // Get filtered coupons based on the active filter
  const getFilteredCoupons = (section: string) => {
    // For "Similar" section, always return the mapped similar coupons regardless of filter
    if (section.toLowerCase() === "similar") {
      return mappedSimilarCoupons
    }

    // For "Expired" section, always show all expired coupons regardless of filter
    if (section === "Expired") {
      return coupons.filter((coupon: any) => coupon.type === "Expired")
    }

    // For "Active" section, apply the filter
    if (section === "Active") {
      const sectionCoupons = coupons.filter((coupon: any) => coupon.type === "Active")

      if (activeFilter === "deals") {
        return sectionCoupons.filter((coupon: any) => !coupon.code)
      } else if (activeFilter === "codes") {
        return sectionCoupons.filter((coupon: any) => coupon.code)
      }

      // Default: return all active coupons
      return sectionCoupons
    }

    // Default fallback
    return coupons.filter((coupon: any) => coupon.type === section)
  }

  function StoreCard({ name, logo, storeId }: any) {
    return (
      <Link
        href={`/coupons/${storeId || "no-slug"}`}
        className="cursor-pointer bg-white rounded border border-[#7FA842] p-3 flex items-center justify-center h-24"
      >
        <div className="relative w-full h-full">
          <img
            src={convertToSecureUrl(logo) || "/placeholder.svg?height=64&width=96"}
            alt={`${name} logo`}
            // fill
            className="object-contain h-[100%]"
            // unoptimized
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"

              // Create a text fallback
              const parent = target.parentElement
              if (parent) {
                const textDiv = document.createElement("div")
                textDiv.className = "absolute inset-0 flex items-center justify-center text-blue-500"
                textDiv.textContent = name
                parent.appendChild(textDiv)
              }
            }}
          />
        </div>
      </Link>
    )
  }

  return (
    <div className="max-w-[1280px] font-sans mx-auto px-4 py-8">
      {/* Fixed Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex">
          <button
            onClick={() => scrollToSection(couponsRef as any)}
            className="px-4 py-2 text-sm font-medium text-green-600 border-b-2 border-green-600"
          >
            Coupons
          </button> 
          <button onClick={() => scrollToSection(storeInfoRef as any)} className="px-4 py-2 text-sm font-medium text-gray-600">
            Store Info
          </button>
          <button onClick={() => scrollToSection(faqsRef as any)} className="px-4 py-2 text-sm font-medium text-gray-600">
            FAQs
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div>
        {/* Coupons Section */}
        <div ref={couponsRef} className="py-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {["Active", "Similar", "Expired"].map((section) => {
                // Special handling for similar coupons
                const filteredCoupons = getFilteredCoupons(section)

                return (
                  <div key={section}>
                    <h2 className="text-xl font-bold mb-4">{section} Coupons</h2>

                    {/* Loading state for similar coupons */}
                    {section.toLowerCase() === "similar" && isLoading.similarCoupons && (
                      <div className="text-gray-500 text-sm">Loading similar coupons...</div>
                    )}

                    {/* If there are no coupons of this type */}
                    {!isLoading.similarCoupons && (!filteredCoupons || filteredCoupons.length === 0) ? (
                      <div className="text-gray-500 text-sm">No coupons available in this category.</div>
                    ) : (
                      !isLoading.similarCoupons &&
                      filteredCoupons.map((coupon: any) => {
                        const hasDescription = coupon.description && coupon.description.trim() !== ""

                        return (
                          <div key={coupon.id} className="border rounded-md p-0 mb-4 px-4">
                            <div className="flex flex-col md:flex-row md:items-center">
                              <div className="flex-1">
                                <div className="flex items-start">
                                  <div className="text-center pr-4 py-4">
                                    <div
                                      className={`font-bold text-xl ${
                                        section === "Expired" ? "text-gray-800" : "text-[#7FA842]"
                                      }`}
                                    >
                                      {coupon?.discount}
                                    </div>
                                    <div
                                      className={`font-bold text-xl ${
                                        section === "Expired" ? "text-gray-800" : "text-[#7FA842]"
                                      }`}
                                    >
                                      {coupon?.second_img}
                                    </div>
                                  </div>
                                  <div className="h-[] self-stretch w-px bg-gray-300 mx-2"></div>
                                  <div className="flex-1 pl-2 py-4">
                                    <div className="text-[13px] text-[#7FA842] font-[800]">{coupon?.codeorDeal}</div>
                                    <div className="font-medium">{coupon.title}</div>
                                    <div className="flex items-center text-xs mt-1">
                                      <FiClock className="text-gray-400 mr-1" />
                                      <span className="text-gray-500 mr-2">{coupon.expiry}</span>
                                      {coupon.verified && (
                                        <span className="flex items-center">
                                          <FiCheck className="text-green-500 mr-1" />
                                          <span className="text-green-500">Verified</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 md:mt-0">
                                <button
                                  style={{
                                    width: "148px",
                                    height: "42px",
                                    borderRadius: "26.7px",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "14px",
                                    lineHeight: "100%",
                                    letterSpacing: "0%",
                                    textAlign: "center",
                                  }}
                                  className={`text-white border px-4 py-1.5 ${
                                    section === "Expired" ? "bg-gray-400 " : "bg-gray-800 hover:bg-gray-700"
                                  }`}
                                  onClick={() => {
                                    // Open the link in a new tab
                                    window.open(coupon?.htmlCode, "_blank")
                                    setCouponCode({
                                      code: coupon?.code,
                                      couponName: coupon?.title,
                                      logo: coupon?.logo,
                                      storeName: coupon?.storeName,
                                      htmlCode: coupon?.htmlCode,
                                    })

                                    // Show the modal
                                    showModal()
                                  }}
                                >
                                  {coupon.buttonText}
                                </button>
                              </div>
                            </div>

                            {/* See Details Button (Always Show) */}
                            <div
                              className="text-xs text-gray-600 flex items-center mt-0 p-2 border-t cursor-pointer"
                              onClick={() => setExpandedId(expandedId === coupon.id ? null : coupon.id)}
                            >
                              <span>See Details</span>
                              <span className="ml-1">{expandedId === coupon.id ? "−" : "+"}</span>
                            </div>

                            {/* Expandable Section */}
                            {expandedId === coupon.id && (
                              <div className="mt-2 text-sm text-gray-700">
                                {hasDescription ? coupon.description : "No additional details available."}
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right sidebar */}
            <div className="w-full lg:w-1/3">
              {/* Website info */}
              <div className="mb-4 text-center">
                <div className="text-xl font-bold mb-4">{activeCouponCount} Active Offers Available</div>
              </div>

              {/* Filters section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-2">Filters Offers</h3>
                <div className="space-y-2">
                  <button
                    className={`w-full transition-colors rounded-full py-2 font-medium text-sm ${
                      activeFilter === "all"
                        ? "bg-[#7FA842] text-white hover:bg-[#81ac41]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All ({activeCouponCount})
                  </button>
                  <button
                    className={`w-full transition-colors rounded-full py-2 font-medium text-sm ${
                      activeFilter === "deals"
                        ? "bg-[#7FA842] text-white hover:bg-[#81ac41]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveFilter("deals")}
                  >
                    Deals ({activeDealsCount})
                  </button>
                  <button
                    className={`w-full transition-colors rounded-full py-2 font-medium text-sm ${
                      activeFilter === "codes"
                        ? "bg-[#7FA842] text-white hover:bg-[#81ac41]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveFilter("codes")}
                  >
                    Codes ({activeCodesCount})
                  </button>
                </div>
              </div>

              {/* Why Trust Us section */}
              <div className="border rounded-lg p-5 mb-6 bg-white shadow-lg">
                {data?.store?.storeDescription ? (
                  <p
                    className="text-sm text-gray-700 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data?.store?.storeDescription }}
                  />
                ) : (
                  <p className="text-gray-500">No Description to show</p>
                )}
              </div>

              <div className="max-w-3xl mx-auto p-4 font-sans">
                {/* Similar Stores Section */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-medium text-center mb-4">Similar Stores</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {formattedSimilarStores?.length > 0 ? (
                      formattedSimilarStores.map((store: any, index: number) => (
                        <StoreCard
                          key={`similar-${index}`}
                          name={store.name}
                          logo={store.logo}
                          storeId={store.storeId}
                        />
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4 flex justify-center w-[100%]">
                        No records found
                      </div>
                    )}
                  </div>
                </div>

                {/* Latest Stores Section */}
                <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-medium text-center mb-4">Latest Stores</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {latestStores?.length > 0 ? (
                      latestStores.map((store: any, index: any) => (
                        <StoreCard
                          key={`latest-${index}`}
                          name={store.name}
                          logo={store.logoUrl}
                          storeId={store?.slug}
                        />
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500 col-span-2">No recent stores found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        {data?.store?.products?.length > 0 && (
          <div className="my-16">
            <p className="text-[25px] md:text-[35px] font-bold mb-4">{data?.store?.name} Products</p>
            <ProductSlider data={data} />
          </div>
        )}

        {/* Store Info Section */}
        <div ref={storeInfoRef} className="pt-8 border-t">
          {/* Render Store Article */}
          <div className="prose lg:prose-xl">
            {data?.store?.storeArticle ? (
              <div dangerouslySetInnerHTML={{ __html: data?.store?.storeArticle }} />
            ) : (
              <p className="text-gray-500">No article available at the moment. Stay tuned for more updates!</p>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        <div ref={faqsRef} className=" ">
          <h2 className="text-2xl font-bold py-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {(data?.store?.faqs || []).map((faq: any, index: number) => (
              <div key={index} className="border-b pb-4">
                <details className="group">
                  <summary className="flex justify-between items-center w-full text-left font-bold cursor-pointer">
                    {faq.question}
                    <FiPlus className="text-gray-500 group-open:hidden" />
                    <FiCheck className="text-gray-500 hidden group-open:inline" />
                  </summary>
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CouponDialog
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        copyToClipboard={copyToClipboard}
        copied={copied}
        couponCode={couponCode}
      />
    </div>
  )
}
