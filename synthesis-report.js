const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: "1B2A4A", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })]
  });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20, bold: opts.bold, color: opts.color })] })]
  });
}

function scoreCell(score, width) {
  let color = "C0392B"; // red
  let fill = "FADBD8";
  if (score >= 7) { color = "27AE60"; fill = "D5F5E3"; }
  else if (score >= 5) { color = "F39C12"; fill = "FEF9E7"; }
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${score}/10`, font: "Arial", size: 20, bold: true, color })] })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1B2A4A" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2C3E50" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "34495E" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "phase0", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "phase1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "phase2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "phase3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "phase4", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "GreenCard.ai | Master Synthesis Report | CONFIDENTIAL", font: "Arial", size: 16, color: "999999", italics: true })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })] })] })
    },
    children: [
      // TITLE
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "GREENCARD.AI", font: "Arial", size: 52, bold: true, color: "1B2A4A" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Master Synthesis Report", font: "Arial", size: 36, color: "2C3E50" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Consolidated Findings from 5 Independent AI Audits", font: "Arial", size: 24, color: "7F8C8D" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "April 14, 2026 | Prepared for Meir Cohen", font: "Arial", size: 22, color: "7F8C8D" })] }),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1B2A4A", space: 1 } }, spacing: { after: 400 }, children: [] }),

      // EXECUTIVE SUMMARY
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Five AI models (ChatGPT 5.4 Pro, Gemini 3.1 Pro, Grok Expert, Perplexity Max, Claude Opus) independently audited GreenCard.ai across 13 dimensions. The unanimous verdict: "), new TextRun({ text: "the AI and product vision is strong, but the infrastructure is a liability that could result in legal action, data breaches, or regulatory shutdown before the first paying customer.", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The most repeated metaphor across all five reports: \"Ferrari engine in a cardboard chassis.\" The Claude AI integration, form definitions, and feature breadth are genuinely impressive for a pre-launch product. But the custom authentication, plaintext PII storage, in-memory rate limiting, and UPL exposure create existential risks that must be resolved before any real user data enters the system.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Overall score across all reviewers: "), new TextRun({ text: "3.1 / 10", bold: true, color: "C0392B" }), new TextRun(" (pre-fix). Estimated score after completing Phases 0-2 below: "), new TextRun({ text: "7.5 / 10", bold: true, color: "27AE60" }), new TextRun(" (launchable).")] }),

      // CONSENSUS MATRIX
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Consensus Matrix: What All 5 Reports Agree On")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Issues are ranked by how many of the 5 independent reviewers flagged them. Unanimous findings (5/5) are treated as non-negotiable.")] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4000, 3360, 1000, 1000],
        rows: [
          new TableRow({ children: [
            headerCell("Issue", 4000), headerCell("Required Fix", 3360), headerCell("Agree", 1000), headerCell("Severity", 1000)
          ]}),
          new TableRow({ children: [
            cell("Custom JWT auth with hardcoded dev secret", 4000), cell("Migrate to Clerk/Auth0 + MFA", 3360), cell("5/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
          new TableRow({ children: [
            cell("In-memory rate limiter broken on serverless", 4000), cell("Upstash Redis distributed rate limiting", 3360), cell("5/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
          new TableRow({ children: [
            cell("UPL risk: AI gives case-specific legal guidance", 4000), cell("Rebrand to 'Document Assistant' + attorney gate", 3360), cell("5/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Zero trust signals (fake testimonials, placeholders)", 4000), cell("Real attorney photo, bar #, AILA badge, disclaimers", 3360), cell("5/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Form UX: 71 fields on single page", 4000), cell("Conversational wizard (TurboTax-style)", 3360), cell("5/5", 1000, { bold: true }), cell("HIGH", 1000, { color: "E67E22", bold: true })
          ]}),
          new TableRow({ children: [
            cell("PII stored in plaintext (SSNs, A-numbers)", 4000), cell("Field-level encryption (iron-webcrypto)", 3360), cell("4/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Dark theme reduces trust for legal product", 4000), cell("Add Professional Light Mode as default", 3360), cell("4/5", 1000, { bold: true }), cell("HIGH", 1000, { color: "E67E22", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Zero analytics/monitoring/error tracking", 4000), cell("GA4 + Mixpanel + Sentry + Hotjar", 3360), cell("4/5", 1000, { bold: true }), cell("HIGH", 1000, { color: "E67E22", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Single attorney = single point of failure", 4000), cell("Backup attorney agreement + capacity plan", 3360), cell("4/5", 1000, { bold: true }), cell("HIGH", 1000, { color: "E67E22", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Claude API data retention (CCPA violation)", 4000), cell("Anthropic ZDR enterprise agreement", 3360), cell("3/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
          new TableRow({ children: [
            cell("$299 filing tier is negative margin", 4000), cell("Reprice to $499-$799", 3360), cell("3/5", 1000, { bold: true }), cell("HIGH", 1000, { color: "E67E22", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Custom i18n should use established library", 4000), cell("Migrate to next-intl", 3360), cell("3/5", 1000, { bold: true }), cell("MEDIUM", 1000, { color: "F39C12", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Prompt injection risk in AI prompts", 4000), cell("XML-tagged system prompts + input sanitization", 3360), cell("3/5", 1000, { bold: true }), cell("HIGH", 1000, { color: "E67E22", bold: true })
          ]}),
          new TableRow({ children: [
            cell("Cloudflare Pages deployment deprecated", 4000), cell("Migrate to Vercel", 3360), cell("1/5", 1000, { bold: true }), cell("CRITICAL", 1000, { color: "C0392B", bold: true })
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // PHASE 0
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Phase 0: Stop the Bleeding (Days 1-3)")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "These fixes are required before any real user data enters the system. Most are code changes that can be completed in hours.", italics: true })] }),
      new Paragraph({ numbering: { reference: "phase0", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Remove dev-secret-key fallback in auth.ts. ", bold: true }), new TextRun("DONE. Changed to throw Error if NEXTAUTH_SECRET env var is missing.")] }),
      new Paragraph({ numbering: { reference: "phase0", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Add comprehensive disclaimers. ", bold: true }), new TextRun("Footer, every AI output, and a standalone /terms page: 'This is not legal advice. GreenCard.ai is an AI document preparation assistant. All legal guidance is provided by [Attorney Name], Florida Bar #XXXXXX.'")] }),
      new Paragraph({ numbering: { reference: "phase0", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Rebrand AI features from 'Advisor' to 'Document Assistant'. ", bold: true }), new TextRun("Change all references in prompts.ts, chat/page.tsx, Navbar, and marketing copy.")] }),
      new Paragraph({ numbering: { reference: "phase0", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Remove fake testimonials and placeholder attorney photo. ", bold: true }), new TextRun("Replace with real attorney headshot, bar number, AILA badge, and 'Not a notario' disclaimer in English and Spanish.")] }),
      new Paragraph({ numbering: { reference: "phase0", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Add human-in-the-loop gate. ", bold: true }), new TextRun("No form can be 'finalized' or submitted without attorney review confirmation. The $29 DIY tier provides AI-assisted preparation only; forms are marked 'DRAFT' until attorney review.")] }),
      new Paragraph({ numbering: { reference: "phase0", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Set up basic analytics and error tracking. ", bold: true }), new TextRun("GA4 for traffic, Sentry for errors, Hotjar for session recordings. Takes 2 hours.")] }),

      // PHASE 1
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Phase 1: Security and Compliance (Weeks 1-2)")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "These are infrastructure changes required for handling PII. No public beta without all items completed.", italics: true })] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Replace custom auth with Clerk. ", bold: true }), new TextRun("Migrate from jose/bcryptjs to Clerk. Enables MFA, social login, session management, and HIPAA-grade security out of the box. Estimated: 3-5 days.")] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Implement field-level encryption for PII. ", bold: true }), new TextRun("Encrypt SSN, A-number, date of birth, and passport number columns in Drizzle schema using iron-webcrypto. Keys managed via environment variables. Estimated: 2 days.")] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Replace in-memory rate limiter with Upstash Redis. ", bold: true }), new TextRun("Swap rate-limit.ts to use @upstash/ratelimit. Distributed, works across serverless isolates. Estimated: 4 hours.")] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Secure Anthropic data pipeline. ", bold: true }), new TextRun("Contact Anthropic sales for Zero Data Retention enterprise agreement. Until signed, strip all PII from Claude API requests (pass form field labels only, not values). Estimated: 1-2 weeks for contract.")] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Migrate deployment from Cloudflare Pages to Vercel. ", bold: true }), new TextRun("Cloudflare next-on-pages is deprecated. Vercel has native Next.js 16 support, edge middleware, and built-in analytics. Estimated: 1 day.")] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Add prompt injection defenses. ", bold: true }), new TextRun("Use XML-tagged system prompts in ai/prompts.ts. Sanitize user input. Add output filtering for any response that resembles legal advice without attorney context. Estimated: 1 day.")] }),
      new Paragraph({ numbering: { reference: "phase1", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Legal review of AI prompts with partner attorney. ", bold: true }), new TextRun("Every system prompt in ai/prompts.ts must be reviewed and approved by the partner attorney to ensure AI outputs stay within 'document preparation' and do not cross into 'legal advice'. Estimated: 1 week.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // PHASE 2
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Phase 2: UX Transformation (Weeks 3-5)")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "The product vision is strong but the UX fails the target user. These changes transform it from a developer demo into a product immigrants will trust and use.", italics: true })] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Convert forms to conversational wizard. ", bold: true }), new TextRun("Break all 5 forms into one-question-per-page or chunked logical sections. Progress bar, auto-save on every field blur, 'Save and Continue Later' button. This is the #1 UX priority.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Add Professional Light Mode as default. ", bold: true }), new TextRun("Navy blue base + green accents. Dark mode as optional toggle. Light mode builds institutional trust for legal services.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Build free eligibility quiz. ", bold: true }), new TextRun("5-question assessment available before signup. User sees approval probability score, then gates save/continue behind email capture. Classic product-led growth.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Replace open chat with guided AI. ", bold: true }), new TextRun("Dynamic quick-reply chips instead of blank text input. 'Are you currently in the US?' with [Yes] [No] [Not sure] buttons. Text box as fallback only.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Build bilingual side-by-side form view. ", bold: true }), new TextRun("English form fields with Spanish translation tooltips/sidebar. Forms must be filed in English, but users need to understand fields in their language.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Migrate i18n to next-intl. ", bold: true }), new TextRun("Replace custom useTranslation hook. next-intl handles pluralization, dates, currency formatting needed for I-864 income requirements.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Simplify navigation. ", bold: true }), new TextRun("Top nav: [How it Works] [Pricing] [Login] [Start Free Assessment]. Move Visa Bulletin, Cost Calculator to Resources footer section.")] }),
      new Paragraph({ numbering: { reference: "phase2", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Rewrite landing page hero. ", bold: true }), new TextRun("Change from 'AI-Powered Immigration' to 'Get Your Green Card Approved. Attorney-Reviewed. Step by Step.' Sell the outcome, not the technology.")] }),

      // PHASE 3
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Phase 3: Business Model and Launch Prep (Weeks 5-8)")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Reprice filing tier. ", bold: true }), new TextRun("$299 is negative margin. Move to $599 for attorney-reviewed filing. Still 40-60% cheaper than Boundless ($995+). Reframe as 'Save $400 vs traditional attorney fees.'")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Restructure DIY tier to eliminate UPL risk. ", bold: true }), new TextRun("$29/mo provides: AI document preparation, form auto-fill, document checklist, and educational content. No case-specific legal analysis. All outputs watermarked 'DRAFT - Requires Attorney Review.'")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Secure backup attorney agreement. ", bold: true }), new TextRun("Identify and contract a second immigration attorney as contingency. Not a marketplace; a business continuity plan.")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Build attorney dashboard. ", bold: true }), new TextRun("Partner attorney needs a portal to review cases, approve forms, track capacity, and communicate with users. Without this, the attorney relationship doesn't scale past 20 cases.")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Recruit 50 beta users. ", bold: true }), new TextRun("Source from: r/immigration, Spanish-language Facebook groups, Catholic Charities chapters in South Florida. Offer free service in exchange for testimonials and feedback.")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Build referral system with WhatsApp sharing. ", bold: true }), new TextRun("Pre-filled WhatsApp message in Spanish: 'I started my green card with GreenCard.ai for $29/month. Join and we both get a free month.' Tiered: 1 referral = 1 free month, 3+ = $150 cash.")] }),
      new Paragraph({ numbering: { reference: "phase3", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Publish 8 SEO content pages. ", bold: true }), new TextRun("Form-specific guides (I-130, I-485, I-765, I-864, N-400), 'How Long Does a Green Card Take?', 'Green Card Through Marriage Checklist', 'Immigration Cost Breakdown 2026'. English + Spanish versions.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // PHASE 4
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Phase 4: Growth and Scale (Weeks 8-12)")] }),
      new Paragraph({ numbering: { reference: "phase4", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Launch paid acquisition. ", bold: true }), new TextRun("$8K Google Ads on 'green card through marriage', 'I-485 checklist'. $7K Meta/TikTok targeting Spanish-speaking 25-45 in family reunification. Expected CAC: $25-55.")] }),
      new Paragraph({ numbering: { reference: "phase4", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Build document checklist feature. ", bold: true }), new TextRun("Printable per-form checklist showing every document needed (birth certificates, marriage evidence, financial records). Checkbox tracker. This is the most-requested missing feature.")] }),
      new Paragraph({ numbering: { reference: "phase4", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Build co-applicant portal. ", bold: true }), new TextRun("Secure link for US citizen spouse to fill I-864 (financial affidavit) without seeing immigrant spouse's full account. Critical for marriage-based cases.")] }),
      new Paragraph({ numbering: { reference: "phase4", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Add Public Charge Simulator. ", bold: true }), new TextRun("AI tool analyzing finances against Federal Poverty Guidelines for I-864. Green/Yellow/Red eligibility indicator. Data already exists in uscis-data.ts.")] }),
      new Paragraph({ numbering: { reference: "phase4", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Launch YouTube/TikTok content. ", bold: true }), new TextRun("12 short Spanish videos: 'I-130 en 5 minutos', 'Evita errores en tu I-485'. Immigration content is massive on both platforms.")] }),
      new Paragraph({ numbering: { reference: "phase4", level: 0 }, spacing: { after: 120 }, children: [new TextRun({ text: "Integrate real USCIS case status tracking. ", bold: true }), new TextRun("USCIS has an unofficial API. Auto-check case status and notify users of updates. Major retention driver.")] }),

      // COMPETITIVE POSITION
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Competitive Positioning")] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1872, 1872, 1872, 1872, 1872],
        rows: [
          new TableRow({ children: [
            headerCell("", 1872), headerCell("GreenCard.ai", 1872), headerCell("Boundless", 1872), headerCell("CitizenPath", 1872), headerCell("SimpleCitizen", 1872)
          ]}),
          new TableRow({ children: [
            cell("Price", 1872, { bold: true }), cell("$29-$599", 1872), cell("$995-$2,995", 1872), cell("$199-$399/form", 1872), cell("$400-$1,200", 1872)
          ]}),
          new TableRow({ children: [
            cell("AI Integration", 1872, { bold: true }), cell("Claude AI native", 1872), cell("Minimal/none", 1872), cell("None", 1872), cell("Basic workflow", 1872)
          ]}),
          new TableRow({ children: [
            cell("Attorney Review", 1872, { bold: true }), cell("Single partner", 1872), cell("Network", 1872), cell("DIY only", 1872), cell("Optional add-on", 1872)
          ]}),
          new TableRow({ children: [
            cell("Languages", 1872, { bold: true }), cell("EN + ES", 1872), cell("EN only", 1872), cell("EN + ES", 1872), cell("EN only", 1872)
          ]}),
          new TableRow({ children: [
            cell("Moat", 1872, { bold: true }), cell("AI speed + cost", 1872), cell("$280M, SEO, scale", 1872), cell("Form expertise", 1872), cell("Corporate clients", 1872)
          ]}),
          new TableRow({ children: [
            cell("Valuation", 1872, { bold: true }), cell("Pre-revenue", 1872), cell("$280M", 1872), cell("Unknown", 1872), cell("Unknown", 1872)
          ]}),
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "Strategic position: ", bold: true }), new TextRun("GreenCard.ai is the low-cost AI-first disruptor. By automating the paralegal layer (OCR, data entry, form preparation), we undercut Boundless by 70%. The risk is that Boundless adds AI to their existing platform and erases the cost advantage. Speed to market and Spanish-first execution are the only durable moats.")] }),

      // BUDGET
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Budget Estimate (90 Days to Launch)")] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 2340, 2340],
        rows: [
          new TableRow({ children: [
            headerCell("Item", 4680), headerCell("Cost", 2340), headerCell("Timeline", 2340)
          ]}),
          new TableRow({ children: [
            cell("Clerk auth (Pro plan)", 4680), cell("$25/mo", 2340), cell("Week 1", 2340)
          ]}),
          new TableRow({ children: [
            cell("Upstash Redis", 4680), cell("$10/mo", 2340), cell("Week 1", 2340)
          ]}),
          new TableRow({ children: [
            cell("Vercel Pro", 4680), cell("$20/mo", 2340), cell("Week 2", 2340)
          ]}),
          new TableRow({ children: [
            cell("Sentry + Hotjar + Mixpanel", 4680), cell("$50/mo", 2340), cell("Week 1", 2340)
          ]}),
          new TableRow({ children: [
            cell("Spanish-native copywriter", 4680), cell("$1,500 one-time", 2340), cell("Weeks 2-4", 2340)
          ]}),
          new TableRow({ children: [
            cell("Attorney legal review of AI prompts", 4680), cell("$2,000 one-time", 2340), cell("Weeks 1-2", 2340)
          ]}),
          new TableRow({ children: [
            cell("Anthropic enterprise agreement", 4680), cell("~$500/mo est.", 2340), cell("Weeks 2-4", 2340)
          ]}),
          new TableRow({ children: [
            cell("Google + Meta ad budget (testing)", 4680), cell("$15,000", 2340), cell("Weeks 8-12", 2340)
          ]}),
          new TableRow({ children: [
            cell("Referral incentives", 4680), cell("$3,000", 2340), cell("Weeks 6-12", 2340)
          ]}),
          new TableRow({ children: [
            cell("Content creation (8 SEO pages + video)", 4680), cell("$5,000", 2340), cell("Weeks 5-10", 2340)
          ]}),
          new TableRow({ children: [
            cell("TOTAL (90 days)", 4680, { bold: true }), cell("~$27,500", 2340, { bold: true }), cell("", 2340)
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // FINAL VERDICT
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Final Verdict")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Would YC fund this? ", bold: true }), new TextRun("Not today. The legal risk and security gaps would be disqualifying in due diligence. After Phases 0-1? Possibly. The $10B+ immigration legal services market is ripe for AI disruption, and this is one of the most complete AI-first attempts.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Would an immigration attorney endorse this? ", bold: true }), new TextRun("Not without the human-in-the-loop gate and proper disclaimers. With those in place, the AI-assisted document preparation saves attorneys 60-70% of paralegal time, making this genuinely valuable to the partner attorney.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Would an immigrant user trust this? ", bold: true }), new TextRun("Not with the dark theme, fake testimonials, and 'AI Advisor' branding. After the UX transformation in Phase 2? Yes. The bilingual side-by-side view, guided chat, and conversational forms would be genuinely superior to any competitor for Spanish-speaking users.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "The biggest risk that could kill this business: ", bold: true }), new TextRun("Boundless ($280M valuation, $25M+ raised) adds AI to their existing platform. They have the SEO, the brand trust, and the attorney network. Our only defense is speed: launch fast, capture the Spanish-speaking segment they underserve, and build network effects through community referrals before they can react.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Bottom line: ", bold: true }), new TextRun("This is 6-8 weeks of focused work away from being a launchable, defensible product. The AI foundation is real. The feature set is comprehensive. The code is clean. But the chassis needs to match the engine. Execute Phases 0-2, launch to 50 beta users, collect real testimonials, then scale. Target: $50K MRR by month 6.")] }),

      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1B2A4A", space: 1 } }, spacing: { before: 400, after: 200 }, children: [] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Report synthesized from independent audits by: ChatGPT 5.4 Pro, Gemini 3.1 Pro, Grok Expert, Perplexity Max, Claude Opus", font: "Arial", size: 18, color: "7F8C8D", italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Prepared April 14, 2026", font: "Arial", size: 18, color: "7F8C8D", italics: true })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/kind-confident-hopper/mnt/outputs/GreenCard_AI_Master_Synthesis.docx", buffer);
  console.log("Document created successfully");
});
