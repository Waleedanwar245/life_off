import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms & Conditions | LiveOffCoupon - Know Your Rights",
  description: "Explore the terms and conditions for using LiveOffCoupon. Understand your rights, responsibilities, and our service guidelines.",
  openGraph: {
    title: "Terms & Conditions | LiveOffCoupon",
    description: "Get familiar with LiveOffCoupon's terms of service, usage guidelines, and your obligations as a user.",
    url: "https://liveoffcoupon.com/terms-conditions",
    type: "website",
    images: [
      {
        url: "https://liveoffcoupon.com/logo.svg",
        width: 1200,
        height: 630,
        alt: "LiveOffCoupon Terms",
      },
    ],
  },
  alternates: {
    canonical: "https://liveoffcoupon.com/terms-conditions",
  },
  other: {
    "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
  },
}

export default function TermsOfUse() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms and Conditions",
            "url": "https://liveoffcoupon.com/terms-conditions",
            "description": "Legal terms and user agreement for accessing and using the LiveOffCoupon platform."
          }),
        }}
      />

      <div className="mt-[100px] max-w-[1000px] mx-auto px-4 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <p className="text-sm mb-6">Last Updated: 18/03/2025</p>
        <p className="mb-6 text-sm">
          By accessing or using the website www.liveoffcoupon.com (the "Site"), you agree to comply with and be bound by
          these Terms of Use. Please read them carefully. If you do not agree with any part of these Terms, you should
          refrain from using the Site.
        </p>
        <h2 className="text-xl font-bold mb-3">Use of the Site</h2>
        <p className="mb-6 text-sm">
          The Site provides information related to discount codes, promo offers, and deals for various brands and
          retailers. The Site is intended solely for browsing and informational purposes. You may use the Site to view and
          access this information. However, you are not allowed to use the Site for any unlawful purpose or to engage in
          activities that may harm or disrupt the Site's functionality or other users' experience. You are solely
          responsible for any content or actions related to using the Site.
        </p>
        <h2 className="text-xl font-bold mb-3">Accuracy of Information</h2>
        <p className="mb-6 text-sm">
          While LiveOffCoupon strives to provide accurate, up-to-date information related to discount codes and
          promotional offers from different brands, we cannot guarantee the accuracy, validity, or availability of any
          information listed on the Site. The offers and promo codes listed may expire, change, or become unavailable
          without notice. You acknowledge that LiveOffCoupon is not responsible for any inaccuracies or discrepancies in
          the information presented.
        </p>
        <h2 className="text-xl font-bold mb-3">External Links</h2>
        <p className="mb-6 text-sm">
          The Site may contain links to third-party websites or resources that are not controlled or maintained by
          LiveOffCoupon. These links are provided solely for your convenience. LiveOffCoupon is not responsible for the
          content or availability of these external sites. You can access these third-party sites at your own risk.
        </p>
        <h2 className="text-xl font-bold mb-3">Limitation of Liability</h2>
        <p className="mb-6 text-sm">
          LiveOffCoupon or its affiliates will not be liable for any direct, indirect, incidental, special, or
          consequential damages arising from your use or inability to use the Site or from any content on the Site,
          including, without limitation, any errors or omissions in the information, viruses, or other harmful components
          that may affect your device.
        </p>
        <h2 className="text-xl font-bold mb-3">Indemnification</h2>
        <p className="mb-6 text-sm">
          You agree to indemnify, defend, and hold harmless LiveOffCoupon, its affiliates, and employees from and against
          any claims, actions, damages, losses, costs, and expenses (including legal fees) arising from your use of the
          Site, your violation of these Terms of Use, or your violation of any rights of third parties.
        </p>
        <h2 className="text-xl font-bold mb-3">Intellectual Property</h2>
        <p className="mb-6 text-sm">
          All content on the Site, including but not limited to text, images, graphics, logos, and other material, is the
          property of LiveOffCoupon and is protected by copyright, trademark, and other intellectual property laws. You
          may not use, copy, or distribute any content from the Site without the express written permission of
          LiveOffCoupon.
        </p>
        <h2 className="text-xl font-bold mb-3">Termination</h2>
        <p className="mb-6 text-sm">
          LiveOffCoupon reserves the right to terminate any user to avail the Site's services at any time, without any
          notice, including but not limited to violating the Term of Use. Upon termination, all rights granted to you will
          be ceased, and you will not be allowed to avail of any services or offers provided by this Site.
        </p>
        <h2 className="text-xl font-bold mb-3">Coupon Submission</h2>
        <p className="mb-6 text-sm">
          LiveOffCoupon allows users to submit coupons to the Site and reserves the right, in its sole discretion, to
          review, approve, or reject any coupon submission. Any coupons you provide are non-confidential and the sole
          property of LiveOffCoupon. You grant LiveOffCoupon a non-exclusive right to use, display, and distribute the
          coupon on our Site and through other marketing channels.
        </p>
        <h2 className="text-xl font-bold mb-3">Changes to the Terms</h2>
        <p className="mb-6 text-sm">
          LiveOffCoupon reserves the right to modify these Terms of Use at any time without prior notice. Any changes to
          the Terms will be posted on this page, and your continued use of the Site after any such changes constitutes
          your acceptance of the updated Terms.
        </p>
        <h2 className="text-xl font-bold mb-3">Contact Information</h2>
        <p className="mb-6 text-sm">
          If you have any questions or concerns about these Terms of Use, please email us at{" "}
          <a href="mailto:info@liveoffcoupon.com" className="text-green-600 hover:underline">
            info@liveoffcoupon.com
          </a>
          .
        </p>
        <p className="mt-8 pt-4 border-t border-gray-200 text-sm font-medium">
          By continuing to use the Site, you acknowledge that you have read, understood, and agree to these Terms of Use.
        </p>
      </div>
    </>
  )
}