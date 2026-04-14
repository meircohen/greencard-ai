import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GreenCard.ai - AI-Powered Immigration Platform",
  description: "Navigate your US immigration journey with AI assistance. Get visa assessments, timeline predictions, cost estimates, and personalized guidance.",
  keywords: ["green card", "immigration", "visa", "AI", "immigration lawyer"],
  authors: [{ name: "GreenCard.ai" }],
  creator: "GreenCard.ai",
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
