"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import SplashScreen from "../utils/SplashSvreen"
import CategoriesCarousel from "./CategoriesCarousel"
import CategoryGrid from "./CategoryGridold"
import { API_URL } from "../utils/BASE_URL"
import axios from "axios"

export default function CategoriesContent() {
    const [categoriesData, setCategoriesData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch categories data
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true)
            try {
                console.log("API_URL:::::", API_URL)
                const response = await axios.get(`${API_URL}/categories`)
                setCategoriesData(response.data)
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
