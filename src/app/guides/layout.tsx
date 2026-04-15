import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immigration Guides & Resources | GreenCard.ai",
  description: "Comprehensive guides on green card applications, visa petitions, fees, processing times, and immigration timelines. Learn about I-130, I-485, I-765, N-400, and more.",
  keywords: [
    "immigration guides",
    "green card guide",
    "visa petition",
    "I-130 guide",
    "I-485 guide",
    "immigration timeline",
    "USCIS fees",
    "naturalization guide",
    "marriage green card",
  ],
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
