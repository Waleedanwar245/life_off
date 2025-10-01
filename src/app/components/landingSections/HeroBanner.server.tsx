// components/landingSections/HeroBanner.server.tsx
import React from "react";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";

type Banner = {
  title?: string;
  description?: string;
  link?: string;
  imageLinks?: string[];
  promoCodes?: string[];
};

export default function HeroBanner({ data }: { data: { banners?: Banner[] } }) {
  const slides =
    data?.banners?.flatMap((banner) =>
      (banner.imageLinks || []).map((image) => ({
        title: banner.title || "Exclusive Offer!",
        subtitle: banner.description || "Limited Time Offer – Don't Miss Out",
        buttonText: "GET COUPON CODE",
        imageUrl: convertToSecureUrl(image),
        link: banner.link,
      }))
    ) || [];

  const promoCards =
    data?.banners?.flatMap((banner) => (banner.promoCodes || []).map((code) => ({ title: code }))) || [];

  return (
    <section className="w-full mx-auto -mt-10">
      {/* Slider markup (server-rendered for SEO) */}
      <div className="relative overflow-hidden hero-slider" aria-roledescription="carousel">
        <div
          className="flex transition-transform duration-700 ease-in-out hero-slider-inner"
          style={{ transform: `translateX(0)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-[340px] md:h-[500px] bg-cover bg-center hero-slide"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
              data-index={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <div className="absolute inset-0" />

              <div className="relative h-full flex items-center px-8 md:px-16">
                <div className="max-w-xl text-white ml-10 z-[999]">
                  <h1 className="font-bold leading-tight mb-4" style={{ fontSize: "clamp(24px, 5vw, 51.2px)" }}>
                    {slide.title}
                  </h1>
                  <p className="mb-8" style={{ fontSize: "clamp(16px, 3vw, 30.93px)" }}>
                    {slide.subtitle}
                  </p>

                  {/* IMPORTANT: No onClick here — client will handle click using data attribute */}
                  <button
                    data-slide-link={slide.link || ""}
                    className="hero-cta cursor-pointer bg-[#96C121] text-white px-4 py-3 hover:bg-[#86AD1E] transition-colors"
                    aria-label="Open coupon link"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls (server-rendered - client will attach handlers) */}
        <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#96C121] p-[5px] md:p-2 hero-prev" aria-label="Previous slide">
          <span className="text-white">‹</span>
        </button>
        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#96C121] p-[5px] md:p-2 hero-next" aria-label="Next slide">
          <span className="text-white">›</span>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 hero-dots" role="tablist" aria-label="Slide dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-dot-index={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Promo Cards */}
      {/* <div className="bg-[#14303B] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 py-[10px]">
        {promoCards.map((card, idx) => (
          <div
            key={idx}
            className="py-6 px-4 text-center text-white hover:bg-[#1c3f4d] transition-colors cursor-pointer relative border-b-[1px] border-gray-600 mx-4 sm:border-none last:border-b-0"
          >
            <p className="text-sm font-medium">{card.title}</p>
            {idx !== promoCards.length - 1 && <div className="hidden sm:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gray-600" />}
          </div>
        ))}
      </div> */}
    </section>
  );
}
