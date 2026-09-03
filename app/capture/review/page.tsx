"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { CAPTURED, CAPTURE_SOURCE, ON_SAVE } from "@/lib/capture";
import { saveCaptured } from "@/lib/useCaptured";

/**
 * What the scan found. The reading state now happens on the posting
 * itself, so this screen starts at the result.
 */
export default function ReviewCapturePage() {
  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />
      <Review />
    </div>
  );
}

function Review() {
  const router = useRouter();
  const [values, setValues] = useState(() =>
    Object.fromEntries(CAPTURED.map((f) => [f.id, f.value])),
  );
  // a flagged field stops being flagged once you have looked at it
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  const flagged = CAPTURED.filter((f) => f.flagged && !confirmed[f.id]);
  const readOk = CAPTURED.length - flagged.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="screen-scroll flex-1 px-[20px] pb-[20px]">
        <h1 className="pt-[6px] text-[27px] font-extrabold tracking-[-0.01em] text-navy">
          Review capture
        </h1>
        <p className="mt-[6px] text-[14px] leading-[20px] text-grey">
          Nothing is saved until you confirm.{" "}
          {flagged.length > 0
            ? "One field needs a quick check."
            : "Everything checks out."}
        </p>

        {/* how well it read */}
        <div className="mt-[16px] flex items-center gap-[10px] rounded-[16px] bg-white p-[15px]">
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-navy">
              {readOk} of {CAPTURED.length} fields read confidently
            </span>
            <span className="mt-[3px] block text-[12.5px] text-grey">
              {flagged.length > 0
                ? "Flagged fields are highlighted below"
                : "Nothing left to check"}
            </span>
          </span>
          {flagged.length > 0 && (
            <span className="shrink-0 rounded-full bg-orange-tint px-[10px] py-[5px] text-[11px] font-semibold text-orange-text">
              {flagged.length} to check
            </span>
          )}
        </div>

        {/* the page it came from */}
        <div className="mt-[10px] flex items-center gap-[12px] rounded-[16px] border border-dashed border-strong p-[15px]">
          <span className="flex h-[34px] w-[34px] shrink-0 flex-col justify-center gap-[3px] rounded-[8px] px-[7px]">
            {[16, 12, 14].map((w, i) => (
              <span key={i} className="h-[3px] rounded-full bg-strong" style={{ width: w }} />
            ))}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-navy">
              Full page captured
            </span>
            <span className="mt-[2px] block truncate text-[12.5px] text-grey">
              {CAPTURE_SOURCE.url} · {CAPTURE_SOURCE.at}
            </span>
          </span>
          <button className="shrink-0 text-[13px] font-semibold text-brand">
            Zoom
          </button>
        </div>

        {/* the fields */}
        <div className="mt-[22px] flex items-baseline gap-[10px]">
          <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em] text-navy">
            Extracted details
          </h2>
          <span className="text-[12.5px] text-grey">Tap to edit</span>
        </div>

        <div className="mt-[10px] space-y-[14px]">
          {CAPTURED.map((f) => {
            const isFlagged = Boolean(f.flagged) && !confirmed[f.id];
            return (
              <div key={f.id}>
                <div className="flex items-center gap-[8px]">
                  <span
                    className={`text-[11px] font-semibold ${
                      isFlagged ? "text-orange-text" : "text-grey"
                    }`}
                  >
                    {f.label}
                  </span>
                  {isFlagged && (
                    <span className="rounded-full bg-orange-tint px-[8px] py-[2px] text-[11px] font-semibold text-orange-text">
                      low confidence
                    </span>
                  )}
                </div>

                <div
                  className={`mt-[6px] flex items-center gap-[8px] rounded-[12px] border px-[14px] py-[12px] ${
                    isFlagged
                      ? "border-orange bg-orange-tint"
                      : "border-hairline bg-white"
                  }`}
                >
                  <input
                    value={values[f.id]}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, [f.id]: e.target.value }));
                      if (f.flagged) setConfirmed((c) => ({ ...c, [f.id]: true }));
                    }}
                    onBlur={() => {
                      if (f.flagged) setConfirmed((c) => ({ ...c, [f.id]: true }));
                    }}
                    aria-label={f.label}
                    className={`min-w-0 flex-1 bg-transparent text-[14px] outline-none ${
                      isFlagged ? "text-orange-text" : "text-navy"
                    }`}
                  />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4 20h4L20 8l-4-4L4 16z"
                      stroke={isFlagged ? "#B35400" : "#C7CDD9"}
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {isFlagged && f.note && (
                  <p className="mt-[6px] text-[12.5px] leading-[17px] text-orange-text">
                    {f.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* what saving does */}
        <div className="mt-[16px] rounded-[16px] bg-brand-light p-[15px]">
          <div className="text-[13px] font-semibold text-brand">When you save</div>
          <div className="mt-[9px] space-y-[7px]">
            {ON_SAVE.map((line) => (
              <div key={line} className="flex gap-[8px]">
                <span className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full bg-brand" />
                <span className="text-[12.5px] leading-[17px] text-brand">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-inset shrink-0 px-[20px] pt-[12px]">
        <button
          onClick={() => {
            // whatever is in the fields now, including any correction
            saveCaptured({
              company: values.company,
              role: values.role,
              deadline: values.deadline,
            });
            router.push("/journey?f=saved");
          }}
          className="h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
        >
          Save to journey
        </button>
        <button
          onClick={() => router.push("/capture")}
          className="mt-[12px] w-full text-center text-[13px] font-semibold text-grey"
        >
          Discard capture
        </button>
      </div>
    </motion.div>
  );
}
