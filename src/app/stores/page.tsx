// src/app/stores/page.tsx
import { Metadata } from "next";
import { API_URL } from "@/app/components/utils/BASE_URL";
import Link from "next/link";
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl";
import StoresContent from "@/app/components/store/StoresContent.server";
import { sanitizeHomeData } from "@/app/components/utils/sanitizeHomeData";

export const metadata: Metadata = {
  title: "Coupons and Discounts on Your Favorite Stores | LiveOff Coupon",
  description:
    "Find the best promo codes, discounts, and coupons for your favorite stores! Browse our complete list of brands and save big on every purchase you make.",
};

const SITE_ORIGIN = "https://liveoffcoupon.com";

async function getStores() {
  try {
    const response = await fetch(`${API_URL}/store`, { next: { revalidate: 10 } });
    if (!response.ok) throw new Error(`API responded with status: ${response.status}`);
    const json = await response.json();
    // sanitize fetched data (removes nofollow from internal links)
    return sanitizeHomeData(json, SITE_ORIGIN);
  } catch (err) {
    console.error("Error fetching stores:", err);
    return [];
  }
}

/**
 * Important: await props.searchParams (not just props) before accessing its properties.
 */
export default async function Page(props: any) {
  // await the searchParams proxy directly (this is the recommended safe pattern)
  const searchParams = (await props?.searchParams) ?? {};

  // normalize to plain strings (safe primitives to pass into server components)
  const pageParam = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
  const letterParam = Array.isArray(searchParams?.letter) ? searchParams.letter[0] : searchParams?.letter;

  // Get sanitized stores
  const stores = await getStores();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Stores on Offers | LiveOffCoupon",
            description: "Discover a wide range of stores offering exclusive discounts and coupons on LiveOffCoupon.",
            url: "https://liveoffcoupon.com/stores",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://liveoffcoupon.com" },
                { "@type": "ListItem", position: 2, name: "Stores", item: "https://liveoffcoupon.com/stores" },
              ],
            },
            potentialAction: {
              "@type": "ViewAction",
              target: "https://liveoffcoupon.com/stores",
              name: "Browse All Stores with Coupons",
            },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: (Array.isArray(stores) ? stores : []).map((store: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://liveoffcoupon.com/coupons/${store?.slug}`,
                item: {
                  "@type": "Store",
                  name: store?.name,
                  url: `https://liveoffcoupon.com/coupons/${store?.slug}`,
                  image: convertToSecureUrl(store?.logoUrl || "/images/default_store_img.png"),
                  identifier: store?.id,
                  sameAs: store?.websiteUrl || "",
                },
              })),
            },
          }),
        }}
      />

      <div>
        {/* pass plain primitives to the server component */}
        <StoresContent
          stores={stores}
          page={String(pageParam ?? "0")}
          letter={letterParam ? String(letterParam).charAt(0) : null}
        />

        {/* hidden SEO links */}
        <div className="hidden">
          {(Array.isArray(stores) ? stores : []).map((store: any) =>
            store?.slug ? (
              <Link key={store.id} href={`/coupons/${store.slug}`}>
                {store.name}
              </Link>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}
