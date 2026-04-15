'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  FileText,
  Users,
  CheckCircle2,
  Award,
  Globe,
  ChevronRight,
  X,
  Heart,
  Briefcase,
  DollarSign,

} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/i18n';

export default function Home() {
  const { t } = useTranslation();
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    setVideoOpen(true);
    setTimeout(() => videoRef.current?.play(), 100);
  };

  const closeVideo = () => {
    setVideoOpen(false);
    videoRef.current?.pause();
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        {/* Subtle gradient blob background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-100/60 to-teal-50/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-100/50 to-indigo-50/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  {t('home.heroBadge')}
                </span>
              </div>

              <h1 className="animate-fade-up-d1 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-slate-900">
                {t('home.heroTitle')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  {t('home.heroHighlight')}
                </span>
              </h1>

              <p className="animate-fade-up-d2 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
                {t('home.heroDescription')}
              </p>

              <div className="animate-fade-up-d3 flex flex-col sm:flex-row gap-3">
                <Link href="/assessment">
                  <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                    {t('home.ctaPrimary')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={openVideo}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-[15px] font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {t('home.ctaSecondary')}
                </button>
              </div>

              {/* Trust indicators */}
              <div className="animate-fade-up-d4 space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Award className="w-4 h-4 text-emerald-600" />
                  {t('home.trustAttorney')}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t('home.trustApproval')}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  {t('home.trustBilingual')}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  {t('home.trustPrice')}
                </div>
              </div>
            </div>

            {/* Right: Social Proof Card */}
            <div className="animate-fade-up-d2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-lg shadow-slate-900/5">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">{t('home.averageSavings')}</p>
                    <p className="text-4xl font-bold text-slate-900">{t('home.significantSavings')}</p>
                    <p className="text-sm text-slate-500">{t('home.comparedToFirms')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{t('home.casesPerMonth')}</p>
                      <p className="text-xs text-slate-500 mt-1">{t('home.casesPerMonth')}</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{t('home.familiesHelped')}</p>
                      <p className="text-xs text-slate-500 mt-1">{t('home.familiesHelped')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES SECTION ═══════════════ */}
      <section id="services" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('home.ourServices')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {t('home.handleComplexity')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: t('home.marriageGreenCard'),
                description: t('home.marriageDesc'),
                color: 'text-rose-600',
                href: '/guides/marriage-green-card',
              },
              {
                icon: CheckCircle2,
                title: t('home.adjustmentStatus'),
                description: t('home.adjustmentDesc'),
                color: 'text-emerald-600',
                href: '/guides/i-485-guide',
              },
              {
                icon: Users,
                title: t('home.familySponsorship'),
                description: t('home.familyDesc'),
                color: 'text-blue-600',
                href: '/assessment',
              },
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 bg-white p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300"
                >
                  <Icon className={`w-6 h-6 ${service.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link href={service.href} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1.5 transition-colors">
                    {t('home.learnMore2')}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('home.howItWorks')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {t('home.threeSteps')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: t('home.tellUsStory'),
                description: t('home.consultationFree'),
                icon: FileText,
              },
              {
                step: '2',
                title: t('home.handlePaperwork'),
                description: t('home.paperworkDesc'),
                icon: Briefcase,
              },
              {
                step: '3',
                title: t('home.attorneyFiles'),
                description: t('home.attorneyFilesDesc'),
                icon: Award,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
                  )}
                  <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/30 p-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ MEET YOUR ATTORNEY ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('home.meetYourAttorney')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {t('home.attorneyOversees')}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-lg shadow-slate-900/5">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Attorney Photo */}
              <div className="flex justify-center md:justify-start">
                <img
                  src="https://cdn.prod.website-files.com/6681cdb84a6659ab5132cb36/6683331414ceebad8b64c1f4_5f0d3ad7-b4ad-43c8-8a73-21f121226082.JPG"
                  alt="Jeremy Knight, Esq."
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>

              {/* Right: Attorney Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {t('home.attorneyName')}
                  </h3>
                  <p className="text-lg text-emerald-600 font-semibold mt-1">
                    {t('home.leadAttorney')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {t('home.lawFirm')}
                    </p>
                    <p className="text-slate-600">{t('home.firmName')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {t('home.barAdmission')}
                    </p>
                    <p className="text-slate-600">{t('home.barInfo')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {t('home.education')}
                    </p>
                    <p className="text-slate-600">{t('home.educationInfo')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {t('home.practiceAreas')}
                    </p>
                    <p className="text-slate-600">{t('home.practiceInfo')}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <p className="text-slate-600 leading-relaxed">
                    {t('home.attorneyBio')}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      {t('home.contact')}
                    </p>
                    <div className="space-y-2">
                      <p className="text-slate-600">
                        <span className="font-medium">{t('home.phone')}</span> <a href="tel:+19547776678" className="text-emerald-600 hover:text-emerald-700">(954) 777-6678</a>
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium">{t('home.email')}</span> <a href="mailto:Yirmi@LadyLibertyLawyers.com" className="text-emerald-600 hover:text-emerald-700">Yirmi@LadyLibertyLawyers.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('home.whyChoose')}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              {t('home.compareTheNeeds')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    {t('pricing.factor')}
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    {t('pricing.traditional')}
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    {t('pricing.diy')}
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-emerald-600">
                    {t('pricing.greencard')}
                  </th>
                </tr>
              </thead>
                            <tbody>
                <tr className="border-b border-slate-100 bg-emerald-50/30">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Attorney Files with USCIS
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">Cost (Attorney Fees)</td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    $3,500 - $6,000
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    $599 - $1,249
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                    $999 - $1,499
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Prep Time
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    3 - 6 weeks
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    4 - 12 weeks
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-emerald-600">
                    3 - 5 days
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Attorney Review
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Online Process
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    Bilingual Support
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    Sometimes
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    Limited
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    RFE Assistance
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    Extra Fee
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400">
                    <X className="w-5 h-5 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { key: 'cost' },
              { key: 'timeline' },
              { key: 'office' },
              { key: 'reviewer' },
              { key: 'denial' },
              { key: 'spanish' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-left">
                    {t(`faq.${item.key}.question`)}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      openFaqIndex === i ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600 leading-relaxed">{t(`faq.${item.key}.answer`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to Start Your Case?
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
            Free confidential consultation. We review your case, answer your questions, and create your personalized strategy.
          </p>
          <Link href="/assessment">
            <button className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto mb-6">
              {t('home.ctaPrimary')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-slate-500 mb-8">
            {t('pricing.cancelAnytime')}
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Legal services provided by Partner Immigration Law, PLLC, Jeremy Knight, Esq., Florida Bar No. 1009132, Fort Lauderdale, Broward County, FL. GreenCard.ai is the technology platform facilitating your engagement with licensed attorneys. This is attorney advertising.
          </p>
        </div>
      </section>

      <Footer />

      {/* ═══════════════ VIDEO MODAL ═══════════════ */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full"
                src="/demo.mp4"
                controls
                playsInline
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
