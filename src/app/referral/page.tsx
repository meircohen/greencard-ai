"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MessageCircle,
  Users,
  Zap,
  Copy,
  Check,
  Trophy,
  Share2,
} from "lucide-react";

export default function ReferralPage() {
  const [userId] = useState("demo-user-123"); // In production, get from auth context
  const [copiedEnglish, setCopiedEnglish] = useState(false);
  const [copiedSpanish, setCopiedSpanish] = useState(false);
  const [referralCount, setReferralCount] = useState(2);

  const spanishMessage = `Estoy preparando mi green card con GreenCard.ai por solo $29/mes. Es super facil con la ayuda de inteligencia artificial. Unete y los dos recibimos un mes gratis: https://greencard.ai/referral?ref=${userId}`;

  const englishMessage = `I'm preparing my green card with GreenCard.ai for just $29/month. It's super easy with AI assistance. Join now and we both get a free month: https://greencard.ai/referral?ref=${userId}`;

  const whatsappSpanishLink = `https://wa.me/?text=${encodeURIComponent(
    spanishMessage
  )}`;
  const whatsappEnglishLink = `https://wa.me/?text=${encodeURIComponent(
    englishMessage
  )}`;

  const copyToClipboard = (text: string, isSpanish: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSpanish) {
      setCopiedSpanish(true);
      setTimeout(() => setCopiedSpanish(false), 2000);
    } else {
      setCopiedEnglish(true);
      setTimeout(() => setCopiedEnglish(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Badge variant="green" size="md">
              <Zap className="w-4 h-4" />
              Earn Free Months
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Refer a Friend, Get a Free Month
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Share your referral link with friends and family. When they sign up,
            you both get a free month of GreenCard.ai Navigator. No limits on
            how many you can refer!
          </p>
        </div>
      </section>

      {/* Referral Tiers */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Earn More Rewards
            </h2>
            <p className="text-lg text-slate-600">
              The more friends you refer, the greater your rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tier 1 */}
            <Card className="p-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    1 Referral
                  </h3>
                </div>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    1 Free Month
                  </p>
                  <p className="text-slate-600">of GreenCard.ai Navigator</p>
                </div>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>For you and your friend</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Instantly after signup</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Tier 2 */}
            <Card className="p-8 relative overflow-hidden group hover:shadow-lg transition-shadow ring-2 ring-emerald-600 md:scale-105 md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Best Value
                </span>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    3+ Referrals
                  </h3>
                </div>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    $150 Cash
                  </p>
                  <p className="text-slate-600">paid to your account</p>
                </div>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>3+ successful referrals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Direct to your preferred payment method</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Share Buttons Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Share Your Referral
            </h2>
            <p className="text-lg text-slate-600">
              Choose your language and share with WhatsApp or copy the message
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* English */}
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  English
                </h3>

                <Card className="p-6 mb-6 bg-slate-50">
                  <p className="text-slate-700 leading-relaxed">
                    {englishMessage}
                  </p>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={() =>
                      window.open(whatsappEnglishLink, "_blank")
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => copyToClipboard(englishMessage, false)}
                  >
                    {copiedEnglish ? (
                      <>
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Spanish */}
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  Español
                </h3>

                <Card className="p-6 mb-6 bg-slate-50">
                  <p className="text-slate-700 leading-relaxed">
                    {spanishMessage}
                  </p>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={() =>
                      window.open(whatsappSpanishLink, "_blank")
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Compartir en WhatsApp
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => copyToClipboard(spanishMessage, true)}
                  >
                    {copiedSpanish ? (
                      <>
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Tracking Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Your Referral Status
            </h2>
            <p className="text-lg text-slate-600">
              Track your referrals and earnings
            </p>
          </div>

          <Card className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Total Referrals */}
              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-4xl font-bold text-slate-900 mb-2">
                  {referralCount}
                </p>
                <p className="text-slate-600">Total Referrals</p>
              </div>

              {/* Free Months Earned */}
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-slate-900 mb-2">
                  {Math.min(referralCount, 3)}
                </p>
                <p className="text-slate-600">Free Months Earned</p>
              </div>

              {/* Pending Earnings */}
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-4xl font-bold text-slate-900 mb-2">
                  {referralCount >= 3 ? "$150" : "-"}
                </p>
                <p className="text-slate-600">Cash Bonus</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-700 font-semibold">
                  Progress to $150 Cash Bonus
                </p>
                <span className="text-sm text-slate-600">
                  {referralCount}/3 referrals
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((referralCount / 3) * 100, 100)}%`,
                  }}
                />
              </div>
              {referralCount < 3 && (
                <p className="text-sm text-slate-600 mt-3">
                  Refer {3 - referralCount} more friend{referralCount < 2 ? '' : 's'} to earn $150 cash!
                </p>
              )}
            </div>
          </Card>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> Referral bonuses are
              credited after your referred friend completes their first month.
              Cash bonuses are processed within 5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                number: "1",
                title: "Share Your Link",
                description:
                  "Copy your personalized referral link or share directly on WhatsApp in English or Spanish.",
              },
              {
                number: "2",
                title: "Friend Signs Up",
                description:
                  "Your friend clicks the link and signs up for any GreenCard.ai paid plan.",
              },
              {
                number: "3",
                title: "You Both Get Rewarded",
                description:
                  "Once they complete their first month, you both receive your free month bonus instantly.",
              },
              {
                number: "4",
                title: "Earn Cash",
                description:
                  "Refer 3+ friends and earn $150 cash, paid directly to your account.",
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-600 text-white font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
