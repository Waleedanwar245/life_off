"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { BiSearch, BiMenu, BiX } from "react-icons/bi"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

// Define paths object to replace the imported PATH
const PATH = {
  LANDING_PAGE: "/",
  STORE: "/stores",
  SINGLE_STORE: "/store/:id",
  ALL_CATEGORY: "/categories",
  SHIPPING_PAGE: "/free-shipping",
  ALL_BLOG: "/blogs",
}

// NavLink component for consistent styling
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="text-[16px] font-medium text-white hover:text-gray-200 transition-colors">
      {children}
    </Link>
  )
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [filteredStores, setFilteredStores] = useState<any[]>([])
  const [storeLoading, setStoreLoading] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 1024px is the lg breakpoint in Tailwind
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close dropdown when clicking outside - only on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close dropdown on click outside on mobile
      if (
        isMobile &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile])

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Show dropdown when search term is not empty
  useEffect(() => {
    if (searchTerm) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [searchTerm])

  // Fetch stores when debounced search term changes - direct API call
  useEffect(() => {
    const fetchStores = async () => {
      if (!debouncedSearchTerm) {
        setFilteredStores([])
        return
      }

      setStoreLoading(true)
      try {
        // Direct API call to the external endpoint
         const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://liveoffcoupon.com/api"
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        const response = await fetch(
          `${apiUrl}/store/search?name=${encodeURIComponent(debouncedSearchTerm)}&page=1&pageSize=10`,
        )

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        setFilteredStores(data?.data?.slice(0, 3) || [])
      } catch (error) {
        console.error("Error fetching stores:", error)
        setFilteredStores([])
      } finally {
        setStoreLoading(false)
      }
    }

    fetchStores()
  }, [debouncedSearchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // Don't close dropdown on desktop when submitting search
    if (isMobile) {
      setShowDropdown(false)
    }
    // Navigate to search results page or handle search submission
    console.log("Search submitted:", searchTerm)
    // You can add navigation to search results page here
    // router.push(`/search?q=${searchTerm}`)
  }

  const navigateToStore = (storeSlug: string) => {
    const navigateUrl = PATH.SINGLE_STORE.replace(":id", storeSlug || "no-slug")
    router.push(navigateUrl)
  }

  const handleStoreClick = (store: any) => {
    // Get the slug with fallbacks
    const storeSlug = store?.slug || store?.storeId || store?.id || "no-slug"
    console.log("Store clicked:", store)
    console.log("Using slug:", storeSlug)

    // First update the UI - always close dropdown when a store is clicked
    setSearchTerm(store.name || "")
    setShowDropdown(false)

    // Then navigate
    navigateToStore(storeSlug)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setShowDropdown(false)
  }

  return (
    <nav className="max-w-[5500px] mx-auto fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="bg-[#96C121] text-white text-sm py-2 text-center flex justify-center items-center space-x-6">
        <span className="hidden md:block">🚀 Join our community for exclusive offers:</span>
        <span className="block md:hidden">🚀 Join us</span>

        <a
          href="https://www.facebook.com/groups/682522187479639"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer flex items-center space-x-2 underline hover:text-[#000] transition-colors"
          aria-label="Join our Facebook group"
        >
          <Image src="/fb_icon.svg" alt="Facebook icon" width={20} height={20} className="w-5 h-5" />
          <span>Facebook</span>
        </a>

        <span>|</span>

        <a
          href="https://whatsapp.com/channel/0029VbAVudTBvvscwNFt253w"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer flex items-center space-x-2 underline hover:text-[#000] transition-colors"
          aria-label="Join our WhatsApp group"
        >
          <Image src="/whatapp-icon.svg" alt="WhatsApp icon" width={20} height={20} className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Desktop Navbar */}
      <div className="h-[65px] hidden lg:flex">
        {/* Left side with white background */}
        <div onClick={() => router.push(PATH.LANDING_PAGE)} className="cursor-pointer bg-white flex items-center px-8">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} className="h-12 w-auto" />
        </div>

        {/* Rest of navbar with dark background */}
        <div className="flex-1 bg-[#14303B] flex items-center justify-between px-8">
          {/* Center navigation */}
          <div className="flex-1 flex items-center justify-center space-x-8">
            <NavLink href={PATH.STORE}>Stores</NavLink>
            <NavLink href={PATH.ALL_CATEGORY}>Categories</NavLink>
            <NavLink href={PATH.SHIPPING_PAGE}>Free Shipping</NavLink>
            <NavLink href={PATH.ALL_BLOG}>Savings Tips</NavLink>
          </div>

          {/* Right side - Search */}
          <div className="flex items-center space-x-4 ml-auto">
            <div className="relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Store Here"
                  className="max-w-[280px] pl-4 pr-12 py-2 border-none focus:outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => searchTerm && setShowDropdown(true)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-12 top-0 h-full px-2 text-gray-500 hover:text-gray-700"
                  >
                    <BiX className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="absolute right-0 top-0 h-full px-4 bg-[#96C121] text-white"
                >
                  <BiSearch className="h-5 w-5" />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50"
                >
                  <div className="p-2 font-semibold text-gray-700 border-b">Stores</div>
                  <div>
                    {storeLoading ? (
                      <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : filteredStores.length > 0 ? (
                      filteredStores.map((store: any) => (
                        <div
                          key={store.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleStoreClick(store)
                            return false
                          }}
                        >
                          {store.name}
                        </div>
                      ))
                    ) : debouncedSearchTerm ? (
                      <div className="p-3 text-center text-gray-500">No stores found</div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar - New stacked design */}
      <div className="lg:hidden flex flex-col">
        {/* Logo centered at top */}
        <div
          onClick={() => router.push(PATH.LANDING_PAGE)}
          className="cursor-pointer bg-white flex justify-center py-4"
        >
          <Image src="/logo.svg" alt="Logo" width={48} height={48} className="h-12 w-auto" />
        </div>

        {/* Search bar and menu toggle on second line */}
        <div className="bg-[#14303B] flex items-center p-4">
          {/* Search bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Store Here"
              className="w-full pl-4 pr-12 py-2 border-none focus:outline-none focus:ring-0"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => searchTerm && setShowDropdown(true)}
              ref={searchInputRef}
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-[#96C121] text-white" onClick={handleSearchSubmit}>
              <BiSearch className="h-5 w-5" />
            </button>

            {/* Mobile Search Results Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50"
              >
                <div className="p-2 font-semibold text-gray-700 border-b">Stores</div>
                <div>
                  {storeLoading ? (
                    <div className="p-3 text-center text-gray-500">Loading...</div>
                  ) : filteredStores.length > 0 ? (
                    filteredStores.map((store: any) => (
                      <div
                        key={store.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleStoreClick(store)
                          return false
                        }}
                      >
                        {store.name}
                      </div>
                    ))
                  ) : debouncedSearchTerm ? (
                    <div className="p-3 text-center text-gray-500">No stores found</div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Menu toggle */}
          <button className="text-white p-2 ml-4" onClick={() => setMenuOpen(!menuOpen)}>
            <BiMenu className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#14303B] p-4 absolute w-full left-0 z-50 shadow-lg">
          <ul className="flex flex-col space-y-4">
            <li>
              <NavLink href={PATH.STORE}>Stores</NavLink>
            </li>
            <li>
              <NavLink href={PATH.ALL_CATEGORY}>Categories</NavLink>
            </li>
            <li>
              <NavLink href={PATH.SHIPPING_PAGE}>Free Shipping</NavLink>
            </li>
            <li>
              <NavLink href={PATH.ALL_BLOG}>Savings Tips</NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
