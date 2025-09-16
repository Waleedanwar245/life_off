"use client"

import { useRef, useEffect, useState } from "react"
import { FiClock, FiCheck, FiPlus } from "react-icons/fi"
import { BsInfoCircle } from "react-icons/bs"

export default function CouponTabs() {
    const couponsRef = useRef<HTMLDivElement>(null)
    const storeInfoRef = useRef<HTMLDivElement>(null)
    const faqsRef = useRef<HTMLDivElement>(null)

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            // Scroll to the section with some offset for the header
            window.scrollTo({
                top: ref.current.offsetTop - 80,
                behavior: "smooth"
            })
        }
    }
    const [showDetails, setShowDetails] = useState(false);

    const [expandedId, setExpandedId] = useState<any>(null);
    const coupons = [
        {
            id: 1,
            type: "Active",
            discount: "5%",
            title: "5% Military Discounts",
            expiry: "Expires Today",
            verified: true,
            description: "This 5% military discount is available for all active and retired military personnel. Offer valid until the end of the day.",
            buttonText: "Get Deal",
        },
        {
            id: 2,
            type: "Active",
            discount: "SALE",
            title: "10 Months Payment Plan For Everybody",
            expiry: "1 Hour Today",
            verified: true,
            buttonText: "Get Deal",
        },
        {
            id: 3,
            type: "Active",
            discount: "SALE",
            title: "25 Free Hours Of Streaming Video On Sign Up",
            expiry: "1 Hour Today",
            verified: true,
            buttonText: "Get Deal",
        },
        {
            id: 4,
            type: "Unverified",
            discount: "FROM $81",
            title: "Video Single Subjects Starting From $81",
            expiry: "1 Hour Today",
            verified: false,
            buttonText: "Get Deal",
        },
        {
            id: 5,
            type: "Expired",
            discount: "10% OFF",
            title: "10% Off Sitewide",
            expiry: "Expired",
            verified: false,
            buttonText: "Expired",
        },
    ];

    return (
        <div className="max-w-6xl mx-auto font-sans">
            {/* Fixed Tabs */}
            <div className="sticky top-0 z-10 bg-white border-b">
                <div className="flex">
                    <button
                        onClick={() => scrollToSection(couponsRef as any)}
                        className="px-4 py-2 text-sm font-medium text-green-600 border-b-2 border-green-600"
                    >
                        Coupons
                    </button>
                    <button
                        onClick={() => scrollToSection(storeInfoRef as any)}
                        className="px-4 py-2 text-sm font-medium text-gray-600"
                    >
                        Store Info
                    </button>
                    <button
                        onClick={() => scrollToSection(faqsRef as any)}
                        className="px-4 py-2 text-sm font-medium text-gray-600"
                    >
                        FAQs
                    </button>
                </div>
            </div>

            {/* Content Sections */}
            <div>
                {/* Coupons Section */}
                <div ref={couponsRef} className="py-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-2/3">
                            {["Active", "Unverified", "Expired"].map((section) => (
                                <div key={section}>
                                    <h2 className="text-xl font-bold mb-4">{section} Coupons</h2>
                                    {coupons
                                        .filter((coupon) => coupon.type === section)
                                        .map((coupon) => {
                                            const hasDescription = coupon.description && coupon.description.trim() !== "";

                                            return (
                                                <div key={coupon.id} className="border rounded-md p-4 mb-4">
                                                    <div className="flex flex-col md:flex-row md:items-center">
                                                        <div className="flex-1">
                                                            <div className="flex items-start gap-4">
                                                                <div className="text-center">
                                                                    <div
                                                                        className={`font-bold text-xl ${section === "Expired" ? "text-gray-700" : "text-green-600"
                                                                            }`}
                                                                    >
                                                                        {coupon.discount}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-xs text-gray-500">DEAL</div>
                                                                    <div className="font-medium text-gray-800">{coupon.title}</div>
                                                                    <div className="flex items-center text-xs mt-1">
                                                                        <FiClock className="text-gray-400 mr-1" />
                                                                        <span className="text-gray-500 mr-2">{coupon.expiry}</span>
                                                                        {coupon.verified && (
                                                                            <span className="flex items-center">
                                                                                <FiCheck className="text-green-500 mr-1" />
                                                                                <span className="text-green-500">Verified</span>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 md:mt-0">
                                                            <button
                                                                className={`text-white text-sm font-medium py-1.5 px-4 rounded-md ${section === "Expired"
                                                                        ? "bg-gray-400 cursor-not-allowed"
                                                                        : "bg-gray-800 hover:bg-gray-700"
                                                                    }`}
                                                            >
                                                                {coupon.buttonText}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* See Details Button (Always Show) */}
                                                    <div
                                                        className="text-xs text-gray-600 flex items-center mt-4 pt-2 border-t cursor-pointer"
                                                        onClick={() => setExpandedId(expandedId  === coupon.id  ? null : coupon.id)}
                                                    >
                                                        <span>See Details</span>
                                                        <span className="ml-1">{expandedId === coupon.id ? "−" : "+"}</span>
                                                    </div>

                                                    {/* Expandable Section */}
                                                    {expandedId === coupon.id && (
                                                        <div className="mt-2 text-sm text-gray-700">
                                                            {hasDescription ? coupon.description : "No additional details available."}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            ))}
                        </div>

                        {/* Right sidebar */}
                        <div className="w-full lg:w-1/3">
                            <div className="border rounded-md p-4 mb-6">
                                <h3 className="font-bold text-lg mb-3">Why Trust Us?</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Not all coupon sites are created equal – that's because LeafPromoCode.com has a team and a process that sets us apart. Every day, our team of coupon hunters and deal finders scours the web for all your favorite retailers. Then our validation team tests each and every one to work overnight. After each and every one checks around the clock. From there, our merchandising team reviews each validated code and hand-picks the best coupons for our users. Our team just verified today (date's here) 24 offers for LeafPromoCode.com.
                                </p>
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Learn How We Verify Coupons
                                </a>
                            </div>

                            <div className="text-sm mb-2">leafpromocode.com</div>
                            <div className="text-sm mb-4">24 Offers Available</div>

                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Filters Offers</h3>
                                <button className="w-full bg-green-600 text-white rounded-md py-2 mb-2">
                                    All (24)
                                </button>
                                <button className="w-full bg-gray-100 text-gray-700 rounded-md py-2 mb-2">
                                    Deals (10)
                                </button>
                                <button className="w-full bg-gray-100 text-gray-700 rounded-md py-2 mb-2">
                                    Sales (3)
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-3">Similar Stores</h3>
                                <ul className="text-sm space-y-2">
                                    <li><a href="#" className="text-blue-600 hover:underline">Scholastic</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Carson Dellosa Education</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Alpha Omega Publications</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Trend Enterprises</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">BJU Press</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Rainbow Resource Center</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Sonlight</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Didax</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">UMD Stores</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">DonorChoose.org</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">FunShine Express</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3">Similar Stores</h3>
                                <ul className="text-sm space-y-2">
                                    <li><a href="#" className="text-blue-600 hover:underline">The Mailbox</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">ABCmouse</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">LakeShore Learning</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Archer and Olive</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Spellbinders</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Really Good Stuff</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">School Specialty</a></li>
                                    <li><a href="#" className="text-blue-600 hover:underline">Creative Teaching</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Store Info Section */}
                <div ref={storeInfoRef} className="py-8 border-t">
                    <h2 className="text-2xl font-bold mb-6">About A Beka Book</h2>
                    <p className="text-gray-700 mb-6">
                        A Beka Book Store is an online platform for Christian textbooks, lesson plans and teaching resources. The e-tailer not just extends and sells books but also offers educational tools and more. In addition to books and resources, Abeka also offers a video homeschool program called Abeka Academy.
                    </p>

                    <h2 className="text-2xl font-bold mb-4">A Beka Book Store Info</h2>

                    <div className="mb-6">
                        <h3 className="font-bold mb-2">A Beka Book Cancellation Policy</h3>
                        <p className="text-gray-700">
                            A Beka Book offers cancellations on video programs. To request a cancellation, contact customer service.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-2">A Beka Book Ways to Save</h3>
                        <ul className="list-disc pl-5 text-gray-700 space-y-2">
                            <li>Sign up for the A Beka Book Store email list to get special offers and news sent to your inbox</li>
                            <li>Check the "Offers" section to see current promotions, sale items</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-2">Buy Now, Pay Later at A Beka Book</h3>
                        <p className="text-gray-700">
                            A Beka Book Store offers six- and 10-monthly payment plans for orders of $150 or more for a fee.
                        </p>
                    </div>
                </div>

                {/* FAQs Section */}
                <div ref={faqsRef} className="py-8 border-t">
                    <h2 className="text-2xl font-bold mb-6">A Beka Book Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <div className="border-b pb-4">
                            <button className="flex justify-between items-center w-full text-left font-bold">
                                What sales does A Beka Book Store have?
                                <FiPlus className="text-gray-500" />
                            </button>
                        </div>

                        <div className="border-b pb-4">
                            <button className="flex justify-between items-center w-full text-left font-bold">
                                What is A Beka Book Store's return policy?
                                <FiPlus className="text-gray-500" />
                            </button>
                        </div>

                        <div className="border-b pb-4">
                            <button className="flex justify-between items-center w-full text-left font-bold">
                                Does A Beka Book Store have a free trial?
                                <FiPlus className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
