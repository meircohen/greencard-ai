'use client';
import { useTranslation } from '@/i18n';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  Heart,
  Users,
  Share2,
  Copy,
  Check,
  User,
  Mail,
  Phone,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export default function ReferralPage() {
  const { t } = useTranslation();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    yourName: '',
    yourEmail: '',
    yourCaseNumber: '',
    referredName: '',
    referredPhone: '',
    referredEmail: '',
    relationship: 'Family',
    message: '',
  });

  const referralLink = 'https://greencard.ai/referral?ref=familia-first';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        yourName: '',
        yourEmail: '',
        yourCaseNumber: '',
        referredName: '',
        referredPhone: '',
        referredEmail: '',
        relationship: 'Family',
        message: '',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Heart className="w-12 h-12 text-amber-500 fill-amber-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            {t('referral.heroTitle')}
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('referral.heroSubtitle')}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              const element = document.getElementById('referral-form');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Refer Someone Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Network Graphic */}
          <div className="mt-16 relative h-48 flex items-center justify-center">
            <div className="absolute w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-900">
              <User className="w-12 h-12 text-blue-900" />
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-600">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-600">
              <Heart className="w-10 h-10 text-amber-600" />
            </div>
            <div className="absolute left-1/4 top-0 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-600">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="absolute right-1/4 bottom-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-600">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </section>

      {/* {t('referral.howItWorks')} */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">{t('referral.howItWorks')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Share Your Link</h3>
              <p className="text-gray-700">Every client gets a unique referral link. Share via WhatsApp, text, or in person with anyone who needs legal help.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">They Start Their Case</h3>
              <p className="text-gray-700">Your friend or family member files a case with GreenCard.ai using your link. They choose their service and begin.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">You Both Win</h3>
              <p className="text-gray-700">You earn a $100 service credit toward any future service. They get priority onboarding and expert support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* {t('referral.rewardTiers')} */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">{t('referral.rewardTiers')}</h2>
          <p className="text-center text-gray-700 mb-16 text-lg">The more you share, the more you earn. Service credits apply to any future service: citizenship, family sponsorship, renewals, or Guardian Plan subscription.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tier 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-900 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">1</div>
              <p className="text-gray-700 mb-4">Referral</p>
              <div className="bg-blue-900 text-white rounded-lg py-4 mb-6 font-bold">$100 Credit</div>
              <p className="text-sm text-gray-600">Apply to your next service</p>
            </div>

            {/* Tier 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-600 rounded-lg p-8 text-center shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">3</div>
              <p className="text-gray-700 mb-4">Referrals</p>
              <div className="bg-green-600 text-white rounded-lg py-4 mb-6 font-bold">$300 Credit</div>
              <p className="text-sm text-gray-600 mb-2">plus</p>
              <p className="text-sm font-semibold text-green-700">Familia Ambassador Badge</p>
            </div>

            {/* Tier 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-600 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">5</div>
              <p className="text-gray-700 mb-4">Referrals</p>
              <div className="bg-amber-600 text-white rounded-lg py-4 mb-6 font-bold">$500 Credit</div>
              <p className="text-sm text-gray-600 mb-2">plus</p>
              <p className="text-sm font-semibold text-amber-700">1 Month Free Guardian Plan</p>
            </div>

            {/* Tier 4 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-600 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10+</div>
              <p className="text-gray-700 mb-4">Referrals</p>
              <div className="bg-indigo-600 text-white rounded-lg py-4 mb-6 font-bold">$1,000 Credit</div>
              <p className="text-sm text-gray-600 mb-2">plus</p>
              <p className="text-sm font-semibold text-indigo-700">Lifetime Guardian Essentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can You Refer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">Who Can You Refer?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-900">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Family Members</h3>
              <p className="text-gray-700">Spouse, siblings, parents, cousins, in-laws, and anyone with an immigration need. Help your loved ones access expert legal guidance.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Friends and Neighbors</h3>
              <p className="text-gray-700">Anyone in your community going through the immigration process. Real recommendations from real people matter most.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-amber-600">
              <h3 className="text-2xl font-bold text-amber-600 mb-4">Coworkers</h3>
              <p className="text-gray-700">Colleagues who need work permits, green cards, citizenship, or family sponsorship. Support each other's success.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-indigo-600">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">Church and Community</h3>
              <p className="text-gray-700">Share with your congregation, WhatsApp groups, and social circles. Help your community access legitimate services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Attorneys */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">For Attorneys</h2>
          <p className="text-lg mb-6 leading-relaxed">
            Immigration, family law, divorce, and estate planning attorneys regularly encounter clients who need immigration help. We offer formal attorney referral partnerships with compliant fee-sharing per FL Bar Rule 1.5(e). Proportional to work done, with client consent in writing.
          </p>
          <Link href="/attorney-os">
            <Button variant="secondary" size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              Join Our Attorney Referral Network
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Community Ambassador Program */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-amber-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Become an Embajador</h2>
          <p className="text-lg text-gray-700 mb-8">Community Ambassador Program for pastors, community organizers, business owners, social workers, and trusted leaders.</p>

          <div className="bg-white rounded-lg shadow-md p-10 mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Why Immigrant Communities Matter</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Immigrant communities make legal decisions based on trusted voices, not Google searches. Pastors, community leaders, and family networks are the primary sources of information and guidance. Your endorsement opens doors to families who need help navigating complex immigration law.
            </p>
            <h3 className="text-2xl font-bold text-blue-900 mb-4 mt-8">Ambassador Benefits</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Featured on our website as a trusted partner in your community</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Annual appreciation event and recognition</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Priority access to GreenCard.ai tools for your family and community</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Custom referral rewards structure based on your role</span>
              </li>
            </ul>
          </div>

          <Button variant="primary" size="lg" className="bg-blue-900 hover:bg-blue-800">
            Apply to Become an Ambassador
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Referral Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="referral-form">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">Refer Someone Now</h2>
          <p className="text-center text-gray-700 mb-12">Tell us who you are referring. We will reach out with next steps.</p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="yourName"
                    value={formData.yourName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Your Email</label>
                  <input
                    type="email"
                    name="yourEmail"
                    value={formData.yourEmail}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Your Case Number (Optional)</label>
                  <input
                    type="text"
                    name="yourCaseNumber"
                    value={formData.yourCaseNumber}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="GCA-2024-..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <h3 className="text-lg font-bold text-blue-900 mb-6">Referred Person</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input
                      type="text"
                      name="referredName"
                      value={formData.referredName}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="Maria Garcia"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="referredPhone"
                      value={formData.referredPhone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="+1 (305) 555-0100"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      name="referredEmail"
                      value={formData.referredEmail}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="maria@example.com"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Relationship</label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option>Family</option>
                      <option>Friend</option>
                      <option>Coworker</option>
                      <option>Community Member</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Optional Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="Why are you referring them?"
                      rows={4}
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full bg-blue-900 hover:bg-blue-800">
                  Submit Referral
                </Button>

                {formSubmitted && (
                  <div className="bg-green-50 border border-green-600 text-green-900 rounded-lg p-4 text-center font-semibold">
                    Thank you for your referral! We will be in touch soon.
                  </div>
                )}
              </form>
            </div>

            {/* Quick Share */}
            <div className="flex flex-col justify-center">
              <div className="bg-blue-50 rounded-lg p-8 mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-6">Or Just Share This Link</h3>
                <div className="bg-white border-2 border-blue-900 rounded-lg p-4 mb-4 break-all text-sm font-mono text-gray-700">
                  {referralLink}
                </div>
                <Button
                  onClick={copyLink}
                  variant="secondary"
                  size="md"
                  className="w-full mb-4"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600 text-center">Share via text, email, or messaging app</p>
              </div>

              <div className="bg-amber-50 rounded-lg p-8 border-l-4 border-amber-600">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp? Even Better
                </h3>
                <p className="text-sm text-amber-800 mb-4">
                  WhatsApp is how immigrant communities share recommendations. Send your referral link directly to your contacts.
                </p>
                <Button variant="primary" size="md" className="w-full bg-green-600 hover:bg-green-700">
                  Share on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Referral Flywheel */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-900 mb-8">The Referral Flywheel</h2>
          <div className="bg-white rounded-lg shadow-md p-10 border-l-4 border-blue-900">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Immigrant communities are tightly networked. When one family gets their green card, they tell their church group, their WhatsApp group, their cousins, and their neighbors. When a parent becomes a citizen, their children celebrate. When a visa is approved, the news spreads fast through trusted channels.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our referral program doesn't create this behavior. It captures and accelerates what already happens naturally in immigrant communities. We reward the recommendations that matter most, from the people immigrants trust.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">Your Recommendation Means Everything</h2>
          <p className="text-xl text-gray-700 mb-12">
            Every referral helps another family access affordable, expert immigration services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const element = document.getElementById('referral-form');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Refer Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="secondary" size="lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Share on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Compliance Note */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 border-t border-gray-300">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-700 text-center leading-relaxed">
            GreenCard.ai's referral program complies with Florida Bar Rules. Referral rewards are service credits and nominal-value gifts, not cash payments. Legal services provided by Partner Immigration Law, PLLC. Jeremy Knight, Esq., FL Bar No. 1009132.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
