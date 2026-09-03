"use client";

import { useSyncExternalStore } from "react";

/**
 * Which event has had a reschedule requested. In memory for one page
 * load, like the rest of the demo state, so a refresh gives the next
 * person the clash back.
 */
let movedEventId: string | null = null;
const listeners = new Set<() => void>();

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useRescheduled() {
  return useSyncExternalStore(
    subscribe,
    () => movedEventId,
    () => null,
  );
}

export function requestReschedule(eventId: string) {
  movedEventId = eventId;
  listeners.forEach((l) => l());
}

export function clearReschedule() {
  movedEventId = null;
  listeners.forEach((l) => l());
}
