"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, ArrowRight, Calendar, Clock } from "lucide-react";

type Category = "all" | "guides" | "news" | "analysis" | "tips";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
  image?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "2026-visa-bulletin-analysis",
    title: "2026 Visa Bulletin Analysis: What You Need to Know",
    excerpt:
      "Deep dive into the latest USCIS visa bulletin data, employment-based priorities, and family sponsorship timelines for 2026.",
    category: "analysis",
    date: "April 10, 2026",
    readTime: "8 min",
    featured: true,
  },
  {
    id: "2",
    slug: "marriage-interview-preparation",
    title: "How to Prepare for Your Marriage Interview",
    excerpt:
      "Complete guide to marriage interviews for spouse visas (I-485, K-1). Learn common questions and tips to prove your relationship is genuine.",
    category: "guides",
    date: "April 5, 2026",
    readTime: "12 min",
  },
  {
    id: "3",
    slug: "eb1a-extraordinary-ability",
    title: "EB-1A Extraordinary Ability: Complete Guide",
    excerpt:
      "Everything immigration attorneys and applicants need to know about the EB-1A visa category for individuals with extraordinary ability.",
    category: "guides",
    date: "March 28, 2026",
    readTime: "15 min",
  },
  {
    id: "4",
    slug: "understanding-rfe-uscis",
    title: "Understanding RFE: What to Do When USCIS Asks for More Evidence",
    excerpt:
      "Request for Evidence (RFE) got you worried? Learn what it means, why USCIS sends them, and how to respond effectively.",
    category: "guides",
    date: "March 20, 2026",
    readTime: "10 min",
  },
  {
    id: "5",
    slug: "h1b-cap-2026",
    title: "H-1B Cap Season 2026: Everything You Need to Know",
    excerpt:
      "Latest updates on H-1B visa lottery, registration requirements, and strategic planning for 2026 cap season.",
    category: "news",
    date: "March 15, 2026",
    readTime: "9 min",
  },
  {
    id: "6",
    slug: "cost-immigration-breakdown",
    title: "Cost of Immigration: Complete Breakdown",
    excerpt:
      "Understand all the fees associated with green card applications, visa petitions, and naturalization. We break down every expense.",
    category: "guides",
    date: "March 8, 2026",
    readTime: "11 min",
  },
  {
    id: "7",
    slug: "top-10-mistakes-green-card",
    title: "Top 10 Mistakes That Delay Your Green Card",
    excerpt:
      "Learn the most common errors that cause USCIS delays and denials. Avoid these pitfalls to keep your case on track.",
    category: "tips",
    date: "February 28, 2026",
    readTime: "7 min",
  },
  {
    id: "8",
    slug: "uscis-fee-changes-2026",
    title: "USCIS Fee Changes 2026: What You Need to Know",
    excerpt:
      "New fee structure for immigration forms and applications in 2026. See how much you'll pay for your green card or visa petition.",
    category: "news",
    date: "February 20, 2026",
    readTime: "6 min",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "All" },
    { value: "guides", label: "Guides" },
    { value: "news", label: "News" },
    { value: "analysis", label: "Analysis" },
    { value: "tips", label: "Tips" },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredPost = blogPosts.find((p) => p.featured);
  const otherPosts = filteredPosts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-midnight via-deep to-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
              <span className="text-green-400 text-sm font-semibold">IMMIGRATION INSIGHTS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Immigration Insights & Guides
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Expert guides, USCIS updates, and immigration news to help you navigate every step of your journey.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-12 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface-2 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${
                    selectedCategory === cat.value
                      ? "bg-green-500/20 border border-green-500 text-green-400"
                      : "bg-surface-2 border border-white/[0.06] text-slate-400 hover:border-green-500/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && selectedCategory === "all" && (
            <div className="mb-12">
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="relative rounded-lg overflow-hidden h-96 bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 hover:border-green-500/60 transition-all group cursor-pointer">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="inline-block w-fit mb-3">
                      <span className="px-3 py-1 bg-green-500/30 border border-green-500 text-green-400 text-sm font-semibold rounded-full capitalize">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-300 text-lg mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="bg-surface-2/50 border-white/[0.06] hover:border-green-500/50 hover:bg-surface-2 transition-all h-full group cursor-pointer overflow-hidden">
                  <div className="p-6 h-full flex flex-col">
                    <div className="inline-block w-fit mb-3">
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold rounded-full capitalize">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-slate-500 text-xs border-t border-white/[0.06] pt-4">
                      <div className="flex items-center gap-4">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <Card className="bg-surface-2/50 border-white/[0.06]">
              <div className="p-12 text-center">
                <p className="text-slate-400 text-lg">No articles found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            </Card>
          )}

          {/* Sidebar CTA */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Get Your Free Case Assessment</h3>
            <p className="text-slate-400 mb-6">
              Our AI advisor will provide personalized recommendations based on your specific immigration situation.
            </p>
            <Link href="/assessment">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
