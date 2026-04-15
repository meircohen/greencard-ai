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
  title: "I-485 Adjustment of Status: Step-by-Step Guide 2026",
  description:
    "Complete guide to Form I-485 Adjustment of Status. Learn about processing times, required documents, fees, biometrics, medical examination, and how to get your green card.",
  keywords: [
    "I-485",
    "adjustment of status",
    "green card",
    "USCIS",
    "biometrics",
    "medical examination",
    "processing times",
    "2026",
  ],
  openGraph: {
    title: "I-485 Adjustment of Status: Step-by-Step Guide 2026",
    description:
      "Master the I-485 adjustment of status process with step-by-step instructions, fee breakdown, and timeline expectations.",
    type: "article",
    url: `${SITE_URL}/guides/i-485-guide`,
  },
  alternates: {
    canonical: "/guides/i-485-guide",
  },
};

const i485Fee = getFormFee("I-485") || 1440;
const i485ProcessingTime = getProcessingTime("I-485");

export default function I485Guide() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "I-485 Adjustment of Status: Step-by-Step Guide 2026",
    description:
      "Complete guide to Form I-485 Adjustment of Status including processing times, documents, fees, and step-by-step instructions.",
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
              I-485 Adjustment of Status: Step-by-Step Guide 2026
            </h1>
            <p className="text-xl text-gray-600">
              Complete guide to the green card adjustment process. Learn about Form I-485, required documents, fees,
              medical exams, and what to expect.
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Filing Fee</h3>
                <p className="text-3xl font-bold text-emerald-600">${i485Fee}</p>
                <p className="text-xs text-gray-500 mt-1">Includes biometrics fee</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Processing Time</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {i485ProcessingTime?.weeks} weeks
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {i485ProcessingTime?.range}
                </p>
              </div>
            </div>
          </Card>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Form I-485?</h2>
            <p className="text-gray-700 mb-4">
              Form I-485, Application to Register Permanent Residence or Adjust Status, is filed to become a lawful
              permanent resident (green card holder) while in the United States. This form allows you to adjust your
              status to permanent resident without leaving the country.
            </p>
            <p className="text-gray-700">
              You can file I-485 if you have an approved I-140 or I-130 petition and an available visa number, or if
              you are an immediate relative of a U.S. citizen with an approved I-130.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Requirements</h2>
            <Card className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Approved immigrant petition (I-140 or I-130)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Available visa number (from visa bulletin)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Currently in the United States</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Valid passport</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Eligible to immigrate (no criminal or security bars)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Can prove ability to support yourself (Form I-864)</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Documents</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Documents:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• Approved I-140 or I-130 petition notice</li>
                <li>• Valid passport (at least 6 months validity)</li>
                <li>• Birth certificate (certified copy)</li>
                <li>• Marriage certificate (if applicable)</li>
                <li>• Divorce decrees (if previously married)</li>
                <li>• Photos (2x2 inches, specifications per USCIS guidelines)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Documents:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• I-864 Affidavit of Support (completed and signed)</li>
                <li>• Sponsor's tax returns (last 2 years)</li>
                <li>• Sponsor's pay stubs or employment letter</li>
                <li>• Proof of assets (if needed to meet income requirements)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Examination:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Form I-693 (completed by USCIS-authorized civil surgeon)</li>
                <li>• Vaccination records</li>
                <li>• Medical test results (X-rays, blood work)</li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The I-485 Process Step-by-Step</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">File I-485 Application</h3>
                    <p className="text-gray-700">
                      Submit completed I-485 with all supporting documents, fees, and photos to USCIS Service Center.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Receipt Notice</h3>
                    <p className="text-gray-700">
                      USCIS sends Notice of Action with receipt number (I-797) confirming application received.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Biometrics Appointment</h3>
                    <p className="text-gray-700">
                      Attend biometrics appointment for fingerprints, photos, and signature. Fee: $85 (included in I-485
                      fee).
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
                    <h3 className="font-semibold text-gray-900 mb-2">Medical Examination</h3>
                    <p className="text-gray-700">
                      Schedule and complete medical exam with USCIS-authorized civil surgeon (usually at your own cost,
                      $300-500).
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
                    <h3 className="font-semibold text-gray-900 mb-2">Background Checks</h3>
                    <p className="text-gray-700">
                      USCIS conducts security, criminal, and background checks. This is the longest part of the process.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Interview (if required)</h3>
                    <p className="text-gray-700">
                      Attend USCIS interview. Interview may be waived for certain applicants with sufficient evidence.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    7
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Decision and Green Card</h3>
                    <p className="text-gray-700">
                      Receive approval notice and green card in mail. Congratulations - you are now a lawful permanent
                      resident!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fees and Costs</h2>
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">I-485 Filing Costs:</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">I-485 Filing Fee</span>
                  <span className="font-semibold text-gray-900">$1,355</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Biometrics Fee</span>
                  <span className="font-semibold text-gray-900">$85</span>
                </div>
                <div className="flex justify-between pt-3 text-lg">
                  <span className="font-bold text-gray-900">USCIS Total</span>
                  <span className="font-bold text-emerald-600">$1,440</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Additional Costs to Budget:</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Medical Examination (I-693)</span>
                  <span className="font-semibold text-gray-900">$300-500</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Document Translation</span>
                  <span className="font-semibold text-gray-900">$200-400</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Photos</span>
                  <span className="font-semibold text-gray-900">$20-50</span>
                </div>
                <div className="flex justify-between pt-3 text-lg">
                  <span className="font-bold text-gray-900">Estimated Total</span>
                  <span className="font-bold text-emerald-600">$1,960-2,490</span>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeline and Processing</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-600">
                    {i485ProcessingTime?.weeks} weeks average
                  </h4>
                  <p className="text-gray-700">Typical processing time from filing to decision</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Range: {i485ProcessingTime?.range}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Varies significantly by service center and case complexity. Some cases may take longer if additional
                    evidence is requested.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mt-8 mb-4">Key Timeline Milestones:</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="font-semibold text-emerald-600 min-w-[100px]">Week 1-2</div>
                  <div className="text-gray-700">Receive receipt notice with receipt number</div>
                </div>
                <div className="flex gap-4">
                  <div className="font-semibold text-emerald-600 min-w-[100px]">Week 4-8</div>
                  <div className="text-gray-700">Biometrics appointment scheduled and completed</div>
                </div>
                <div className="flex gap-4">
                  <div className="font-semibold text-emerald-600 min-w-[100px]">Month 3-6</div>
                  <div className="text-gray-700">
                    Background checks being conducted (can take several months)
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="font-semibold text-emerald-600 min-w-[100px]">Month 8-24+</div>
                  <div className="text-gray-700">Interview (if needed) or approval decision</div>
                </div>
              </div>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. Immigration law is complex and highly case-specific. Consult with a qualified immigration
              attorney before filing your I-485 application. The information provided is current as of April 2026 and
              subject to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to File Your I-485?</h2>
            <p className="text-gray-700 mb-6">
              Get personalized guidance on your adjustment of status application with our free assessment.
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
