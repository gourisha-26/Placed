"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Mascot } from "@/components/app/Mascot";
import { TODAY, formatDayLong } from "@/lib/data";
import { setJobState } from "@/lib/useJobState";

/**
 * E0 - the lock screen. Tapping the notification is what sets up the
 * premise: placED has already read the email and moved the status.
 */
export default function NotificationPage() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#221E33]">
      {/* wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B2540] via-[#221E33] to-[#171426]" />

      {/* phone status row */}
      <div className="relative flex items-center px-[26px] pt-[16px] text-white">
        <span className="flex-1" />
        <span className="flex items-end gap-[5px]">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={i * 4.4}
                y={9 - i * 3}
                width="3"
                height={3 + i * 3}
                rx="1"
                fill="#fff"
              />
            ))}
          </svg>
          <svg width="16" height="12" viewBox="0 0 24 18" fill="none" aria-hidden>
            <path d="M2 6a15 15 0 0 1 20 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M6 10.5a9 9 0 0 1 12 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="15" r="1.6" fill="#fff" />
          </svg>
          <span className="flex h-[12px] w-[24px] items-center rounded-[3px] border border-white/60 p-[2px]">
            <span className="h-full w-[80%] rounded-[1px] bg-white" />
          </span>
        </span>
      </div>

      {/* clock */}
      <div className="relative mt-[36px] text-center text-white">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="mx-auto opacity-80">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#fff" strokeWidth="1.8" />
        </svg>
        <div className="mt-[14px] text-[15px] text-white/85">
          {formatDayLong(TODAY).replace(/^(\w+) /, "$1, ")}
        </div>
        <div className="mt-[2px] text-[76px] font-semibold leading-[84px] tracking-[-0.02em]">
          9:41
        </div>
      </div>

      {/* the notification */}
      <div className="relative mt-auto px-[16px] pb-[26px]">
        <motion.button
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
          onClick={() => {
            // opening it is what puts the inferred status on the record
            setJobState("adobe", { applied: true, appliedWith: "V5", inferred: true });
            router.push("/job/adobe");
          }}
          className="w-full rounded-[20px] bg-white/12 p-[15px] text-left backdrop-blur-xl"
        >
          <div className="flex items-center gap-[8px]">
            <span className="flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-[6px] bg-brand-light">
              <Mascot state="idle" size={18} />
            </span>
            <span className="flex-1 text-[11.5px] font-semibold tracking-[0.06em] text-white/70">
              PLACED
            </span>
            <span className="text-[11.5px] text-white/60">now</span>
          </div>

          <div className="mt-[9px] text-[15px] font-bold text-white">
            Adobe shortlisted you
          </div>
          <div className="mt-[2px] text-[13px] text-white/70">
            UI/UX designer · from your inbox
          </div>
        </motion.button>

        {/* the stacked notification behind it */}
        <div className="mx-[10px] h-[10px] rounded-b-[16px] bg-white/8" />

        <div className="mt-[26px] flex items-center justify-between px-[24px]">
          {[0, 1].map((i) => (
            <span key={i} className="h-[46px] w-[46px] rounded-full bg-white/85" />
          ))}
        </div>
        <div className="mx-auto mt-[22px] h-[5px] w-[134px] rounded-full bg-white/80" />
      </div>
    </div>
  );
}
