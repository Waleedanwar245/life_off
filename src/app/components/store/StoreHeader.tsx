import { convertToSecureUrl } from "../utils/convertToSecureUrl";

export default function StoreHeader({ data }: any) {
    return (
      <div className="max-w-[1280px] mx-auto md:px-4 md:py-0">
        <div className="relative">
          {/* Main container with subtle shadow and border */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-10 rounded-xl bg-white md:py-0 px-6">
            {/* Left container (Logo) */}
            <div className=" justify-center md:justify-start flex">
              <div
                style={{
                  width: "clamp(123px, 10vw, 183px)",
                  height: "clamp(123px, 10vw, 183px)",
                }}
                className="rounded-full bg-white flex items-center justify-center p-2 border-[6px] border-[#7FA842]"
              >
                <div className="w-[80%] h-[80%] flex items-center justify-center">
                  <img
                    src={convertToSecureUrl(data?.store.logoUrl) || "/assets/category-logo.svg"}
                    alt={`${data?.store?.name || "Store"} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
  
            {/* Right container (Text content) */}
            <div className="flex flex-col items-center text-start sm:items-start justify-center flex-grow ">
              <h1
                className="font-[800] text-gray-900 mb-2"
                style={{
                  fontSize: "clamp(24.09px, 4vw, 38.09px)",
                }}
              >
                {data?.store?.name || "N/A"} {data?.store?.secondaryName}
              </h1>
              <p
                className="text-gray-600 uppercase tracking-wide"
                style={{
                  fontSize: "clamp(10.09px, 5vw, 14px)",
                }}
              >
                VERIFIED COUPONS AND PROMO CODE{" "}
                {new Date()
                  .toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  