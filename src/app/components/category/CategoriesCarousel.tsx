"use client"

import { useState, useRef, useEffect } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

// Define paths object to replace the imported PATH
const PATH = {
  SINGLE_CATEGORY: "/category/:id",
}

interface Category {
  id: number
  image: string
  title: string
  categoryName: string
  slug?: string
}

export default function CategoriesCarousel({ data }: any) {
  const router = useRouter()
  const categories: Category[] =
    data?.filter((c: any) => c.id !== "92270548-c8fe-496f-aefb-4c948a4b6e23")?.map((category: any) => ({
      id: category.id,
      image: category.image,
      categoryName: category.categoryName,
      title: category.categoryTitle, // Assuming the title in the API is 'categoryTitle'
      slug: category.slug,
    })) || []

  const [isEnd, setIsEnd] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft
      const scrollWidth = sliderRef.current.scrollWidth
      const clientWidth = sliderRef.current.clientWidth

      // If we are at the end, disable the right arrow
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        setIsEnd(true)
      } else {
        setIsEnd(false)
      }
    }
  }

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.clientWidth,
        behavior: "smooth",
      })
    }
  }

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.clientWidth,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    // Attach the scroll event listener
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (slider) {
        slider.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-center">Top Coupons & Deals Categories</h2>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={false} // Always enable the prev button
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 text-green-600 hover:text-green-700 transition-colors`}
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isEnd} // Disable if at the end
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 text-green-600 hover:text-green-700 transition-colors ${isEnd ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Categories Container */}
        <div className="overflow-hidden px-8">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-in-out gap-4 overflow-x-auto scroll-smooth"
            style={{ scrollBehavior: "smooth", overflow: "hidden" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="cursor-pointer flex-none w-full xs:w-1/2 sm:w-1/4 md:w-1/6 lg:w-1/6 xl:w-1/6"
                onClick={() => router.push(PATH.SINGLE_CATEGORY.replace(":id", category?.slug || "no-slug"))}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full pt-[100%] rounded-full overflow-hidden border-2 border-gray-100">
                    <div className="absolute inset-0">
                      <Image
                        src={convertToSecureUrl(category.image) || "/images/placeholder.svg"}
                        alt={category.title || "Category"}
                        fill
                        className="object-fill"
                        unoptimized // Use this for external images
                      />
                    </div>
                  </div>
                  <h3 className="text-xs font-medium text-center text-gray-800 uppercase">{category?.categoryName}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
