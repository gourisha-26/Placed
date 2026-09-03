/**
 * The demo student. One source of truth so the onboarding form,
 * Profile and the resume preview never drift apart.
 */
export const STUDENT = {
  fullName: "Gourisha Goel",
  /** Used for greetings — "Good morning, Gourisha". */
  firstName: "Gourisha",
  initial: "G",
  email: "gourisha.goel@vit.ac.in",
  // the mailbox placED watches - separate from the college address,
  // because that is the one recruiters actually reply to
  gmail: "gourisha.goel@gmail.com",
  phone: "9876543210",
  dob: "2004-03-12",
  degree: "B.Tech",
  graduating: "2026",
  branch: "Computer Science",
  branchShort: "CSE",
  cgpa: "8.4",
  backlogs: "None",
  class12: "92",
  class10: "94",
  backlogHistory: "None",
  college: "VIT Vellore",
  rollNo: "20BCE1234",
} as const;

export const DEGREES = [
  "B.Tech",
  "B.E.",
  "B.Sc",
  "BCA",
  "M.Tech",
  "MCA",
  "MBA",
];

export const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical",
  "Civil",
  "Data Science",
];

export const GRAD_YEARS = ["2025", "2026", "2027", "2028"];

export const BACKLOG_COUNTS = ["None", "1", "2", "3 or more"];

export const BACKLOG_HISTORY = [
  "None",
  "Had some, all cleared",
  "Some still pending",
];
