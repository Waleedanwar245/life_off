// src/app/components/utils/removeNofollow.ts
import { load, CheerioAPI } from "cheerio";

/**
 * Remove the "nofollow" token from all <a> rel attributes.
 * - Keeps other rel tokens intact.
 * - Keeps noopener/noreferrer if present (for security).
 * - If rel becomes empty, remove the attribute entirely.
 *
 * Use only on server (this uses cheerio).
 */
export function removeNofollow(html?: string | null): string {
  if (!html) return "";

  const $: CheerioAPI = load(html); // avoid options that may disagree with typings

  $("a").each((_: number, el: any) => {
    const $el = $(el);
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

  // return fragment HTML or full document
  return $.root().html() ?? $.html();
}
