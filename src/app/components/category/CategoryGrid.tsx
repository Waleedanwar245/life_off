"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

// Define paths object to replace the imported PATH
const PATH = {
  SINGLE_CATEGORY: "/category/:id",
}

interface Category {
  id: string
  image: string
  title: string
  categoryTitle?: string
  categoryName?: string
  slug?: string
}

export default function CategoryGrid({ data }: any) {
  const router = useRouter()

  const categories =
    data?.filter((c: any) => c.id !== "92270548-c8fe-496f-aefb-4c948a4b6e23")?.map(({ id, image, categoryTitle, categoryName, slug }: Category) => ({
      id,
      image,
      categoryTitle,
      categoryName,
      slug,
    })) || [] // Extract only required properties

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">All Coupons & Deals Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {categories.map(({ id, image, categoryTitle, categoryName, slug }: any) => (
          <div
            key={id}
            className="flex flex-col items-center group cursor-pointer rounded-full"
            onClick={() => router.push(PATH.SINGLE_CATEGORY.replace(":id", slug || "no-slug"))}
          >
            <div className="relative w-[119px] h-[119px] rounded-full overflow-hidden mb-3 bg-gray-50 shadow-lg">
              <div className="absolute inset-0 border-2 border-gray-100 rounded-full overflow-hidden">
                <Image
                  src={convertToSecureUrl(image) || "/images/placeholder.svg"}
                  alt={categoryTitle || "Category"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110 shadow-lg"
                  unoptimized // Use this for external images
                />
              </div>
            </div>

            <h3 className="text-xs font-medium text-center text-gray-800">{categoryName}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
