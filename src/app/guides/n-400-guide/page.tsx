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
  title: "N-400 Naturalization: Path to US Citizenship 2026",
  description:
    "Complete guide to Form N-400 Application for Naturalization. Learn about citizenship requirements, English and civics tests, and the path to becoming a U.S. citizen.",
  keywords: [
    "N-400",
    "naturalization",
    "citizenship",
    "civics test",
    "English test",
    "USCIS",
    "permanent resident",
    "2026",
  ],
  openGraph: {
    title: "N-400 Naturalization: Path to US Citizenship 2026",
    description:
      "Master the citizenship process with our complete guide to Form N-400, requirements, tests, and timeline.",
    type: "article",
    url: `${SITE_URL}/guides/n-400-guide`,
  },
  alternates: {
    canonical: "/guides/n-400-guide",
  },
};

const n400Fee = getFormFee("N-400") || 710;
const n400ProcessingTime = getProcessingTime("N-400");

export default function N400Guide() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "N-400 Naturalization: Path to US Citizenship 2026",
    description:
      "Complete guide to Form N-400 Application for Naturalization including eligibility, requirements, tests, and citizenship timeline.",
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
              N-400 Naturalization: Path to US Citizenship 2026
            </h1>
            <p className="text-xl text-gray-600">
              Become a U.S. citizen. Complete guide to Form N-400 covering eligibility requirements, English and civics
              tests, and the naturalization process.
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Filing Fee</h3>
                <p className="text-3xl font-bold text-emerald-600">${n400Fee}</p>
                <p className="text-xs text-gray-500 mt-1">Online ($710) or Paper ($760)</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Processing Time</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {n400ProcessingTime?.weeks} weeks
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {n400ProcessingTime?.range}
                </p>
              </div>
            </div>
          </Card>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Form N-400?</h2>
            <p className="text-gray-700 mb-4">
              Form N-400, Application for Naturalization, is your path to becoming a U.S. citizen. Filing this form
              starts the naturalization process, which culminates in a citizenship oath ceremony where you officially
              become a U.S. citizen.
            </p>
            <p className="text-gray-700">
              Citizenship provides benefits including voting rights, access to federal jobs, freedom to sponsor family
              members, and full protection of the U.S. Constitution.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Requirements</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">You Can Apply If:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Have been a permanent resident for at least 5 years (or 3 years if spouse of U.S. citizen)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Have been physically present in the U.S. for at least 30 months of the 5 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Can read, write, and speak basic English</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Have knowledge of U.S. civics and government</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Are of good moral character</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Believe in the principles of the U.S. Constitution</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Citizenship Tests</h2>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">English Test</h3>
              <p className="text-gray-700 mb-4">
                The English test evaluates your ability to read, write, and speak English at a basic conversational
                level.
              </p>
              <div className="space-y-2 text-gray-700">
                <div>
                  <strong>Speaking:</strong> You demonstrate speaking ability during the entire interview with the USCIS
                  officer.
                </div>
                <div>
                  <strong>Reading:</strong> Read one sentence out of three provided by the officer.
                </div>
                <div>
                  <strong>Writing:</strong> Write one sentence out of three provided by the officer.
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Civics Test</h3>
              <p className="text-gray-700 mb-4">
                The civics test assesses your knowledge of U.S. government, history, rights, and responsibilities.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>100 questions total in question bank</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Asked up to 10 questions (need 6 correct to pass)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Topics: Constitution, rights, government structure, history, citizenship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>All civics materials provided by USCIS are publicly available for study</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Documentation</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Documents:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Permanent resident card (green card)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>State-issued ID or driver's license</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Birth certificate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Marriage certificates (if applicable)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Tax returns for the last 5 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Travel records (passport, travel history)</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos and Fingerprints:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Two 2x2 inch photos (recent, color)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Fingerprints taken at biometrics appointment</span>
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
                    <h3 className="font-semibold text-gray-900 mb-2">Verify Eligibility</h3>
                    <p className="text-gray-700">
                      Ensure you meet all requirements: 5 years permanent resident status, physical presence, English,
                      civics knowledge.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Complete N-400 Form</h3>
                    <p className="text-gray-700">
                      Fill out application form with accurate information about your background, residence history, and
                      activities.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Study for Tests</h3>
                    <p className="text-gray-700">
                      Prepare for English and civics tests. USCIS provides free study materials and practice tests
                      online.
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
                      File N-400 online or by mail with filing fee of ${n400Fee} and all supporting documents.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Biometrics Appointment</h3>
                    <p className="text-gray-700">
                      Attend biometrics appointment for fingerprints and photos. USCIS covers this fee.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Interview and Tests</h3>
                    <p className="text-gray-700">
                      Attend interview with USCIS officer. You'll take English and civics tests during this appointment.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Oath Ceremony</h3>
                    <p className="text-gray-700">
                      Take the Oath of Allegiance at a USCIS citizenship ceremony. You are now a U.S. citizen!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits of U.S. Citizenship</h2>
            <Card className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Right to vote in all elections</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Eligibility for federal employment and security clearances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Ability to petition for more family members</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Passport and unrestricted travel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Full constitutional protections and legal rights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">✓</span>
                  <span>Protection from deportation</span>
                </li>
              </ul>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. Consult with a qualified immigration attorney before filing your N-400 application. The
              information provided is current as of April 2026 and subject to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Become a U.S. Citizen?</h2>
            <p className="text-gray-700 mb-6">
              Get guidance on the naturalization process and citizenship requirements with our free assessment.
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
