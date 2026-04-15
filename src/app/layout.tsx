import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: {
    default: "GreenCard.ai - AI-Powered Immigration Platform",
    template: "%s | GreenCard.ai",
  },
  description: "Navigate your US immigration journey with AI assistance. Get visa assessments, timeline predictions, cost estimates, and personalized guidance.",
  keywords: [
    "green card", "immigration", "visa", "AI", "immigration lawyer",
    "I-485", "I-130", "EB-1A", "USCIS", "RFE", "adjustment of status",
    "immigration assessment", "visa bulletin", "processing times",
  ],
  authors: [{ name: "GreenCard.ai" }],
  creator: "GreenCard.ai",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: { "en-US": "/en", "es-US": "/es" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "GreenCard.ai",
    title: "GreenCard.ai - AI-Powered Immigration Platform",
    description: "Navigate your US immigration journey with AI. Visa assessments, cost estimates, and personalized guidance.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GreenCard.ai - Your AI Immigration Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenCard.ai - AI-Powered Immigration Platform",
    description: "Navigate your US immigration journey with AI assistance.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-midnight text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
