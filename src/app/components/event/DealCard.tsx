'use client'
import { FaCheck } from "react-icons/fa"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import Image from "next/image"
import PATH from "../utils/path"
interface DealCardProps {
  discount: string
  type: "OFF" | "CODE"
  brand: string
  description: string
  verified: boolean
  expiry: string
  logo: string
  btnText: string
  slug: string
  code:any
}

export default function DealCard({ discount, type, brand, description, verified, expiry, logo, btnText, slug ,code}: DealCardProps) {
  console.log("logo:::", logo);
  return (
    <div className="border rounded-lg overflow-hidden" onClick={() => window.open(PATH.SINGLE_STORE.replace(":id", slug || "no-slug"))}>
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="w-full flex items-center justify-center   rounded overflow-hidden">
            <div className="min-w-56 min-h-56 relative">
              <Image
                src={convertToSecureUrl(logo) || "/placeholder.svg"}
                alt={logo}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </div>

        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 min-h-[60px]">
            <span className="font-bold text-xl text-gray-800">
              {discount} {type}
            </span>
            {verified && (
              <span className="flex items-center text-xs text-green-600">
                <FaCheck className="mr-1" /> Verified
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-gray-800">
            {brand} {description}
          </div>
          {/* <div className="text-xs text-gray-500 mt-1">Valid till {expiry}</div> */}
        </div>
        <button className={`w-full ${code? 'bg-[#789A1A]':'bg-[#10262F]'}   text-white py-2 rounded text-sm font-medium`}>
          {btnText}
        </button>
      </div>
    </div>
  )
}

