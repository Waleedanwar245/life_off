import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "About Us | LiveOffCoupon - Your Source for the Best Discount Codes",
    description: "Learn about LiveOffCoupon – your go-to platform for the latest verified coupon codes, promo deals, and discounts from top brands. We help you save every day!",
    openGraph: {
        title: "About Us | LiveOffCoupon",
        description: "Discover how LiveOffCoupon helps you save with verified coupons and exclusive promo deals from your favorite brands.",
        url: "https://liveoffcoupon.com/about-us",
        type: "website",
        images: [
            {
                url: "https://liveoffcoupon.com/logo.svg",
                width: 1200,
                height: 630,
                alt: "LiveOffCoupon",
            },
        ],
    },
    alternates: {
        canonical: "https://liveoffcoupon.com/about-us",
    },
    other: {
        "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
    },
}

export default function AboutUsSection() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "LiveOffCoupon",
                        "url": "https://liveoffcoupon.com/",
                        "logo": "https://liveoffcoupon.com/logopng.png",
                        "sameAs": [
                            "https://www.facebook.com/liveoffcoupons",
                            "https://www.instagram.com/liveoffcoupon/"
                        ],
                        "description": "LiveOffCoupon helps users save with the latest promo codes, discounts, and verified coupons across a wide range of categories.",
                    }),
                }}
            />

            <div className="max-w-6xl mx-auto px-6 py-10 mt-[100px]">
                {/* Hero Section */}
                <div className="mb-8 text-start">
                    <h1 className="text-4xl font-bold mb-4">The Promo Codes & Coupons Are Just A Click Away!</h1>
                    <p className="text-gray-700 max-w-3xl ">
                        Who doesn't like discounts? But hunting down the best deals and promotions requires time and effort. With
                        LiveOffCoupon, you need not worry because we do the searching and present you with the best discounts and
                        coupon codes from top brands.
                    </p>
                </div>

                {/* About LiveOffCoupons Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="md:w-3/5">
                        <h2 className="text-2xl font-bold mb-6">About LiveOffCoupon</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                LiveOffCoupon is a dedicated platform for people who want to save on their hard-earned money while
                                shopping for daily necessities and luxuries. We work behind the scenes to gather the best promo codes,
                                seasonal offers, and limited-time sales for you.
                            </p>
                            <p>
                                Our website features coupons from different categories, such as clothing, accessories, toys, electronics,
                                pet care, food, automotive, and costumes, so you can save big on every item. We add the latest coupons and
                                promo codes from different brands and retail shops daily to get maximum discounts on each product you wish
                                to purchase.
                            </p>
                            <p>
                                LiveOffCoupon isn't just another coupon website. We are a team that works to find only available, verified
                                coupons and legitimate deals, so you won't get frustrated with expired coupons and fake promos while
                                checking out. We constantly provide the freshest deals, so you get the most current discounts.
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/5 flex justify-center items-center">
                        <div className="relative w-64 h-64">
                            <img
                                src={'/about_1.png'}
                                alt="Person with shopping items"
                                width={250}
                                height={250}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* What You'll Find Here Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="md:w-3/5">
                        <h2 className="text-2xl font-bold mb-6">What You'll Find Here</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                We bring you a variety of saving opportunities like coupon codes, discount deals, special seasonal
                                discounts, exclusive holiday offers, and time-limited promotions.
                            </p>
                            <p>
                                Each brand and retail shop has different offers, whether it's their anniversary, a public holiday, or any
                                event that needs celebration. You don't have to keep track of sales and discounts on brands because every
                                latest promotion and offer can be found here.
                            </p>
                            <p>
                                All you need to do is copy the coupon code of your choice and paste it during the checkout process on the
                                dedicated brand website, and you will receive amazing discounts on your selected items.
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/5 flex justify-center items-center">
                        <div className="relative w-64 h-64">
                            <img
                                src={'/about_2.png'}
                                alt="Person with shopping items"
                                width={250}
                                height={250}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Partnering with the Best Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="md:w-full">
                        <h2 className="text-2xl font-bold mb-6">Partnering with the Best for Your Savings</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                LiveOffCoupon is not just about finding the best deals for you. We create meaningful partnerships with the
                                top brands so we can be the first ones to get hold of their discounts. Our strong relationships with
                                trusted retailers give us access to promo codes and coupons that you won't find anywhere else.
                            </p>
                            <p>
                                These collaborations allow us to share unique discounts, seasonal offers, and special holiday promotions,
                                which give you a front-row seat to the best deals in the market. After all, it's about making sure you
                                save more, while we connect you with the brands you love.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}