import Link from "next/link"
import Image from "next/image"
import { FaCalendarAlt } from "react-icons/fa"
import { formatDate } from "../utils/formatDate"
import { convertToSecureUrl } from "../utils/convertToSecureUrl"
import dynamic from "next/dynamic"
import { API_URL } from "../utils/BASE_URL"
import SafeHtml from "../utils/SafeHtml"

// Types
interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    featuredImage: string
    createdAt: string
    isTrending: boolean
}

interface BlogsResponse {
    list: BlogPost[]
}

// Fetch trending blogs
async function getTrendingBlogs(): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/blogs`, {
            next: { revalidate: 10 }, // Revalidate every hour
        })

        if (!res.ok) {
            throw new Error("Failed to fetch trending blogs")
        }

        return res.json()
    } catch (error) {
        console.error("Error fetching trending blogs:", error)
        return { list: [] }
    }
}

export default async function RelatedBlogs({ blogData }: { blogData: any }) {
    const data = await getTrendingBlogs()

    // Filter trending articles
    const featuredArticles =
        data
            ?.filter((item: any) => item?.isTrending)
            ?.slice(0,4).map((item: any) => ({
                id: item?.id || "",
                title: item?.title || "Untitled",
                image: item?.featuredImage || "/placeholder.svg?height=96&width=96",
                publishedDate: formatDate(item.createdAt),
                slug: item?.slug || "",
            })) || []

    return (
        <div className="mx-auto px-4 py-8 mt-56 ">

                <h2 className="text-xl font-bold mb-4 ">TRENDING</h2>

                <div className="space-y-4">
                    {featuredArticles.length > 0 ? (
                        featuredArticles.map((article: any) => (
                            <Link
                                href={`/blog/${article.slug}`}
                                key={article.id}
                                className="cursor-pointer flex gap-3 border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="relative w-24 h-24">
                                    <img
                                        src={convertToSecureUrl(article.image) || "/placeholder.svg"}
                                        alt={article.title}
                                        // fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>
                                <div className="p-2">
                                    <h3 className="font-medium text-sm">{article.title}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <FaCalendarAlt className="mr-1" />
                                        <span>Published {article.publishedDate}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No trending articles found.</p>
                    )}
                </div>
        </div>
    )
}
