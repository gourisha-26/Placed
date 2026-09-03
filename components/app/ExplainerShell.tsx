"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";

/**
 * Runs a list of cue times once, and hands back the current step. `run`
 * changes to start it again, which is what Replay does.
 */
export function useSequence(times: number[], run: number) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const ids = times.map((t, i) => setTimeout(() => setStep(i), t));
    return () => ids.forEach(clearTimeout);
  }, [run, times]);

  return { step, done: step === times.length - 1 };
}

export type Caption = { eyebrow: string; line: string };

/**
 * The chrome shared by both explainers: back, the caption that changes as
 * the demo plays, the demo card itself, then Replay and Got it.
 */
export function ExplainerShell({
  caption,
  done,
  onReplay,
  onDone,
  children,
}: {
  caption: Caption;
  done: boolean;
  onReplay: () => void;
  /** where "Got it" leads when the explainer sits inside a flow */
  onDone?: () => void;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="flex-1 overflow-hidden">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="ml-[20px] mt-[12px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="#11182B"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* fixed - the demo is the thing to watch, so the words above it
            stay put rather than competing with it */}
        <div className="mt-[16px] h-[62px] px-[44px]">
          <div className="text-[10.5px] font-bold tracking-[0.08em] text-brand">
            {caption.eyebrow}
          </div>
          <div className="mt-[6px] text-[17px] font-semibold leading-[24px] text-navy">
            {caption.line}
          </div>
        </div>

        {/* demo */}
        <div className="mt-[20px] px-[44px]">
          <div className="relative h-[352px] w-[305px] overflow-hidden rounded-[18px] bg-white shadow-[0_10px_30px_rgba(17,24,43,0.06)]">
            {children}
          </div>
        </div>

        {/* replay appears only once the run has finished */}
        <div className="mt-[24px] flex h-[44px] items-center justify-center">
          <AnimatePresence>
            {done && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onReplay}
                className="flex h-[44px] items-center gap-[9px] rounded-full bg-white px-[22px] text-[13px] font-semibold text-navy"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M20 12a8 8 0 1 1-2.3-5.6"
                    stroke="#11182B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 4v4h-4"
                    stroke="#11182B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Replay
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="footer-inset shrink-0 px-[24px]">
        <button
          onClick={() => (onDone ? onDone() : router.back())}
          className="h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
        >
          {onDone ? "Open Adobe careers" : "Got it"}
        </button>
        <p className="mt-[14px] text-center text-[12.5px] text-grey">
          Find this again any time in Profile.
        </p>
      </div>
    </div>
  );
}

/** The grey text placeholders both demos use for body copy. */
export function Lines({
  widths,
  top,
}: {
  widths: number[];
  top: number;
}) {
  return (
    <>
      {widths.map((w, i) => (
        <div
          key={i}
          className="absolute left-[20px] h-[7px] rounded-full bg-[#EEF1F6]"
          style={{ width: w, top: top + i * 15 }}
        />
      ))}
    </>
  );
}
