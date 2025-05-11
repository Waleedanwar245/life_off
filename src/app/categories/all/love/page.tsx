// import type { Metadata } from "next"
// import CategoriesContent from "@/app/components/category/CategoriesContent"

// export const metadata: Metadata = {
//   title: "All Categories | LiveOffCoupon",
//   description:
//     "Explore a wide range of categories on LiveOffCoupon, offering amazing deals and discounts across various product categories.",
//   openGraph: {
//     title: "All Categories | LiveOffCoupon",
//     description: "Discover discounts in all product categories available on LiveOffCoupon.",
//     type: "website",
//     url: "https://liveoffcoupon.com/category/all",
//     images: [
//       {
//         url: "/images/store-logo.png",
//         width: 1200,
//         height: 630,
//         alt: "LiveOffCoupon",
//       },
//     ],
//   },
//   alternates: {
//     canonical: "https://liveoffcoupon.com/categories",
//   },
//   other: {
//     "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
//   },
// }

// export default function Page() {
//   return <CategoriesContent /> 
// }

export default function TestPage() {
  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h1>Categories Test Page</h1>
      <p>If you can see this, the route is working!</p>
    </div>
  )
}