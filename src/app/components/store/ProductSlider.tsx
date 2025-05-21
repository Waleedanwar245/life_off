"use client"

import ProductGrid from "./ProductGrid"



export default function ProductSlider({ data }: { data: any }) {
  const products = data?.store?.products || []

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ProductGrid data={data} />
    </div>
  )
}
