"use client"

import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"
// import Image from "next/image"

export default function ProductGrid({ data }: any) {
  const products = data?.list?.store?.products || []

  const formatPrice = (price: any) => {
    if (typeof price !== "string" && typeof price !== "number") return "0.00"

    // Remove any currency symbols and whitespace
    const clean = String(price).replace(/[^0-9.]/g, "")

    const parsed = Number.parseFloat(clean)
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2)
  }

  // Calculate discount percentage
  const calculateDiscount = (currentPrice: string, oldPrice: string) => {
    if (!currentPrice || !oldPrice) return null

    const current = Number.parseFloat(currentPrice)
    const original = Number.parseFloat(oldPrice)

    if (isNaN(current) || isNaN(original) || original <= current) return null

    const discount = Math.round(((original - current) / original) * 100)
    return `-${discount}%`
  }

  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-500">No products available at this time</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((product: any) => {
          const currentPrice = formatPrice(product.currentPrice)
          const originalPrice = product.oldPrice ? formatPrice(product.oldPrice) : null
          const discount = originalPrice ? calculateDiscount(currentPrice, originalPrice) : null

          return (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                title: product.name || "Unknown Product",
                image: product.imageUrl || "/placeholder.svg",
                rating: product.rating || 5, // Default rating if not provided
                currentPrice,
                originalPrice,
                discount,
                htmlUrl: product.htmlUrl || "#",
                store: {
                  name: product.store?.name || "Store",
                },
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

interface Store {
  name: string
  logoUrl?: string
}

interface Product {
  id: number | string
  title: string
  image: string
  rating: number
  currentPrice: string
  originalPrice: string | null
  discount: string | null
  htmlUrl?: string
  store: Store
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
      <div className="relative overflow-hidden h-48">
        <div className="relative w-full h-full">
          <img
            src={product.image || "/placeholder.svg?height=200&width=300"}
            alt={product.title}
            // fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            // unoptimized
            // onError={(e) => {
            //   const target = e.target as HTMLImageElement
            //   target.onerror = null
            //   target.src = "/placeholder.svg?height=200&width=300"
            // }}
          />
        </div>
        {product.discount && (
          <div className="absolute top-3 right-3 bg-[#7FA842] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
            {product.discount}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-gray-800 font-medium mb-3 line-clamp-2 min-h-[3rem] text-sm">{product.title}</h3>
        <div className="flex mb-3 gap-0.5">{renderStars(product.rating)}</div>
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs mr-2">${product.originalPrice}</span>
            )}
            <span className="text-gray-900 font-bold">${product.currentPrice}</span>
          </div>
          <a
            href={product.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#8BC34A] hover:bg-[#7CB342] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Get Deal
          </a>
        </div>
      </div>
    </div>
  )
}
