"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Mascot } from "@/components/app/Mascot";
import { STUDENT } from "@/lib/student";
import { RESUMES } from "@/lib/resumes";
import { setJobState, useJobState } from "@/lib/useJobState";

/**
 * D7 - the app cannot see the employer's portal, so it asks rather than
 * assuming. Tagging the version is what lets it record the right one.
 */
export function DidYouApplySheet({
  jobId,
  company,
}: {
  jobId: string;
  company: string;
}) {
  const router = useRouter();
  const job = useJobState(jobId);
  const [tagged, setTagged] = useState(job.resume);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex items-end bg-navy/35"
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
        className="w-full rounded-t-[24px] bg-offwhite px-[20px] pb-[30px] pt-[14px]"
      >
        <div className="mx-auto h-[4px] w-[42px] rounded-full bg-strong" />

        <div className="mt-[16px] flex items-center gap-[12px]">
          <Mascot state="waiting" size={54} />
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-bold text-navy">
              Did you apply to {company}?
            </span>
            <span className="mt-[2px] block text-[12.5px] text-grey">
              You opened the portal 4 minutes ago.
            </span>
          </span>
        </div>

        <div className="mt-[16px] rounded-[14px] bg-brand-light p-[13px]">
          <p className="text-[12.5px] leading-[18px] text-brand">
            Marking it starts inbox tracking →<br />
            we&apos;ll watch {STUDENT.gmail} for a reply from {company}.
          </p>
        </div>

        <div className="mt-[12px] rounded-[16px] bg-white p-[15px]">
          <div className="text-[14px] font-bold text-navy">
            Which resume did you upload?
          </div>
          <div className="mt-[3px] text-[12.5px] text-grey">
            Tag it so the app records the right one.
          </div>
          <div className="mt-[12px] flex gap-[8px]">
            {RESUMES.map((r) => {
              const on = r.version === tagged;
              return (
                <button
                  key={r.version}
                  onClick={() => setTagged(r.version)}
                  aria-pressed={on}
                  className={`h-[36px] flex-1 rounded-[10px] text-[13px] font-semibold transition-colors duration-150 ${
                    on
                      ? "bg-brand text-white"
                      : "border border-hairline text-navy"
                  }`}
                >
                  {r.version}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setJobState(jobId, { applied: true, appliedWith: tagged });
            router.push(`/journey?applied=${jobId}`);
          }}
          className="mt-[16px] h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
        >
          Yes, mark as applied
        </button>
        <button
          onClick={() => router.push("/journey")}
          className="mt-[10px] h-[52px] w-full rounded-full border border-hairline bg-white text-[14px] font-semibold text-navy"
        >
          Not yet - remind me tonight
        </button>
        <button
          onClick={() => router.push("/journey")}
          className="mt-[14px] w-full text-center text-[13px] text-grey"
        >
          I decided not to apply
        </button>
      </motion.div>
    </motion.div>
  );
}
