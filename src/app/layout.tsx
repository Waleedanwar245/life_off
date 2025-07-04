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
  weight: ["300", "400", "500", "600", "700"], // Choose required weights
  variable: "--font-montserrat", // Creates a CSS variable
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
    icon: "/logo1.svg", // ✅ Add your favicon here
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
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta name='impact-site-verification' value='b3c2df1a-6452-410f-9559-d6778508cca3'>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <ThemeProvider>
          <Toaster />
          <Navbar />
          <ToastContainer position="bottom-right" autoClose={3000} />
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
