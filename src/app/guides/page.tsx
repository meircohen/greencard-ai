"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface GuideCard {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const guides: GuideCard[] = [
  {
    slug: "marriage-green-card",
    title: "Green Card Through Marriage: Complete Checklist",
    description:
      "Step-by-step guide to obtaining a green card through marriage to a U.S. citizen. Covers required documents, marriage proof requirements, the filing process, conditional green card status, and red flags USCIS looks for.",
    category: "Marriage-Based Immigration",
  },
  {
    slug: "i-485-guide",
    title: "I-485 Adjustment of Status",
    description:
      "Step-by-step guide to filing Form I-485 to adjust status to permanent resident. Covers eligibility, required documents, the 7-step filing process, cost breakdown ($1,440), and what to expect during processing (18-36 months).",
    category: "Green Card Application",
  },
];

const categories = Array.from(new Set(guides.map((g) => g.category)));

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-20">
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
      <Footer />
    </>
  );
}
