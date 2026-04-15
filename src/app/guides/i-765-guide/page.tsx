import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StructuredData from "@/components/StructuredData";
import { getFormFee, getProcessingTime } from "@/lib/uscis-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: "I-765 Employment Authorization: How to Get Your Work Permit 2026",
  description:
    "Complete guide to Form I-765 Employment Authorization Document (EAD). Learn eligibility, filing process, fees, and how long it takes to get your work permit.",
  keywords: [
    "I-765",
    "employment authorization",
    "work permit",
    "EAD",
    "USCIS",
    "advance parole",
    "2026",
  ],
  openGraph: {
    title: "I-765 Employment Authorization: How to Get Your Work Permit 2026",
    description:
      "Master Form I-765 with our comprehensive guide to employment authorization, work permits, and the filing process.",
    type: "article",
    url: `${SITE_URL}/guides/i-765-guide`,
  },
  alternates: {
    canonical: "/guides/i-765-guide",
  },
};

const i765Fee = getFormFee("I-765") || 470;
const i765ProcessingTime = getProcessingTime("I-765");

export default function I765Guide() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "I-765 Employment Authorization: How to Get Your Work Permit 2026",
    description:
      "Complete guide to Form I-765 including eligibility, filing process, costs, and employment authorization timeline.",
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
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              I-765 Employment Authorization: How to Get Your Work Permit 2026
            </h1>
            <p className="text-xl text-gray-600">
              Get the right to work in the United States. Complete guide to Form I-765 including eligibility,
              documentation, fees, and processing timeline.
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Filing Fee</h3>
                <p className="text-3xl font-bold text-emerald-600">${i765Fee}</p>
                <p className="text-xs text-gray-500 mt-1">Some categories free</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Processing Time</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {i765ProcessingTime?.weeks} weeks
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {i765ProcessingTime?.range}
                </p>
              </div>
            </div>
          </Card>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Form I-765?</h2>
            <p className="text-gray-700 mb-4">
              Form I-765, Application for Employment Authorization, allows you to work legally in the United States
              while your immigration case is pending. An approved I-765 results in an Employment Authorization Document
              (EAD), commonly called a work permit.
            </p>
            <p className="text-gray-700">
              You can file I-765 concurrently with your I-485, or separately if you are in certain categories like
              asylum applicants, VAWA self-petitioners, or TPS holders.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is Eligible for Employment Authorization</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Eligibility Categories:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>I-485 Applicants:</strong> Pending adjustment of status for 180+ days
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Asylum Applicants:</strong> After filing I-539 or I-589
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>VAWA Self-Petitioners:</strong> Can apply immediately
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>TPS Holders:</strong> Temporary Protected Status holders
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>U/T Visa Holders:</strong> Crime victims and trafficking victims
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Documentation</h2>
            <Card className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Completed Form I-765</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Valid passport copy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Approved I-485 receipt notice (if filing with I-485)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>2x2 inch photo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Evidence of eligibility category (asylum notice, VAWA petition, etc.)</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Filing Process</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Determine Eligibility</h3>
                    <p className="text-gray-700">
                      Verify you meet requirements for your specific category and have proper supporting documents.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complete Form I-765</h3>
                    <p className="text-gray-700">
                      Fill out all required fields with your personal information and category information.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gather Supporting Documents</h3>
                    <p className="text-gray-700">
                      Collect passport copies, photos, and evidence of your eligibility category.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Application</h3>
                    <p className="text-gray-700">
                      File I-765 with appropriate service center. Can be filed with I-485 (same envelope) or
                      separately.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Receive EAD Card</h3>
                    <p className="text-gray-700">
                      Once approved, your work permit card arrives by mail. Valid for typically 1-4 years depending on
                      your category.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fees and Costs</h2>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">I-765 Filing Costs:</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Standard Filing Fee</span>
                  <span className="font-semibold text-gray-900">$470</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Some Categories (Free)</span>
                  <span className="font-semibold text-gray-900">$0</span>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Note: Asylum applicants, VAWA self-petitioners, and certain other categories are exempt from filing
                  fees.
                </p>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Timeline</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-600">
                    {i765ProcessingTime?.weeks} weeks average
                  </h4>
                  <p className="text-gray-700">Typical processing time for employment authorization approval</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Range: {i765ProcessingTime?.range}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Processing times vary by USCIS office and case complexity
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mt-8 mb-4">Using Your EAD Work Permit:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Work for Any Employer:</strong> EAD allows unrestricted work authorization with any U.S.
                    employer
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Social Security Number:</strong> Apply for SSN once you have your EAD card
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Validity Period:</strong> EAD validity depends on your category and case status
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. Consult with a qualified immigration attorney before filing your I-765 application. The
              information provided is current as of April 2026 and subject to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Your Work Permit?</h2>
            <p className="text-gray-700 mb-6">
              Learn about your employment authorization options with our free immigration assessment.
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
