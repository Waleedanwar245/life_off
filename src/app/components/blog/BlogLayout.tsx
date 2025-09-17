// BlogLayout.tsx  (client)
"use client";

import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { convertToSecureUrl } from "../utils/convertToSecureUrl";
import { API_URL } from "../utils/BASE_URL";

const PATH = {
  SINGLE_BLOG: "/blog/:id",
};

function normalize(raw: any) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.list && Array.isArray(raw.list)) return raw.list;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  return [];
}

export default function BlogLayout({ data }: any) {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // If parent passed initial data (server-side fetched), use it immediately.
  const initialPosts = useMemo(() => normalize(data), [data]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // If we already have posts from props, use them and skip fetching.
    if (initialPosts && initialPosts.length > 0) {
      // sort newest -> oldest just in case
      const ps = [...initialPosts].sort((a: any, b: any) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
      setLatestPosts(ps);
      setIsLoading(false);
      return () => controller.abort();
    }

    // otherwise fetch from the API endpoint
    const fetchLatest = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/blogs/latest`, { signal });
        if (!res.ok) {
          console.error("Failed to fetch /blogs/latest", res.status);
          setLatestPosts([]);
          return;
        }
        const json = await res.json();
        const posts = normalize(json);
        posts.sort((a: any, b: any) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        setLatestPosts(posts);
      } catch (err) {
        if (signal.aborted) return;
        console.error("Error fetching latest blogs:", err);
        setLatestPosts([]);
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    fetchLatest();
    return () => controller.abort();
  }, [initialPosts]);

  const posts = latestPosts || [];

  const navigateToBlog = (slug: string) => {
    router.push(PATH.SINGLE_BLOG.replace(":id", slug || "no-slug"));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="my-8">
        <h2 className="text-center text-[19.03px] text-gray-800 font-semibold uppercase tracking-wider mb-8">
          Latest Posts
        </h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#7FA842] border-t-transparent rounded-full animate-spin" />
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
                    <span>
                      Published{" "}
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown"}
                    </span>
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
