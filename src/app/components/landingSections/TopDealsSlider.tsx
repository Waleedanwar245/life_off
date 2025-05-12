"use client"

import { useState, useEffect } from "react"
// import Image from "next/image"
import { FiChevronDown } from "react-icons/fi"
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "@/app/components/utils/BASE_URL"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

interface Store {
  name: string
  logoUrl?: string
}

interface Product {
  id: number
  title: string
  image: string
  discount: string
  store: Store
  rating: number
  originalPrice: string
  salePrice: string
  category: string
  htmlUrl?: string
}

export default function TopDealsSlider() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product`)
        setData(response.data)
        setError(false)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const fallbackProducts: Product[] = [
    {
      id: 1,
      title: "The Crash Bad Instant Folding long Twin Bed",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Dy6CrCSUdmNJ1m7x4wvfUqznYhOccN.png",
      discount: "-31%",
      store: { name: "Amazon" },
      rating: 5,
      originalPrice: "$990.00",
      salePrice: "$690.00",
      category: "Furniture",
    },
  ]

  const cleanNumber = (val: any) => {
    const cleaned = String(val).replace(/[^0-9.]/g, "")
    const parsed = Number.parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  const products: Product[] =
    data
      ?.filter((item: any) => item?.isFeatured)
      .map((item: any, index: number) => ({
        id: item?.id ?? index,
        title: item?.name ?? "Unknown Product",
        image: item?.imageUrl ?? "/placeholder.svg",
        discount:
          item?.oldPrice && item?.currentPrice
            ? `${Math.round(
                ((cleanNumber(item.oldPrice) - cleanNumber(item.currentPrice)) / cleanNumber(item.oldPrice)) * 100,
              )}%`
            : "0%",
        store: {
          name: item?.store?.name ?? "Unknown Store",
          logoUrl: item?.store?.logoUrl,
        },
        htmlUrl: item?.htmlUrl ?? "#",
        rating: item?.rating,
        originalPrice: `${item?.oldPrice ?? "0.00"}`,
        salePrice: `${item?.currentPrice ?? "0.00"}`,
        category: item?.category ?? "General",
      })) ?? fallbackProducts

  const parsePrice = (price: string) => Number.parseFloat(price.replace(/[^\d.]/g, "")) || 0

  const parseDiscount = (discount: string) => Number.parseInt(discount.replace(/[^\d]/g, "")) || 0

  const sortedProducts = [...(products || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parsePrice(a.salePrice) - parsePrice(b.salePrice)
      case "price-high":
        return parsePrice(b.salePrice) - parsePrice(a.salePrice)
      case "discount":
        return parseDiscount(b.discount) - parseDiscount(a.discount)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="bg-gray-50 max-w-[1440px] mx-auto px-4 pt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Deals</h2>
            <p className="text-gray-500">Discover the best offers from your favorite stores</p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7FA842] shadow-sm w-full"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Highest Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <FiChevronDown />
              </div>
            </div>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && <p>Loading deals...</p>}
        {error && <p className="text-red-500">Failed to load products. Showing fallback data.</p>}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProductProps {
  product: Product
}

function ProductCard({ product }: ProductProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FaStarHalfAlt key="half" className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
        ))}
      </>
    )
  }

  return (
    <div
      onClick={() => window.open(product.htmlUrl, "_blank")}
      className="cursor-pointer group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="relative overflow-hidden h-60">
        <img
          src={convertToSecureUrl(product.image) || "/placeholder.svg"}
          alt={product?.title}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute top-3 right-3 bg-[#7FA842] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
          {product.discount}
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
          {product.store.name}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-gray-800 font-medium mb-3 line-clamp-2 min-h-[3rem] text-sm">{product.title}</h3>
        <div className="flex mb-3 gap-0.5">{renderStars(product.rating)}</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 line-through text-xs mr-2">{product.originalPrice}</span>
            <span className="text-gray-900 font-bold">{product.salePrice}</span>
          </div>
          <a
            href={product.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#7CB342] hover:bg-[#8BC34A] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Get Deal
          </a>
        </div>
      </div>
    </div>
  )
}
