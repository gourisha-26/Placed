import { STUDENT } from "./student";

/**
 * What the scan pulled off the posting. Nine fields, one of which the
 * reader was not sure about - that flag is the reason the review step
 * exists at all.
 */
export type CapturedField = {
  id: string;
  label: string;
  value: string;
  /** the reader could not read this cleanly */
  flagged?: boolean;
  note?: string;
};

export const CAPTURE_SOURCE = {
  url: "careers.adobe.com",
  fullUrl: "careers.adobe.com/jobs/uiux...",
  at: "16 Aug, 9:41 AM",
};

/**
 * The posting the widget reads. Every extracted field below has to be
 * visible on this page - that is the whole point of the simulation.
 */
export const POSTING = {
  company: "Adobe",
  role: "UI/UX Designer",
  meta: "Bengaluru · Hybrid · Full time + 6 month internship",
  facts: [
    ["Apply by", "18 Aug 2026"],
    ["Eligibility", "CGPA 7.0+, no active backlogs"],
    ["Compensation", "₹18–22 LPA"],
    ["Requisition", "ADB-2026-UX-114"],
  ] as const,
  aboutHeading: "About the role",
  about:
    "You'll work with product and engineering to design flows across Adobe's creative tools. We're looking for strong fundamentals in interaction design, comfort with Figma, and evidence of user research in your portfolio.",
  skills: "Skills: Figma, prototyping, user research, design systems",
};

export const CAPTURED: CapturedField[] = [
  { id: "company", label: "Company", value: "Adobe" },
  { id: "role", label: "Role", value: "UI/UX designer" },
  {
    id: "deadline",
    label: "Deadline",
    value: "18 Aug",
    flagged: true,
    note: "Read as “18 Aug ?” - the posting text was blurred here.",
  },
  { id: "eligibility", label: "Eligibility", value: "CGPA 7.0+ · no active backlogs" },
  { id: "location", label: "Location", value: "Bengaluru · Hybrid" },
  { id: "type", label: "Employment type", value: "Full time + 6 month internship" },
  { id: "stipend", label: "Stipend / CTC", value: "₹18–22 LPA" },
  { id: "jobId", label: "Job ID", value: "ADB-2026-UX-114" },
  {
    id: "link",
    label: "Application link",
    value: "careers.adobe.com/apply/ADB-2026-UX-114",
  },
];

/** What saving actually does, spelled out before you commit to it. */
export const ON_SAVE = [
  "Added to Journey as Saved",
  "18 Aug deadline added to Calendar",
  "We'll suggest the resume version that best fits this role",
  `We'll watch ${STUDENT.gmail} for updates`,
];
