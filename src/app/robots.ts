// app/robots.txt.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    // rules is an array so you can add more user-agent blocks later if needed
    rules: [
      {
        userAgent: '*',
        // Allow the site root
        allow: ['/'],
        // Disallow tag pages and any URL that starts with "/?" (common pattern to block query variants)
        disallow: ['/tag/', '/?'],
      },
    ],
    sitemap: 'https://liveoffcoupon.com/sitemap.xml',
  }
}
