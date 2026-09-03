"use client";

import { useEffect, useState } from "react";
import { DEFAULT_RESUME } from "./resumes";

const KEY = "placed:defaultResume";
const EVENT = "placed:defaultResumeChange";

/**
 * Which version the app attaches by default. Kept in localStorage and
 * announced on a custom event, because a `storage` event does not fire in
 * the tab that made the change - and Profile has to follow a choice made
 * on the Resumes screen within the same session.
 */
export function useDefaultResume() {
  const [version, setVersion] = useState(DEFAULT_RESUME);

  useEffect(() => {
    const read = () => {
      try {
        setVersion(window.localStorage.getItem(KEY) ?? DEFAULT_RESUME);
      } catch {
        setVersion(DEFAULT_RESUME);
      }
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  return version;
}

export function setDefaultResume(v: string) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* private mode - the choice just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}
