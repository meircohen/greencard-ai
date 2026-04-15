"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Star, Phone, Mail, MapPin } from "lucide-react";
import { PARTNER_FIRM } from "@/lib/partner";

// Testimonials removed: do not display client testimonials until real,
// verified reviews are collected post-launch. Fake testimonials violate
// FTC guidelines and undermine trust in a legal product.
const testimonials: { name: string; role: string; content: string; avatar: string; avatarColor: string }[] = [];

const trustBadges = [
  "Licensed in Florida",
  "Federal Practice",
  "10+ Years Experience",
];

export default function AttorneysPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    caseDescription: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/signup";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                {PARTNER_FIRM.name}
              </h1>
              <p className="text-xl text-secondary mb-8">
                {PARTNER_FIRM.attorney} • {PARTNER_FIRM.firm}
              </p>
              <p className="text-lg text-secondary leading-relaxed mb-8">
                {PARTNER_FIRM.bio}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <a
                  href={`tel:${PARTNER_FIRM.phone}`}
                  className="flex items-center gap-3 text-secondary hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-primary" />
                  {PARTNER_FIRM.phone}
                </a>
                <a
                  href={`mailto:${PARTNER_FIRM.email}`}
                  className="flex items-center gap-3 text-secondary hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-green-primary" />
                  {PARTNER_FIRM.email}
                </a>
                <div className="flex items-center gap-3 text-secondary">
                  <MapPin className="w-5 h-5 text-green-primary" />
                  {PARTNER_FIRM.address}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                {trustBadges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right: Attorney Initials Badge */}
            <div>
              <div className="bg-gradient-to-br from-green-primary/20 to-blue-primary/20 rounded-lg h-96 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-green-primary to-blue-primary flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-6xl font-bold text-white">
                      {PARTNER_FIRM.attorney.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <p className="text-secondary text-lg">
                    {PARTNER_FIRM.attorney}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Partnered */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Why We Partnered
          </h2>
          <p className="text-lg text-secondary mb-12">
            GreenCard.ai combines powerful technology with expert legal
            review. Instead of searching through dozens of attorneys, you get
            matched with our trusted partner who understands our process and is
            optimized for our clients.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-left">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Professional Efficiency
              </h3>
              <p className="text-secondary text-sm">
                Our platform handles form filling, document preparation, and case
                assessment—freeing your attorney to focus on strategy.
              </p>
            </Card>

            <Card className="p-6 text-left">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Expert Review
              </h3>
              <p className="text-secondary text-sm">
                Every case gets a final review from a licensed attorney before
                filing. The best of both worlds.
              </p>
            </Card>

            <Card className="p-6 text-left">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Transparent Pricing
              </h3>
              <p className="text-secondary text-sm">
                No marketplace markups. One trusted partner. Simple pricing you
                can understand.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                number: 1,
                title: "Case Assessment",
                description:
                  "Start with our case assessment. Tell your story and get an analysis of your options, timeline, and success rate.",
              },
              {
                number: 2,
                title: "Form Preparation",
                description:
                  "Our platform assists with form filling, document gathering, and case preparation. Everything is organized and ready.",
              },
              {
                number: 3,
                title: "Attorney Review & Filing",
                description:
                  "Our partner attorney reviews your complete case, provides guidance, and handles all filing with USCIS.",
              },
            ].map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-primary text-white font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties & Languages */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-3">
                {PARTNER_FIRM.specialties.map((specialty) => (
                  <Badge key={specialty} variant="green" >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Languages</h3>
              <div className="flex flex-wrap gap-3">
                {PARTNER_FIRM.languages.map((language) => (
                  <Badge key={language} variant="green" >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Trusted by Families Across America
          </h2>
          <p className="text-lg text-secondary leading-relaxed">
            We're building a track record of successful cases filed by licensed attorneys with transparent pricing. As we grow, client stories will appear here.
          </p>
        </div>
      </section>

      {/* Contact Form CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-primary/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-4 text-center">
            Schedule a Free Consultation
          </h2>
          <p className="text-center text-secondary mb-12">
            Let's discuss your immigration case and create a path forward
            together.
          </p>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-green-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-green-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-green-primary transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Brief Case Description
                </label>
                <textarea
                  name="caseDescription"
                  value={formData.caseDescription}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-green-primary transition-colors resize-none"
                  placeholder="Tell us about your immigration situation..."
                />
              </div>

              <Button
                variant="primary"

                className="w-full"
                type="submit"
              >
                Schedule Consultation
              </Button>
            </form>
          </Card>

          <p className="text-center text-secondary text-sm mt-6">
            We'll reach out within 24 hours to confirm your consultation.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
