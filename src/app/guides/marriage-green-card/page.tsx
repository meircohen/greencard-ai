import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StructuredData from "@/components/StructuredData";
import { getFormFee } from "@/lib/uscis-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: "Green Card Through Marriage: Complete Checklist 2026",
  description:
    "Ultimate guide to getting a green card through marriage. Learn about spousal sponsorship, required documents, timeline, costs, and how to prove a genuine relationship.",
  keywords: [
    "marriage green card",
    "spousal sponsorship",
    "I-130",
    "immediate relative",
    "green card through marriage",
    "2026",
  ],
  openGraph: {
    title: "Green Card Through Marriage: Complete Checklist 2026",
    description:
      "Master the marriage-based green card process with our complete guide covering requirements, documents, timeline, and relationship proof.",
    type: "article",
    url: `${SITE_URL}/guides/marriage-green-card`,
  },
  alternates: {
    canonical: "/guides/marriage-green-card",
  },
};

const i130Fee = getFormFee("I-130") || 535;
const i485Fee = getFormFee("I-485") || 1440;

export default function MarriageGreenCardGuide() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Green Card Through Marriage: Complete Checklist 2026",
    description:
      "Complete guide to obtaining a green card through marriage including requirements, checklist, timeline, and relationship proof.",
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
              Green Card Through Marriage: Complete Checklist 2026
            </h1>
            <p className="text-xl text-gray-600">
              Navigate the spousal green card process. Complete checklist including I-130 and I-485, required documents,
              relationship proof, and timeline.
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Cost</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  ${i130Fee + i485Fee + 85}
                </p>
                <p className="text-xs text-gray-500 mt-1">Filing fees + biometrics</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Timeline</h3>
                <p className="text-3xl font-bold text-emerald-600">6-10 months</p>
                <p className="text-xs text-gray-500 mt-1">From filing to green card</p>
              </div>
            </div>
          </Card>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Qualifies for Marriage-Based Green Card</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">You Are Eligible If:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Married to a U.S. citizen or permanent resident</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Marriage is valid in the country where it took place</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Spouse has been a U.S. citizen for at least 2 years (beneficial for visa processing)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>You have not been married to your spouse for less than 2 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>You intend to reside with your spouse in the U.S.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>You are not inadmissible to the United States</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Documents to Prove Your Marriage is Genuine
            </h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Documents for Relationship Proof:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Official Marriage Documents:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 mt-2">
                    <li>• Certified marriage certificate</li>
                    <li>• Marriage license</li>
                    <li>• Wedding invitation and photos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Proof of Cohabitation:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 mt-2">
                    <li>• Mortgage or lease agreement (both names)</li>
                    <li>• Utility bills (electricity, water, gas)</li>
                    <li>• Insurance policies (auto, health, home)</li>
                    <li>• Photographs of you together at home</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Joint Financial Documents:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 mt-2">
                    <li>• Joint bank account statements</li>
                    <li>• Joint credit card statements</li>
                    <li>• Joint tax returns</li>
                    <li>• Life insurance with spouse as beneficiary</li>
                    <li>• Retirement account designating spouse</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Personal Relationship Evidence:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 mt-2">
                    <li>• Love letters and emails</li>
                    <li>• Text message conversations</li>
                    <li>• Photos from trips and holidays</li>
                    <li>• Social media posts about each other</li>
                    <li>• Affidavits from family and friends</li>
                    <li>• Video recordings of you together</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Family Documents:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 mt-2">
                    <li>• Birth certificates (showing married name)</li>
                    <li>• Divorce decrees from previous marriages</li>
                    <li>• Children's documents (if applicable)</li>
                    <li>• Will/estate documents naming spouse</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Process</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gather All Marriage Documents</h3>
                    <p className="text-gray-700">
                      Collect certified marriage certificate, wedding photos, and proof of cohabitation to demonstrate
                      genuine relationship.
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
                    <h3 className="font-semibold text-gray-900 mb-2">File I-130 Petition</h3>
                    <p className="text-gray-700">
                      Spouse files Form I-130 at the appropriate USCIS service center with $535 fee and supporting
                      documents.
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
                    <h3 className="font-semibold text-gray-900 mb-2">I-130 Approval</h3>
                    <p className="text-gray-700">
                      I-130 petition is approved. Takes 2-4 months. Visa is immediately available (immediate relatives).
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
                    <h3 className="font-semibold text-gray-900 mb-2">File I-485 (If in the U.S.)</h3>
                    <p className="text-gray-700">
                      File Application for Adjustment of Status with $1,440 fee, biometrics fee, and complete
                      documentation.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Biometrics and Medical Exam</h3>
                    <p className="text-gray-700">
                      Attend biometrics appointment and complete medical examination with USCIS-authorized civil
                      surgeon.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Interview (If Required)</h3>
                    <p className="text-gray-700">
                      Attend joint interview with spouse. USCIS may conduct interview to verify genuineness of marriage.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Green Card Approval</h3>
                    <p className="text-gray-700">
                      I-485 approved. Receive green card in mail within 1-2 weeks. You are now a permanent resident!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Documents Checklist</h2>
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Certified marriage certificate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Wedding photos (clear, from wedding day)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Joint lease/mortgage or bills in both names</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Bank statements (joint account preferred)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Tax returns (if filed jointly)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Affidavits from family and friends</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Valid passports (both spouses)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Birth certificate (foreign spouse)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Police clearance (foreign spouse)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-emerald-600 rounded"></div>
                  <span className="text-gray-700">Medical examination (Form I-693)</span>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Considerations</h2>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">If Married Less Than 2 Years:</h3>
              <p className="text-gray-700 mb-4">
                If you have been married for less than 2 years at the time of approval, you will receive a conditional
                green card (valid for 2 years). At the end of 2 years, you must file I-751 to remove conditions.
              </p>
            </Card>

            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Red Flags USCIS Watches For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Minimal communication history before marriage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Significant age or economic disparity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>No joint financial accounts or shared bills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Limited photos or evidence of cohabitation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Quick marriage followed by immediate green card application</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Strengthen Your Case:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Gather extensive documentation of your relationship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Obtain affidavits from family, friends, and neighbors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Include personal narrative letter explaining your relationship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Open joint bank accounts and establish financial ties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Provide extensive photos throughout your relationship</span>
                </li>
              </ul>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. Marriage-based green card cases can be complex, especially if USCIS questions the
              genuineness of your marriage. Consider consulting with a qualified immigration attorney before filing.
              The information provided is current as of April 2026 and subject to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Help with Your Marriage-Based Green Card</h2>
            <p className="text-gray-700 mb-6">
              Start your spousal green card process confidently with our free assessment and guidance.
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
