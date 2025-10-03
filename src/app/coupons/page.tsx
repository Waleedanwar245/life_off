import CouponsContent from "../components/store/couponsContent";


export const metadata = {
  title: "Coupons | LiveOffCoupon",
  description: "Coupons LiveOffCoupon — Reveal Codes and Get Codes.",
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
