import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { I18nProvider } from "@/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: {
    default: "GreenCard.ai - Modern Immigration Legal Services",
    template: "%s | GreenCard.ai",
  },
  description: "Navigate your US immigration journey with advanced technology. Get visa assessments, timeline predictions, cost estimates, and personalized guidance.",
  keywords: [
    "green card", "immigration", "visa", "immigration lawyer",
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
    title: "GreenCard.ai - Modern Immigration Legal Services",
    description: "Navigate your US immigration journey with advanced technology. Visa assessments, cost estimates, and personalized guidance.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GreenCard.ai - Modern Immigration Legal Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenCard.ai - Modern Immigration Legal Services",
    description: "Navigate your US immigration journey with advanced technology.",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-white text-slate-900 antialiased`}>
        <I18nProvider>
          {children}
          <Analytics />
          <WhatsAppButton />
        </I18nProvider>
      </body>
    </html>
  );
}
