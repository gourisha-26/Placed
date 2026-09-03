"use client";

import { useSyncExternalStore } from "react";
import type { Application, CalEvent } from "./data";

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

/** A posting saved by the capture flow. */
export type CapturedJob = {
  id: string;
  company: string;
  role: string;
  /** as written on the review screen, e.g. "18 Aug" */
  deadline: string;
  savedAt: number;
};

/**
 * Captures live in memory for the length of one page load - deliberately
 * not localStorage. Moving between tabs keeps the capture (Next navigates
 * on the client), but a refresh clears it, so the next person to open the
 * deployed app gets a clean slate and can try the flow themselves.
 */
const EMPTY: CapturedJob[] = [];
let jobs: CapturedJob[] = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCaptured() {
  // the server snapshot is the same stable empty array, so the first
  // client render matches the markup that was sent
  return useSyncExternalStore(
    subscribe,
    () => jobs,
    () => EMPTY,
  );
}

/** Saves a capture. Only the most recent one is kept. */
export function saveCaptured(job: Omit<CapturedJob, "id" | "savedAt">) {
  jobs = [{ ...job, id: `cap-${Date.now()}`, savedAt: Date.now() }];
  emit();
}

export function clearCaptured() {
  jobs = EMPTY;
  emit();
}

/* ---------- turning a capture into app data ---------- */

/** A captured posting is one you have not applied to yet. */
export function capturedToApplication(j: CapturedJob): Application {
  return {
    id: j.id,
    company: j.company,
    role: `${j.role} · not applied yet`,
    stage: "Saved",
    meta: `Closes ${j.deadline}`,
    bucket: "saved",
    // a fresh capture with a date on it is the thing most likely to lapse
    priority: "high",
    needsAttention: true,
  };
}

/** "18 Aug" -> "2026-08-18", so it can sit on the calendar. */
export function deadlineToDate(deadline: string) {
  const m = deadline.match(/(\d{1,2})\s*([A-Za-z]{3})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].toLowerCase());
  if (month < 0) return null;
  return `2026-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

export function capturedToEvent(j: CapturedJob): CalEvent | null {
  const date = deadlineToDate(j.deadline);
  if (!date) return null;
  return {
    id: `ev-${j.id}`,
    appId: j.id,
    date,
    kind: "deadline",
    detail: "Application closes",
  };
}
