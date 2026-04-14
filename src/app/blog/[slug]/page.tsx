"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, Share2, ArrowRight } from "lucide-react";

interface BlogPostData {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
  tableOfContents: { id: string; title: string }[];
}

const blogPosts: Record<string, BlogPostData> = {
  "2026-visa-bulletin-analysis": {
    slug: "2026-visa-bulletin-analysis",
    title: "2026 Visa Bulletin Analysis: Understanding Priority Dates and Processing Times",
    author: "GreenCard.ai Team",
    date: "April 10, 2026",
    readTime: "8 min",
    category: "Analysis",
    excerpt:
      "Deep dive into the latest USCIS visa bulletin data, employment-based priorities, and family sponsorship timelines for 2026.",
    tableOfContents: [
      { id: "what-is-visa-bulletin", title: "What is the Visa Bulletin?" },
      { id: "understanding-priority-dates", title: "Understanding Priority Dates" },
      { id: "how-to-read", title: "How to Read the Visa Bulletin" },
      { id: "2026-trends", title: "2026 Employment-Based Trends" },
      { id: "family-sponsorship", title: "Family Sponsorship Timeline" },
      { id: "visa-processing-times", title: "Visa Processing Times by Country" },
      { id: "strategic-implications", title: "Strategic Planning Implications" },
    ],
    content: `
<h2 id="what-is-visa-bulletin">What is the Visa Bulletin?</h2>

<p>The Visa Bulletin is a monthly publication by the U.S. State Department that shows the visa availability for immigrant visas in the United States. Published on the 8th of each month, the Visa Bulletin is essential reading for anyone tracking their green card application or planning to sponsor an immigrant.</p>

<p>For employment-based and family-sponsored green card applicants, the Visa Bulletin determines when you can file your I-485 adjustment of status application or when you can process your visa at a consulate abroad. Understanding how to read this document can mean the difference between progressing your case and experiencing years-long delays.</p>

<h2 id="understanding-priority-dates">Understanding Priority Dates: The Foundation</h2>

<p>At the heart of the Visa Bulletin is the concept of the "priority date." Your priority date is essentially the date when your green card petition (Form I-140 or I-130) was filed with USCIS. This date determines where you fall in the immigration queue.</p>

<p>Think of it like getting a ticket at a busy restaurant. The restaurant (USCIS) only has a limited number of green card "seats" available each month. Your priority date is your ticket number. The older your priority date, the sooner you'll be called for dinner (your interview).</p>

<p>For employment-based petitions, the priority date is the date the labor certification was filed, not the I-140 filing date. This is crucial because the labor certification process can take 12-24 months, meaning your actual priority date could be significantly older than you expect.</p>

<h3>Current vs. Visa Available</h3>

<p>The Visa Bulletin shows two key dates for most categories:</p>

<ul>
<li><strong>Final Action Dates (FAD)</strong> - The date through which USCIS will issue approvals and allow I-485 applications to be filed</li>
<li><strong>Dates for Filing</strong> - For consular processing, the date through which applications can be submitted</li>
</ul>

<p>These dates represent USCIS's best estimate of when they'll have processed applications through that date. Once your priority date reaches the published date, you're eligible to file your I-485 (if in the U.S.) or apply at a consulate (if abroad).</p>

<h2 id="how-to-read">How to Read the Visa Bulletin: A Step-by-Step Guide</h2>

<p>Let's break down what you'll find in the Visa Bulletin:</p>

<p><strong>The Family Sponsorship Table</strong> shows availability for immediate relatives of U.S. citizens and family-based green card categories (F2A, F2B, F3, F4). This table is organized by category and shows the current cutoff date.</p>

<p><strong>The Employment-Based Table</strong> shows availability for EB-1 (priority workers), EB-2 (professionals with advanced degrees), EB-3 (skilled and unskilled workers), EB-4 (special immigrants), and EB-5 (investors). Each category is further broken down by country or region.</p>

<p><strong>Dates shown in the bulletin are:</strong></p>

<ul>
<li>"C" (Current) - means visas are available now for all applicants in that category with any priority date</li>
<li>A specific date - means visas are available for applicants whose priority date is on or before that date</li>
<li>A future date - means visas will become available on or around that date for applicants with earlier priority dates</li>
<li>"U" (Unavailable) - means no visas are available; applications cannot be filed yet</li>
</ul>

<p>It's important to check the specific table for your category and, if applicable, your country of birth. Some categories have different cutoff dates for different countries due to per-country limits.</p>

<h2 id="2026-trends">2026 Employment-Based Trends: What We're Seeing</h2>

<p>In 2026, employment-based green cards are showing interesting trends that differ significantly from previous years:</p>

<h3>EB-1 (Priority Workers)</h3>

<p>EB-1 remains current for most countries, meaning applicants can file their I-485 immediately upon I-140 approval. This category includes outstanding researchers, artists, athletes, and executives. If you have an advanced degree and extraordinary achievement in your field, EB-1 offers one of the fastest pathways to a green card.</p>

<h3>EB-2 (Advanced Degree Professionals)</h3>

<p>EB-2 processing has significantly accelerated in 2026 compared to 2024-2025. Most countries outside India and China are now current or have very short retrogression. For applicants from India, wait times remain substantial but have improved, with priority dates from 2014-2015 now becoming current. Chinese nationals typically see faster processing compared to Indian nationals.</p>

<h3>EB-3 (Skilled and Unskilled Workers)</h3>

<p>EB-3 categories show mixed results. Professionals and skilled workers are becoming current for most countries, but unskilled workers face extended waits. India continues to experience the longest retrogression, with priority dates from 2008-2009 currently being processed.</p>

<h3>EB-4 and EB-5</h3>

<p>EB-4 special immigrants and EB-5 investors show more availability in 2026, though policy changes in 2025 have affected EB-5 visa allocations. EB-5 has become more attractive to those with higher minimum investment thresholds.</p>

<h2 id="family-sponsorship">Family Sponsorship Timeline: Immediate Relatives vs. Family Preferences</h2>

<p>Family sponsorship pathways have very different timelines:</p>

<h3>Immediate Relatives of U.S. Citizens (IR-1, IR-2, IR-3, IR-4, CR-1, CR-2)</h3>

<p>Immediate relatives enjoy visa availability and can typically file their I-485 or consular visa application within weeks of petition approval. These categories include spouses of U.S. citizens, unmarried children under 21, and parents of U.S. citizens over 21. If you have a U.S. citizen family member, this is the fastest route to a green card.</p>

<h3>Family Preference Categories (F2A, F2B, F3, F4)</h3>

<p><strong>F2A (Spouses and children of permanent residents)</strong> - Currently shows retrogression to 2019-2020 priority dates for most applicants. From filing to green card can take 2-3 years.</p>

<p><strong>F2B (Unmarried adult children of permanent residents)</strong> - Shows significant retrogression, typically 5-8 years from filing to approval.</p>

<p><strong>F3 (Married children of U.S. citizens)</strong> - Family-sponsored category showing retrogression to 2015-2017 priority dates, meaning 6-10+ year waits.</p>

<p><strong>F4 (Siblings of U.S. citizens)</strong> - The slowest category, with current processing of 2005-2008 priority dates. Applicants can expect 15-20 year waits from petition filing to green card approval.</p>

<h2 id="visa-processing-times">Visa Processing Times by Country: An International Perspective</h2>

<p>Processing times vary dramatically by country of birth, especially for employment-based categories:</p>

<h3>Fast-Processing Countries</h3>

<p>Most countries outside India and China enjoy relatively quick processing. For EB-2, applicants from Canada, Australia, Mexico, and most European nations see current availability. Processing times from I-485 filing to approval typically range from 6-18 months.</p>

<h3>India</h3>

<p>India faces significant per-country limits in employment-based categories. An EB-2 applicant from India may wait 8-12+ years from I-140 filing to I-485 approval. An EB-3 applicant from India faces even longer delays. However, the backlog has begun to move more quickly in 2026 compared to previous years, offering some hope for applicants from the world's most populous country.</p>

<h3>China</h3>

<p>China also faces per-country limits but typically processes faster than India. EB-2 applicants from China may wait 3-5 years, while EB-3 applicants face longer delays. Recent policy changes have slightly accelerated processing.</p>

<h3>Mexico and the Philippines</h3>

<p>Both countries show moderate retrogression in family-sponsored categories. EB-3 shows slowdowns due to unskilled worker categories. Processing typically takes 2-5 additional years beyond the fast-processing countries.</p>

<h2 id="strategic-implications">Strategic Planning Implications for 2026</h2>

<p><strong>If you're currently on H-1B or another work visa:</strong> Consider filing your I-140 now if you haven't already. Even if your priority date is retrogressed, filing now guarantees your place in line and allows you to start applying for extensions if needed. The longer you wait, the longer your eventual wait for the green card.</p>

<p><strong>If you're from India in EB-2:</strong> Don't lose hope. Processing is faster than it has been in years. Starting in 2026, priority dates are finally moving through the 2014-2015 period, suggesting the massive backlog is beginning to clear. If you're an EB-1 candidate, consider switching categories—EB-1 is current.</p>

<p><strong>If you're sponsoring an immediate relative:</strong> You're in luck. File immediately and expect your case to move within months. The fastest path to a green card in 2026 is through immediate relatives of U.S. citizens.</p>

<p><strong>If you're a business owner considering EB-5:</strong> The updated EB-5 program offers new opportunities with revised minimum investments and faster processing in some cases. Consult with an immigration attorney about whether this pathway makes sense for your circumstances.</p>

<p><strong>For family sponsorship applicants:</strong> Start planning now. If you're petitioning as an F3 or F4, a 10-20 year process is not unusual. Consider whether there's a possibility of immigrating through employment instead, which might be faster.</p>

<h2>Moving Forward in 2026</h2>

<p>The Visa Bulletin is updated monthly, and the numbers move monthly. Your job is to watch your specific category and be ready to act when your priority date becomes current. Set a reminder to check the bulletin on the 8th of each month.</p>

<p>Remember: the Visa Bulletin is not a prediction—it's a monthly snapshot of where USCIS has processed cases. It can move faster or slower than expected based on pending workload, staffing, policy changes, and external factors.</p>

<p>If you need help tracking your priority date, understanding where you stand, or planning your green card strategy, GreenCard.ai's AI advisor can provide personalized guidance based on your specific category, country, and timeline.</p>
    `,
  },
  "marriage-interview-preparation": {
    slug: "marriage-interview-preparation",
    title: "How to Prepare for Your Marriage Interview",
    author: "GreenCard.ai Team",
    date: "April 5, 2026",
    readTime: "12 min",
    category: "Guides",
    excerpt:
      "Complete guide to marriage interviews for spouse visas (I-485, K-1). Learn common questions and tips to prove your relationship is genuine.",
    tableOfContents: [
      { id: "overview", title: "Marriage Interview Overview" },
      { id: "preparation", title: "How to Prepare" },
    ],
    content: `
<h2 id="overview">Marriage Interview Overview</h2>
<p>The marriage interview is a critical step in the spousal visa process. Coming soon with full content...</p>

<h2 id="preparation">How to Prepare</h2>
<p>Learn proven strategies for interview success...</p>
    `,
  },
  "eb1a-extraordinary-ability": {
    slug: "eb1a-extraordinary-ability",
    title: "EB-1A Extraordinary Ability: Complete Guide",
    author: "GreenCard.ai Team",
    date: "March 28, 2026",
    readTime: "15 min",
    category: "Guides",
    excerpt:
      "Everything immigration attorneys and applicants need to know about the EB-1A visa category for individuals with extraordinary ability.",
    tableOfContents: [{ id: "overview", title: "Overview" }],
    content: `<h2 id="overview">EB-1A Overview</h2><p>Coming soon...</p>`,
  },
  "understanding-rfe-uscis": {
    slug: "understanding-rfe-uscis",
    title: "Understanding RFE: What to Do When USCIS Asks for More Evidence",
    author: "GreenCard.ai Team",
    date: "March 20, 2026",
    readTime: "10 min",
    category: "Guides",
    excerpt:
      "Request for Evidence (RFE) got you worried? Learn what it means, why USCIS sends them, and how to respond effectively.",
    tableOfContents: [{ id: "overview", title: "Overview" }],
    content: `<h2 id="overview">RFE Overview</h2><p>Coming soon...</p>`,
  },
  "h1b-cap-2026": {
    slug: "h1b-cap-2026",
    title: "H-1B Cap Season 2026: Everything You Need to Know",
    author: "GreenCard.ai Team",
    date: "March 15, 2026",
    readTime: "9 min",
    category: "News",
    excerpt:
      "Latest updates on H-1B visa lottery, registration requirements, and strategic planning for 2026 cap season.",
    tableOfContents: [{ id: "overview", title: "Overview" }],
    content: `<h2 id="overview">H-1B 2026 Overview</h2><p>Coming soon...</p>`,
  },
  "cost-immigration-breakdown": {
    slug: "cost-immigration-breakdown",
    title: "Cost of Immigration: Complete Breakdown",
    author: "GreenCard.ai Team",
    date: "March 8, 2026",
    readTime: "11 min",
    category: "Guides",
    excerpt:
      "Understand all the fees associated with green card applications, visa petitions, and naturalization. We break down every expense.",
    tableOfContents: [{ id: "overview", title: "Overview" }],
    content: `<h2 id="overview">Immigration Cost Overview</h2><p>Coming soon...</p>`,
  },
  "top-10-mistakes-green-card": {
    slug: "top-10-mistakes-green-card",
    title: "Top 10 Mistakes That Delay Your Green Card",
    author: "GreenCard.ai Team",
    date: "February 28, 2026",
    readTime: "7 min",
    category: "Tips",
    excerpt:
      "Learn the most common errors that cause USCIS delays and denials. Avoid these pitfalls to keep your case on track.",
    tableOfContents: [{ id: "overview", title: "Overview" }],
    content: `<h2 id="overview">Common Mistakes</h2><p>Coming soon...</p>`,
  },
  "uscis-fee-changes-2026": {
    slug: "uscis-fee-changes-2026",
    title: "USCIS Fee Changes 2026: What You Need to Know",
    author: "GreenCard.ai Team",
    date: "February 20, 2026",
    readTime: "6 min",
    category: "News",
    excerpt:
      "New fee structure for immigration forms and applications in 2026. See how much you'll pay for your green card or visa petition.",
    tableOfContents: [{ id: "overview", title: "Overview" }],
    content: `<h2 id="overview">2026 Fee Changes</h2><p>Coming soon...</p>`,
  },
};

const relatedPosts = [
  {
    slug: "h1b-cap-2026",
    title: "H-1B Cap Season 2026",
    category: "News",
  },
  {
    slug: "eb1a-extraordinary-ability",
    title: "EB-1A Extraordinary Ability Guide",
    category: "Guides",
  },
  {
    slug: "understanding-rfe-uscis",
    title: "Understanding RFE from USCIS",
    category: "Guides",
  },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];
  const [activeSection, setActiveSection] = useState("");

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-midnight via-deep to-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-surface/50 border-white/[0.06] max-w-md">
            <div className="p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Post Not Found</h2>
              <p className="text-slate-400 mb-6">The article you're looking for doesn't exist.</p>
              <Link href="/blog">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Back to Blog
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-midnight via-deep to-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
              <span className="text-green-400 text-xs font-semibold uppercase">{post.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm border-b border-white/[0.06] pb-6">
              <span>{post.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} read
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="bg-surface/50 border-white/[0.06] p-8">
                <div
                  className="prose prose-invert max-w-none text-slate-300"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Card>

              {/* Share Buttons */}
              <div className="mt-8 flex items-center gap-3">
                <span className="text-slate-400 text-sm">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?url=${typeof window !== "undefined" ? window.location.href : ""}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-surface-2 border border-white/[0.06] text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== "undefined" ? window.location.href : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-surface-2 border border-white/[0.06] text-slate-400 hover:text-blue-400 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? window.location.href : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-surface-2 border border-white/[0.06] text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Facebook
                </a>
              </div>

              {/* CTA Banner */}
              <div className="mt-12 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Get Your Free Case Assessment</h3>
                <p className="text-slate-400 mb-6">
                  Our AI advisor will provide personalized recommendations based on your immigration situation.
                </p>
                <Link href="/assessment">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Start Free Assessment
                  </Button>
                </Link>
              </div>

              {/* Related Posts */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} href={`/blog/${related.slug}`}>
                      <Card className="bg-surface-2/50 border-white/[0.06] hover:border-green-500/50 transition-all group cursor-pointer h-full p-6">
                        <span className="inline-block px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold rounded mb-3">
                          {related.category}
                        </span>
                        <h4 className="text-white font-bold group-hover:text-green-400 transition-colors">
                          {related.title}
                        </h4>
                        <div className="mt-4 flex items-center gap-2 text-green-400 text-sm group-hover:gap-3 transition-all">
                          Read <ArrowRight className="w-4 h-4" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Table of Contents */}
              <Card className="bg-surface/50 border-white/[0.06] p-6 sticky top-24">
                <h4 className="text-white font-bold mb-4">Table of Contents</h4>
                <nav className="space-y-2">
                  {post.tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-slate-400 hover:text-green-400 text-sm transition-colors"
                      onClick={() => setActiveSection(item.id)}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
