"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { consumeSetupFinished } from "@/lib/useProfileStatus";
import { STUDENT } from "@/lib/student";

/**
 * Confirms, once, that the mailbox is now being watched - the one part
 * of setup with no visible result on Home otherwise. Green because it
 * reports a state that is already true, not an action to take.
 */
export function TrackingToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (consumeSetupFinished()) setShow(true);
  }, []);

  // the timer lives on `show`, not on mount - under StrictMode the mount
  // effect runs twice and only the first run sees the one-shot flag, so a
  // timer started there would be cleaned up and never replaced
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 top-[52px] z-30 flex justify-center px-[20px]"
        >
          <div className="flex max-w-full items-center gap-[8px] rounded-full bg-success-tint px-[14px] py-[9px] shadow-[0_6px_20px_rgba(17,24,43,0.10)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" fill="#0E7A4E" />
              <path
                d="m7.5 12.4 3 3 6-6.5"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="truncate text-[12.5px] font-semibold text-success">
              Tracking {STUDENT.gmail}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
