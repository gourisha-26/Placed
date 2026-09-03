"use client";

import { useEffect, useState } from "react";

const KEY = "placed:profileComplete";

/**
 * Whether the student filled in their details during setup.
 *
 * Kept in localStorage rather than a URL param so the prompt survives
 * moving between tabs — a param would vanish the first time they open
 * Journey and come back.
 *
 * `null` while reading, so the card never flashes in during hydration.
 */
export function useProfileStatus() {
  const [complete, setComplete] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setComplete(window.localStorage.getItem(KEY) !== "false");
    } catch {
      setComplete(true);
    }
  }, []);

  return complete;
}

export function markProfileIncomplete() {
  try {
    window.localStorage.setItem(KEY, "false");
  } catch {
    /* private mode - the prompt just won't persist */
  }
}

export function markProfileComplete() {
  try {
    window.localStorage.setItem(KEY, "true");
  } catch {
    /* no-op */
  }
}

const JUST_SETUP = "placed:justFinishedSetup";

/**
 * A one-shot handoff from the last setup step to Home, so Home can
 * confirm what was just switched on. Read clears it: the toast belongs
 * to that one arrival, not to every later visit.
 */
export function markSetupFinished() {
  try {
    window.sessionStorage.setItem(JUST_SETUP, "1");
  } catch {
    /* no-op */
  }
}

export function consumeSetupFinished() {
  try {
    const hit = window.sessionStorage.getItem(JUST_SETUP) === "1";
    window.sessionStorage.removeItem(JUST_SETUP);
    return hit;
  } catch {
    return false;
  }
}
