"use client"

import { useState } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

export default function HeroBanner({ data }: { data: any }) {
  const slides =
    data?.banners?.flatMap((banner: any) => {
      return banner.imageLinks.map((image: string) => ({
        title: banner.title || "Exclusive Offer!",
        subtitle: banner.description || "Limited Time Offer – Don't Miss Out",
        buttonText: "GET COUPON CODE",
        imageUrl: convertToSecureUrl(image),
        link: banner.link,
      }))
    }) || []

  const promoCards =
    data?.banners?.flatMap((banner: any) => {
      return banner.promoCodes.map((code: string) => ({
        title: code,
      }))
    }) || []

  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="max-w-[1440px] mx-auto -mt-10">
      {/* Main Slider */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide: any, index: number) => (
            <div
              key={index}
              className="min-w-full h-[340px] md:h-[500px]  bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0" />

              {/* Content */}
              <div className="relative h-full flex items-center px-8 md:px-16">
                {/* Text Content */}
                <div className="max-w-xl text-white ml-10 z-[999]">
                  <h1 className="font-bold leading-tight mb-4" style={{ fontSize: "clamp(24px, 5vw, 51.2px)" }}>
                    {slide.title}
                  </h1>
                  <p className="mb-8 " style={{ fontSize: "clamp(16px, 3vw, 30.93px)" }}>
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => {
                      if (slide.link) {
                        window.open(slide.link, "_blank")
                      }
                    }}
                    style={{ fontSize: "clamp(10px, 3vw, 22.93px)" }}
                    className="cursor-pointer bg-[#96C121] text-white px-4 py-3 hover:bg-[#86AD1E] transition-colors"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#96C121] p-[5px] md:p-2">
          <IoIosArrowBack className="w-[14px] h-[14px] md:w-6 md:h-6 text-white" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#96C121] p-[5px] md:p-2">
          <IoIosArrowForward className="w-[14px] h-[14px] md:w-6 md:h-6 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Promo Cards */}
      <div className="bg-[#14303B] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 py-[10px]">
        {promoCards.map((card: any, index: number) => (
          <div
            key={index}
            className="py-6 px-4 text-center text-white hover:bg-[#1c3f4d] transition-colors cursor-pointer relative border-b-[1px] border-gray-600 mx-4 sm:border-none last:border-b-0"
          >
            <p className="text-sm font-medium">{card.title}</p>
            {index !== promoCards.length - 1 && (
              <div className="hidden sm:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
