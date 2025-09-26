// File: app/components/ProductSlider.server.tsx
import React from "react";
import ProductGrid from "./ProductGrid.server"; // ProductGrid can be a client component

type Props = { data?: any };

export default function ProductSliderServer({ data }: Props) {
  const products = data?.store?.products || [];

  if (!products || products.length === 0) return null;

  // Render the existing ProductGrid. ProductGrid may be a client component — that's fine.
  return (
    <div className="max-w-7xl mx-auto">
      <ProductGrid data={data} />
    </div>
  );
}
