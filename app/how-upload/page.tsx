"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ExplainerShell,
  useSequence,
  type Caption,
} from "@/components/app/ExplainerShell";
import { STUDENT } from "@/lib/student";
import { fileName } from "@/lib/resumes";

const CUES = [0, 1400, 2400, 4000, 5400, 6600, 8200];

const CAPTION: Caption = {
  eyebrow: "PLACED IS IN YOUR FILE PICKER",
  line: "Pick your resume, no file hunting.",
};

/* the three versions the picker lists */
const FILES = ["V5", "V3", "V1"];

export default function HowUploadPage({ onDone }: { onDone?: () => void } = {}) {
  const [run, setRun] = useState(0);
  const { step, done } = useSequence(CUES, run);

  const sheetUp = step >= 2 && step <= 4;
  const attached = step >= 5;

  return (
    <ExplainerShell
      caption={CAPTION}
      done={done}
      onReplay={() => setRun((r) => r + 1)}
      onDone={onDone}
    >
      {/* the employer's application form */}
      <div className="absolute left-[20px] top-[18px] flex h-[26px] w-[265px] items-center rounded-[8px] bg-offwhite px-[10px]">
        <span className="text-[9.5px] text-grey">careers.adobe.com</span>
      </div>

      <div className="absolute left-[20px] top-[60px] w-[265px]">
        <Field label="Full name" value={STUDENT.fullName} />
        <div className="h-[12px]" />
        <Field label="Email" value={STUDENT.gmail} />
      </div>

      {/* the resume slot, before and after */}
      <div className="absolute left-[20px] top-[184px] w-[265px]">
        <div className="text-[9px] font-medium text-grey">Resume</div>

        <div className="relative mt-[4px] h-[44px]">
          <motion.div
            animate={{ opacity: attached ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center rounded-[10px] border border-dashed border-strong bg-white px-[14px]"
          >
            <span className="text-[11.5px] font-semibold text-navy">
              Upload resume
            </span>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: attached ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center gap-[10px] rounded-[10px] bg-success-tint px-[14px]"
          >
            <span className="text-[13px] font-bold text-success">✓</span>
            <span className="truncate text-[10.5px] font-semibold text-success">
              {fileName("V5")}
            </span>
          </motion.div>
        </div>
      </div>

      {/* the tap that opens the picker */}
      {step === 1 && (
        <motion.span
          initial={{ opacity: 0.5, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute left-[126px] top-[186px] h-[52px] w-[52px] rounded-full bg-brand"
        />
      )}

      {/* the file picker */}
      <motion.div
        initial={{ y: 232 }}
        animate={{ y: sheetUp ? 0 : 232 }}
        transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 h-[232px] rounded-t-[14px] bg-white shadow-[0_-8px_24px_rgba(17,24,43,0.10)]"
      >
        <div className="mx-auto mt-[10px] h-[4px] w-[34px] rounded-full bg-hairline" />
        <div className="mt-[12px] px-[20px] text-[13px] font-semibold text-navy">
          Choose a file
        </div>

        {/* placED is one of the sources, which is the whole point */}
        <div className="mt-[10px] flex gap-[7px] px-[20px]">
          {["iCloud", "Drive", "Placed", "Recents"].map((c) => {
            const isPlaced = c === "Placed";
            const lit = isPlaced && step >= 3;
            return (
              <motion.span
                key={c}
                animate={{ scale: lit ? 1.06 : 1 }}
                transition={{ duration: 0.3 }}
                className={`flex h-[24px] items-center rounded-[8px] px-[10px] text-[10px] font-medium ${
                  lit ? "bg-brand text-white" : "bg-offwhite text-navy"
                }`}
              >
                {c}
              </motion.span>
            );
          })}
        </div>

        <div className="mt-[8px] space-y-[2px] px-[20px]">
          {FILES.map((v, i) => {
            const picked = step >= 4 && i === 0;
            return (
              <motion.div
                key={v}
                animate={{
                  backgroundColor: picked ? "#E8F0FF" : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3 }}
                className="flex h-[44px] items-center gap-[10px] rounded-[10px] px-[12px]"
              >
                <span className="h-[24px] w-[24px] shrink-0 rounded-[7px] bg-offwhite" />
                <span
                  className={`truncate text-[10.5px] ${
                    picked ? "font-semibold text-brand" : "font-medium text-navy"
                  }`}
                >
                  {fileName(v)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </ExplainerShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="text-[9px] font-medium text-grey">{label}</div>
      <div className="mt-[4px] flex h-[32px] items-center rounded-[9px] bg-offwhite px-[10px]">
        <span className="truncate text-[11px] text-navy">{value}</span>
      </div>
    </>
  );
}
