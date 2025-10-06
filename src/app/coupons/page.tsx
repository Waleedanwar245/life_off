import CouponsContent from "../components/store/couponsContent";


export const metadata = {
  title: "LiveOff Coupon | Best Deals, Promo Codes & Discounts Online",
  description: "Save big with the latest verified coupons and promo codes from LiveOff Coupon. Discover exclusive offers on your favorite brands and shop smarter today.",
  alternates: {
    canonical: 'https://liveoffcoupon.com/coupons',
  },
}
// app/coupons/page.tsx
export default function CouponListPage() {
  return (
    <div>
     
      {/* Render list of coupons here */}
       <CouponsContent/>
    </div>
  );
}
