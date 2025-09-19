// src/app/components/utils/removeNofollow.ts
import { load, CheerioAPI } from "cheerio";

type RemoveOptions = {
  onlyInternal?: boolean; // default true
  siteOrigin?: string; // e.g. "https://liveoffcoupon.com"
};

/**
 * Remove the "nofollow" token from <a> rel attributes.
 * - If onlyInternal is true, remove nofollow only for internal links (relative URLs or same host).
 * - Keeps other rel tokens (noopener/noreferrer) intact.
 * - If rel becomes empty, remove the attribute entirely.
 *
 * Server-only utility (uses cheerio).
 */
export function removeNofollow(html?: string | null, options?: RemoveOptions): string {
  if (!html) return "";

  const onlyInternal = options?.onlyInternal ?? true;
  const siteOrigin = options?.siteOrigin ?? "https://liveoffcoupon.com"; // change if needed

  const siteHostname = (() => {
    try {
      return new URL(siteOrigin).hostname;
    } catch {
      return siteOrigin; // fallback: treat as hostname if no protocol present
    }
  })();

  const $: CheerioAPI = load(html);

  $("a").each((_: number, el: any) => {
    const $el = $(el);
    const href = ($el.attr("href") || "").trim();

    // determine if link is internal
    let isInternal = false;
    if (!href) {
      isInternal = false;
    } else if (href.startsWith("/")) {
      isInternal = true;
    } else {
      // if href is absolute URL, compare hostnames
      try {
        const u = new URL(href, siteOrigin);
        if (u.hostname === siteHostname) isInternal = true;
      } catch {
        // If URL parsing fails, treat as external (conservative)
        isInternal = false;
      }
    }

    // Only alter rel if not required to keep external nofollow
    if (onlyInternal && !isInternal) {
      // skip external links when onlyInternal === true
      return;
    }

    const relAttr = ($el.attr("rel") || "").trim();

    // Build set of tokens (lower-cased)
    const tokens = new Set<string>(
      relAttr
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.toLowerCase())
    );

    // Remove nofollow token if present
    if (tokens.has("nofollow")) tokens.delete("nofollow");

    // If there's nothing left, remove the rel attr (so we don't leave rel="")
    const remaining = Array.from(tokens);
    if (remaining.length === 0) {
      $el.removeAttr("rel");
    } else {
      // stable ordering: keep noopener/noreferrer first (if present), then others alphabetically
      const preferred = ["noopener", "noreferrer"];
      const rest = remaining.filter((t) => !preferred.includes(t)).sort();
      const finalTokens = [
        ...preferred.filter((p) => tokens.has(p)),
        ...rest,
      ];
      $el.attr("rel", finalTokens.join(" "));
    }
  });

  return $.root().html() ?? $.html();
}
