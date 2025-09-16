"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { API_URL } from "../utils/BASE_URL";

const PATH = {
  SINGLE_BLOG: "/blog/:id",
};

export default function BlogLayout({ data }: any) {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper: normalize API response to an array of posts
  const normalize = (raw: any) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (raw.list && Array.isArray(raw.list)) return raw.list;
    // if API returns { data: [...] } or other shapes, try to find an array
    if (raw.data && Array.isArray(raw.data)) return raw.data;
    return [];
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllBlogs = async () => {
      setIsLoading(true);
      try {
        // Try the "all blogs" endpoint first
        const endpoints = [`${API_URL}/blogs`, `${API_URL}/blogs/latest`];

        let responseData: any = null;
        for (const url of endpoints) {
          try {
            const res = await fetch(url, { signal });
            if (!res.ok) {
              // try next endpoint
              continue;
            }
            responseData = await res.json();
            break;
          } catch (err) {
            // fetch failed (network/abort or 4xx/5xx) — try next endpoint
            if (signal.aborted) throw err;
            continue;
          }
        }

        const posts = normalize(responseData);

        // Sort newest -> oldest by createdAt
        posts.sort((a: any, b: any) => {
          const ta = new Date(a.createdAt).getTime() || 0;
          const tb = new Date(b.createdAt).getTime() || 0;
          return tb - ta;
        });

        setLatestPosts(posts);
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
        setLatestPosts([]);
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    fetchAllBlogs();

    return () => controller.abort();
  }, []);

  const posts = latestPosts || [];
  const authorDetails = data?.[0]?.__author__ || null;

  // Navigate to a blog post
  const navigateToBlog = (slug: string) => {
    router.push(PATH.SINGLE_BLOG.replace(":id", slug || "no-slug"));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Latest Posts Section */}
      <div className="my-8">
        <h2 className="text-center text-[19.03px] text-gray-800 font-semibold uppercase tracking-wider mb-8">
          Latest Posts
        </h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#7FA842] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <div
                key={post.id || post.slug || Math.random()}
                onClick={() => navigateToBlog(post?.slug || "no-slug")}
                className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="overflow-hidden relative h-48">
                  <img
                    src={convertToSecureUrl(post.featuredImage) || "/images/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 transition-colors">
                    {post.title}
                  </h3>
                  <div className="text-sm font-medium mb-2 text-[#7FA842]">
                    {post?.category?.categoryTitle || "General"}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaCalendarAlt className="mr-2" />
                    <span>Published {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
