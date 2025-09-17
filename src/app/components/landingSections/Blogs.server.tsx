// components/landingSections/Blogs.server.tsx
import React from "react";
import { API_URL } from "../utils/BASE_URL";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";

type RawBlog = any;
type Blog = {
  id: string | number;
  title: string;
  slug: string;
  featuredImage?: string;
  createdAt?: string;
  author?: string;
  excerpt?: string;
};

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  const namedEntities: Record<string, string> = {
    nbsp: " ",
    lt: "<",
    gt: ">",
    amp: "&",
    quot: '"',
    apos: "'",
  };

  str = str.replace(/&([a-zA-Z]+);/g, (_m, name) => {
    if (namedEntities[name]) return namedEntities[name];
    return `&${name};`;
  });

  str = str.replace(/&#(\d+);/g, (_m, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return "";
    }
  });

  str = str.replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return "";
    }
  });

  return str;
}

function stripHtmlTags(input: string): string {
  if (!input) return "";
  let s = decodeHtmlEntities(input);
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const list: RawBlog[] = Array.isArray(json) ? json : json?.list ?? json?.data ?? [];

    const blogs = (list || [])
      .map((b: RawBlog, i: number) => {
        const rawContent = b?.content ?? b?.excerpt ?? b?.description ?? "";
        const decoded = typeof rawContent === "string" ? decodeHtmlEntities(rawContent) : "";
        const plain = stripHtmlTags(decoded);

        const excerpt =
          plain.length > 300 ? plain.slice(0, 200).trimEnd().replace(/\s+\S*$/, "") + "..." : plain;

        return {
          id: b?.id ?? b?._id ?? i,
          title: b?.title ?? "Untitled",
          slug: b?.slug ?? `no-slug-${i}`,
          featuredImage: b?.featuredImage ?? b?.image ?? "/placeholder.svg",
          createdAt: b?.createdAt ?? b?.publishedAt ?? null,
          author: b?.__author__?.name ?? b?.author ?? null,
          excerpt,
        } as Blog;
      })
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

    return blogs;
  } catch (err) {
    console.error("Blogs fetch error:", err);
    return [];
  }
}

export default async function Blogs() {
  const blogs = await fetchBlogs();
  const visible = blogs.slice(0, 6);

  return (
    <section id="blogs-section" className="max-w-[1440px] mx-auto p-4 md:p-8" aria-labelledby="blogs-heading">
      <div className="h-full mx-auto">
        <h1 id="blogs-heading" className="text-[35px] text-gray-800 font-bold mb-8" style={{ fontSize: "clamp(24px, 1vw, 35px)" }}>
          Blogs
        </h1>

        {visible.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No Blogs Available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map((post) => (
              <article key={post.id} className="sha flex bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border-2 border-[#8BC34B]">
                <a href={`/blog/${post.slug || "no-slug"}`} className="flex w-full" aria-label={post.title}>
                  {/* Image column */}
                  <div className="w-1/3 bg-purple-100 relative">
                    <img
                      src={convertToSecureUrl(post.featuredImage) || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-[10px] blog-img"
                      data-fallback="/placeholder.svg"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-2/3 p-6">
                    <h2 className="text-[18.18px] text-gray-800 font-semibold mb-2 line-clamp-2" style={{ fontSize: "clamp(14px, 1vw, 18.18px)" }}>
                      {post.title}
                    </h2>

                    <div className="flex items-center gap-2 text-[12.73px] text-gray-600 mb-3" style={{ fontSize: "clamp(10px, 1vw, 12px)" }}>
                      <span className="capitalize">{post.author ?? "Author"}</span>
                      <span>•</span>
                      <span>
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Unknown Date"}
                      </span>
                    </div>

                    {post.excerpt && <p className="text-sm text-gray-700 line-clamp-3">{post.excerpt}</p>}
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
