/**
 * I-130 Form Definition
 * Petition for Alien Relative
 * 
 * A form used to petition for immediate relatives, family preference
 * beneficiaries, widows/widowers, and orphans to immigrate to the US
 */

export type FieldType =
  | "text"
  | "date"
  | "select"
  | "checkbox"
  | "textarea"
  | "ssn"
  | "phone"
  | "address";

export type RiskLevel = "low" | "medium" | "high";

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: any;
  message: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  section: string;
  helpText?: string;
  validationRules?: ValidationRule[];
  rfeRisk: RiskLevel;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormDefinition {
  id: string;
  formNumber: string;
  title: string;
  description: string;
  effectiveDate: string;
  sections: FormSection[];
  fieldCount: number;
  estimatedTime: number; // in minutes
}

// Part 1: Information About You (Petitioner)
const part1Fields: FormField[] = [
  {
    id: "i130_petitioner_name_first",
    label: "First Name",
    type: "text",
    required: true,
    section: "part1",
    helpText: "Your first name as shown on your legal documents",
    validationRules: [
      { type: "required", message: "First name is required" },
      { type: "maxLength", value: 50, message: "First name must be 50 characters or less" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_name_middle",
    label: "Middle Name(s)",
    type: "text",
    required: false,
    section: "part1",
    helpText: "Your middle name(s) if applicable",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_name_last",
    label: "Last Name / Family Name",
    type: "text",
    required: true,
    section: "part1",
    helpText: "Your last name / family name as shown on your legal documents",
    validationRules: [
      { type: "required", message: "Last name is required" },
      { type: "maxLength", value: 50, message: "Last name must be 50 characters or less" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_date_of_birth",
    label: "Date of Birth",
    type: "date",
    required: true,
    section: "part1",
    helpText: "Your date of birth in MM/DD/YYYY format",
    validationRules: [
      { type: "required", message: "Date of birth is required" },
      { type: "pattern", value: "^(0[1-9]|1[0-2])/([0-2][0-9]|3[0-1])/\\d{4}$", message: "Date must be in MM/DD/YYYY format" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_gender",
    label: "Gender",
    type: "select",
    required: true,
    section: "part1",
    helpText: "Your gender",
    options: [
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_citizenship",
    label: "Country of Citizenship",
    type: "text",
    required: true,
    section: "part1",
    helpText: "The country where you are a citizen",
    validationRules: [
      { type: "required", message: "Country of citizenship is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_alien_number",
    label: "USCIS Number",
    type: "text",
    required: false,
    section: "part1",
    helpText: "Your A-Number or USCIS number if you have received an I-94, I-97, or similar document",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_green_card_receipt",
    label: "Green Card / Permanent Resident Card Receipt Number",
    type: "text",
    required: false,
    section: "part1",
    helpText: "Receipt number of your green card if applicable",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_state_of_residence",
    label: "State of Current Residence",
    type: "text",
    required: true,
    section: "part1",
    helpText: "State where you currently reside",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_current_immigration_status",
    label: "Current Immigration Status",
    type: "select",
    required: true,
    section: "part1",
    helpText: "Your current immigration status in the United States",
    options: [
      { value: "USC", label: "U.S. Citizen" },
      { value: "LPR", label: "Lawful Permanent Resident (Green Card Holder)" },
      { value: "Special", label: "Special Immigrant" },
      { value: "Refugee", label: "Refugee" },
      { value: "Asylee", label: "Asylee" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_naturalization_date",
    label: "Date of Naturalization",
    type: "date",
    required: false,
    section: "part1",
    helpText: "Date you became a U.S. citizen (if applicable)",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_citizenship_country",
    label: "Country Where You Became a U.S. Citizen",
    type: "text",
    required: false,
    section: "part1",
    helpText: "Country where naturalization took place (if applicable)",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_green_card_issue_date",
    label: "Date Green Card Was Issued",
    type: "date",
    required: false,
    section: "part1",
    helpText: "Date your green card was issued (if applicable)",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_occupation",
    label: "Occupation",
    type: "text",
    required: false,
    section: "part1",
    helpText: "Your current occupation or job title",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_annual_income",
    label: "Annual Income (Gross)",
    type: "text",
    required: false,
    section: "part1",
    helpText: "Your gross annual household income in U.S. dollars",
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_address_street",
    label: "Street Address",
    type: "address",
    required: true,
    section: "part1",
    helpText: "Your current street address",
    validationRules: [
      { type: "required", message: "Street address is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_address_city",
    label: "City / Town",
    type: "text",
    required: true,
    section: "part1",
    helpText: "City or town of your current residence",
    validationRules: [
      { type: "required", message: "City is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_address_zip",
    label: "ZIP Code",
    type: "text",
    required: true,
    section: "part1",
    helpText: "ZIP code of your residence",
    validationRules: [
      { type: "required", message: "ZIP code is required" },
      { type: "pattern", value: "^\\d{5}(-\\d{4})?$", message: "Must be valid ZIP code format (12345 or 12345-6789)" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_phone",
    label: "Phone Number",
    type: "phone",
    required: true,
    section: "part1",
    helpText: "Your daytime phone number including country code",
    validationRules: [
      { type: "required", message: "Phone number is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_email",
    label: "Email Address",
    type: "text",
    required: true,
    section: "part1",
    helpText: "Your email address for correspondence",
    validationRules: [
      { type: "required", message: "Email address is required" },
      { type: "pattern", value: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message: "Must be a valid email address" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_petitioner_uscis_office",
    label: "USCIS Office / Service Center",
    type: "select",
    required: false,
    section: "part1",
    helpText: "The USCIS office or service center handling your case",
    options: [
      { value: "VSC", label: "Vermont Service Center" },
      { value: "TSC", label: "Texas Service Center" },
      { value: "NSC", label: "Nebraska Service Center" },
      { value: "WSC", label: "West Service Center" },
    ],
    rfeRisk: "low",
  },
];

// Part 2: Information About Your Relative (Beneficiary)
const part2Fields: FormField[] = [
  {
    id: "i130_beneficiary_name_first",
    label: "First Name",
    type: "text",
    required: true,
    section: "part2",
    helpText: "Beneficiary's first name",
    validationRules: [
      { type: "required", message: "Beneficiary first name is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_name_middle",
    label: "Middle Name(s)",
    type: "text",
    required: false,
    section: "part2",
    helpText: "Beneficiary's middle name(s) if applicable",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_name_last",
    label: "Last Name / Family Name",
    type: "text",
    required: true,
    section: "part2",
    helpText: "Beneficiary's last name",
    validationRules: [
      { type: "required", message: "Beneficiary last name is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_date_of_birth",
    label: "Date of Birth",
    type: "date",
    required: true,
    section: "part2",
    helpText: "Beneficiary's date of birth",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_gender",
    label: "Gender",
    type: "select",
    required: true,
    section: "part2",
    options: [
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_citizenship",
    label: "Country of Birth",
    type: "text",
    required: true,
    section: "part2",
    helpText: "Country where beneficiary was born",
    validationRules: [
      { type: "required", message: "Country of birth is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_current_citizenship",
    label: "Country of Citizenship",
    type: "text",
    required: true,
    section: "part2",
    helpText: "Country where beneficiary is currently a citizen",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_passport_number",
    label: "Passport Number",
    type: "text",
    required: false,
    section: "part2",
    helpText: "Beneficiary's passport number if available",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_national_id",
    label: "National Identification Number",
    type: "text",
    required: false,
    section: "part2",
    helpText: "National ID, driver's license, or similar identification number",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_relationship",
    label: "Relationship to You",
    type: "select",
    required: true,
    section: "part2",
    helpText: "Select your relationship to the beneficiary",
    options: [
      { value: "spouse", label: "Spouse" },
      { value: "parent", label: "Parent" },
      { value: "child", label: "Unmarried Child" },
      { value: "sibling", label: "Brother or Sister" },
      { value: "orphan", label: "Orphan" },
      { value: "widow", label: "Widow(er)" },
    ],
    rfeRisk: "medium",
  },
  {
    id: "i130_beneficiary_current_location",
    label: "Current Location (Country and City)",
    type: "text",
    required: true,
    section: "part2",
    helpText: "Where the beneficiary currently resides",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_visa_status",
    label: "Current Immigration Status",
    type: "select",
    required: true,
    section: "part2",
    helpText: "Beneficiary's current immigration status",
    options: [
      { value: "USC", label: "U.S. Citizen" },
      { value: "LPR", label: "Lawful Permanent Resident" },
      { value: "F1", label: "F-1 Student" },
      { value: "H1B", label: "H-1B Worker" },
      { value: "L1", label: "L-1 Intracompany Transferee" },
      { value: "Undocumented", label: "Undocumented" },
      { value: "Other", label: "Other" },
    ],
    rfeRisk: "medium",
  },
  {
    id: "i130_beneficiary_ever_worked_us",
    label: "Has the beneficiary ever worked in the United States?",
    type: "checkbox",
    required: false,
    section: "part2",
    rfeRisk: "medium",
  },
  {
    id: "i130_beneficiary_us_visits",
    label: "Has the beneficiary ever been to the United States?",
    type: "checkbox",
    required: false,
    section: "part2",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_police_record",
    label: "Does the beneficiary have any criminal convictions or police records?",
    type: "checkbox",
    required: false,
    section: "part2",
    rfeRisk: "high",
  },
  {
    id: "i130_beneficiary_health_issues",
    label: "Does the beneficiary have any health conditions requiring vaccination exemptions?",
    type: "checkbox",
    required: false,
    section: "part2",
    rfeRisk: "medium",
  },
  {
    id: "i130_beneficiary_education_level",
    label: "Highest Level of Education",
    type: "select",
    required: false,
    section: "part2",
    options: [
      { value: "elementary", label: "Elementary School" },
      { value: "middle", label: "Middle School" },
      { value: "high", label: "High School / Secondary" },
      { value: "associate", label: "Associate Degree" },
      { value: "bachelor", label: "Bachelor's Degree" },
      { value: "master", label: "Master's Degree" },
      { value: "phd", label: "Ph.D. or Equivalent" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_occupation",
    label: "Current or Most Recent Occupation",
    type: "text",
    required: false,
    section: "part2",
    helpText: "Job title or profession",
    rfeRisk: "low",
  },
];

// Part 3: Information About Your Relative (continued)
const part3Fields: FormField[] = [
  {
    id: "i130_beneficiary_prev_names",
    label: "Has the beneficiary ever used any other names?",
    type: "checkbox",
    required: false,
    section: "part3",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_prev_names_list",
    label: "Previous Names Used",
    type: "textarea",
    required: false,
    section: "part3",
    helpText: "List any previous names the beneficiary has used (maiden name, nicknames, legal name changes, etc.)",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_previous_immigration_petition",
    label: "Has an immigrant petition ever been filed for the beneficiary?",
    type: "checkbox",
    required: false,
    section: "part3",
    rfeRisk: "high",
  },
  {
    id: "i130_beneficiary_previous_petition_details",
    label: "Details of Previous Petition",
    type: "textarea",
    required: false,
    section: "part3",
    helpText: "Provide details of any previous immigration petition filed for the beneficiary",
    rfeRisk: "high",
  },
  {
    id: "i130_beneficiary_marriage_history",
    label: "Number of Times Married",
    type: "select",
    required: true,
    section: "part3",
    options: [
      { value: "0", label: "Never married" },
      { value: "1", label: "Married once" },
      { value: "2", label: "Married twice" },
      { value: "3", label: "Married three times" },
      { value: "4+", label: "Married four or more times" },
    ],
    rfeRisk: "medium",
  },
  {
    id: "i130_beneficiary_current_marriage_status",
    label: "Current Marital Status",
    type: "select",
    required: true,
    section: "part3",
    options: [
      { value: "single", label: "Single / Never Married" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
      { value: "legally_separated", label: "Legally Separated" },
    ],
    rfeRisk: "medium",
  },
  {
    id: "i130_beneficiary_children",
    label: "Number of Children (Any Age, Living or Deceased)",
    type: "text",
    required: false,
    section: "part3",
    placeholder: "Enter number",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_parents_alive",
    label: "Are Both Parents Living?",
    type: "select",
    required: false,
    section: "part3",
    options: [
      { value: "both_alive", label: "Both parents are living" },
      { value: "father_alive", label: "Father only is living" },
      { value: "mother_alive", label: "Mother only is living" },
      { value: "neither_alive", label: "Neither parent is living" },
      { value: "unknown", label: "Unknown" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_siblings",
    label: "Number of Siblings",
    type: "text",
    required: false,
    section: "part3",
    placeholder: "Enter number",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_parents_us_status",
    label: "Do either of the beneficiary's parents have U.S. citizenship or permanent residency?",
    type: "checkbox",
    required: false,
    section: "part3",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_person_preparing_form",
    label: "Is someone other than the beneficiary preparing this form?",
    type: "checkbox",
    required: false,
    section: "part3",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_interpreter_needed",
    label: "Does the beneficiary require an interpreter?",
    type: "checkbox",
    required: false,
    section: "part3",
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_interpreter_language",
    label: "Interpreter Language",
    type: "text",
    required: false,
    section: "part3",
    helpText: "Language in which interpreter is needed",
    rfeRisk: "low",
  },
];

// Part 4: Additional Information
const part4Fields: FormField[] = [
  {
    id: "i130_declaration_true",
    label: "I declare under penalty of perjury that the foregoing is true and correct.",
    type: "checkbox",
    required: true,
    section: "part4",
    validationRules: [
      { type: "required", message: "You must certify that the information is true and correct" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_signature_date",
    label: "Date of Signature",
    type: "date",
    required: true,
    section: "part4",
    helpText: "Date you are signing this form",
    validationRules: [
      { type: "required", message: "Signature date is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_declaration",
    label: "I declare under penalty of perjury that the foregoing is true and correct. (Beneficiary Signature)",
    type: "checkbox",
    required: true,
    section: "part4",
    helpText: "Beneficiary must also declare the information is true",
    validationRules: [
      { type: "required", message: "Beneficiary must certify the information" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_beneficiary_signature_date",
    label: "Date of Beneficiary Signature",
    type: "date",
    required: true,
    section: "part4",
    validationRules: [
      { type: "required", message: "Beneficiary signature date is required" },
    ],
    rfeRisk: "low",
  },
  {
    id: "i130_attorney_representative",
    label: "Is an attorney or representative completing this form on your behalf?",
    type: "checkbox",
    required: false,
    section: "part4",
    rfeRisk: "low",
  },
  {
    id: "i130_attorney_name",
    label: "Attorney/Representative Name",
    type: "text",
    required: false,
    section: "part4",
    rfeRisk: "low",
  },
  {
    id: "i130_attorney_phone",
    label: "Attorney/Representative Phone",
    type: "phone",
    required: false,
    section: "part4",
    rfeRisk: "low",
  },
  {
    id: "i130_attorney_fax",
    label: "Attorney/Representative Fax",
    type: "text",
    required: false,
    section: "part4",
    rfeRisk: "low",
  },
  {
    id: "i130_supplemental_info",
    label: "Supplemental Information or Explanation",
    type: "textarea",
    required: false,
    section: "part4",
    helpText: "Use this space if you need to provide additional information or clarification",
    rfeRisk: "low",
  },
  {
    id: "i130_supporting_documents",
    label: "Supporting Documents Attached",
    type: "textarea",
    required: false,
    section: "part4",
    helpText: "List all supporting documents you are submitting with this form",
    rfeRisk: "low",
  },
];

export const i130FormDefinition: FormDefinition = {
  id: "i-130",
  formNumber: "I-130",
  title: "Petition for Alien Relative",
  description:
    "This form is filed by a U.S. citizen or lawful permanent resident to petition for an immediate relative, family preference beneficiary, widow(er), or orphan. It is the first step in the family-based immigration process.",
  effectiveDate: "03/01/2023",
  sections: [
    {
      id: "part1",
      title: "Part 1: Information About You (Petitioner)",
      description: "Provide your personal and contact information",
      fields: part1Fields,
    },
    {
      id: "part2",
      title: "Part 2: Information About Your Relative (Beneficiary)",
      description: "Provide information about the person you are petitioning for",
      fields: part2Fields,
    },
    {
      id: "part3",
      title: "Part 3: Information About Your Relative (Continued)",
      description: "Additional information about the beneficiary",
      fields: part3Fields,
    },
    {
      id: "part4",
      title: "Part 4: Additional Information",
      description: "Signatures, certification, and supplemental information",
      fields: part4Fields,
    },
  ],
  fieldCount: part1Fields.length + part2Fields.length + part3Fields.length + part4Fields.length,
  estimatedTime: 45,
};

export default i130FormDefinition;
