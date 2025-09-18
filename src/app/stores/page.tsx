// src/app/stores/page.tsx
import { Metadata } from "next";
import { API_URL } from "@/app/components/utils/BASE_URL";
import Link from "next/link";
import { convertToSecureUrl } from "@/app/components/utils/convertToSecureUrl";
import StoresContent from "@/app/components/store/StoresContent.server";

export const metadata: Metadata = {
  title: "Coupons and Discounts on Your Favorite Stores | LiveOff Coupon",
  description:
    "Find the best promo codes, discounts, and coupons for your favorite stores! Browse our complete list of brands and save big on every purchase you make.",
};

async function getStores() {
  try {
    const response = await fetch(`${API_URL}/store`, { next: { revalidate: 10 } });
    if (!response.ok) throw new Error(`API responded with status: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Error fetching stores:", err);
    return [];
  }
}

/**
 * IMPORTANT: destructure `searchParams` in the function signature.
 * That avoids the Next.js runtime warning about using dynamic APIs incorrectly.
 */
export default async function Page({
  searchParams = {},
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  // Normalize page/letter to plain strings (safe to pass to other server components)
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : (searchParams.page as string | undefined);
  const letterParam = Array.isArray(searchParams.letter) ? searchParams.letter[0] : (searchParams.letter as string | undefined);

  // fetch stores on the server
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
              itemListElement: stores.map((store: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://liveoffcoupon.com/coupons/${store.slug}`,
                item: {
                  "@type": "Store",
                  name: store.name,
                  url: `https://liveoffcoupon.com/coupons/${store.slug}`,
                  image: convertToSecureUrl(store.logoUrl || "/images/default_store_img.png"),
                  identifier: store.id,
                  sameAs: store.websiteUrl || "",
                },
              })),
            },
          }),
        }}
      />

      <div className="">
        {/* pass plain primitives (strings) to the server component */}
        <StoresContent stores={stores} page={pageParam ?? "0"} letter={letterParam ?? null} />

        {/* hidden links for SEO (keeps HTML links present) */}
        <div className="hidden">
          {stores.map((store: any) =>
            store.slug ? (
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
