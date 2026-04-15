import React from "react";
import Link from "next/link";

const servicesLinks = [
  { label: "Marriage Green Cards", href: "/guides/marriage-green-card" },
  { label: "Family Sponsorship", href: "/guides/i-130-guide" },
  { label: "Adjustment of Status", href: "/guides/i-485-guide" },
  { label: "Work Permits", href: "/guides/i-765-guide" },
  { label: "Citizenship", href: "/guides/n-400-guide" },
  { label: "Consular Processing", href: "/guides/green-card-timeline" },
];

const resourceLinks = [
  { label: "Visa Bulletin", href: "/visa-bulletin" },
  { label: "Cost Calculator", href: "/cost-calculator" },
  { label: "Case Tracker", href: "/tracker" },
  { label: "Immigration Guides", href: "/guides" },
  { label: "Scam Verification", href: "/verify" },
  { label: "Blog", href: "/blog" },
];

const programLinks = [
  { label: "Filing Guarantee", href: "/guarantee" },
  { label: "WhatsApp Portal", href: "/whatsapp-portal" },
  { label: "Familia Plan", href: "/familia" },
  { label: "Case Rescue", href: "/rescue" },
  { label: "Emergency Help", href: "/emergency" },
  { label: "Refer a Friend", href: "/referral" },
  { label: "For Attorneys", href: "/attorney-os" },
];

const contactLinks = [
  { label: "Schedule Consultation", href: "/assessment" },
  { label: "Contact", href: "/contact" },
  { label: "Phone", href: "tel:+19547776678", isPhone: true },
  { label: "Email", href: "mailto:hello@greencard.ai", isEmail: true },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Attorney Advertising Disclaimer", href: "/terms" },
  { label: "Accessibility", href: "/terms" },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 border-t border-blue-800 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Brand section */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="text-2xl font-bold text-white">
              GreenCard.ai
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Modern immigration legal services for families across America. Expert attorneys, transparent pricing, and a process designed around you.
            </p>
          </div>

          {/* Services links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2.5">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Programs</h3>
            <ul className="space-y-2.5">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2.5">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="text-blue-200 text-sm pt-2">
                Fort Lauderdale, FL 33312
              </li>
              <li className="text-blue-200 text-sm">
                Mon-Fri, 9am-6pm EST
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-6 justify-center md:justify-start text-blue-100 text-sm">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="text-blue-100 text-sm">
                &copy; {currentYear} GreenCard.ai. All rights reserved.
              </p>
            </div>
            <p className="text-blue-100 text-xs text-center md:text-left">
              Legal services provided by Partner Immigration Law, PLLC, a Florida-licensed immigration law firm. Jeremy Knight, Esq., Florida Bar No. 1009132, Fort Lauderdale, Broward County, Florida. GreenCard.ai is the technology platform that powers our client experience. Past results do not guarantee future outcomes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
