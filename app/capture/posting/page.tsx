"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { Mascot } from "@/components/app/Mascot";
import { CAPTURE_SOURCE, POSTING } from "@/lib/capture";

/**
 * C3 - the job posting, open in a browser, with the widget floating over
 * it. Pure white rather than the app's off-white, because you have left
 * the app. The scan runs on this page so you can see what is being read.
 */
type Phase = "idle" | "scanning" | "reading";

const SCAN_MS = 1500;
const READ_MS = 1600;

export default function PostingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (phase === "idle") return;
    const t =
      phase === "scanning"
        ? setTimeout(() => setPhase("reading"), SCAN_MS)
        : setTimeout(() => router.push("/capture/review"), READ_MS);
    return () => clearTimeout(t);
  }, [phase, router]);

  const busy = phase !== "idle";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      <StatusBar />

      {/* browser chrome */}
      <div className="flex h-[56px] shrink-0 items-center gap-[10px] bg-[#F1F3F4] px-[14px]">
        <div className="flex h-[34px] flex-1 items-center gap-[8px] rounded-full bg-white px-[12px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="#5F6368" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#5F6368" strokeWidth="2" />
          </svg>
          <span className="truncate text-[12.5px] text-[#202124]">
            {CAPTURE_SOURCE.fullUrl}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"
              stroke="#5F6368"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border-2 border-[#5F6368] text-[11px] font-medium text-[#5F6368]">
          3
        </span>
        <span className="text-[19px] leading-none text-[#5F6368]">⋮</span>
      </div>

      {/* the posting */}
      <div className="screen-scroll relative flex-1 px-[20px] pb-[90px]">
        <h1 className="mt-[38px] text-[22px] font-bold text-navy">
          {POSTING.company}
        </h1>
        <div className="mt-[9px] text-[18px] font-bold text-navy">
          {POSTING.role}
        </div>
        <div className="mt-[10px] text-[12.5px] text-grey">{POSTING.meta}</div>

        <div className="mt-[35px] rounded-[18px] bg-offwhite px-[15px]">
          {POSTING.facts.map(([k, v], i) => (
            <div
              key={k}
              className={`flex items-center gap-[10px] py-[13px] ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="flex-1 text-[12.5px] text-grey">{k}</span>
              <span className="text-[11px] font-bold text-navy">{v}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-[32px] text-[15px] font-bold text-navy">
          {POSTING.aboutHeading}
        </h2>
        <p className="mt-[10px] text-[12.5px] leading-[19px] text-grey">
          {POSTING.about}
        </p>
        <p className="mt-[16px] text-[12.5px] leading-[19px] text-grey">
          {POSTING.skills}
        </p>
      </div>

      {/* the sweep, over the page it is reading */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-[106px] bottom-0 z-30"
          >
            {/* corner brackets close around the page */}
            <motion.div
              initial={{ scale: 1.04, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-[14px] inset-y-[14px]"
            >
              {[
                "left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-[14px]",
                "right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-[14px]",
                "left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-[14px]",
                "right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-[14px]",
              ].map((c) => (
                <span
                  key={c}
                  className={`absolute h-[34px] w-[34px] border-brand ${c}`}
                />
              ))}
            </motion.div>

            {/* the line travelling down the posting */}
            <motion.div
              initial={{ top: 20 }}
              animate={{ top: "88%" }}
              transition={{ duration: SCAN_MS / 1000, ease: "easeInOut" }}
              className="absolute inset-x-[14px] h-[3px] bg-brand shadow-[0_0_18px_4px_rgba(27,79,216,0.35)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* reading, still over the posting so the source stays visible */}
      <AnimatePresence>
        {phase === "reading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-navy/25 px-[34px]"
          >
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex w-full flex-col items-center rounded-[20px] bg-white py-[34px]"
            >
              <motion.div
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Mascot state="working" size={92} />
              </motion.div>
              <div className="mt-[12px] text-[15.5px] font-bold text-navy">
                Reading the posting...
              </div>
              <div className="mt-[5px] text-[12.5px] text-grey">
                Pulling out company, role and deadline.
              </div>
              <div className="mt-[18px] h-[5px] w-[170px] overflow-hidden rounded-full bg-offwhite">
                <motion.div
                  initial={{ width: "8%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: READ_MS / 1000, ease: "easeInOut" }}
                  className="h-full rounded-full bg-brand"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the widget, floating over the page like it would over any app */}
      <motion.button
        onClick={() => setPhase("scanning")}
        disabled={busy}
        animate={{ opacity: busy ? 0 : 1, scale: busy ? 0.9 : 1 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-[92px] right-[23px] z-30 flex h-[60px] items-center gap-[10px] rounded-full bg-navy pl-[12px] pr-[20px] shadow-[0_10px_28px_rgba(17,24,43,0.35)]"
      >
        <Mascot state="idle" size={40} />
        <span className="text-[13px] font-semibold text-white">
          Capture this job
        </span>
      </motion.button>

      {/* browser bottom bar */}
      <div className="flex h-[64px] shrink-0 items-center justify-around border-t border-[#DADCE0] bg-[#F1F3F4] text-[#5F6368]">
        <button onClick={() => router.back()} aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 5l7 7-7 7" stroke="#9AA0A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="#5F6368" strokeWidth="2" />
        </svg>
        <span className="text-[19px] leading-none">⋮</span>
      </div>
    </div>
  );
}
