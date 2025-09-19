// src/app/components/utils/sanitizeHomeData.ts
import { removeNofollow } from "./removeNofollow";

function looksLikeHtml(s: string): boolean {
  return /<a\s+/i.test(s) || /<\/?[a-z][\s\S]*>/i.test(s);
}

/**
 * Recursively sanitize any string fields that look like HTML.
 * Returns a deep-cloned value with sanitized strings.
 *
 * options.siteOrigin should match your site (e.g. https://liveoffcoupon.com)
 */
export function sanitizeHomeData<T>(data: T, siteOrigin = "https://liveoffcoupon.com"): T {
  if (data == null) return data;

  if (typeof data === "string") {
    if (looksLikeHtml(data)) {
      return removeNofollow(data, { onlyInternal: true, siteOrigin }) as unknown as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeHomeData(item, siteOrigin)) as unknown as T;
  }

  if (typeof data === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(data as any)) {
      out[k] = sanitizeHomeData(v, siteOrigin);
    }
    return out;
  }

  // primitives (number, boolean, etc.)
  return data;
}
