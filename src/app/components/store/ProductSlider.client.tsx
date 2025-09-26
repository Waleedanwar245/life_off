// Optional: keep the old client file for backwards compatibility
// File: app/components/ProductSlider.client.tsx
"use client"
import ProductGrid from "./ProductGrid.client";

export default function ProductSliderClient({ data }: { data: any }) {
  const products = data?.store?.products || [];

  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <ProductGrid data={data} />
    </div>
  );
}
