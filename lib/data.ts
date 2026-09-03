/**
 * The 12 tracked applications. One dataset so Home, Journey and the
 * filter counts can never disagree — the mismatch that had to be fixed
 * by hand in the Figma file.
 *
 * 12 tracked = 4 saved + 8 applied
 * Of the 8 applied: 3 in process, 1 offer, 1 closed, 3 waiting
 */

export type Priority = "high" | "medium" | "low";
export type Bucket = "saved" | "waiting" | "inprocess" | "offer" | "closed";

export type Application = {
  id: string;
  company: string;
  role: string;
  stage: string;
  /** what happens next - the framing Journey uses */
  meta: string;
  priority: Priority;
  bucket: Bucket;
  /** shown in Home's "Needs attention" */
  needsAttention?: boolean;
  /** shown in Home's "Since yesterday" - what *changed*, which is a
   *  different question from what's next, so it carries its own line
   *  and urgency rather than reusing the one above. */
  recent?: { meta: string; priority: Priority };
};

export const APPLICATIONS: Application[] = [
  // ordered by how soon each needs you: Adobe closes in 2 days, Zoho in 4
  {
    id: "adobe",
    company: "Adobe",
    role: "UI/UX designer · not applied yet",
    stage: "Saved",
    meta: "Closes in 2 days",
    bucket: "saved",
    priority: "high",
    needsAttention: true,
    recent: { meta: "Captured from the Adobe careers page · 2h ago", priority: "medium" },
  },
  {
    id: "zoho",
    company: "Zoho",
    role: "Developer · not applied yet",
    stage: "Saved",
    meta: "Closes in 4 days",
    bucket: "saved",
    priority: "high",
    needsAttention: true,
  },
  {
    id: "tcs",
    company: "TCS",
    role: "Software engineer · Resume V5",
    stage: "Offer",
    meta: "Respond by 27 Aug",
    bucket: "offer",
    priority: "medium",
    needsAttention: true,
  },
  {
    id: "deloitte",
    company: "Deloitte",
    role: "Analyst · Resume V3",
    stage: "Interview",
    meta: "Round 2 tomorrow, 11:00 AM",
    bucket: "inprocess",
    priority: "medium",
    recent: { meta: "Round 2 tomorrow, 11:00 AM", priority: "medium" },
  },
  {
    id: "swiggy",
    company: "Swiggy",
    role: "Product designer · Resume V5",
    stage: "Assessment",
    meta: "Assessment today, 2:00 PM",
    bucket: "inprocess",
    priority: "high",
  },
  {
    id: "infosys",
    company: "Infosys",
    role: "Systems engineer · Resume V3",
    stage: "Assessment",
    // moved out of "waiting" when the assessment landed - it clashes
    // with the Deloitte interview, which is why it is high priority
    meta: "Assessment Fri 19 Aug · clashes with Deloitte",
    bucket: "inprocess",
    priority: "high",
  },
  {
    id: "zomato",
    company: "Zomato",
    role: "UX designer · Resume V5",
    stage: "Applied",
    meta: "Applied 8 days ago · no update yet",
    bucket: "waiting",
    priority: "low",
  },
  {
    id: "phonepe",
    company: "PhonePe",
    role: "Product designer · Resume V5",
    stage: "Applied",
    meta: "Applied 5 days ago · no update yet",
    bucket: "waiting",
    priority: "low",
  },
  {
    id: "wipro",
    company: "Wipro",
    role: "Product analyst · not applied",
    stage: "Saved",
    meta: "Closes 25 Aug",
    bucket: "saved",
    priority: "low",
  },
  {
    id: "mindtree",
    company: "Mindtree",
    role: "UI engineer · not applied",
    stage: "Saved",
    meta: "Closes 4 Sep",
    bucket: "saved",
    priority: "low",
  },
  {
    id: "freshworks",
    company: "Freshworks",
    role: "Design intern · not applied",
    stage: "Saved",
    meta: "No deadline listed",
    bucket: "saved",
    priority: "low",
  },
  {
    id: "flipkart",
    company: "Flipkart",
    role: "UI/UX designer · Resume V5",
    stage: "Not selected",
    meta: "Not selected at interview · 12 Aug",
    bucket: "closed",
    priority: "low",
  },
];

/**
 * Counts derived from a list, never hand-typed. Takes the list rather
 * than closing over APPLICATIONS so a captured job can be folded in.
 */
export function countsFor(list: Application[]) {
  return {
    total: list.length,
    saved: list.filter((a) => a.bucket === "saved").length,
    waiting: list.filter((a) => a.bucket === "waiting").length,
    inprocess: list.filter((a) => a.bucket === "inprocess").length,
    offer: list.filter((a) => a.bucket === "offer").length,
    closed: list.filter((a) => a.bucket === "closed").length,
  };
}

export const needsAttentionOf = (list: Application[]) =>
  list.filter((a) => a.needsAttention);
export const recentOf = (list: Application[]) => list.filter((a) => a.recent);

/** Defaults for anything rendered before the stored captures load. */
export const COUNTS = countsFor(APPLICATIONS);
export const NEEDS_ATTENTION = needsAttentionOf(APPLICATIONS);
export const RECENT = recentOf(APPLICATIONS);

/** Filter pills on Journey, in the order the design shows them. */
export const FILTERS = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "inprocess", label: "In process" },
  { id: "waiting", label: "Waiting" },
  { id: "offer", label: "Offer" },
  { id: "closed", label: "Closed" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

/**
 * Journey's "All" view. Items flagged for Needs action appear there and
 * are NOT repeated in their bucket section, so the section counts add up
 * to the tracked total with nothing shown twice.
 */
export function journeySections(list: Application[] = APPLICATIONS) {
  const flagged = list.filter((a) => a.needsAttention);
  const rest = list.filter((a) => !a.needsAttention);
  const inBucket = (...b: Bucket[]) =>
    rest.filter((a) => b.includes(a.bucket));

  return [
    { title: "Needs action", items: flagged },
    // an offer is still actively moving, so it sits with in-process
    { title: "In process", items: inBucket("inprocess", "offer") },
    { title: "Waiting", items: inBucket("waiting") },
    { title: "Saved", items: inBucket("saved") },
    { title: "Closed", items: inBucket("closed") },
  ].filter((s) => s.items.length > 0);
}

export function filterApplications(f: FilterId, list: Application[] = APPLICATIONS) {
  if (f === "all") return list;
  return list.filter((a) => a.bucket === f);
}

export const NEXT_UP = {
  eyebrow: "NEXT UP",
  countdown: "in 4h 20m",
  title: "Swiggy Assessment",
  meta: "2:00 - 3:00 PM  ·  60 min",
  primary: "View Job",
  secondary: "Open Assessment",
};

/* ------------------------------------------------------------------
   Calendar - 04 Calendar on the Main Screens page
   ------------------------------------------------------------------
   Events point at an application by id, so a company name can never
   drift between Journey and Calendar.

   The month is the one drawn in Figma: August 2026, week strip
   M15 T16 W17 T18 F19 S20 S21, today on the 16th. That strip only holds
   if the 1st is a Monday, so weekdays come from that internal calendar
   rather than the real 2026 one.
------------------------------------------------------------------ */

export const TODAY = "2026-08-16";
export const TOMORROW = "2026-08-17";
export const MONTH_LABEL = "August 2026";

/** Days counted from 1 August, which is a Monday here. */
function ordinal(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return (m === 9 ? 31 : 0) + d;
}

const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdayOf = (date: string) => WD[(ordinal(date) - 1) % 7];

const WD_LONG = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/** "Friday 19 August" - on the app's own calendar, not the real one. */
export function formatDayLong(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${WD_LONG[(ordinal(date) - 1) % 7]} ${d} ${m === 9 ? "September" : "August"}`;
}

export function formatDay(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${weekdayOf(date)} ${d} ${m === 9 ? "Sep" : "Aug"}`;
}

export function daysUntil(date: string) {
  return ordinal(date) - ordinal(TODAY);
}

export type EventKind =
  | "assessment"
  | "interview"
  | "deadline"
  | "offer"
  | "applied"
  | "closed";

export type CalEvent = {
  id: string;
  appId: string;
  /** YYYY-MM-DD */
  date: string;
  time?: string;
  /** minutes from midnight - only the day view needs them */
  startMin?: number;
  endMin?: number;
  /** the line under the company on the day view */
  sub?: string;
  where?: string;
  duration?: string;
  /** the facts that decide which one is easier to move */
  rows?: [string, string][];
  /** who the reschedule request goes to */
  contact?: string;
  /** how this event is referred to when it is the one being kept */
  keptAs?: string;
  /** the request written for this direction - assembling it from
   *  fragments produced "a Infosys assessment", so each is written out */
  draft?: { subject: string; body: string };
  kind: EventKind;
  /** the single coloured line under the company name */
  detail: string;
  /** id of the event this one runs into */
  clashesWith?: string;
};

export const EVENTS: CalEvent[] = [
  // already happened
  { id: "e1", appId: "infosys", date: "2026-08-04", kind: "applied", detail: "Applied · Resume V3" },
  { id: "e2", appId: "zomato", date: "2026-08-08", kind: "applied", detail: "Applied · Resume V5" },
  { id: "e3", appId: "phonepe", date: "2026-08-11", kind: "applied", detail: "Applied · Resume V5" },
  { id: "e4", appId: "flipkart", date: "2026-08-12", kind: "closed", detail: "Not selected at interview" },

  // today - drawn as the hero card, not as a row
  { id: "e5", appId: "swiggy", date: "2026-08-16", time: "2:00", kind: "assessment", detail: "Online assessment · 60 min" },
  { id: "e5b", appId: "adobe", date: "2026-08-18", kind: "deadline", detail: "Application closes" },

  // tomorrow
  { id: "e6", appId: "deloitte", date: "2026-08-17", time: "11:00", kind: "interview", detail: "Round 2 · technical · Google Meet" },

  // the rest of the week, including the overlap
  {
    id: "e7", appId: "deloitte", date: "2026-08-19", time: "11:00",
    startMin: 11 * 60, endMin: 11 * 60 + 45,
    kind: "interview", sub: "Interview · round 3, final", where: "Google Meet",
    duration: "45 min",
    rows: [
      ["Round reached", "3 of 3 — final"],
      ["Format", "Google Meet"],
      ["Set by", "Recruiter"],
    ],
    contact: "Aditi Mehta · Deloitte recruiting",
    keptAs: "the Deloitte final round",
    draft: {
      subject: "Request to reschedule - round 3, 19 Aug",
      body: `Hi Aditi,

I have a campus assessment scheduled at 11:30 AM on 19 August that I can't move. Would it be possible to shift our round 3 interview to later that day, or to 20 August?

Apologies for the short notice.

{name} · {roll}`,
    },
    detail: "Round 3 - clashes with Infosys", clashesWith: "e8",
  },
  {
    id: "e8", appId: "infosys", date: "2026-08-19", time: "11:30",
    startMin: 11 * 60 + 30, endMin: 13 * 60,
    kind: "assessment", sub: "Assessment · round 1 of 4", where: "proctored, on campus",
    duration: "90 min",
    rows: [
      ["Round reached", "1 of 4"],
      ["Format", "Proctored, on campus"],
      ["Set by", "Placement cell"],
    ],
    contact: "placements@vit.ac.in",
    keptAs: "the Infosys assessment",
    draft: {
      subject: "Request for a different Infosys assessment slot - 19 Aug",
      body: `Hello,

I have my final round Deloitte interview at 11:00 AM on 19 August, and the recruiter set that time. Could I be moved to a different Infosys assessment slot that day?

Apologies for the short notice.

{name} · {roll}`,
    },
    detail: "proctored - clashes with Deloitte", clashesWith: "e7",
  },
  { id: "e9", appId: "zoho", date: "2026-08-20", time: "18:00", kind: "deadline", detail: "application closes" },

  // beyond this week
  { id: "e11", appId: "wipro", date: "2026-08-25", kind: "deadline", detail: "Application closes" },
  { id: "e12", appId: "tcs", date: "2026-08-27", kind: "offer", detail: "Offer decision due" },
  { id: "e13", appId: "mindtree", date: "2026-09-04", kind: "deadline", detail: "Application closes" },
];

const BY_ID = new Map(APPLICATIONS.map((a) => [a.id, a]));
const EVENT_BY_ID = new Map(EVENTS.map((e) => [e.id, e]));

/**
 * The application an event belongs to. Falls back to a stub rather than
 * undefined: a calendar row for an application that is not in the list
 * should render thinly, not take the screen down.
 */
export const eventCompany = (e: CalEvent, list?: Application[]): Application => {
  const hit = list?.find((a) => a.id === e.appId) ?? BY_ID.get(e.appId);
  return (
    hit ?? {
      id: e.appId,
      company: "Unknown",
      role: "",
      stage: "Saved",
      meta: "",
      priority: "low",
      bucket: "saved",
    }
  );
};

/**
 * Orange marks the rows that need a decision - an overlap or a closing
 * date. Everything else stays blue, so the week reads at a glance.
 */
export const isUrgent = (e: CalEvent) =>
  Boolean(e.clashesWith) || e.kind === "deadline";

const byTime = (a: CalEvent, b: CalEvent) =>
  a.date === b.date
    ? (a.time ?? "").localeCompare(b.time ?? "")
    : a.date < b.date
      ? -1
      : 1;

export const eventsOn = (date: string, list: CalEvent[] = EVENTS) =>
  list.filter((e) => e.date === date).sort(byTime);

/**
 * Every day in August, for the strip across the top. Each cell carries a
 * dot per event, so a day with two dots is visibly a day with two things
 * on it - which is what makes the 19th read as a clash before you reach
 * the banner.
 */
export const monthDays = (list: CalEvent[] = EVENTS) =>
  Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const date = `2026-08-${String(day).padStart(2, "0")}`;
    return {
      date,
      day,
      letter: weekdayOf(date)[0],
      today: date === TODAY,
      past: day < 16,
      dots: eventsOn(date, list).map((e) => (isUrgent(e) ? "urgent" : "normal")),
    };
  });

const WEEK_END = "2026-08-21";

/** Still to come this week, once today and tomorrow have their own sections. */
export const thisWeek = (list: CalEvent[] = EVENTS) =>
  list.filter((e) => e.date > TOMORROW && e.date <= WEEK_END).sort(byTime);

/** Deadlines inside the next fortnight - a watchlist, not a schedule. */
export const closingSoon = (list: CalEvent[] = EVENTS) =>
  list.filter(
    (e) => e.kind === "deadline" && daysUntil(e.date) > 0 && daysUntil(e.date) <= 14,
  ).sort(byTime);

/* ---- the day view ---- */

/** "11:00" / "1:00 PM" - meridiem only where it is not obvious. */
export function formatTime(min: number, withMeridiem = true) {
  const h24 = Math.floor(min / 60);
  const m = min % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const clock = `${h}:${String(m).padStart(2, "0")}`;
  return withMeridiem ? `${clock} ${h24 < 12 ? "AM" : "PM"}` : clock;
}

/** Drops the meridiem from the start when both ends share it. */
export function formatRange(startMin: number, endMin: number) {
  const sameHalf = startMin < 720 === endMin < 720;
  return `${formatTime(startMin, !sameHalf)} – ${formatTime(endMin)}`;
}

/** How long two events run over each other, in minutes. */
export function overlapMinutes(a: CalEvent, b: CalEvent) {
  if (a.startMin == null || a.endMin == null || b.startMin == null || b.endMin == null) {
    return 0;
  }
  return Math.max(0, Math.min(a.endMin, b.endMin) - Math.max(a.startMin, b.startMin));
}

/** The clash on a given day, if that day has one. */
export function clashOn(date: string, list: CalEvent[] = EVENTS) {
  const a = list.find((e) => e.date === date && e.clashesWith);
  if (!a) return null;
  const b = list.find((e) => e.id === a.clashesWith);
  if (!b) return null;
  const [first, second] = (a.startMin ?? 0) <= (b.startMin ?? 0) ? [a, b] : [b, a];
  return { first, second, minutes: overlapMinutes(a, b) };
}

/** The one overlap in the schedule, if there is one. */
export function scheduleClash() {
  const a = EVENTS.find((e) => e.clashesWith && e.date >= TODAY);
  if (!a) return null;
  return { date: a.date, a, b: EVENT_BY_ID.get(a.clashesWith!)! };
}
