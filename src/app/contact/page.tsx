'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', caseType: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const caseTypes = [
    'Select Case Type',
    'EB-1 (Extraordinary Ability)',
    'EB-2 (Advanced Degree)',
    'EB-3 (Skilled Worker)',
    'Family-Based Immigration',
    'VAWA (Abuse)',
    'Work Visa (H-1B, L-1, etc)',
    'Student Visa (F-1)',
    'Investor/Entrepreneur',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Contact Information */}
            <div className="md:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  {t('contact.contactInformation')}
                </h2>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t('contact.phone')}</h3>
                  <p className="text-slate-600">
                    <a href="tel:+19547776678" className="hover:text-emerald-600 transition-colors">
                      (954) 777-6678
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t('contact.email')}</h3>
                  <p className="text-slate-600">
                    <a href="mailto:hello@greencard.ai" className="hover:text-emerald-600 transition-colors">
                      hello@greencard.ai
                    </a>
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t('contact.office')}</h3>
                  <p className="text-slate-600">{t('contact.officeLocation')}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t('contact.officeHours')}</h3>
                  <p className="text-slate-600">{t('contact.mondayFriday')}</p>
                  <p className="text-slate-600">{t('contact.businessHours')}</p>
                </div>
              </div>

              {/* Bilingual Note */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Globe className="w-6 h-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t('contact.languages')}</h3>
                  <p className="text-slate-600">{t('contact.languagesSpoken')}</p>
                  <p className="text-sm text-slate-500">{t('contact.spanishSpoken')}</p>
                </div>
              </div>

              {/* Attorney Info */}
              <div className="pt-8 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Jeremy "Yirmi" Knight, Esq.
                </h3>
                <p className="text-sm text-slate-600">
                  Florida Bar No. 1009132
                </p>
                <p className="text-sm text-slate-600">
                  Partner Immigration Law, PLLC
                </p>
                <p className="text-sm text-slate-600">
                  Fort Lauderdale, Broward County, FL 33312
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {t('contact.sendMessage')}
                </h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                    <p className="text-emerald-900 font-semibold mb-2">
                      {t('contact.thankYou')}
                    </p>
                    <p className="text-emerald-700">
                      {t('contact.messageReceived')}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                        {t('contact.fullName')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors"
                        placeholder={t('contact.nameInputPlaceholder')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                        {t('contact.emailAddress')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors"
                        placeholder={t('contact.emailInputPlaceholder')}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
                        {t('contact.phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors"
                        placeholder={t('contact.phoneInputPlaceholder')}
                      />
                    </div>

                    {/* Case Type */}
                    <div>
                      <label htmlFor="caseType" className="block text-sm font-medium text-slate-900 mb-2">
                        {t('contact.caseType')}
                      </label>
                      <select
                        id="caseType"
                        name="caseType"
                        value={formData.caseType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors bg-white"
                      >
                        {caseTypes.map((type, idx) => (
                          <option key={idx} value={idx === 0 ? '' : type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                        {t('contact.message')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors resize-none"
                        placeholder={t('contact.messageInputPlaceholder')}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      {t('contact.sendButton')}
                    </Button>
                  </form>
                )}
              </div>

              {/* CTA to Assessment */}
              <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t('contact.readyToStart')}
                </h3>
                <p className="text-slate-600 mb-4">
                  {t('contact.assessmentCTA')}
                </p>
                <Link href="/assessment">
                  <Button variant="secondary" size="lg">
                    {t('contact.startAssessment')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
