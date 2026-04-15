"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import RfeResponseViewer from "@/components/RfeResponseViewer";
import type { RfeResponse } from "@/lib/rfe-response";
import { AlertCircle, Loader, CheckCircle2, ArrowRight } from "lucide-react";

export default function RfeResponsePage() {
  const [rfeText, setRfeText] = useState("");
  const [caseType, setCaseType] = useState("I-485");
  const [clientName, setClientName] = useState("");
  const [aNumber, setANumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<RfeResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!rfeText.trim()) {
        setError("Please paste the RFE letter text");
        setLoading(false);
        return;
      }

      if (rfeText.trim().length < 50) {
        setError("RFE text appears too short. Please paste the complete letter.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/rfe-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfeText: rfeText.trim(),
          caseType: caseType || "I-485",
          clientInfo: {
            name: clientName || undefined,
            aNumber: aNumber || undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate RFE response");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (response) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">RFE Response Ready</h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              We have analyzed your RFE and prepared a response package for you. Review the items below,
              gather the requested documents, and consult with an immigration attorney before submitting.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setResponse(null);
                setRfeText("");
              }}
            >
              Generate Another RFE Response
            </Button>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <RfeResponseViewer data={response} clientName={clientName} caseType={caseType} />
          </div>
        </section>

        <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Attorney Help?</h2>
            <p className="text-lg text-gray-700 mb-8">
              RFE responses require careful attention to detail. An immigration attorney can review your
              documents, strengthen your case, and help ensure your response is complete and accurate.
            </p>
            <Button variant="primary" size="lg">
              Contact an Immigration Attorney
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Got an RFE? We'll Help You Respond
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A Request for Evidence (RFE) doesn't mean your case is in trouble, but responding correctly is
            critical. Our AI-powered tool analyzes your RFE, identifies what USCIS wants, suggests the
            right evidence, and drafts a professional response letter.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">87 Days</div>
              <p className="text-gray-600">That's how long you have to respond to an RFE</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">$500-2K+</div>
              <p className="text-gray-600">Typical attorney cost for RFE responses</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">Free</div>
              <p className="text-gray-600">Your first RFE response analysis</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paste Your RFE Letter</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  RFE Letter Text
                </label>
                <textarea
                  value={rfeText}
                  onChange={(e) => setRfeText(e.target.value)}
                  placeholder="Paste the complete text of your RFE letter here. Include the USCIS letterhead, all sections, and the signature date if visible."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">Minimum 50 characters required</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Case Type / Form
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="I-485">I-485 (Adjustment of Status)</option>
                    <option value="I-130">I-130 (Family Sponsorship)</option>
                    <option value="I-140">I-140 (Employment Sponsorship)</option>
                    <option value="I-765">I-765 (Work Authorization)</option>
                    <option value="I-131">I-131 (Travel Document)</option>
                    <option value="I-539">I-539 (Extension of Status)</option>
                    <option value="N-400">N-400 (Naturalization)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Name (Optional)
                    </label>
                    <Input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Smith"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      A-Number (Optional)
                    </label>
                    <Input
                      type="text"
                      value={aNumber}
                      onChange={(e) => setANumber(e.target.value)}
                      placeholder="123-456-789"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || !rfeText.trim()}
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Your RFE...
                  </>
                ) : (
                  <>
                    Generate Response
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-600 text-center">
                Your RFE text is processed securely and not stored. First response is free. Subsequent
                responses require account signup.
              </p>
            </form>
          </Card>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">How to Use This Tool</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Find your USCIS RFE notice in your mail or email</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Copy and paste the entire letter text above (including all sections)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Enter your case type and information</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Review the analysis and gather requested documents</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">5.</span>
                <span>Consult with an attorney before submitting</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Common Questions</h2>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens after I submit the RFE text?</h3>
              <p className="text-gray-600">
                Our AI analyzes the RFE letter, identifies each request, suggests appropriate evidence, rates
                the difficulty, and drafts a professional cover letter. You can then review, copy, print, and
                use this as a guide while consulting with an attorney.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Is this a substitute for an attorney?</h3>
              <p className="text-gray-600">
                Absolutely not. This tool provides general guidance only. Immigration law is complex and
                fact-specific. You should consult a qualified immigration attorney before submitting your RFE
                response to ensure it addresses all concerns and strengthens your case.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How much time do I have to respond?</h3>
              <p className="text-gray-600">
                You typically have 87 days from the RFE notice date to submit a complete response. Some RFEs
                may specify a different deadline. Check your notice carefully.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I use the generated letter directly?</h3>
              <p className="text-gray-600">
                The generated letter is a draft template. You should customize it with your specific case
                details, have an attorney review it, and ensure it accurately addresses each USCIS concern.
                Never submit an unreviewed AI-generated document.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What if I need help gathering specific documents?
              </h3>
              <p className="text-gray-600">
                Our tool suggests documents to submit, but it cannot guarantee that any specific documents
                will satisfy USCIS. An immigration attorney familiar with USCIS requirements can advise on the
                strongest evidence for your particular situation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Respond to Your RFE?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Start analyzing your RFE letter now. Get a complete response package in seconds.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              document.querySelector("textarea")?.focus();
              document.querySelector("textarea")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Analyze Your RFE
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
