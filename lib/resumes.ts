import { STUDENT } from "./student";

/**
 * The five resume versions. One list, so the Profile card, the Resumes
 * screen and the preview can never disagree about how many there are or
 * which one is the default.
 */
export type Resume = {
  version: string;
  /** what this version is aimed at */
  focus: string;
  updated: string;
  size: string;
  /** the role line at the top of the document */
  role: string;
  skills: string[];
};

export const RESUMES: Resume[] = [
  {
    version: "V5",
    focus: "Design roles",
    updated: "updated 2 Aug",
    size: "214 KB",
    role: "UI/UX Designer",
    skills: ["Figma", "User research", "Prototyping", "Design systems"],
  },
  {
    version: "V4",
    focus: "General",
    updated: "updated 22 Jul",
    size: "198 KB",
    role: "Computer Science Undergraduate",
    skills: ["Python", "SQL", "Figma", "Communication"],
  },
  {
    version: "V3",
    focus: "Dev roles",
    updated: "updated 18 Jul",
    size: "206 KB",
    role: "Frontend Developer",
    skills: ["Figma", "Prototyping", "React", "Git"],
  },
  {
    version: "V2",
    focus: "Analyst roles",
    updated: "updated 2 Jul",
    size: "191 KB",
    role: "Data Analyst",
    skills: ["User research", "SQL", "Excel", "Power BI"],
  },
  {
    version: "V1",
    focus: "General",
    updated: "updated 14 Jun",
    size: "184 KB",
    role: "Computer Science Undergraduate",
    skills: ["C++", "Data structures", "HTML and CSS", "Teamwork"],
  },
];

export const DEFAULT_RESUME = "V5";

export const getResume = (v: string) =>
  RESUMES.find((r) => r.version === v);

export const fileName = (v: string) =>
  `${STUDENT.fullName.replace(/ /g, "_")}_Resume_${v}.pdf`;

/**
 * The body of the document. Experience and education are facts about the
 * student, so they are the same on every version - only the role line and
 * the skills change, which is what actually differs between them.
 */
export const EXPERIENCE = [
  {
    title: "Product Design Intern — Zeta Labs",
    meta: "May 2025 – Jul 2025  ·  Bengaluru",
    body: "Redesigned the onboarding flow for a fintech app, cutting drop-off by 18%. Ran 12 user interviews and built the design system used across 3 product teams.",
  },
  {
    title: "UI/UX Freelance — Self-employed",
    meta: "Jan 2025 – Apr 2025",
    body: "Designed and prototyped a campus event-booking app for VIT's student council, from wireframes to a clickable Figma prototype used in the council's pitch.",
  },
];

export const EDUCATION = {
  title: `${STUDENT.degree}, ${STUDENT.branch} — ${STUDENT.college}`,
  meta: `2022 – ${STUDENT.graduating}  ·  CGPA ${STUDENT.cgpa}`,
};
