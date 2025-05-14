import { FaCheck } from "react-icons/fa"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"

interface DealCardProps {
  discount: string
  type: "OFF" | "CODE"
  brand: string
  description: string
  verified: boolean
  expiry: string
  logo: string
  btnText:string
}

export default function DealCard({ discount, type, brand, description, verified, expiry, logo ,btnText}: DealCardProps) {
  console.log("logo:::",logo);
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src={convertToSecureUrl(logo) || "/placeholder.svg"} alt={`${brand} logo`} width={40} height={40} className="mr-2" />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">
              {discount} {type}
            </span>
            {verified && (
              <span className="flex items-center text-xs text-green-600">
                <FaCheck className="mr-1" /> Verified
              </span>
            )}
          </div>
          <div className="text-sm font-medium">
            {brand} {description}
          </div>
          <div className="text-xs text-gray-500 mt-1">Valid till {expiry}</div>
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium">
          {btnText}
        </button>
      </div>
    </div>
  )
}

