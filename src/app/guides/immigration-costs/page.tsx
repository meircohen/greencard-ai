import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StructuredData from "@/components/StructuredData";
import { getFormFee, calculateTotalCost } from "@/lib/uscis-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: "Immigration Cost Breakdown 2026: Every Fee Explained",
  description:
    "Complete breakdown of immigration costs and fees. Learn about USCIS filing fees, attorney costs, medical exams, and total cost estimates for different visa categories.",
  keywords: [
    "immigration costs",
    "USCIS fees",
    "filing fees",
    "immigration attorney",
    "green card cost",
    "2026",
  ],
  openGraph: {
    title: "Immigration Cost Breakdown 2026: Every Fee Explained",
    description:
      "Transparent breakdown of all immigration costs including USCIS fees, attorney costs, and hidden expenses you need to budget for.",
    type: "article",
    url: `${SITE_URL}/guides/immigration-costs`,
  },
  alternates: {
    canonical: "/guides/immigration-costs",
  },
};

export default function ImmigrationCostsGuide() {
  const i130Fee = getFormFee("I-130") || 535;
  const i485Fee = getFormFee("I-485") || 1440;
  const i765Fee = getFormFee("I-765") || 470;
  const i864Fee = getFormFee("I-864") || 0;
  const n400Fee = getFormFee("N-400") || 710;

  const spouseTotalUSCIS = i130Fee + i485Fee + 85; // biometrics
  const spouseTotalWithAttorney = spouseTotalUSCIS + 3500; // typical attorney
  const spouseTotalWithAllCosts =
    spouseTotalWithAttorney + 350 + 200 + 50 + 150; // medical + translation + photos + misc

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Immigration Cost Breakdown 2026: Every Fee Explained",
    description:
      "Complete breakdown of immigration costs including USCIS fees, attorney costs, medical exams, and total cost estimates for different immigration paths.",
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
              Immigration Cost Breakdown 2026: Every Fee Explained
            </h1>
            <p className="text-xl text-gray-600">
              Understand the true cost of immigration. Complete breakdown of USCIS fees, attorney costs, medical exams,
              and all expenses for different immigration categories.
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-red-50 to-white border-red-200">
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> Immigration fees change annually. This guide reflects 2026 fees. Always verify
              current fees at uscis.gov before filing.
            </p>
          </Card>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">USCIS Form Filing Fees</h2>
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="pb-3 text-gray-900 font-semibold">Form</th>
                      <th className="pb-3 text-gray-900 font-semibold">Name</th>
                      <th className="pb-3 text-right text-gray-900 font-semibold">Online</th>
                      <th className="pb-3 text-right text-gray-900 font-semibold">Paper</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-mono text-gray-900">I-130</td>
                      <td className="py-3 text-gray-700">Petition for Alien Relative</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">${i130Fee}</td>
                      <td className="py-3 text-right text-gray-900">$625</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-mono text-gray-900">I-485</td>
                      <td className="py-3 text-gray-700">Adjustment of Status</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">${i485Fee}</td>
                      <td className="py-3 text-right text-gray-900">$1,540</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-mono text-gray-900">I-765</td>
                      <td className="py-3 text-gray-700">Employment Authorization</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">${i765Fee}</td>
                      <td className="py-3 text-right text-gray-900">$520</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-mono text-gray-900">I-864</td>
                      <td className="py-3 text-gray-700">Affidavit of Support</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">${i864Fee}</td>
                      <td className="py-3 text-right text-gray-900">$0</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-mono text-gray-900">N-400</td>
                      <td className="py-3 text-gray-700">Application for Naturalization</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">${n400Fee}</td>
                      <td className="py-3 text-right text-gray-900">$760</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-mono text-gray-900">I-90</td>
                      <td className="py-3 text-gray-700">Green Card Renewal</td>
                      <td className="py-3 text-right text-gray-900 font-semibold">$465</td>
                      <td className="py-3 text-right text-gray-900">$565</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-gray-900">Biometrics</td>
                      <td className="py-3 text-gray-700">Fingerprinting Service</td>
                      <td colSpan={2} className="py-3 text-right text-gray-900 font-semibold">
                        $85
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Cost by Scenario</h2>

            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Spouse of U.S. Citizen (Marriage Green Card)
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">USCIS Fees Only:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">I-130 Filing</span>
                      <span className="text-gray-900 font-semibold">${i130Fee}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">I-485 Filing</span>
                      <span className="text-gray-900 font-semibold">${i485Fee}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Biometrics</span>
                      <span className="text-gray-900 font-semibold">$85</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg">
                      <span className="font-bold text-gray-900">Subtotal</span>
                      <span className="font-bold text-emerald-600">${spouseTotalUSCIS}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">With Attorney:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">USCIS Fees</span>
                      <span className="text-gray-900 font-semibold">${spouseTotalUSCIS}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Immigration Attorney</span>
                      <span className="text-gray-900 font-semibold">$3,500</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg">
                      <span className="font-bold text-gray-900">Subtotal</span>
                      <span className="font-bold text-emerald-600">${spouseTotalWithAttorney}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Total with All Costs:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">USCIS + Attorney</span>
                      <span className="text-gray-900 font-semibold">${spouseTotalWithAttorney}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Medical Exam</span>
                      <span className="text-gray-900 font-semibold">$350</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Document Translation</span>
                      <span className="text-gray-900 font-semibold">$200</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Photos & Copies</span>
                      <span className="text-gray-900 font-semibold">$50</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-700">Miscellaneous</span>
                      <span className="text-gray-900 font-semibold">$150</span>
                    </div>
                    <div className="flex justify-between pt-3 text-lg">
                      <span className="font-bold text-gray-900">TOTAL ESTIMATE</span>
                      <span className="font-bold text-emerald-600">${spouseTotalWithAllCosts}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Employment-Based EB-1 or EB-2 (with Attorney)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">I-140 Filing</span>
                  <span className="text-gray-900 font-semibold">$715</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Premium Processing (optional)</span>
                  <span className="text-gray-900 font-semibold">$2,805</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">I-485 Filing</span>
                  <span className="text-gray-900 font-semibold">${i485Fee}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Attorney Fees</span>
                  <span className="text-gray-900 font-semibold">$5,000-$15,000</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Medical & Misc</span>
                  <span className="text-gray-900 font-semibold">$750</span>
                </div>
                <div className="flex justify-between pt-3 text-lg">
                  <span className="font-bold text-gray-900">ESTIMATED RANGE</span>
                  <span className="font-bold text-emerald-600">$11,000-$21,000+</span>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Expenses to Budget</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Medical Examination:</h4>
                  <p className="text-sm text-gray-700 ml-4">$300-$500 (required for I-485)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Document Translation:</h4>
                  <p className="text-sm text-gray-700 ml-4">$200-$400 (per form/document set)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Police Clearance:</h4>
                  <p className="text-sm text-gray-700 ml-4">$50-$200 (varies by country)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Notarization & Certification:</h4>
                  <p className="text-sm text-gray-700 ml-4">$25-$100 (per document)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Photos:</h4>
                  <p className="text-sm text-gray-700 ml-4">$20-$50 (2x2 inch passport style)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Copies & Shipping:</h4>
                  <p className="text-sm text-gray-700 ml-4">$50-$150 (FedEx/certified mail)</p>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ways to Reduce Immigration Costs</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Without Sacrificing Quality:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>DIY Preparation:</strong> Organize your own documents before meeting with an attorney
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Translation Alternatives:</strong> Use certified online translation services instead of
                    in-person translators
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Online Filing:</strong> File forms online ($90-$100 cheaper than paper filing)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Limited Scope Representation:</strong> Hire attorney for specific tasks only, not full
                    representation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Non-profit Organizations:</strong> Some nonprofits offer free/low-cost immigration assistance
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Payment Plans:</strong> Ask attorneys about payment plans or discounts for upfront payment
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fee Waivers and Reductions</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Who Qualifies for Reductions:</h3>
              <p className="text-gray-700 mb-4">
                USCIS offers fee reductions and waivers for applicants with low income. You can apply for a fee waiver
                using Form I-912.
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Income at or below 200% of federal poverty guidelines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Receiving government assistance (SNAP, Medicaid, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Significant financial hardship</span>
                </li>
              </ul>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-gray-800">
                  <strong>Tip:</strong> Filing Form I-912 with your application can waive USCIS fees (except biometrics
                  for employment-based cases).
                </p>
              </div>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. USCIS fees change annually and may vary based on filing method and individual circumstances.
              Always verify current fees at uscis.gov. The information provided is current as of April 2026 and subject
              to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understand Your Total Immigration Costs</h2>
            <p className="text-gray-700 mb-6">
              Get a detailed cost estimate for your specific immigration path with our free assessment tool.
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
