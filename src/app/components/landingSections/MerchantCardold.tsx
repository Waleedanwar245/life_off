"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const MerchantCard = ({ data }: { data: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const merchants = [
    { name: "Adidas", logo: "/placeholder.svg?height=60&width=120" },
    { name: "1800contacts", logo: "/placeholder.svg?height=60&width=120" },
    { name: "ASOS", logo: "/placeholder.svg?height=60&width=120" },
    { name: "OOFOS", logo: "/placeholder.svg?height=60&width=120" },
    { name: "JCPenney", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Nike", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Target", logo: "/placeholder.svg?height=60&width=120" },
  ]
  const [duplicatedMerchants, setDuplicatedMerchants] = useState<any[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)

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
    const scrollSpeed = 0 // pixels per frame (adjust for smoothness)

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

  const CARD_WIDTH = 192
  const CARD_GAP = 24
  const SLIDE_WIDTH = CARD_WIDTH + CARD_GAP
  const visibleCardsCount = 5 // Number of cards visible in the viewport

  const nextSlide = () => {
    if (currentIndex >= duplicatedMerchants.length - visibleCardsCount) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(duplicatedMerchants.length - visibleCardsCount)
    } else {
      setCurrentIndex((prev) => prev - 1)
    }
  }


  console.log("duplicatedMerchants:::", duplicatedMerchants);
  const router = useRouter()

  return (

    
    <div className="mx-auto w-full py-16 px-4" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="">
        {/* Heading */}
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-12">Our Favorite Merchants</h2>
        {/* Merchants Container */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          {/* <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#96C121] p-[5px] md:p-2">
            <IoIosArrowBack className="w-[14px] h-[14px] md:w-6 md:h-6 text-white" />
          </button> */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 p-[5px] md:p-2  shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{ backgroundColor: "#96C121" }}
          >
            <IoIosArrowBack className="w-[14px] h-[14px] md:w-6 md:h-6 text-white" />
          </button>
          {/* Merchants Grid */}
          <div className="overflow-hidden mx-16">
            <div
              className="flex transition-transform duration-300 ease-in-out gap-9" 
              style={{ transform: `translateX(-${currentIndex * SLIDE_WIDTH}px)` }}
            >
              {duplicatedMerchants.map((merchant, index) => (
                <div
                  onClick={() => { router.push(`/coupons/${merchant?.slug}`) }}
                  key={index}
                  className="cursor-pointer flex-shrink-0 w-48 h-32 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center p-6"
                >
                  <div className="text-center">
                    {/* <div className="text-lg font-semibold text-gray-800">{merchant.name}</div> */}
                    {/* Placeholder for actual logos */}
                    <img src={convertToSecureUrl(merchant?.logoUrl)} alt="" />
                    {/* <div className="mt-2 text-sm text-gray-500">Logo</div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 p-[5px] md:p-2  shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{ backgroundColor: "#96C121" }}
          >
            <IoIosArrowForward className="w-[14px] h-[14px] md:w-6 md:h-6 text-white" />
          </button>
        </div>
        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.max(1, merchants.length - 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? "bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    </div>

  )
}

export default MerchantCard
