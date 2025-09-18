import { Metadata } from "next"
import { API_URL } from "@/app/components/utils/BASE_URL"
import Link from "next/link"
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl"
import StoresContent from "@/app/components/store/StoresContent.server";

export const metadata: Metadata = {
  title: "Coupons and Discounts on Your Favorite Stores | LiveOff Coupon",
  description: "Find the best promo codes, discounts, and coupons for your favorite stores! Browse our complete list of brands and save big on every purchase you make.",
  // Rest of your metadata stays the same
}

// Server-side data fetching
async function getStores() {
  try {
    const response = await fetch(`${API_URL}/store`, {
      next: { revalidate: 10 } // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching stores:", error)
    return []
  }
}

export default async function Page(props: any) {
  // Fetch data on the server
  const { searchParams } = props ?? {}
  const stores = await getStores()

  return (
    <>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Stores on Offers | LiveOffCoupon",
            "description": "Discover a wide range of stores offering exclusive discounts and coupons on LiveOffCoupon.",
            "url": "https://liveoffcoupon.com/stores",

            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://liveoffcoupon.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Stores",
                  "item": "https://liveoffcoupon.com/stores"
                }
              ]
            },

            "potentialAction": {
              "@type": "ViewAction",
              "target": "https://liveoffcoupon.com/stores",
              "name": "Browse All Stores with Coupons"
            },

            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": stores.map((store: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://liveoffcoupon.com/coupons/${store.slug}`,
                "item": {
                  "@type": "Store",
                  "name": store.name,
                  "url": `https://liveoffcoupon.com/coupons/${store.slug}`,
                  "image": convertToSecureUrl(store.logoUrl || "/images/default_store_img.png"),
                  "identifier": store.id,
                  "sameAs": store.websiteUrl || "", // if available
                }
              }))
            }
          })
        }}
      />

      <div className="">
        <StoresContent stores={stores} searchParams={searchParams ?? {}} />
        
        {/* Add this section to ensure ALL links are in the HTML */}
        <div className="hidden">
          {stores.map((store: any) => (
            store.slug && (
              <Link key={store.id} href={`/coupons/${store.slug}`}>
                {store.name}
              </Link>
            )
          ))}
        </div>


      </div>
    </>
  )
}