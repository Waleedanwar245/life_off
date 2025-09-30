import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google"; // Import Montserrat
import "./globals.css";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../context/ThemeContext";
import 'antd/dist/reset.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LiveOffCoupon - Get Best Deals, Coupons & Discounts Online",
  description:
    "Find the latest coupons, discounts, and top deals on LiveOffCoupon. Save money on your favorite brands every day!",
  icons: {
    icon: "/logo1.svg",
  },
};

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://liveoffcoupon.com/#organization",
      name: "LiveOffCoupon",
      url: "https://liveoffcoupon.com",
      logo: {
        "@type": "ImageObject",
        url: "https://liveoffcoupon.com/logo.png"
      },
      sameAs: [
        "https://www.facebook.com/liveoffcoupon",
        "https://twitter.com/liveoffcoupon",
        "https://www.instagram.com/liveoffcoupon"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://liveoffcoupon.com/#website",
      url: "https://liveoffcoupon.com",
      name: "LiveOffCoupon",
      publisher: {
        "@id": "https://liveoffcoupon.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://liveoffcoupon.com/#webpage",
      url: "https://liveoffcoupon.com",
      name: "LiveOffCoupon",
      description: "Find the latest coupons, discounts, and top deals on LiveOffCoupon.",
      inLanguage: "en-US",
      isPartOf: {
        "@id": "https://liveoffcoupon.com/#website"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
      
        {/* Impact Site Verification */}
        <meta name="impact-site-verification" content="2d2a195a-5071-411f-aa3a-fcaf4a305391" />
        <meta name="lhverifycode" content="32dc01246faccb7f5b3cad5016dd5033" />
        <meta name="impact-site-verification" content="2b1a2ed1-b061-470c-9954-733206903f12" />
        <meta name="fo-verify" content="804a9314-2d5e-402e-9f40-a1813c92647d" />
        <link rel="alternate" href="https://liveoffcoupon.com/" hreflang="en-us" />


        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                // Ensure html has no "dark" class before CSS paints
                document.documentElement.classList.remove('dark');
                // Persist that we are forcing light
                localStorage.setItem('theme', 'light');
              } catch(e) { /* ignore storage errors */ }
            })();`,
          }}
        />
  
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K33DHQPK');`,
          }}
        />
        {/* End Google Tag Manager */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K33DHQPK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider>
          <Toaster />
          <Navbar />
          <ToastContainer position="bottom-right" autoClose={3000} />
          {children}
          <Footer />
        </ThemeProvider>

      </body>
    </html>
  );
}
