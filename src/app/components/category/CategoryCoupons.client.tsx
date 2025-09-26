// File: app/components/CategoryCoupons.client.tsx
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import dynamic from "next/dynamic";
import { API_URL } from "../utils/BASE_URL";
import CouponDialog from "../store/CouponDialog";
const SafeHtml = dynamic(() => import('../utils/SafeHtml'), { ssr: false });

type Props = {
  data?: any;
  preFetchedCategories?: any[];
  preFetchedCoupons?: any[];
}

export default function CategoryCoupons({ data, preFetchedCategories = [], preFetchedCoupons = [] }: Props) {
  const [categories, setCategories] = useState<any[]>(preFetchedCategories || [])
  const [coupons, setCoupons] = useState<any[]>(preFetchedCoupons || [])
  const [selectedCategory, setSelectedCategory] = useState<any>(data?.id || (preFetchedCategories?.[0]?.id) || null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(preFetchedCategories?.length === 0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [couponCode, setCouponCode] = useState({
    code: "",
    couponName: "",
    logo: "",
    storeName: "",
    htmlCode: "",
  })

  // Fetch all categories using Axios (client fallback only)
  const fetchCategories = async () => {
    setCategoriesLoading(true)
    try {
      const response = await axios.get(`${API_URL}/categories/all`)
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Fetch coupons by category ID using Axios (client fallback only)
  const fetchCoupons = async (categoryId: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}/coupons`)
      setCoupons(response.data)
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to load data when component mounts or selectedCategory changes
  useEffect(() => {
    // If server provided categories, use them; otherwise fetch client-side
    if (!preFetchedCategories || preFetchedCategories.length === 0) {
      fetchCategories()
    } else {
      setCategories(preFetchedCategories)
    }

    // If data prop provides an id, use it
    if (data?.id) {
      setSelectedCategory(data.id)
      // If server provided coupons for this category, use them; otherwise fetch
      if (!preFetchedCoupons || preFetchedCoupons.length === 0) {
        fetchCoupons(data.id)
      } else {
        setCoupons(preFetchedCoupons)
      }
    } else if (preFetchedCategories && preFetchedCategories.length > 0 && (!preFetchedCoupons || preFetchedCoupons.length === 0)) {
      // If we have categories but no coupons pre-fetched, load coupons for first category
      const firstId = preFetchedCategories[0]?.id
      if (firstId) {
        setSelectedCategory(firstId)
        fetchCoupons(firstId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id])

  // Get the current category description
  const currentCategory = categories.find((cat: any) => cat.id === selectedCategory)
  const categoryDescription = data?.categoryDescription || currentCategory?.categoryDescription || ""
  const categoryHeading2 = currentCategory?.heading2 || data?.heading2 || "heading2"

  // Handle category click and fetch coupons for that category
  const handleCategoryClick = (categoryId: any) => {
    setSelectedCategory(categoryId)
    // If we already have coupons for this id in state, keep them; otherwise fetch
    fetchCoupons(categoryId)
  }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Category Description */}
        <div className="lg:col-span-1 space-y-6">
          {/* Category Description */}
          {categoryDescription && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h2 className="text-xl font-bold mb-3 text-gray-800">{categoryHeading2}</h2>
              <SafeHtml html={categoryDescription} />
            </div>
          )}

          {/* Categories Section */}
          <div className="sticky top-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg text-gray-800">Categories</h2>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {categoriesLoading ? (
                <div className="p-4 text-center">Loading categories...</div>
              ) : categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((category: any) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors ${selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
                          }`}
                      >
                        <div className="flex items-center">
                          {category.image && (
                            <div className="w-8 h-8 mr-3 flex-shrink-0">
                              <img
                                src={convertToSecureUrl(category.image) || "/placeholder.svg"}
                                alt={category.categoryName}
                                className="w-full h-full object-cover rounded"
                                onError={(e: any) => {
                                  e.target.onerror = null
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          )}
                          <span className="text-gray-800">{category.categoryName}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No categories available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Coupons */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedCategory && categories.find((cat: any) => cat.id === selectedCategory)?.heading1}
          </h2>

          {isLoading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon: any) => {
                console.log("coupon====",coupon);

                return (
                  <div
                    key={coupon.id}
                    className="border border-gray-200 rounded-md p-6 flex flex-col relative h-full group hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-8 rlative">
                      <div className="flex flex-col items-center w-full">
                        <img
                          src={convertToSecureUrl(coupon.store?.logoUrl) || "/placeholder.svg"}
                          alt={coupon.store?.name || "Store logo"}
                          className="h-56 w-auto object-contain"
                        />
                      </div>
                      <div className="absolute right-0 top-0 border border-gray-300 rounded text-gray-800 px-3 py-1 text-sm group-hover:bg-[#7FA842] group-hover:text-white group-hover:border-[#7FA842] transition-all duration-300">
                        {coupon?.mainImage + " " + coupon?.secondaryImage}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 min-h-[3rem] line-clamp-2 text-gray-800">{coupon.name}</h3>

                    <div className="mt-auto flex justify-center">
                      <div className="w-[60%]">
                        <button
                          onClick={() => {
                            localStorage.setItem('couponData', JSON.stringify({
                               code: coupon?.code,
                              couponName: coupon?.title,
                              logo: coupon.store?.logoUrl,
                              storeName: coupon?.store?.name,
                              htmlCode: coupon?.htmlCodeUrl ? coupon?.htmlCodeUrl : coupon?.store?.htmlCode,
                            }));

                            setCouponCode({
                               code: coupon?.code,
                              couponName: coupon?.title,
                              logo: coupon.store?.logoUrl,
                              storeName: coupon?.store?.name,
                              htmlCode: coupon?.htmlCodeUrl ? coupon?.htmlCodeUrl : coupon?.store?.htmlCode,
                            })

                            // Show the modal
                            showModal()
                            window.open(`${window.location.origin}/coupons/${coupon?.store?.slug}`, "_blank");
                            window.location.href = coupon?.htmlCode;
                          }}
                          className="bg-[#7FA842] hover:bg-[#6a8e38] text-white font-bold py-3 px-1 rounded w-full mb-4 transition-colors duration-300"
                        >
                          {coupon.code ? `Reveal Code` : "Get Deal"}
                        </button>

                        {coupon.endDate && (
                          <p className="text-sm text-gray-500 text-center">
                            Expires On: {new Date(coupon.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {coupons.length === 0 && !isLoading && (
                <p className="text-center col-span-full text-gray-500">No coupons available for this category.</p>
              )}
            </div>
          )}
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
