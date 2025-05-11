"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import SplashScreen from "../utils/SplashSvreen"
import CategoriesCarousel from "./CategoriesCarousel"
import CategoryGrid from "./CategoryGrid"
import { API_URL } from "../utils/BASE_URL"

export default function CategoriesContent() {
  const [categoriesData, setCategoriesData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        console.log("API_URL:::::",API_URL);
        const response = await fetch(`${API_URL}/categories`)

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        setCategoriesData(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategoriesData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div>
      <Script id="schema-script" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "All Categories | LiveOffCoupon",
          description: "Explore all categories and find exclusive deals and discounts on LiveOffCoupon.",
          url: "https://liveoffcoupon.com/category/all",
        })}
      </Script>

      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          <div className="mt-[100px]">
            <CategoriesCarousel data={categoriesData} />
            <CategoryGrid data={categoriesData} />
          </div>
        </>
      )}
    </div>
  )
}
