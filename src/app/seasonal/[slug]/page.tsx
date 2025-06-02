import type { Metadata, ResolvingMetadata } from 'next'
import { API_URL } from "@/app/components/utils/BASE_URL"
import Link from 'next/link'
import ChristmasDeals from '@/app/components/event/ChristmasDeals'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function generateEventJsonLd(event: any, url: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        "url": url,
        "name": event.metaTitle || event.heading1 || "Event | LiveOffCoupon",
        "description": event.metaDescription || event.description || "Discover exclusive deals and discounts for special events."
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://liveoffcoupon.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Seasonal Events",
            "item": "https://liveoffcoupon.com/seasonal"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": event.metaTitle || event.heading1 || "Event",
            "item": url
          }
        ]
      },
      {
        "@type": "ViewAction",
        "target": url,
        "name": `View event ${event.metaTitle || event.heading1 || ''} on LiveOffCoupon`,
        "description": `Explore deals and discounts for the ${event.metaTitle || event.heading1 || ''} event.`
      },
      {
        "@type": "Event",
        "name": event.metaTitle || event.heading1 || "Event | LiveOffCoupon",
        "url": url,
        "description": event.metaDescription || event.description || "Discover exclusive deals and discounts for special events.",
        "image": event.bannerImage || "https://liveoffcoupon.com/default-event-banner.jpg",
        "startDate": event.startDate || "2025-11-27", // Adjust as necessary
        "endDate": event.endDate || "2025-11-28",     // Adjust as necessary
        "eventStatus": "EventScheduled",
        "eventAttendanceMode": "OnlineEventAttendanceMode"
      }
    ]
  }
}


// Fetch all events for generateStaticParams
async function getAllEvents() {
  try {
    const response = await fetch(`${API_URL}/events`)

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

// This function tells Next.js which event pages to generate at build time
export async function generateStaticParams() {
  try {
    const events = await getAllEvents()

    // Filter out events with null slugs
    const validEvents = events.filter((event: any) => event.slug !== null)

    console.log(`Found ${validEvents.length} events with valid slugs out of ${events.length} total`)

    // Return an array of objects with the slug parameter
    return validEvents.map((event: any) => ({
      slug: event.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for events:", error)
    return [] // Return empty array if there's an error
  }
}

// Fetch single event data
async function getEventBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/events/slug/${slug}`, {
      next: { revalidate: 10 } // Revalidate every hour
    })
    console.log("response::::::", response);



    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error)
    return null
  }
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // Await the params to get the slug
    const { slug } = await params
    const data = await getEventBySlug(slug)
    const event = data
    console.log("data:::::::::::", data);


    if (!event) {
      return {
        title: "Event Not Found | LiveOffCoupon",
        description: "The requested event could not be found.",
      }
    }

    const eventTitle = event.metaTitle || event.heading1 || 'Black Friday Deals 2025 | LiveOffCoupon'
    const eventDescription = event.metaDescription || event.description ||
      "Maximize savings with Black Friday discount codes in 2025. Get exclusive coupons for electronics, fashion, home goods, and more this Black Friday season!"

    return {
      title: eventTitle,
      description: eventDescription,
      openGraph: {
        title: eventTitle,
        description: eventDescription,
        url: `https://liveoffcoupon.com/seasonal/${slug}`,
        type: "website",
        images: [
          {
            url: event.bannerImage || "https://liveoffcoupon.com/default-event-banner.jpg",
            width: 1200,
            height: 630,
            alt: eventTitle,
          },
        ],
      },
      alternates: {
        canonical: `https://liveoffcoupon.com/seasonal/${slug}`,
      },
      other: {
        "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Event | LiveOffCoupon",
      description: "Discover exclusive deals and discounts for special events.",
    }
  }
}

export default async function EventPage({ params }: Props) {
  try {
    // Await the params to get the slug
    const { slug } = await params
    const data = await getEventBySlug(slug)

    if (!data) {
      throw new Error("No data returned from API")
    }

    const event = data
    const eventTitle = event.metaTitle || event.heading1 || 'Black Friday Deals 2025 | LiveOffCoupon'
    const eventDescription = event.metaDescription || event.description ||
      "Maximize savings with Black Friday discount codes in 2025. Get exclusive coupons for electronics, fashion, home goods, and more this Black Friday season!"

    const url = `https://liveoffcoupon.com/seasonal/${slug}`

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateEventJsonLd(event, url)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": eventTitle,
              "url": `https://liveoffcoupon.com/seasonal/${slug}`,
              "description": eventDescription,
              "image": event.bannerImage || "https://liveoffcoupon.com/default-event-banner.jpg",
              "startDate": "2025-11-27", // Assuming the date for Black Friday
              "endDate": "2025-11-28",  // Assuming the date for Black Friday
              "eventStatus": "EventScheduled",
              "eventAttendanceMode": "OnlineEventAttendanceMode",
            }),
          }}
        />

        <div className='mt-[100px]'>
          <ChristmasDeals data={event} />
        </div>
      </>
    )
  } catch (error) {
    console.error("Error rendering event page:", error)
    return redirect('/')
  }
}