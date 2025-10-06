// src/app/submit/page.tsx  (SERVER component)

import type { Metadata } from 'next'
import SubmitOfferForm from './submitoffer' // adjust if your component path differs

export const metadata: Metadata = {
  title: 'Submit An Offer | Share Your Best Coupons With LiveOff Coupon',
  description: 'Reach more shoppers by submitting your coupon codes and promo deals to LiveOff Coupon. Fill easy form, fast approval, and get wide exposure for your offers.',
  alternates: {
    canonical: 'https://liveoffcoupon.com/submit'
  },
  openGraph: {
    title: 'Submit An Offer | Share Your Best Coupons With LiveOff Coupon',
    description: 'Reach more shoppers by submitting your coupon codes and promo deals to LiveOff Coupon. Fill easy form, fast approval, and get wide exposure for your offers.',
    url: 'https://liveoffcoupon.com/submit',
    siteName: 'LiveOffCoupon',
  },
  
}

export default function SubmitOfferPage() {
  return <SubmitOfferForm />
}
