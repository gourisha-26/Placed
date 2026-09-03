import { STUDENT } from "./student";

/**
 * The email placED read, and what it concluded from it. Task 4 is about
 * showing its working, so the quoted phrase and the status it produced
 * are stored separately - the screen highlights the phrase inside the
 * message rather than restating it.
 */
export const INFERENCE = {
  from: "careers-noreply@adobe.com",
  sender: "Adobe Talent Acquisition",
  date: "16 Aug",
  time: "9:42 AM",
  subject: "Your Adobe application",
  greeting: `Hi ${STUDENT.firstName},`,
  body: "Thank you for your interest in the UI/UX Designer role. We're moving your profile forward for review.",
  /** the words that triggered it, quoted back verbatim */
  phrase: "Moving your profile forward",
  status: "Shortlisted",
  /** what the status goes back to if the read was wrong */
  fallback: "Applied",
};

/** The application's history, which the timeline draws. */
export const TIMELINE = [
  { title: "Captured", meta: "12 Aug · from the Adobe careers page" },
  { title: "Applied", meta: "13 Aug · Resume V5 attached" },
];
