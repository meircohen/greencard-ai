/**
 * Document checklist requirements per visa/form type.
 * Each item tracks what's needed, why, and how critical it is.
 */

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  category: "identity" | "financial" | "legal" | "medical" | "evidence" | "forms";
  rfeRisk: "low" | "medium" | "high";
  tips?: string;
}

export interface DocumentChecklist {
  formNumber: string;
  visaType: string;
  title: string;
  items: ChecklistItem[];
}

export const i485Checklist: DocumentChecklist = {
  formNumber: "I-485",
  visaType: "Adjustment of Status",
  title: "I-485 Document Checklist",
  items: [
    {
      id: "i485_form",
      label: "Form I-485 (completed and signed)",
      description: "The application itself, all parts completed",
      required: true,
      category: "forms",
      rfeRisk: "high",
    },
    {
      id: "i485_photos",
      label: "2 Passport-Style Photos",
      description: "USCIS-compliant 2x2 inch photos, white background, taken within 30 days",
      required: true,
      category: "identity",
      rfeRisk: "medium",
      tips: "Write your name and A-number (if any) lightly in pencil on the back",
    },
    {
      id: "i485_passport_copy",
      label: "Copy of Valid Passport (all pages)",
      description: "Biographical page and all pages with stamps, visas, or annotations",
      required: true,
      category: "identity",
      rfeRisk: "medium",
    },
    {
      id: "i485_birth_cert",
      label: "Birth Certificate with English Translation",
      description: "Official birth certificate; if not in English, include certified translation",
      required: true,
      category: "identity",
      rfeRisk: "high",
      tips: "Translation must include a certification statement from the translator",
    },
    {
      id: "i485_i94",
      label: "I-94 Arrival/Departure Record",
      description: "Print from CBP website: i94.cbp.dhs.gov",
      required: true,
      category: "legal",
      rfeRisk: "medium",
    },
    {
      id: "i485_i693",
      label: "Form I-693 (Medical Examination)",
      description: "Completed by a USCIS-designated civil surgeon; sealed envelope",
      required: true,
      category: "medical",
      rfeRisk: "high",
      tips: "Must be completed no more than 60 days before filing and is valid for 2 years from the civil surgeon's signature",
    },
    {
      id: "i485_i864",
      label: "Form I-864 (Affidavit of Support)",
      description: "Required for family-based and some employment-based applicants",
      required: true,
      category: "forms",
      rfeRisk: "high",
    },
    {
      id: "i485_tax_returns",
      label: "Federal Tax Returns (3 years)",
      description: "IRS transcripts or copies of filed returns with W-2s for the sponsor",
      required: true,
      category: "financial",
      rfeRisk: "high",
      tips: "Order IRS transcripts at irs.gov/individuals/get-transcript for fastest processing",
    },
    {
      id: "i485_employment_letter",
      label: "Employment Verification Letter",
      description: "Current employer letter showing job title, salary, and start date",
      required: true,
      category: "financial",
      rfeRisk: "medium",
    },
    {
      id: "i485_police_clearance",
      label: "Police Clearance Certificate",
      description: "From all countries where you lived 6+ months after age 16",
      required: false,
      category: "legal",
      rfeRisk: "medium",
      tips: "Not always required but strongly recommended; some countries take months to issue",
    },
    {
      id: "i485_court_records",
      label: "Court/Criminal Records (if applicable)",
      description: "Certified dispositions for any arrests, charges, or convictions",
      required: false,
      category: "legal",
      rfeRisk: "high",
      tips: "Even dismissed or expunged records should be disclosed and documented",
    },
    {
      id: "i485_marriage_cert",
      label: "Marriage Certificate (if married)",
      description: "Certified copy with English translation if needed",
      required: false,
      category: "identity",
      rfeRisk: "medium",
    },
    {
      id: "i485_divorce_decree",
      label: "Divorce Decree (if previously married)",
      description: "Proof of termination of all prior marriages",
      required: false,
      category: "identity",
      rfeRisk: "high",
      tips: "Missing divorce documentation is a common RFE trigger",
    },
    {
      id: "i485_i140_approval",
      label: "I-140 Approval Notice (employment-based)",
      description: "Copy of the approved immigrant petition",
      required: false,
      category: "forms",
      rfeRisk: "high",
    },
    {
      id: "i485_i130_approval",
      label: "I-130 Approval Notice (family-based)",
      description: "Copy of the approved family petition",
      required: false,
      category: "forms",
      rfeRisk: "high",
    },
    {
      id: "i485_bona_fide_evidence",
      label: "Evidence of Bona Fide Relationship (spouse cases)",
      description: "Joint bank statements, lease, utilities, photos together, affidavits",
      required: false,
      category: "evidence",
      rfeRisk: "high",
      tips: "The more evidence the better; aim for 10+ items across different categories",
    },
    {
      id: "i485_filing_fee",
      label: "Filing Fee ($1,140 or current amount)",
      description: "Check or money order payable to U.S. Department of Homeland Security",
      required: true,
      category: "financial",
      rfeRisk: "low",
    },
    {
      id: "i485_biometric_fee",
      label: "Biometric Services Fee ($85)",
      description: "Required for applicants aged 14-78",
      required: true,
      category: "financial",
      rfeRisk: "low",
    },
    {
      id: "i485_i765",
      label: "Form I-765 (EAD Application, optional)",
      description: "Apply for work authorization while I-485 is pending",
      required: false,
      category: "forms",
      rfeRisk: "low",
      tips: "No additional fee when filed concurrently with I-485",
    },
    {
      id: "i485_i131",
      label: "Form I-131 (Advance Parole, optional)",
      description: "Apply for travel authorization while I-485 is pending",
      required: false,
      category: "forms",
      rfeRisk: "low",
      tips: "No additional fee when filed concurrently with I-485",
    },
  ],
};

export const i130Checklist: DocumentChecklist = {
  formNumber: "I-130",
  visaType: "Family Petition",
  title: "I-130 Document Checklist",
  items: [
    {
      id: "i130_form",
      label: "Form I-130 (completed and signed)",
      description: "Petition for alien relative",
      required: true,
      category: "forms",
      rfeRisk: "high",
    },
    {
      id: "i130_petitioner_citizenship",
      label: "Proof of U.S. Citizenship or LPR Status",
      description: "Birth certificate, naturalization certificate, passport, or green card",
      required: true,
      category: "identity",
      rfeRisk: "high",
    },
    {
      id: "i130_marriage_cert",
      label: "Marriage Certificate",
      description: "Civil marriage certificate for spouse petitions",
      required: true,
      category: "identity",
      rfeRisk: "high",
    },
    {
      id: "i130_photos",
      label: "2 Passport-Style Photos (petitioner and beneficiary)",
      description: "USCIS-compliant 2x2 inch photos for each person",
      required: true,
      category: "identity",
      rfeRisk: "medium",
    },
    {
      id: "i130_bona_fide",
      label: "Evidence of Bona Fide Marriage",
      description: "Joint accounts, lease, insurance, photos, affidavits from friends/family",
      required: true,
      category: "evidence",
      rfeRisk: "high",
      tips: "This is the #1 RFE trigger for spouse petitions. Submit as much as possible.",
    },
    {
      id: "i130_prior_marriage_termination",
      label: "Proof of Termination of Prior Marriages",
      description: "Divorce decrees, annulment records, or death certificates",
      required: false,
      category: "identity",
      rfeRisk: "high",
    },
    {
      id: "i130_filing_fee",
      label: "Filing Fee ($535 or current amount)",
      description: "Check or money order payable to U.S. Department of Homeland Security",
      required: true,
      category: "financial",
      rfeRisk: "low",
    },
    {
      id: "i130_beneficiary_passport",
      label: "Beneficiary Passport Copy",
      description: "Copy of the beneficiary's valid passport biographical page",
      required: true,
      category: "identity",
      rfeRisk: "medium",
    },
    {
      id: "i130_beneficiary_birth_cert",
      label: "Beneficiary Birth Certificate",
      description: "With English translation if not in English",
      required: true,
      category: "identity",
      rfeRisk: "medium",
    },
  ],
};

export const eb1aChecklist: DocumentChecklist = {
  formNumber: "I-140",
  visaType: "EB-1A Extraordinary Ability",
  title: "EB-1A Document Checklist",
  items: [
    {
      id: "eb1a_form",
      label: "Form I-140 (completed and signed)",
      description: "Immigrant Petition for Alien Workers",
      required: true,
      category: "forms",
      rfeRisk: "high",
    },
    {
      id: "eb1a_evidence_letter",
      label: "Petition Letter / Cover Letter",
      description: "Detailed letter explaining how you meet at least 3 of 10 criteria",
      required: true,
      category: "evidence",
      rfeRisk: "high",
      tips: "This is the backbone of your case. Be specific with evidence for each criterion.",
    },
    {
      id: "eb1a_awards",
      label: "Awards and Honors Documentation",
      description: "Certificates, letters, news coverage of nationally/internationally recognized awards",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_memberships",
      label: "Professional Association Memberships",
      description: "Membership in associations requiring outstanding achievement",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_media",
      label: "Published Material About You",
      description: "News articles, interviews, profiles in major media",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_judging",
      label: "Evidence of Judging Others' Work",
      description: "Peer review records, panel invitations, editorial board memberships",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_original_contributions",
      label: "Original Contributions of Major Significance",
      description: "Patents, research papers with high citation counts, expert letters",
      required: false,
      category: "evidence",
      rfeRisk: "high",
      tips: "Expert recommendation letters from independent professionals in your field are very powerful here",
    },
    {
      id: "eb1a_scholarly_articles",
      label: "Scholarly Articles in Professional Journals",
      description: "Published research papers, books, or articles",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_exhibitions",
      label: "Exhibition/Showcase Evidence",
      description: "For artists: gallery shows, performances, exhibitions",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_leading_role",
      label: "Leading or Critical Role Evidence",
      description: "Org charts, letters from employers, revenue impact documentation",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_high_salary",
      label: "High Salary / Remuneration Evidence",
      description: "Pay stubs, contracts, tax returns showing compensation above peers",
      required: false,
      category: "financial",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_commercial_success",
      label: "Commercial Success in Performing Arts",
      description: "Box office records, sales figures, ratings data",
      required: false,
      category: "evidence",
      rfeRisk: "medium",
    },
    {
      id: "eb1a_expert_letters",
      label: "Expert Recommendation Letters (5-8 recommended)",
      description: "From recognized experts in your field, ideally independent",
      required: true,
      category: "evidence",
      rfeRisk: "high",
      tips: "Mix of dependent (colleagues) and independent (people who know your work but haven't worked with you)",
    },
    {
      id: "eb1a_filing_fee",
      label: "Filing Fee ($700 or current amount)",
      description: "Check or money order payable to U.S. Department of Homeland Security",
      required: true,
      category: "financial",
      rfeRisk: "low",
    },
  ],
};

/** Get checklist by form number */
export function getChecklist(formNumber: string): DocumentChecklist | null {
  const normalized = formNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized === "I485") return i485Checklist;
  if (normalized === "I130") return i130Checklist;
  if (normalized === "I140" || normalized === "EB1A") return eb1aChecklist;
  return null;
}

/** Get all available checklists */
export function getAllChecklists(): DocumentChecklist[] {
  return [i485Checklist, i130Checklist, eb1aChecklist];
}
