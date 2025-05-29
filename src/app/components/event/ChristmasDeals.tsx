import DealCard from "./DealCard";
import StoreGrid from "./StoreGrid";

export default function ChristmasDeals({ data }: any) {

  // Extract stores for the StoreGrid component
  const storeList = data?.coupons?.store?.map((store: any) => store.name) || []
  // Transform coupons data to match the DealCard component format
  const dealsList =
    data?.coupons?.map((coupon: any) => {
 
      return ({
        slug: coupon?.store?.slug,
        discount: coupon?.mainImage || "",
        type: coupon?.secondaryImage || "OFF",
        brand: coupon?.name,
        description: coupon?.codeImage || "Coupon Code",
        verified: coupon?.isVerified,
        expiry: formatDate(coupon?.endDate),
        logo: coupon?.store?.logoUrl || "/placeholder.svg?height=40&width=40",
        code: coupon?.code,
        htmlCodeUrl: coupon?.htmlCodeUrl,
        detail: coupon?.detail,
        btnText: coupon?.code ? " View Coupon Code" : " View Deal"
      })
    }) || []


  console.log("dealsList:::", dealsList);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">{data?.heading1 || "Christmas Deals 2025"}</h1>
      {/* <p>{data?.description}</p> */}

      {data?.description ? (
        <div className="custom-class"
          dangerouslySetInnerHTML={{ __html: data?.description }}
        />
      ) : (
        <p className="text-gray-500">Undoubtedly the biggest shopping holiday for many years, the Black Friday stirs up expectations among consumers to save on their luxury purchases. If you are little furious about the crowds in stores, we understand you. Accept our open invitation to shop what you love from the most comfortable Black Friday sale ever, that we are glad to have for you.</p>
      )}


      {/* Feature Stores */}
      <div className="mb-8">
        {storeList.length > 0 && <h2 className="text-xl font-semibold mb-4">Feature Stores</h2>}
        <StoreGrid stores={storeList.length > 0 ? storeList : []} />
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        {dealsList && dealsList.length > 0 ? (
          dealsList.map((deal: any, index: any) => (
            <DealCard key={index} {...deal} />
          ))
        ) : (
          <p className="text-gray-500">No deals available at the moment.</p> // Optional message for when no deals are present
        )}
      </div>


      {/* Size Inclusive Section */}
      <div className="mb-8">
        {/* <h2 className="text-2xl font-bold mb-4">{data?.heading2 || "What Does Size-Inclusive Mean?"}</h2> */}
        {/* <p>{data?.description2}</p> */}

        {data?.description2 ? (
          <div className="custom-class"
            dangerouslySetInnerHTML={{ __html: data?.description2 }}
          />
        ) : (
          <p className="text-gray-500"> </p>
        )}
      </div>
    </div>
  )
}

// Helper function to format date
function formatDate(dateString: string): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    return "N/A"
  }
}






