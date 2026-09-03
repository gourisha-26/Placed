import { RESUMES } from "./resumes";

/**
 * What the Adobe posting asks for. The compare screen derives every
 * matched / missing list from this and each resume's own skills, so the
 * lists can never disagree with what the resume preview shows.
 */
export const JOB_SKILLS = [
  "Figma",
  "User research",
  "Prototyping",
  "Design systems",
];

/**
 * The score is not a skill ratio - it also weighs how recent the version
 * is and how close its focus sits to the role - so it is stated per
 * version rather than computed.
 */
const SCORES: Record<string, number> = {
  V5: 82,
  V4: 58,
  V3: 64,
  V2: 51,
  V1: 44,
};

export type ResumeMatch = {
  version: string;
  focus: string;
  updated: string;
  score: number;
  matched: string[];
  missing: string[];
  /** below this the app says so rather than letting it through quietly */
  weak: boolean;
};

const has = (skills: readonly string[], want: string) =>
  skills.some((s) => s.toLowerCase() === want.toLowerCase());

export const WEAK_BELOW = 50;

export function matchesForJob(): ResumeMatch[] {
  return RESUMES.map((r) => {
    const matched = JOB_SKILLS.filter((s) => has(r.skills, s));
    return {
      version: r.version,
      focus: r.focus,
      updated: r.updated,
      score: SCORES[r.version] ?? 0,
      matched,
      missing: JOB_SKILLS.filter((s) => !has(r.skills, s)),
      weak: (SCORES[r.version] ?? 0) < WEAK_BELOW,
    };
  }).sort((a, b) => b.score - a.score);
}

/** The one the app puts forward. */
export function suggestedMatch() {
  return matchesForJob()[0];
}

export function matchFor(version: string) {
  return matchesForJob().find((m) => m.version === version);
}
