import { Metadata } from "next";

const baseUrl = "https://greencard.ai";
const defaultImage = `${baseUrl}/og-image.png`;

type PageType =
  | "home"
  | "chat"
  | "visa-bulletin"
  | "cost-calculator"
  | "pricing"
  | "attorneys"
  | "attorney-detail"
  | "login"
  | "signup"
  | "not-found";

const pageMetadata: Record<PageType, Omit<Metadata, "openGraph">> = {
  home: {
    title: "GreenCard.ai - AI-Powered Immigration Assistant",
    description:
      "Your AI-powered immigration assistant. Chat with Claude, calculate costs, review visa bulletins, and find vetted immigration attorneys.",
  },
  chat: {
    title: "Chat with AI - GreenCard.ai",
    description:
      "Chat with Claude about your immigration questions. Get instant, personalized guidance on visa options, documentation, and processes.",
  },
  "visa-bulletin": {
    title: "Visa Bulletin - GreenCard.ai",
    description:
      "Track visa availability and priority dates with our live Visa Bulletin tool. Make informed decisions about your immigration timeline.",
  },
  "cost-calculator": {
    title: "Immigration Cost Calculator - GreenCard.ai",
    description:
      "Calculate the total cost of your immigration process. Estimate filing fees, attorney costs, and other expenses.",
  },
  pricing: {
    title: "Pricing Plans - GreenCard.ai",
    description:
      "Choose the right plan for your immigration journey. From free AI chat to premium attorney consultations.",
  },
  attorneys: {
    title: "Find Immigration Attorneys - GreenCard.ai",
    description:
      "Find and connect with vetted immigration attorneys. Browse specialties, reviews, and schedule consultations.",
  },
  "attorney-detail": {
    title: "Attorney Profile - GreenCard.ai",
    description: "View attorney details, specialties, reviews, and schedule a consultation.",
  },
  login: {
    title: "Login - GreenCard.ai",
    description: "Sign in to your GreenCard.ai account.",
  },
  signup: {
    title: "Sign Up - GreenCard.ai",
    description:
      "Create your GreenCard.ai account and start your immigration journey.",
  },
  "not-found": {
    title: "Page Not Found - GreenCard.ai",
    description: "The page you are looking for does not exist.",
  },
};

export function generateMetadata(page: PageType): Metadata {
  const baseMeta = pageMetadata[page] || pageMetadata.home;
  const title = typeof baseMeta.title === "string" ? baseMeta.title : "GreenCard.ai";
  const description = typeof baseMeta.description === "string" ? baseMeta.description : "";

  return {
    ...baseMeta,
    title: `${title} | GreenCard.ai`,
    openGraph: {
      title: title,
      description: description,
      url: baseUrl,
      siteName: "GreenCard.ai",
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [defaultImage],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GreenCard.ai",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "AI-powered immigration assistant and attorney marketplace",
    sameAs: [
      "https://twitter.com/greencard_ai",
      "https://linkedin.com/company/greencard-ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Support",
      email: "support@greencard.ai",
    },
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Immigration Assistance",
    provider: {
      "@type": "Organization",
      name: "GreenCard.ai",
      url: baseUrl,
    },
    description: "AI-powered immigration guidance and attorney connections",
    serviceType: "Legal Services",
    areaServed: "US",
    availableLanguage: [
      "en",
      "es",
      "zh",
      "ja",
      "ko",
      "fr",
      "de",
      "ru",
      "hi",
    ],
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
