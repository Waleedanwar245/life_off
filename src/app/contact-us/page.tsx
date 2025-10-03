import React from 'react'
import ContactForm from '../components/contactus'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us | LiveOffCoupon",
  description: "Contact LiveOffCoupon — send us a message or question.",
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