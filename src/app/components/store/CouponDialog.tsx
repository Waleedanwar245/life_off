"use client"
import Image from "next/image"

export default function CouponDialog({ copyToClipboard, isModalOpen, handleCancel, couponCode, copied }: any) {
  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-end p-2">
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center pt-4 pb-6">
          {/* Logo */}
          <div className="relative w-24 h-24 mb-4 rounded-full flex items-center justify-center">
            <Image
              src={couponCode?.logo || "/placeholder.svg?height=80&width=120"}
              alt="Store Logo"
              width={120}
              height={80}
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Coupon Title */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">{couponCode.couponName}</h2>

          {/* Coupon Code Section */}
          {couponCode.code ? (
            <div className="flex w-full max-w-md border rounded-md overflow-hidden mx-4">
              <div className="bg-white p-3 flex-grow text-center text-2xl font-bold text-gray-700">
                {couponCode.code}
              </div>
              <button
                onClick={copyToClipboard}
                className={`bg-[#7FA842] text-white px-4 flex items-center justify-center ${
                  copied ? "bg-[#7FA842]" : "bg-[#7FA842] hover:bg-[#6d9339]"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex justify-center">No Coupon Code Required</div>
          )}

          {/* Instructions */}
          <p className="mt-4 text-gray-600">
            Paste this code at{" "}
            <a
              href={couponCode?.htmlCode}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {couponCode?.storeName}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
