import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StructuredData from "@/components/StructuredData";
import { getMinimumIncome } from "@/lib/uscis-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: "I-864 Affidavit of Support: Financial Requirements Guide 2026",
  description:
    "Complete guide to Form I-864 Affidavit of Support. Learn about income requirements, poverty guidelines, who can be a sponsor, and financial obligations.",
  keywords: [
    "I-864",
    "affidavit of support",
    "income requirements",
    "poverty guidelines",
    "sponsor",
    "financial support",
    "2026",
  ],
  openGraph: {
    title: "I-864 Affidavit of Support: Financial Requirements Guide 2026",
    description:
      "Master the I-864 with our comprehensive guide covering income requirements, sponsor obligations, and poverty guidelines.",
    type: "article",
    url: `${SITE_URL}/guides/i-864-guide`,
  },
  alternates: {
    canonical: "/guides/i-864-guide",
  },
};

export default function I864Guide() {
  const income100_4 = getMinimumIncome(4, 100) || 31200;
  const income200_4 = getMinimumIncome(4, 200) || 62400;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "I-864 Affidavit of Support: Financial Requirements Guide 2026",
    description:
      "Complete guide to Form I-864 including income requirements, poverty guidelines, sponsor qualifications, and financial obligations.",
    author: {
      "@type": "Organization",
      name: "GreenCard.ai",
      url: SITE_URL,
    },
    datePublished: "2026-04-14",
    dateModified: "2026-04-14",
  };

  return (
    <>
      <StructuredData schema={structuredData} />
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              I-864 Affidavit of Support: Financial Requirements Guide 2026
            </h1>
            <p className="text-xl text-gray-600">
              Understand the financial commitment required for family-based immigration. Complete guide to income
              requirements, sponsor obligations, and poverty guidelines.
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Filing Fee</h3>
              <p className="text-3xl font-bold text-emerald-600">$0</p>
              <p className="text-xs text-gray-500 mt-1">No USCIS filing fee</p>
            </div>
          </Card>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Form I-864?</h2>
            <p className="text-gray-700 mb-4">
              Form I-864, Affidavit of Support, is a binding contract between the petitioner/sponsor and USCIS. By
              signing this form, the sponsor agrees to financially support the immigrant if they become unable to
              support themselves.
            </p>
            <p className="text-gray-700">
              The sponsor legally commits to maintaining the immigrant's income at 100-200% of the federal poverty
              guidelines. This obligation typically lasts until the beneficiary becomes a U.S. citizen, has worked 40
              quarters of Social Security credits, or passes away.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Can Be a Sponsor</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsor Requirements:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>U.S. citizen or permanent resident (over 18 years old)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Domiciled in the United States</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Income at or above 100-200% of poverty guidelines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Not on government assistance (with some exceptions)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Family relationship to the beneficiary (usually)</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2026 Income Requirements</h2>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">100% Federal Poverty Guidelines:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-2 text-gray-900 font-semibold">Household Size</th>
                      <th className="pb-2 text-emerald-600 font-semibold">Minimum Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">1 person</td>
                      <td className="py-2 text-gray-900 font-semibold">$15,060</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">2 people</td>
                      <td className="py-2 text-gray-900 font-semibold">$20,440</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">3 people</td>
                      <td className="py-2 text-gray-900 font-semibold">$25,820</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-700">4 people</td>
                      <td className="py-2 text-gray-900 font-semibold">${income100_4}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">200% Federal Poverty Guidelines:</h3>
              <p className="text-sm text-gray-600 mb-4">
                Higher threshold typically required for family-based petitions by U.S. citizens
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-2 text-gray-900 font-semibold">Household Size</th>
                      <th className="pb-2 text-emerald-600 font-semibold">Minimum Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">1 person</td>
                      <td className="py-2 text-gray-900 font-semibold">$30,120</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">2 people</td>
                      <td className="py-2 text-gray-900 font-semibold">$40,880</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">3 people</td>
                      <td className="py-2 text-gray-900 font-semibold">$51,640</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-700">4 people</td>
                      <td className="py-2 text-gray-900 font-semibold">${income200_4}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Proving Income</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Financial Documents:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Federal income tax returns (last 2 years)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>W-2 forms and IRS tax transcripts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Recent pay stubs (last 3 months)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Employment authorization letter from employer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Proof of assets (bank statements, property deeds) if income insufficient</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Co-sponsor affidavit (if primary sponsor income insufficient)</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sponsor Obligations</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Responsibilities:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Financial Support:</strong> Sponsor is legally responsible if immigrant receives public
                    benefits
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Duration:</strong> Obligation typically lasts 10 years or until immigrant becomes U.S.
                    citizen
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Government Claims:</strong> USCIS can recover benefits paid to immigrant from sponsor
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Enforcement:</strong> Binding contract - enforceable in state or federal court
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When Income is Insufficient</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options for Low-Income Sponsors:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Joint Sponsor:</strong> Add a co-sponsor with sufficient income (separate I-864)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Use Assets:</strong> Count assets at 5x (for age 25+) the shortfall amount
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Household Income:</strong> Include income from household members (if willing to be liable)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Delay Filing:</strong> Wait until income increases or more assets are available
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Filing and Submission</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to File I-864:</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Form I-864</h4>
                    <p className="text-gray-700 text-sm">
                      Fill out form with sponsor information and financial details
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gather Financial Evidence</h4>
                    <p className="text-gray-700 text-sm">
                      Collect tax returns, pay stubs, and proof of income or assets
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sign in Front of Notary</h4>
                    <p className="text-gray-700 text-sm">
                      I-864 must be signed before a notary public or at USCIS appointment
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Submit with Application</h4>
                    <p className="text-gray-700 text-sm">
                      File I-864 with immigrant's I-485 or visa application to consular post
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. I-864 is a binding legal contract with significant financial implications. Consult with a
              qualified immigration attorney before signing. The information provided is current as of April 2026 and
              subject to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Your I-864?</h2>
            <p className="text-gray-700 mb-6">
              Get guidance on financial requirements and sponsorship obligations with our free assessment.
            </p>
            <Link href="/assessment">
              <Button variant="primary" size="lg">
                Take Free Immigration Assessment
              </Button>
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
