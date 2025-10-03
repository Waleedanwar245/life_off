// src/app/submit/page.tsx  (SERVER component)

import type { Metadata } from 'next'
import SubmitOfferForm from './submitoffer' // adjust if your component path differs

export const metadata: Metadata = {
  title: 'Submit an Offer | LiveOffCoupon',
  description: 'Submit an offer or coupon for your store to LiveOffCoupon.',
  alternates: {
    canonical: 'https://liveoffcoupon.com/submit'
  },
  openGraph: {
    title: 'Submit an Offer | LiveOffCoupon',
    description: 'Submit an offer or coupon for your store to LiveOffCoupon.',
    url: 'https://liveoffcoupon.com/submit',
    siteName: 'LiveOffCoupon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit an Offer | LiveOffCoupon',
    description: 'Submit an offer or coupon for your store to LiveOffCoupon.',
  },
}

export default function SubmitOfferPage() {
  return <SubmitOfferForm />
}
