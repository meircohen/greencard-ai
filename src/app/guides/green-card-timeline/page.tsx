import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StructuredData from "@/components/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

export const metadata: Metadata = {
  title: "How Long Does a Green Card Take? Processing Times 2026",
  description:
    "Complete breakdown of green card processing times by category. Learn timelines for family-based, employment-based, and special immigrant categories.",
  keywords: [
    "green card timeline",
    "processing times",
    "visa bulletin",
    "immigration timeline",
    "USCIS",
    "2026",
  ],
  openGraph: {
    title: "How Long Does a Green Card Take? Processing Times 2026",
    description:
      "Detailed guide to green card processing times, visa bulletin waits, and expected timelines for different immigration categories.",
    type: "article",
    url: `${SITE_URL}/guides/green-card-timeline`,
  },
  alternates: {
    canonical: "/guides/green-card-timeline",
  },
};

export default function GreenCardTimeline() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How Long Does a Green Card Take? Processing Times 2026",
    description:
      "Complete guide to green card processing timelines including visa bulletin waits and expected processing times by category.",
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
              How Long Does a Green Card Take? Processing Times 2026
            </h1>
            <p className="text-xl text-gray-600">
              Understand your green card timeline. Detailed breakdown of processing times for different immigration
              categories, visa bulletin waits, and what to expect at each stage.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Times Overview</h2>
            <p className="text-gray-700 mb-4">
              Green card processing times vary significantly based on your immigration category, visa availability, and
              the USCIS service center handling your case. Processing times range from as quick as 6-8 months for some
              immediate relative cases to several years for certain employment-based categories.
            </p>
            <p className="text-gray-700">
              There are two components to consider: visa bulletin wait times and actual USCIS processing time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Family-Based Green Card Times</h2>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Relatives (No Wait)</h3>
              <p className="text-gray-700 mb-4">
                Immediate relatives of U.S. citizens have no visa bulletin wait time. Visas are always "current."
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Spouse of U.S. Citizen</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Total Timeline:</strong> 6-10 months
                  </p>
                  <ul className="text-sm text-gray-700 mt-2 ml-4">
                    <li>• I-130 approval: 2-4 months</li>
                    <li>• I-485 processing: 4-6 months</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Parent of U.S. Citizen</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Total Timeline:</strong> 6-10 months
                  </p>
                  <ul className="text-sm text-gray-700 mt-2 ml-4">
                    <li>• I-130 approval: 2-4 months</li>
                    <li>• I-485 processing: 4-6 months</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preference Categories (Visa Wait)</h3>
              <p className="text-gray-700 mb-4">
                Family preference categories must wait for visa availability. Check the visa bulletin monthly for your
                priority date.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">F2A (Spouse/Child of Permanent Resident)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> Current (no wait as of April 2026)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 12-18 months
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">F2B (Adult Child of Permanent Resident)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> 2016-07-08 (several years wait)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 3-5 years or more
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">F3 (Married Child of U.S. Citizen)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> 2012-10-01 (several years wait)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 5-8 years or more
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Employment-Based Green Card Times</h2>
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Availability (EB-1, EB-4)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">EB-1A (Extraordinary Ability)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> Current (visa always available)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 12-18 months
                  </p>
                  <ul className="text-sm text-gray-700 mt-2 ml-4">
                    <li>• I-140 approval: 4-6 months</li>
                    <li>• I-485 processing: 8-12 months</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories with Wait Times (EB-2, EB-3, EB-5)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">EB-2 (Professionals with Advanced Degrees)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> 2023-06-01 (2-3 years wait depending on country)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 2-4 years
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">EB-3 (Skilled & Unskilled Workers)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> 2021-09-01 (4-5 years wait for most countries)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 4-6 years
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">EB-5 (Investor Category)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> 2022-01-01 (varies by country)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Total Timeline:</strong> 2-3 years
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stages of Processing</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: I-130 or I-140 Approval</h3>
              <div className="space-y-3 mb-6 text-gray-700">
                <div>
                  <strong className="text-gray-900">I-130 (Petition for Alien Relative):</strong> 12-24 months
                </div>
                <div>
                  <strong className="text-gray-900">I-140 (Immigrant Petition for Alien):</strong> 15-30 months
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Visa Bulletin Wait</h3>
              <p className="text-gray-700 mb-4">
                After I-130/I-140 approval, wait for your priority date to become current in the visa bulletin.
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Current:</strong> Visa immediately available (0 wait time)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Backlog:</strong> Priority date in the past means you can proceed (0 wait time)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Future Date:</strong> Must wait for your priority date to become current
                  </span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: I-485 Processing</h3>
              <p className="text-gray-700 mb-4">
                Once visa is available, file I-485 (or proceed to consular processing if abroad).
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Receipt and biometrics: 2-4 weeks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Background checks: 2-12 months (longest part)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Interview (if required): 1-2 weeks after request</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Decision to green card arrival: 1-2 weeks</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Factors That Affect Processing Time</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Can Slow Down Your Case:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Request for Evidence (RFE) from USCIS</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Security or background check delays</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Name checks and name processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Medical examination issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>Incomplete or incorrect documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  <span>USCIS service center backlog</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Can Speed Up Your Case:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Premium Processing for I-140 (reduces wait by 15 days)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Accurate, complete documentation submitted initially</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Prompt response to any USCIS requests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>Filing with less backlogged USCIS service center</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking Your Application</h2>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Monitor Progress:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>USCIS Case Tracker:</strong> Check at uscis.gov using your receipt number (I-797)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Visa Bulletin:</strong> Check monthly at state.gov for your category and priority date
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Service Center Updates:</strong> USCIS publishes processing times for each service center
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  <span>
                    <strong>Response to Requests:</strong> Respond immediately to any USCIS notices or RFEs
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <Card className="p-6 mb-10 bg-amber-50 border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>Legal Disclaimer:</strong> This guide is for informational purposes only and does not constitute
              legal advice. Processing times vary widely and are subject to change. Consult with a qualified immigration
              attorney for an estimate based on your specific situation. The information provided is current as of April
              2026 and subject to change.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Green Card Timeline</h2>
            <p className="text-gray-700 mb-6">
              Get a personalized timeline estimate based on your specific immigration category and circumstances.
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
