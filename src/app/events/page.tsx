import type { Metadata } from 'next'
import Link from 'next/link'
import { API_URL } from "@/app/components/utils/BASE_URL"
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Special Events & Seasonal Deals | LiveOffCoupon",
  description: "Discover exclusive deals and discounts for special events and seasonal sales like Black Friday, Cyber Monday, and more.",
  openGraph: {
    title: "Special Events & Seasonal Deals | LiveOffCoupon",
    description: "Discover exclusive deals and discounts for special events and seasonal sales.",
    type: "website",
    url: "https://liveoffcoupon.com/events",
    images: [
      {
        url: "/images/events-banner.jpg",
        width: 1200,
        height: 630,
        alt: "LiveOffCoupon Events",
      },
    ],
  },
  alternates: {
    canonical: "https://liveoffcoupon.com/events",
  },
  other: {
    "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
  },
}

// Fetch all events
async function getAllEvents() {
  try {
    const response = await fetch(`${API_URL}/events`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching all events:", error)
    return []
  }
}

export default async function EventsPage() {
  const events = await getAllEvents()
  const validEvents = events.filter((event: any) => event.slug !== null)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Special Events & Seasonal Deals | LiveOffCoupon",
            "description": "Discover exclusive deals and discounts for special events and seasonal sales.",
            "url": "https://liveoffcoupon.com/events",
          }),
        }}
      />
      
      <div className="mt-[100px] max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Special Events & Seasonal Deals</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validEvents.length > 0 ? (
            validEvents.map((event: any) => (
              <Link 
                key={event.id} 
                href={`/event/${event.slug}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={event.bannerImage || "/images/default-event-banner.jpg"}
                    alt={event.heading1 || "Event"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{event.heading1 || "Special Event"}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {event.description || "Discover exclusive deals and discounts for this special event."}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center">No events available at the moment.</p>
          )}
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">About Our Special Events</h2>
          <p className="text-gray-700">
            At LiveOffCoupon, we bring you the best deals and discounts for special events throughout the year. 
            From Black Friday and Cyber Monday to seasonal sales and holiday promotions, we've got you covered 
            with exclusive coupons and promo codes to help you save on your favorite products and services.
          </p>
        </div>
      </div>
    </>
  )
}