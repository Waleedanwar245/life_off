import React from 'react'
import ContactForm from '../components/contactus'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "LiveOff Coupon Contact | Ask Us Anything About Coupons & Deals",
  description: "Need quick help with discount codes or offers? Contact LiveOff Coupon now for fast, friendly customer support to maximize your savings on every purchase.",
  alternates: {
    canonical: "https://liveoffcoupon.com/contact-us"
  },
  openGraph: {
    url: "https://liveoffcoupon.com/contact-us",
  },
};

const page = () => {
  return (
    <div><ContactForm/></div>
  )
}

export default page