// page.tsx
import { API_URL } from "@/app/components/utils/BASE_URL"
import SplashScreen from "@/app/components/utils/SplashSvreen"
import type { Metadata, ResolvingMetadata } from "next"
import { Suspense } from "react"
import axios from "axios"
import StoreHeader from "@/app/components/store/StoreHeader"
import CouponTabs from "@/app/components/store/CouponTabs.server";
import dayjs from "dayjs"
import { notFound, redirect } from "next/navigation" // ✅ server-side redirect
import { sanitizeHomeData } from "@/app/components/utils/sanitizeHomeData";


export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://liveoffcoupon.com";

// Types
interface Store {
  id: string
  storeTitle: string
  name: string
  secondaryName: string
  slug: string
  storeDescription: string
  metaDescription: string
  logoUrl: string
  coupons: any
}

interface StoreData {
  store: Store
  coupons?: any[]
  products?: any[]
}

// Define Props type
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  try {
    // Fetch all stores to generate static paths
    const res = await axios.get(`${API_URL}/store`)
    const stores = res.data

    // Filter out stores with null slugs
    const validStores = stores.filter((store: any) => store.slug !== null);

    console.log(`Found ${validStores.length} stores with valid slugs out of ${stores.length} total`);

    // Return an array of objects with the slug parameter
    return validStores.map((store: any) => ({
      slug: store.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for stores:", error)
    return [] // Return empty array if there's an error
  }
}

async function getStoreBySlug(slug: string): Promise<StoreData> {
  console.log("slug:::", slug);
  try {
    const res = await fetch(`${API_URL}/store/coupon-product-by-slug/${slug}`, {
      cache: "no-store", // this disables caching
      next: { revalidate: 0 }, // optional, further disables ISR
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch store data for slug: ${slug}`);
    }

    const data = await res.json();
    // sanitize the whole payload (removes internal nofollow tokens)
    const sanitized = sanitizeHomeData(data, SITE_ORIGIN);
    return sanitized as StoreData;
  } catch (error) {
    console.error("Error fetching store data:", error);
    throw error;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    // Await the params to get the id
    const { slug } = await params
    const data = await getStoreBySlug(slug)
    const store = data?.store

    if (!store) {
      return {
        title: "Store Not Found | LiveOffCoupon",
        description: "The requested store could not be found.",
      }
    }

    const storeTitle = store?.storeTitle || (store?.coupons?.[0]?.mainImage + " " + store?.coupons?.[0]?.secondaryImage + " " + store.name?.trim() + " " + store?.secondaryName) || store.name?.trim() || store.slug?.trim() || "Featured Store"
    const storeDescription =
      `Get ${storeTitle}. LiveOff Coupon offers updated coupon codes and exclusive savings. Updated regularly to help you save more.` ||
      store.storeDescription?.trim() ||
      `Discover the latest coupons, discounts, and offers at ${storeTitle} on LiveOff Coupon.`

    return {
      title: `${storeTitle} ${dayjs().format('MMMM YYYY')} | LiveOff Coupon`,
      description: storeDescription,
      openGraph: {
        title: `${storeTitle} ${dayjs().format('MMMM YYYY')} | LiveOff Coupon`,
        description: storeDescription,
        url: `https://liveoffcoupon.com/coupons/${store.slug}`,
        type: "website",
        images: [
          {
            url: store.logoUrl || "/logo.png",
            width: 1200,
            height: 630,
            alt: storeTitle,
          },
        ],
      },
      alternates: {
        canonical: `https://liveoffcoupon.com/coupons/${store.slug}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Store | LiveOffCoupon",
      description: "Discover the latest coupons and deals to save money on your favorite brands.",
    }
  }
}

// Generate JSON-LD schema
function generateJsonLd(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": store.storeTitle?.trim() || store.name?.trim() || "LiveOff Coupon Store",
    "url": `https://liveoffcoupon.com/coupons/${store.slug}`,
    "description": store.metaDescription?.trim() || store.storeDescription?.trim() || "Find the best deals and coupons.",
    "image": store.logoUrl || "https://liveoffcoupon.com/default-store-image.jpg",
  }
}

function generateBreadcrumbList(store: Store) {
  return {
    "@context": "https://schema.org",
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
        "name": "Coupons",
        "item": "https://liveoffcoupon.com/coupons"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": store.storeTitle || store.name || "Store",
        "item": `https://liveoffcoupon.com/coupons/${store.slug}`
      }
    ]
  }
}

function generateViewActionSchema(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "ViewAction",
    "target": `https://liveoffcoupon.com/coupons/${store.slug}`,
    "name": `View coupons for ${store.storeTitle || store.name}`,
    "description": store.metaDescription || store.storeDescription || "Explore deals and offers from this store"
  }
}


export default async function StorePage({ params }: Props) {
  try {
    // Await the params to get the id
    const { slug } = await params
    const data = await getStoreBySlug(slug)

    if (!data || !data?.store) {
      redirect('/stores')
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(data.store)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbList(data.store)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateViewActionSchema(data.store)),
          }}
        />
        <Suspense fallback={<SplashScreen />}>
          <div className='mt-[250px] md:mt-[135px]' >
            <StoreHeader data={data} />
          </div>
          <CouponTabs data={data} />
          {/* <StoreContent storeData={data} /> */}
        </Suspense>
      </>
    )
  } catch (error) {
    console.error("Error rendering store page:", error)
    return redirect('/stores')
  }
}
