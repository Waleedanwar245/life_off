import type { Metadata } from 'next'
import { FaCircle } from "react-icons/fa"

export const metadata: Metadata = {
  title: "Privacy Policy | LiveOffCoupon - Your Data, Our Responsibility",
  description: "Read LiveOffCoupon's Privacy Policy to understand how we collect, use, and protect your personal data when you use our platform.",
  openGraph: {
    title: "Privacy Policy | LiveOffCoupon",
    description: "Understand how LiveOffCoupon ensures your data privacy and security through our comprehensive Privacy Policy.",
    url: "https://liveoffcoupon.com/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://liveoffcoupon.com/logo.svg",
        width: 1200,
        height: 630,
        alt: "LiveOffCoupon Privacy",
      },
    ],
  },
  alternates: {
    canonical: "https://liveoffcoupon.com/privacy-policy",
  },
  other: {
    "google-site-verification": "jun25llOGzjnJpsoK3-Qvha-gL5rLMR73W68lVU-h6M",
  },
}

export default function PrivacyPolicy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "url": "https://liveoffcoupon.com/privacy-policy",
            "logo": "https://liveoffcoupon.com/logo200.png",
            "description": "Details on how LiveOffCoupon collects, uses, and protects your personal information."
          }),
        }}
      />

      <div className="mt-[100px] max-w-[1000px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
        <p className="text-sm text-green-600 mb-6">Effective Date: April 20, 2025</p>

        <div className="space-y-4 text-gray-700">
          <p>
            At LiveOffCoupon! We are dedicated to helping you save money by providing the latest coupons and codes from
            a variety of brands. Our goal is to make it easy for you to find and use discounts on your favorite products
            and services. We work with different brands to bring you the best offers, so you can shop smarter and save
            more.
          </p>

          <p>
            In addition to offering great deals, we also allow our users to submit their own coupons to share with the
            community. By enabling users to contribute, we strive to create a platform where everyone can benefit from
            exclusive discounts and promotions.
          </p>

          <p>
            We value your privacy and are committed to being transparent about how we collect, use, and protect your
            information. This Privacy Policy outlines our data collection and usage practices when you visit our
            website.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Information We Collect</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            We do not collect personal information such as names, addresses, phone numbers, or payment details. However,
            we may collect certain non-personal information to improve user experience, including:
          </p>

          <ul className="space-y-6 mt-4">
            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Cookies and tracking technologies to analyze site usage and performance</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Aggregated data on how visitors interact with our website</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Browser type, device information, and IP addresses (anonymized where possible)</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">How We Use Collected Information</h2>

        <div className="space-y-4 text-gray-700">
          <p>We use the information collected to:</p>

          <ul className="space-y-6 mt-4">
            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Improve website functionality and user experience</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Analyze trends and website performance</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Display relevant deals and coupons</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Detect and prevent fraudulent activities</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Ensure website security and integrity</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Submit Coupons</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            We allow users to submit their own coupons to share with the community. If you choose to submit a coupon,
            you may be required to provide certain details, such as:
          </p>

          <ul className="space-y-6 mt-4">
            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Your name (optional or required, depending on submission settings)</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Email address (to verify submissions or contact if needed)</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Coupon details, including brand, discount, and expiration date</span>
            </li>
          </ul>

          <p className="mt-6">
            We reserve the right to review, edit, or remove any submitted coupons that do not comply with our terms.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Coupon and Brand Partnerships</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            LiveOffCoupon provides coupons and promotional codes for a variety of brands. While we try to keep our
            offers up-to-date, we do not control third-party coupons' terms, validity, or availability. Users should
            verify deals directly with the respective brands before making a purchase.
          </p>
          <p>
            Our partnerships with different brands may involve affiliate links, which means we may earn a commission
            when you use our coupons or links to make a purchase. This does not affect the price you pay or the validity
            of the offer.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Third-Party Services</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            Our website may contain links to third-party websites or services that have their privacy policies. We do
            not control these third parties and encourage you to review their policies before interacting with their
            services.
          </p>
          <p>
            We may also use third-party analytics and advertising services, which may use cookies or other tracking
            technologies to serve relevant advertisements and analyze visitor behavior.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Cookies and Tracking Technologies</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            We use cookies and similar tracking technologies to improve your experience on LiveOffCoupon. These
            technologies help us:
          </p>

          <ul className="space-y-6 mt-4">
            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Remember user preferences and settings</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Deliver relevant advertisements</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Track and measure site performance</span>
            </li>
          </ul>

          <p className="mt-6">
            You can adjust your browser settings to manage or disable cookies, which may affect certain website
            functionalities.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Newsletter and Direct Marketing</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            If you choose to subscribe to our newsletter, we may send you promotional emails about the latest deals,
            coupons, and offers. You can unsubscribe at any time by clicking the "Unsubscribe" link in our emails or
            adjusting your account settings to match your preferences.
          </p>
          <p>
            We may use collected information to send you direct marketing messages, including special promotions and
            updates about LiveOffCoupon. You have the option to receive these communications at any time by following
            the instructions provided in the messages or by contacting us directly.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Data Security and Retention</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            We take reasonable measures to protect any collected information from unauthorized access or misuse. We
            implement industry-standard security measures such as encryption and firewall protection to safeguard data.
          </p>
          <p>
            We retain non-personal data for as long as necessary to fulfill the purposes outlined in this Privacy
            Policy. Any retained data is anonymized and used solely for analytical and operational purposes.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Age Restriction</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            LiveOffCoupon is intended for general audiences. We do not knowingly collect any information from
            individuals under 18 years of age. If you believe a minor has provided information to us, please contact us,
            and we will take appropriate action.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Your Rights and Choices</h2>

        <div className="space-y-4 text-gray-700">
          <p>You have the right to:</p>

          <ul className="space-y-6 mt-4">
            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Opt-out of cookies through browser settings</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Disable third-party tracking via ad settings</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Unsubscribe from marketing emails and newsletters</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Request the removal of any personal data you have provided</span>
            </li>

            <li className="flex">
              <FaCircle className="h-2 w-2 mt-2 mr-3 flex-shrink-0" />
              <span>Contact us for any questions regarding data use</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Updates to This Policy</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and your
            continued use of our website constitutes acceptance of the revised policy.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Contact Us</h2>

        <div className="space-y-4 text-gray-700">
          <p>
            If you need to provide us with information, or feedback, or have any questions, you may be required to
            provide your name and email address. This allows us to respond to your inquiry effectively. We will not use
            your email for marketing purposes unless you have opted in.
          </p>
          <p>For any inquiries, please contact us at:</p>
          <p>Email: info@liveoffcoupon.com</p>
        </div>
      </div>
    </>
  )
}