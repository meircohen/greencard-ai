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
  title: "I-130 Petition for Alien Relative: Complete Guide 2026",
  description:
    "Learn everything about Form I-130 including fees, processing times, eligibility requirements, and step-by-step filing instructions for family-based green cards.",
  keywords: [
    "I-130",
    "petition for alien relative",
    "family-based green card",
    "USCIS form",
    "immediate relative",
    "visa petition",
    "2026",
  ],
  openGraph: {
    title: "I-130 Petition for Alien Relative: Complete Guide 2026",
    description:
      "Master Form I-130 with our comprehensive guide covering eligibility, fees, processing times, and step-by-step instructions.",
    type: "article",
    url: `${SITE_URL}/guides/i-130-guide`,
  },
  alternates: {
    canonical: "/guides/i-130-guide",
  },
};

const i130Fee = getFormFee("I-130") || 535;
const i130ProcessingTime = getProcessingTime("I-130");

export default function I130Guide() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "I-130 Petition for Alien Relative: Complete Guide 2026",
    description:
      "Learn everything about Form I-130 including fees, processing times, eligibility requirements, and step-by-step filing instructions.",
    author: {
      "@type": "Organization",
      name: "GreenCard.ai",
      url: SITE_URL,
    },
    datePublished: "2026-04-14",
    dateModified: "2026-04-14",
    mainEntity: {
      "@type": "HowTo",
      name: "How to File Form I-130",
      step: [
        {
          "@type": "HowToStep",
          name: "Determine eligibility",
          text: "Confirm you qualify as an immediate relative, family preference category, or other eligible relationship.",
        },
        {
          "@type": "HowToStep",
          name: "Prepare documentation",
          text: "Gather birth certificates, marriage certificates, photos, and proof of relationship.",
        },
        {
          "@type": "HowToStep",
          name: "Complete Form I-130",
          text: "Fill out the petition form with accurate information about the petitioner and beneficiary.",
        },
        {
          "@type": "HowToStep",
          name: "Submit application",
          text: "File online or by mail with supporting documents and the filing fee.",
        },
      ],
    },
  };

  return (
    <>
      <StructuredData schema={structuredData} />
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              I-130 Petition for Alien Relative: Complete Guide 2026
            </h1>
            <p className="text-xl text-gray-600">
              Master the Form I-130 petition process with this comprehensive guide. Learn about eligibility, fees,
              processing times, and step-by-step filing instructions.
            </p>
          </div>

          {/* Key Information Card */}
          <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Filing Fee</h3>
                <p className="text-3xl font-bold text-emerald-600">${i130Fee}</p>
                <p className="text-xs text-gray-500 mt-1">Online ($535) or Paper ($625)</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Processing Time</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {i130ProcessingTime?.weeks} weeks
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Typical range: {i130ProcessingTime?.range}
                </p>
              </div>
            </div>
          </Card>

          {/* Table of Contents */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
            <Card className="p-6">
              <ul className="space-y-2">
                <li>
                  <a href="#what-is-i130" className="text-emerald-600 hover:underline">
                    What is Form I-130?
                  </a>
                </li>
                <li>
                  <a href="#eligibility" className="text-emerald-600 hover:underline">
                    Who is Eligible to File
                  </a>
                </li>
                <li>
                  <a href="#requirements" className="text-emerald-600 hover:underline">
                    Required Documentation
                  </a>
                </li>
                <li>
                  <a href="#filing-process" className="text-emerald-600 hover:underline">
                    Step-by-Step Filing Process
                  </a>
                </li>
                <li>
                  <a href="#fees" className="text-emerald-600 hover:underline">
                    Fees and Costs
                  </a>
                </li>
                <li>
                  <a href="#timeline" className="text-emerald-600 hover:underline">
                    Timeline and Processing
                  </a>
                </li>
              </ul>
            </Card>
          </div>

          {/* Content Sections */}
          <section id="what-is-i130" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Form I-130?</h2>
            <p className="text-gray-700 mb-4">
              Form I-130, Petition for Alien Relative, is the first step in the family-based immigration process. This
              petition allows U.S. citizens and permanent residents to sponsor eligible family members for green cards.
            </p>
            <p className="text-gray-700 mb-4">
              The petitioner (the U.S. citizen or green card holder) files the I-130 to establish a qualifying
              relationship with the beneficiary (the foreign national seeking immigration benefits). Once approved, the
              beneficiary can apply for adjustment of status or consular processing.
            </p>
          </section>

          <section id="eligibility" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is Eligible to File</h2>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">U.S. Citizens Can Petition For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Spouses (immediate relative - no visa bulletin wait)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Parents (immediate relative - no visa bulletin wait)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Unmarried children under 21 (immediate relative)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Adult children and siblings (preference categories - longer wait)</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Green Card Holders Can Petition For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Spouses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Unmarried children</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Note: Green card holders cannot petition for parents, siblings, or married children.
              </p>
            </Card>
          </section>

          <section id="requirements" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Documentation</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For All I-130 Petitions:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Original or certified birth certificate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Valid government-issued photo ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Proof of citizenship (petitioner)</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship-Specific Documents:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">For Spouse Petitions:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Marriage certificate (certified copy)</li>
                    <li>• Divorce decrees (if applicable)</li>
                    <li>• Joint photos or evidence of cohabitation</li>
                    <li>• Joint financial documents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">For Parent Petitions:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Birth certificate proving parent-child relationship</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">For Child Petitions:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Birth certificate proving parent-child relationship</li>
                    <li>• Divorce decrees (if beneficiary was previously married)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          <section id="filing-process" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Filing Process</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gather Documentation</h3>
                    <p className="text-gray-700">
                      Collect all required documents including birth certificates, marriage certificates, and proof of
                      relationship. Ensure all documents are certified copies.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Complete Form I-130</h3>
                    <p className="text-gray-700">
                      Fill out the petition form accurately with information about both the petitioner and beneficiary.
                      Pay special attention to dates and family relationships.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Prepare Supporting Evidence</h3>
                    <p className="text-gray-700">
                      Organize all documents in the order specified by USCIS. Include cover letter, copies of all forms,
                      and supporting evidence clearly labeled.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Pay Filing Fee</h3>
                    <p className="text-gray-700">
                      Include payment for the filing fee ($535 online, $625 by mail). Make checks payable to
                      "USCIS" and include receipt number if paying online.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Application</h3>
                    <p className="text-gray-700">
                      File online through USCIS.gov or mail to the appropriate USCIS Service Center. Keep copies of all
                      documents for your records.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Monitor Application Status</h3>
                    <p className="text-gray-700">
                      Check your application status using the receipt number provided. Respond promptly to any Requests
                      for Evidence (RFEs) from USCIS.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section id="fees" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fees and Costs</h2>
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">I-130 Filing Fee Breakdown:</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Online Filing</span>
                  <span className="font-semibold text-gray-900">$535</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Paper Filing</span>
                  <span className="font-semibold text-gray-900">$625</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Total Immigration Costs (I-130 + I-485):</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">I-130 Filing</span>
                  <span className="font-semibold text-gray-900">$535</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">I-485 Filing</span>
                  <span className="font-semibold text-gray-900">$1,440</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Biometrics</span>
                  <span className="font-semibold text-gray-900">$85</span>
                </div>
                <div className="flex justify-between pt-3 text-lg">
                  <span className="font-bold text-gray-900">Total Estimate</span>
                  <span className="font-bold text-emerald-600">$2,060</span>
                </div>
              </div>
            </Card>
          </section>

          <section id="timeline" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeline and Processing</h2>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Expected Processing Times:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-600">{i130ProcessingTime?.weeks} weeks</h4>
                  <p className="text-gray-700">Average processing time</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Range: {i130ProcessingTime?.range}</h4>
                  <p className="text-gray-700 text-sm">
                    Actual processing times vary by service center and case complexity
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4 mt-8">What Happens After Approval:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Immediate Relatives:</strong> Can apply for adjustment of status immediately if in the U.S.,
                    or proceed to consular processing abroad
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Preference Categories:</strong> Must wait for visa availability based on priority date and
                    visa bulletin
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Disclaimer */}
          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. Immigration law is complex and case-specific. Consult with a qualified immigration attorney
              or accredited representative before submitting your application. The information provided is current as of
              April 2026 and subject to change.
            </p>
          </Card>

          {/* CTA */}
          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your I-130 Petition?</h2>
            <p className="text-gray-700 mb-6">
              Get personalized guidance on your family-based immigration case with our free assessment tool.
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
