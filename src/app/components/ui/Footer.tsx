"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { API_URL } from "../utils/BASE_URL"

// Define paths object to replace the imported PATH
const PATH = {
  LANDING_PAGE: "/",
  STORE: "/stores",
  SINGLE_STORE: "/coupons/:id",
  ALL_CATEGORY: "/categories",
  SHIPPING_PAGE: "/free-shipping",
  ALL_BLOG: "/blogs",
  SINGLE_EVENT: "/event/:id",
  COUPON_REQUREST_OFFER: "/submit",
  ABOUT_US: "/about-us",
  PRIVACY_POLICY_LANDING: "/privacy-policy",
  TERM_AND_CONDITIONS: "/terms-conditions",
}

// Helper function to get error message
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error
  if (error?.data?.message) return error.data.message
  if (error?.message) return error.message
  return "Something went wrong"
}

const FooterSection = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async () => {
    // Simple email validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    try {
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const response = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to subscribe")
      }

      toast.success("You've been successfully subscribed to our newsletter!")
      setEmail("") // clear the input
    } catch (err) {
      console.error("Subscription failed:", err)
      toast.error(getErrorMessage(err) || "Something went wrong. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-[#0A2730] text-white mt-28 max-w-[5500px] mx-auto">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        <div className="bg-[#7FA842] p-6 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[calc(100%-2rem)] rounded-[10px]">
          <h2 className="text-[58.9px] font-bold mb-2" style={{ fontSize: "clamp(24px, 3vw, 58.9px)" }}>
            Love to save?
          </h2>
          <p className="text-[23px] mb-4" style={{ fontSize: "clamp(16px, 1vw, 23px)" }}>
            Sign up for the free liveoffcoupons newsletter today! It's packed with the latest promo codes and top
            discounts.
          </p>
          <div className="flex gap-4 flex-wrap">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="flex-1 px-4 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7DAD41]"
            />
            <button
              onClick={handleSubscribe}
              disabled={isSubmitting}
              className="bg-[#0A2730] text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pt-48">
          {/* Logo Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => router.push(PATH.LANDING_PAGE)}>
              <Image
                src="/footer_logo.svg"
                alt="LiveOffCoupons Logo"
                width={150}
                height={71}
                className="h-[71.41480255126953px] w-auto"
              />
            </div>
          </div>

          {/* Seasonal Deals */}
          <div>
            <h3 className="font-semibold mb-4">Seasonal Deals</h3>
            <ul className="space-y-2 text-[16px]">
              <li>
                <a href="#" className="hover:text-[#95C959] transition-colors" target="_blank" rel="noreferrer">
                  Cyber Monday
                </a>
              </li>
              <li>
                <Link
                  href={PATH.SINGLE_EVENT.replace(":id", "black-friday-deals")}
                  className="hover:text-[#95C959] transition-colors"
                >
                  Black Friday
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#95C959] transition-colors">
                  Christmas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#95C959] transition-colors">
                  Halloween
                </a>
              </li>
            </ul>
          </div>

          {/* Browse By */}
          <div>
            <h3 className="font-semibold mb-4">Browse By</h3>
            <ul className="space-y-2 text-[16px]">
              <li>
                <Link href={PATH.ALL_CATEGORY} className="hover:text-[#95C959] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href={PATH.STORE} className="hover:text-[#95C959] transition-colors">
                  Stores
                </Link>
              </li>
              <li>
                <Link href={PATH.SHIPPING_PAGE} className="hover:text-[#95C959] transition-colors">
                  Free Shipping Coupons
                </Link>
              </li>
              <li>
                <Link href={PATH.ALL_BLOG} className="hover:text-[#95C959] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-[16px]">
              <li>
                <Link href={PATH.COUPON_REQUREST_OFFER} className="hover:text-[#95C959] transition-colors">
                  Submit Coupon
                </Link>
              </li>
              <li>
                <Link href={PATH.ABOUT_US} className="hover:text-[#95C959] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={PATH.PRIVACY_POLICY_LANDING} className="hover:text-[#95C959] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={PATH.TERM_AND_CONDITIONS} className="hover:text-[#95C959] transition-colors">
                  TermsOfUse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a
              href="https://www.facebook.com/liveoffcoupons/"
              target="_blank"
              className="hover:text-[#95C959] transition"
              rel="noreferrer"
            >
              <Image src="/fb-logo.svg" alt="Facebook" width={24} height={24} className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/liveoffcoupon/"
              target="_blank"
              className="hover:text-[#95C959] transition"
              rel="noreferrer"
            >
              <Image src="/instagram-logo.svg" alt="Instagram" width={24} height={24} className="w-6 h-6" />
            </a>
            {/* Commented out social links preserved from original */}
            {/* <a href="#" className="hover:text-[#95C959] transition">
              <Image 
                src="/images/linkedin-footer-logo.png" 
                alt="LinkedIn" 
                width={24} 
                height={24} 
                className="w-6 h-6" 
              />
            </a>
            <a href="https://www.pinterest.com/liveoffcoupon/" target="blank" className="hover:text-[#95C959] transition">
              <Image 
                src="/images/tw-footer-logo.png" 
                alt="Twitter" 
                width={24} 
                height={24} 
                className="w-6 h-6" 
              />
            </a> */}
          </div>

          <div className="text-sm text-gray-400 flex flex-wrap justify-center gap-4">
            <span>Copyright {new Date().getFullYear()} Liveoffcoupons, All rights reserved</span>
            <Link href={PATH.TERM_AND_CONDITIONS} className="hover:text-[#95C959]">
              T&Cs
            </Link>
            {/* Commented out links preserved from original */}
            {/* <Link href="#" className="hover:text-[#95C959]">Privacy Policy</Link> */}
            {/* <Link href="#" className="hover:text-[#95C959]">Disclaimer</Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
