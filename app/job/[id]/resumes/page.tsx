"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BackButton } from "@/components/app/BackButton";
import { WEAK_BELOW, matchesForJob, suggestedMatch } from "@/lib/match";
import { setJobState, useJobState } from "@/lib/useJobState";

/**
 * D2 - the versions scored against this one posting. Picking a weak one
 * is allowed, but the app says so first rather than letting it through
 * quietly (D2b).
 */
export default function CompareResumesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const job = useJobState(id);

  const matches = matchesForJob();
  const suggested = suggestedMatch();
  const [picked, setPicked] = useState(job.resume);
  const [warnAbout, setWarnAbout] = useState<string | null>(null);

  const chosen = matches.find((m) => m.version === picked)!;

  const use_ = () => {
    if (chosen.weak) {
      setWarnAbout(chosen.version);
      return;
    }
    setJobState(id, { resume: chosen.version });
    router.push(`/job/${id}`);
  };

  return (
    <div className="relative flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[20px]">
        <div className="pt-[6px]">
          <BackButton />
        </div>

        <h1 className="mt-[16px] text-[27px] font-extrabold tracking-[-0.01em] text-navy">
          Choose a resume
        </h1>
        <p className="mt-[8px] text-[13.5px] leading-[19px] text-grey">
          Scored against the Adobe UI/UX Designer posting, not your general
          ATS score.
        </p>

        <div className="mt-[18px] space-y-[10px]">
          {matches.map((m) => {
            const on = m.version === picked;
            return (
              <button
                key={m.version}
                onClick={() => setPicked(m.version)}
                aria-pressed={on}
                className={`block w-full rounded-[16px] p-[15px] text-left transition-colors duration-150 ${
                  on ? "bg-brand-light" : "border border-hairline bg-white"
                }`}
              >
                <div className="flex items-center gap-[10px]">
                  <span
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
                      on ? "border-brand bg-brand" : "border-strong"
                    }`}
                  >
                    {on && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path
                          d="m5 12.5 5 5 9-10"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>

                  <span className="flex-1 text-[17px] font-bold text-navy">
                    {m.version}
                  </span>

                  {m.version === suggested.version && (
                    <span className="rounded-full bg-white px-[9px] py-[3px] text-[11px] font-semibold text-brand">
                      Suggested
                    </span>
                  )}

                  <span
                    className={`text-[17px] font-bold ${
                      m.weak ? "text-error" : "text-navy"
                    }`}
                  >
                    {m.score}%
                  </span>
                </div>

                <div className="mt-[2px] pl-[32px] text-[12.5px] text-grey">
                  {m.focus} · {m.updated}
                </div>

                <div className="mt-[10px] flex items-center gap-[12px]">
                  <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-white">
                    <span
                      className={`block h-full rounded-full ${
                        m.weak ? "bg-error" : "bg-brand"
                      }`}
                      style={{ width: `${m.score}%` }}
                    />
                  </span>
                  <Link
                    href={`/resumes/${m.version}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex shrink-0 items-center gap-[5px] text-[12px] font-semibold text-brand"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"
                        stroke="#1B4FD8"
                        strokeWidth="1.9"
                      />
                      <circle cx="12" cy="12" r="2.6" stroke="#1B4FD8" strokeWidth="1.9" />
                    </svg>
                    Preview
                  </Link>
                </div>

                <div className="mt-[10px] text-[12.5px] leading-[17px] text-grey">
                  {m.matched.length > 0
                    ? `Matched: ${m.matched.join(", ").toLowerCase()}`
                    : "Matched: none of the listed skills"}
                </div>
                {m.missing.length > 0 && (
                  <div
                    className={`mt-[2px] text-[12.5px] leading-[17px] ${
                      m.weak ? "text-error" : "text-grey"
                    }`}
                  >
                    Missing: {m.missing.join(", ").toLowerCase()}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="footer-inset shrink-0 px-[20px] pt-[12px]">
        <button
          onClick={use_}
          className="h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
        >
          Use {chosen.version} for this application
        </button>
      </div>

      {/* D2b - said before it happens, not after */}
      <AnimatePresence>
        {warnAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-navy/35"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="w-full rounded-t-[24px] bg-white px-[20px] pb-[34px] pt-[22px]"
            >
              <div className="flex items-center gap-[9px]">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-error">
                  <span className="text-[12px] font-bold leading-none text-white">!</span>
                </span>
                <span className="text-[16px] font-bold text-navy">
                  {warnAbout} is a weak match
                </span>
              </div>
              <p className="mt-[8px] text-[13px] leading-[19px] text-grey">
                It scores {chosen.score}% against this posting, below the{" "}
                {WEAK_BELOW}% the app treats as a fit. {suggested.version} scores{" "}
                {suggested.score}%.
              </p>

              <button
                onClick={() => {
                  setJobState(id, { resume: suggested.version });
                  router.push(`/job/${id}`);
                }}
                className="mt-[18px] h-[50px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
              >
                Switch to {suggested.version}
              </button>
              <button
                onClick={() => {
                  setJobState(id, { resume: warnAbout });
                  router.push(`/job/${id}`);
                }}
                className="mt-[10px] h-[50px] w-full rounded-full border border-hairline text-[14px] font-semibold text-navy"
              >
                Send {warnAbout} anyway
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
