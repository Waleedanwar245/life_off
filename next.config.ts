// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    domains: ['liveoffcoupon.com'],
  },

  async redirects() {
    return [
      {
        source: '/&',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/seasonal',
        destination: '/seasonal/christmas-deals',
        permanent: true,
      },
      {
        source: '/event/black-friday-deals',
        destination: '/seasonal/black-friday-deals',
        permanent: true,
      },
      // NOTE: removed the literal "/coupons/https://..." source (invalid)
      // See options below (A or B) to handle that case.

      {
        source: '/favicon.ico',
        destination: '/',
        permanent: true,
      },

      // Redirect when the URL contains the query key "whoisdatacenter.com"
      {
        source: '/',
        has: [
          { type: 'query', key: 'whoisdatacenter.com' }
        ],
        destination: '/',
        permanent: true,
      },

      // Redirect when ?ref=qanomed
      {
        source: '/',
        has: [
          { type: 'query', key: 'ref', value: 'qanomed' }
        ],
        destination: '/',
        permanent: true,
      },

      // Redirect when ?cid=4&id=177  (both query keys must match)
      {
        source: '/',
        has: [
          { type: 'query', key: 'cid', value: '4' },
          { type: 'query', key: 'id', value: '177' },
        ],
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
