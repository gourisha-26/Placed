"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";

/**
 * Connecting → Inbox connected. Runs on a timer and then hands off
 * to the profile step, so the student never taps through a state
 * that is only telling them to wait.
 */
export default function ConnectingPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const toDone = setTimeout(() => setDone(true), 1900);
    const toNext = setTimeout(() => router.push("/profile-setup"), 3400);
    return () => {
      clearTimeout(toDone);
      clearTimeout(toNext);
    };
  }, [router]);

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="flex flex-1 flex-col items-center justify-center px-[40px] pb-[80px]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              {/* The whole SVG spins, not a child of it. Rotating an SVG
                  circle turns it about the SVG origin rather than its own
                  centre; rotating the wrapping element avoids that entirely. */}
              <motion.div
                className="h-[84px] w-[84px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
              >
                {/* r=39 + 6px stroke fills the full 84px box, so the ring
                    matches the filled success circle exactly. */}
                <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
                  <circle
                    cx="42"
                    cy="42"
                    r="39"
                    stroke="#E8F0FF"
                    strokeWidth="6"
                  />
                  <circle
                    cx="42"
                    cy="42"
                    r="39"
                    stroke="#1B4FD8"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="58 200"
                  />
                </svg>
              </motion.div>
              <div className="mt-[24px] text-[20px] font-extrabold text-navy">
                Connecting
              </div>
              <div className="mt-[8px] text-[13.5px] text-grey">
                Signing you in securely
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-success-tint">
                <motion.svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    stroke="#0E7A4E"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </motion.svg>
              </div>
              <div className="mt-[24px] text-[20px] font-extrabold text-navy">
                Inbox connected
              </div>
              {/* reserves the subtitle row the loading state occupies, so
                  the circle and title don't shift when the state flips */}
              <div className="mt-[8px] h-[19px]" aria-hidden />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
