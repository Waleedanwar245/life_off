"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { FaBuilding, FaTshirt, FaLeaf, FaHome, FaHeart } from "react-icons/fa"
import { MdChevronRight } from "react-icons/md"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

const categoryIcons = {
  Travel: <FaBuilding className="w-5 h-5" />,
  "Women's Clothing": <FaLeaf className="w-5 h-5" />,
  "Mens Clothing": <FaTshirt className="w-5 h-5" />,
  "Home & Garden": <FaHome className="w-5 h-5" />,
  "Health & Beauty": <FaHeart className="w-5 h-5" />,
}

export default function Categories({ data }: { data: any }) {
  const categoriesContainerRef = useRef<HTMLDivElement>(null)
  const [lineHeight, setLineHeight] = useState<number>(0)
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [displayedCategoriesCount, _setDisplayedCategoriesCount] = useState<number>(6) // Default to showing 6 categories initially

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedCategories = data.map((category: any) => {
        // Filter unique coupons by storeId
        const uniqueCoupons = Array.from(
          new Map(category.coupons?.map((coupon: any) => [coupon.storeId, coupon])).values(),
        )

        const formattedCategory = {
          name: category.categoryName,
          icon:
            // @ts-ignore
            categoryIcons[category.categoryTitle] || <FaBuilding className="w-5 h-5" />,
          deals: uniqueCoupons.map((coupon: any) => ({
            store: coupon?.store,
            slug: coupon?.store?.slug,
            storeId: coupon?.store?.id,
            logo: coupon.store.logoUrl || "/placeholder.svg",
            offer: coupon.name || "No details available",
          })),
        }

        return formattedCategory
      })

      setCategories(formattedCategories)
      setSelectedCategory(formattedCategories[0])
    }
  }, [data])

  // Update line height when displayed categories change
  useEffect(() => {
    if (categoriesContainerRef.current) {
      // Set timeout to ensure DOM has updated
      setTimeout(() => {
        const containerHeight = categoriesContainerRef.current?.clientHeight || 0
        setLineHeight(containerHeight - 24) // Subtract a bit from the top
      }, 10)
    }
  }, [displayedCategoriesCount, categories])

  // Handle the "View More" button click
  const handleViewMore = () => {
    router.push("/categories/all") // Navigate to all categories page
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 bg-[#7FA8421F] mt-4">
      <h2 className="text-[35px] font-bold mb-8" style={{ fontSize: "clamp(30px, 2vw, 35px)" }}>
        Categories
      </h2>

      {/* Mobile Categories - Horizontal Layout */}
      <div className="lg:hidden mb-8">
        <div className="flex overflow-x-auto pb-4 gap-4">
          {categories.slice(0, displayedCategoriesCount).map((category, index) => (
            <div
              key={index}
              className={`flex flex-col items-center min-w-[80px] cursor-pointer ${
                selectedCategory?.name === category.name ? "text-[#96C121]" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="w-12 h-12 rounded-full bg-white border-2 border-[#14303B] flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-center">{category.name}</span>
            </div>
          ))}
          {categories.length > displayedCategoriesCount && (
            <div className="pl-4 mt-4">
              <button
                onClick={handleViewMore}
                className="text-[#96C121] text-sm font-medium flex items-center gap-1 hover:text-[#7da01b] transition-colors"
              >
                View More
                <MdChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Categories - Vertical Layout with line */}
        <div className="w-full lg:w-64 relative hidden lg:block">
          {/* Vertical line with dynamic height */}
          <div className="absolute left-[17px] top-[24px] w-[2px] bg-gray-200" style={{ height: `${lineHeight}px` }} />

          {/* Categories container with ref for measuring */}
          <div ref={categoriesContainerRef} className="space-y-6">
            {categories.slice(0, displayedCategoriesCount).map((category, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 cursor-pointer ${
                  selectedCategory?.name === category.name ? "text-[#96C121]" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#14303B] z-10 flex items-center justify-center relative">
                    {/* Filled circle instead of bordered circle */}
                    <div className="text-white">{category.icon}</div>
                  </div>
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            ))}

            {categories.length > displayedCategoriesCount && (
              <div className="pl-12">
                <button
                  onClick={handleViewMore}
                  className="text-[#96C121] text-sm font-medium flex items-center gap-1 hover:text-[#7da01b] transition-colors"
                >
                  View More
                  <MdChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Deals - 2 columns on desktop, 1 column on mobile */}
        <div className="w-full overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedCategory?.deals?.length > 0 ? (
              <>
                {selectedCategory.deals.slice(0, 10).map((deal: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start cursor-pointer"
                    onClick={() => {
                      router.push(`/coupons/${deal?.store?.slug || "no-slug"}`)
                    }}
                  >
                    {/* Left side - Logo with gray background */}
                    <div className="bg-white flex items-center border border-[#96C121] justify-center w-[120px] lg:w-[160px] h-[60px] rounded-l-lg shadow-sm relative z-10">
                      <div className="relative w-[90%] h-[90%]">
                        <img
                          src={convertToSecureUrl(deal.logo) || "/placeholder.svg"}
                          alt={`${deal.offer} logo`}
                        //   fill
                          className="object-contain"
                        //   unoptimized
                        />
                      </div>
                    </div>
                    {/* Right side - Offer Text with green border */}
                    <div className="bg-white flex-1 flex items-center border border-l-0 border-[#96C121] rounded-r-lg pl-4 pr-3 py-4 mt-[4px]">
                      <p className="text-sm text-gray-700" style={{ fontSize: "clamp(12px, 1vw, 18px)" }}>
                        {deal.offer}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500">No deals available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
