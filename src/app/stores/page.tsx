import { Metadata } from "next"
import { API_URL } from "@/app/components/utils/BASE_URL"
import Link from "next/link"
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl"
import StoresContent from "../components/store/StoresContent"

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

export default async function Page() {
  // Fetch data on the server
  const stores = await getStores()
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Stores on Offers | LiveOffCoupon",
            description: "Discover a wide range of stores offering exclusive discounts and coupons on LiveOffCoupon.",
            url: "https://liveoffcoupon.com/stores",
          }),
        }}
      />
      
      <div className="">
        <StoresContent/>
        {/* <h2 className="text-2xl font-bold text-center mb-8">Stores on Offers</h2> */}
        
        {/* Stores Grid */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {stores.length > 0 ? (
            stores.slice(0, 30).map((store: any, index: number) => (
              <Link
                key={index}
                href={`/coupons/${store?.slug || "no-slug"}`}
                className={`${store.bgColor || "bg-white"} w-[206px] h-[166px] cursor-pointer aspect-square rounded-lg flex items-center justify-center p-6 transition-transform hover:scale-105 shadow-md`}
              >
                {store?.logoUrl ? (
                  <img
                    src={convertToSecureUrl(store?.logoUrl) || "/images/default_store_img.png"}
                    alt={`${store.name} logo`}
                    width={150}
                    height={150}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src="/images/default_store_img.png"
                    alt="Default store logo"
                    width={150}
                    height={150}
                    className="w-full h-full object-contain"
                  />
                )}
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full">No stores available.</p>
          )}
        </div> */}
        
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