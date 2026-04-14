"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, ChevronDown } from "lucide-react";

const plans = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever free",
    popular: false,
    description: "Perfect for exploring your options",
    features: [
      "AI visa assessment",
      "Visa bulletin updates",
      "Cost calculator",
      "Basic checklist",
      "1 analysis per month",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Navigator",
    price: "$29",
    period: "/month",
    popular: true,
    description: "AI-Powered Self-Service",
    features: [
      "Everything in Explorer",
      "Unlimited AI analyses",
      "Smart form auto-fill",
      "Document review",
      "Deadline tracking",
      "Case dashboard",
      "Priority support",
    ],
    cta: "Start 14-Day Trial",
  },
  {
    name: "Attorney-Backed",
    price: "$149",
    period: "/month",
    popular: false,
    description: "Everything + partner attorney support",
    features: [
      "Everything in Navigator",
      "Direct access to our partner attorney",
      "Attorney document review & guidance",
      "Professional case filing & representation",
      "Priority processing help",
      "Interview prep coaching",
      "Unlimited support",
      "Free initial consultation",
    ],
    cta: "Schedule Consultation",
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), and payment via bank transfer for annual plans.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All paid plans include a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data is always yours. You can download all your documents and information before canceling.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <h3 className="font-semibold text-primary text-left">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-white/5 text-secondary">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Start free. Scale when ready.
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Choose the plan that fits your immigration journey. All plans include
            our core AI tools and expert guidance.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative ${plan.popular ? "md:scale-105 md:z-10" : ""}`}
            >
              <Card
                className={`p-8 h-full flex flex-col ${
                  plan.popular
                    ? "ring-2 ring-green-primary/50 bg-surface/60"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-green-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-secondary text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-secondary ml-2">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className="flex items-start gap-3 text-secondary"
                    >
                      <Check className="w-5 h-5 text-green-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (plan.name === "Explorer") {
                      window.location.href = "/assessment";
                    } else if (plan.name === "Navigator") {
                      window.location.href = "/signup";
                    } else {
                      window.location.href = "/attorneys";
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Note */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
        <div className="bg-surface/30 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-secondary text-center">
            Attorney services on the Attorney-Backed plan are provided by Partner Immigration Law, PLLC, a licensed immigration law firm. GreenCard.ai is a technology platform and does not provide legal advice.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-secondary">
            Everything you need to know about our pricing and plans.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-secondary mb-4">Still have questions?</p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = "mailto:hello@greencard.ai")}
          >
            Contact Our Team
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
