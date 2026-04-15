import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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

interface GuideCard {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const guides: GuideCard[] = [
  {
    slug: "i-130-guide",
    title: "I-130 Petition for Alien Relative",
    description:
      "Complete guide to filing Form I-130 to sponsor a family member for a U.S. green card. Learn about eligibility, documentation requirements, filing process, fees ($535), and processing times (12-24 weeks).",
    category: "Family-Based Immigration",
  },
  {
    slug: "i-485-guide",
    title: "I-485 Adjustment of Status",
    description:
      "Step-by-step guide to filing Form I-485 to adjust status to permanent resident. Covers eligibility, required documents, the 7-step filing process, cost breakdown ($1,440), and what to expect during processing (18-36 months).",
    category: "Green Card Application",
  },
  {
    slug: "i-765-guide",
    title: "I-765 Employment Authorization (Work Permit)",
    description:
      "Learn how to apply for work authorization while your green card application is pending. Covers eligibility categories, filing requirements, cost ($470 or free depending on category), and processing timeline (2-5 weeks).",
    category: "Work Authorization",
  },
  {
    slug: "i-864-guide",
    title: "I-864 Affidavit of Support (Financial Requirements)",
    description:
      "Understand the financial sponsorship requirements for green card applicants. Includes 2026 poverty guidelines, sponsor obligations, income verification, co-sponsor options, and how to prove financial capacity.",
    category: "Financial Requirements",
  },
  {
    slug: "n-400-guide",
    title: "N-400 Naturalization (Path to U.S. Citizenship)",
    description:
      "Complete guide to applying for U.S. citizenship through naturalization. Covers eligibility (5 years permanent resident status), the civics test, English requirements, 7-step process, and benefits of citizenship.",
    category: "Citizenship",
  },
  {
    slug: "green-card-timeline",
    title: "Green Card Processing Times 2026",
    description:
      "Understand how long it takes to get a green card. Detailed breakdown of processing times for family-based (6-10 months), employment-based (varies by category), visa bulletin waits, and factors affecting processing speed.",
    category: "Processing Times",
  },
  {
    slug: "marriage-green-card",
    title: "Green Card Through Marriage: Complete Checklist",
    description:
      "Step-by-step guide to obtaining a green card through marriage to a U.S. citizen. Covers required documents, marriage proof requirements, the filing process, conditional green card status, and red flags USCIS looks for.",
    category: "Marriage-Based Immigration",
  },
  {
    slug: "immigration-costs",
    title: "Immigration Cost Breakdown 2026: Every Fee Explained",
    description:
      "Complete breakdown of all immigration-related costs and fees. Includes USCIS filing fees for all major forms, cost scenarios for different cases, additional expenses, ways to reduce costs, and fee waiver information.",
    category: "Costs & Fees",
  },
];

const categories = Array.from(new Set(guides.map((g) => g.category)));

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Immigration Guides & Resources
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Comprehensive guides to help you navigate the U.S. immigration process. From green card
            applications to naturalization, find detailed information about eligibility, requirements,
            costs, and timelines.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <p className="text-sm text-slate-700">
              <strong>Disclaimer:</strong> These guides are for informational purposes only and do not
              constitute legal advice. Immigration law is complex and changes frequently. For legal advice
              specific to your situation, please consult with a qualified immigration attorney.
            </p>
          </div>
        </div>

        {/* Category Groups */}
        {categories.map((category) => {
          const categoryGuides = guides.filter((g) => g.category === category);
          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-emerald-700">
                {category}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {categoryGuides.map((guide) => (
                  <Card key={guide.slug} className="flex flex-col">
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        {guide.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {guide.description}
                      </p>
                    </div>
                    <div className="px-6 pb-6">
                      <Link href={`/guides/${guide.slug}`}>
                        <Button variant="primary" className="w-full">
                          Read Guide
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-8 md:p-12 text-center border border-emerald-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Not sure where to start?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Our free assessment will analyze your immigration situation and provide
            personalized recommendations on the best path for your green card or visa application.
          </p>
          <Link href="/assessment">
            <Button variant="primary" size="lg">
              Get Your Free Assessment
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
