"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { STUDENT } from "@/lib/student";
import { RESUMES, fileName } from "@/lib/resumes";
import { setJobState } from "@/lib/useJobState";

/**
 * D4 / D5 / D6 - the employer's own portal. Pure white, because this is
 * not the app. placED appears only as one source inside the file picker.
 */
export default function PortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [picking, setPicking] = useState(false);
  const [attached, setAttached] = useState<string | null>(null);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      <StatusBar />

      {/* browser chrome */}
      <div className="flex h-[50px] shrink-0 items-center gap-[10px] bg-[#F6F7F9] px-[14px]">
        <div className="flex h-[32px] flex-1 items-center gap-[8px] rounded-full bg-white px-[12px]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="#5F6368" strokeWidth="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#5F6368" strokeWidth="2" />
          </svg>
          <span className="truncate text-[11.5px] text-[#202124]">
            careers.adobe.com/apply/ADB-2026-UX-114
          </span>
        </div>
        <span className="text-[18px] leading-none text-[#5F6368]">⋮</span>
      </div>

      <div className="screen-scroll flex-1 px-[20px] pb-[30px]">
        <h1 className="mt-[24px] text-[19px] font-bold text-navy">
          Adobe Careers
        </h1>
        <p className="mt-[5px] text-[13px] text-grey">
          UI/UX Designer - Application
        </p>

        <div className="mt-[20px] space-y-[13px]">
          <PortalField label="Full name" value={STUDENT.fullName} />
          <PortalField label="Email" value={STUDENT.gmail} />
          <PortalField label="Phone" value={`+91 ${STUDENT.phone.slice(0, 5)} ${STUDENT.phone.slice(5)}`} />

          {/* the resume slot - the only part that matters here */}
          <div className="rounded-[10px] border border-hairline bg-offwhite p-[13px]">
            <div className="text-[11px] font-semibold text-grey">Resume</div>
            {attached ? (
              <div className="mt-[8px] flex items-center gap-[9px]">
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy">
                  {fileName(attached)}
                </span>
                <span className="shrink-0 rounded-[6px] bg-success-tint px-[8px] py-[3px] text-[11px] font-semibold text-success">
                  Attached
                </span>
                {/* attaching the wrong file is easy to do, so it has to be
                    easy to undo */}
                <button
                  onClick={() => setAttached(null)}
                  aria-label="Remove attached resume"
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-hairline"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="#687286"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="mt-[8px] flex items-center gap-[10px]">
                <button
                  onClick={() => setPicking(true)}
                  className="rounded-[7px] bg-hairline px-[11px] py-[6px] text-[12.5px] font-semibold text-navy"
                >
                  Choose file
                </button>
                <span className="text-[12.5px] text-grey">No file chosen</span>
              </div>
            )}
          </div>

          <PortalField
            label="Why this role"
            value="I've spent the last year designing..."
          />
        </div>

        <button
          onClick={() => {
            if (!attached) {
              setPicking(true);
              return;
            }
            setJobState(id, { resume: attached, openedPortal: true });
            router.push(`/job/${id}?ask=1`);
          }}
          className="mt-[22px] h-[50px] w-full rounded-[10px] bg-navy text-[13.5px] font-semibold text-white"
        >
          Submit application
        </button>
      </div>

      {/* D5 - the picker, with placED sitting in it */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-navy/30"
            onClick={() => setPicking(false)}
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[20px] bg-white px-[20px] pb-[30px] pt-[14px]"
            >
              <div className="mx-auto h-[4px] w-[38px] rounded-full bg-hairline" />
              <div className="mt-[14px] text-[15px] font-bold text-navy">
                Choose a file
              </div>

              <div className="mt-[12px] flex gap-[8px]">
                {["iCloud", "Drive", "Placed", "Recents"].map((c) => (
                  <span
                    key={c}
                    className={`flex h-[28px] items-center rounded-[9px] px-[12px] text-[11.5px] font-medium ${
                      c === "Placed"
                        ? "bg-brand text-white"
                        : "bg-offwhite text-navy"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-[10px]">
                {RESUMES.map((r) => (
                  <button
                    key={r.version}
                    onClick={() => {
                      setAttached(r.version);
                      setPicking(false);
                    }}
                    className="flex w-full items-center gap-[11px] border-b border-hairline py-[13px] text-left last:border-0"
                  >
                    <span className="h-[26px] w-[26px] shrink-0 rounded-[7px] bg-offwhite" />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-navy">
                      {fileName(r.version)}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPicking(false)}
                className="mt-[14px] w-full text-center text-[13px] font-semibold text-grey"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PortalField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-hairline p-[13px]">
      <div className="text-[11px] font-semibold text-grey">{label}</div>
      <div className="mt-[6px] truncate text-[13.5px] text-navy">{value}</div>
    </div>
  );
}
