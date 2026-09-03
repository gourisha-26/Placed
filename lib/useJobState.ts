"use client";

import { useSyncExternalStore } from "react";

/**
 * Per-job state for the apply flow: which resume is attached, whether the
 * portal has been opened, and whether it has been marked applied.
 *
 * In memory for one page load, like captures - so the deployed demo
 * resets for the next person who tries it.
 */
export type JobState = {
  resume: string;
  openedPortal: boolean;
  applied: boolean;
  appliedWith?: string;
  /** set only when renamed by hand; otherwise the name follows the version */
  fileName?: string;
  /** placED read an email and moved the status on its own */
  inferred?: boolean;
  /** what the student decided about that read */
  decision?: "kept" | "corrected";
};

const DEFAULT: JobState = {
  resume: "V5",
  openedPortal: false,
  applied: false,
};

/** Stable empty reference: useSyncExternalStore compares snapshots by
 *  identity, so returning a fresh {} each call spins React in a loop. */
const NO_STATES: Record<string, JobState> = {};

let states: Record<string, JobState> = NO_STATES;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useJobState(id: string): JobState {
  return useSyncExternalStore(
    subscribe,
    () => states[id] ?? DEFAULT,
    () => DEFAULT,
  );
}

export function setJobState(id: string, patch: Partial<JobState>) {
  const prev = states[id] ?? DEFAULT;
  const next = { ...prev, ...patch };

  // a hand-typed name belongs to the version it was typed for, so
  // switching version drops it rather than mislabelling the new file
  if (patch.resume && patch.resume !== prev.resume && !("fileName" in patch)) {
    delete next.fileName;
  }

  states = { ...states, [id]: next };
  emit();
}

/** Every job that has been marked applied this session. */
export function useAppliedJobs() {
  return useSyncExternalStore(
    subscribe,
    () => states,
    () => NO_STATES,
  );
}

export function resetJobs() {
  states = NO_STATES;
  emit();
}
