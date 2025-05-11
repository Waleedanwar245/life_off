export const API_URL = typeof window !== "undefined"
  ? process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
  : "https://liveoffcoupon.com/api"