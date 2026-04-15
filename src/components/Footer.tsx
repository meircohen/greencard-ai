import React from "react";
import Link from "next/link";

const platformLinks = [
  { label: "Document Assistant", href: "/chat" },
  { label: "Assessment Tool", href: "/assessment" },
  { label: "Visa Bulletin", href: "/visa-bulletin" },
  { label: "Cost Calculator", href: "/cost-calculator" },
  { label: "Our Attorney", href: "/attorneys" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 border-t border-blue-800 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              GreenCard.ai
            </div>
            <p className="text-blue-100 text-sm">
              AI-powered guidance for your US immigration journey. Get expert insights, timeline predictions, and cost estimates.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors duration-200"
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
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-blue-100 text-sm">
                &copy; {currentYear} GreenCard.ai. All rights reserved.
              </p>
            </div>
            <p className="text-blue-100 text-xs text-center md:text-left">
              Disclaimer: GreenCard.ai is not a law firm and does not provide legal advice. Legal services are provided by Partner Immigration Law, PLLC, a licensed immigration law firm. GreenCard.ai is a technology platform.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
