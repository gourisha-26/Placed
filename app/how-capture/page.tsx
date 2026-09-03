"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ExplainerShell,
  Lines,
  useSequence,
  type Caption,
} from "@/components/app/ExplainerShell";

/* The demo walks three sources, then a capture, then the review sheet.
   Times are cue points in ms from the start of a run. */
const CUES = [0, 1600, 3000, 4200, 5600, 7000, 8600, 10200];

const CAPTION: Caption = {
  eyebrow: "THE BUTTON FLOATS OVER EVERY APP",
  line: "Widget follows you into every app.",
};

export default function HowCapturePage() {
  const [run, setRun] = useState(0);
  const { step, done } = useSequence(CUES, run);

  const source = step >= 2 ? 2 : step;
  const scanning = step === 3 || step === 4;

  return (
    <ExplainerShell
      caption={CAPTION}
      done={done}
      onReplay={() => setRun((r) => r + 1)}
    >
      {/* the app the widget is sitting over */}
      <AnimatePresence mode="wait">
        <motion.div
          key={source}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          {source === 0 && <LinkedInSource />}
          {source === 1 && <WhatsAppSource />}
          {source === 2 && <CareersSource showFields={step >= 4} />}
        </motion.div>
      </AnimatePresence>

      {/* the scan sweep */}
      {scanning && (
        <motion.div
          initial={{ top: 56, opacity: 0 }}
          animate={{ top: 300, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
          className="absolute left-0 h-[3px] w-full bg-brand"
        />
      )}

      {/* the floating capture button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: step >= 5 ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.4, delay: step === 0 ? 0.5 : 0 }}
        className="absolute left-[194px] top-[303px] flex h-[33px] w-[95px] items-center gap-[7px] rounded-full bg-navy pl-[13px]"
      >
        <span className="h-[15px] w-[15px] rounded-full bg-brand-light" />
        <span className="text-[11.5px] font-semibold text-white">Capture</span>
      </motion.div>

      {/* the tap on it */}
      {step === 3 && (
        <motion.span
          initial={{ opacity: 0.5, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute left-[213px] top-[291px] h-[58px] w-[58px] rounded-full bg-brand"
        />
      )}

      {/* review sheet */}
      <motion.div
        initial={{ y: 208 }}
        animate={{ y: step >= 5 ? 0 : 208 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 h-[208px] rounded-t-[14px] bg-white shadow-[0_-8px_24px_rgba(17,24,43,0.10)]"
      >
        <div className="mx-auto mt-[10px] h-[4px] w-[34px] rounded-full bg-hairline" />
        <div className="mt-[12px] px-[20px] text-[13px] font-semibold text-navy">
          Review capture
        </div>
        <div className="mt-[2px] px-[20px] text-[10px] text-grey">
          Check it, then save
        </div>

        <div className="mt-[10px] space-y-[4px] px-[20px]">
          {[
            ["Company", "Adobe"],
            ["Role", "UI/UX Designer"],
            ["Deadline", "18 Aug"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex h-[26px] items-center rounded-[7px] bg-offwhite px-[10px]"
            >
              <span className="flex-1 text-[9.5px] font-medium text-grey">{k}</span>
              <span className="text-[9.5px] font-semibold text-navy">{v}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 6 ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="mx-[20px] mt-[6px] flex h-[30px] items-center gap-[8px] rounded-[8px] bg-success-tint px-[12px]"
        >
          <span className="text-[12px] font-bold text-success">✓</span>
          <span className="text-[10px] font-semibold text-success">
            Saved to your Journey
          </span>
        </motion.div>
      </motion.div>
    </ExplainerShell>
  );
}

/* ---------- the three places a job turns up ---------- */

function UrlBar({ text, tone = "text-grey" }: { text: string; tone?: string }) {
  return (
    <div className="absolute left-[20px] top-[18px] flex h-[26px] w-[265px] items-center rounded-[8px] bg-offwhite px-[10px]">
      <span className={`text-[9.5px] ${tone}`}>{text}</span>
    </div>
  );
}

function LinkedInSource() {
  return (
    <>
      <UrlBar text="linkedin.com/jobs" />
      <div className="absolute left-[20px] top-[62px] flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-[#0A66C2] text-[12px] font-bold text-white">
        in
      </div>
      <div className="absolute left-[56px] top-[63px] text-[12.5px] font-semibold text-navy">
        Deloitte
      </div>
      <div className="absolute left-[56px] top-[79px] text-[9.5px] text-grey">
        Analyst · posted 3 days ago
      </div>
      <Lines widths={[250, 222, 240, 205]} top={106} />
      <div className="absolute left-[20px] top-[176px] flex h-[26px] w-[84px] items-center justify-center rounded-full bg-[#0A66C2] text-[10.5px] font-semibold text-white">
        Apply
      </div>
    </>
  );
}

function WhatsAppSource() {
  return (
    <>
      <UrlBar text="WhatsApp · Placement group" tone="text-[#25D366]" />
      <div className="absolute left-[20px] top-[62px] w-[232px] rounded-[12px] bg-success-tint p-[12px]">
        <div className="text-[10.5px] font-medium text-navy">
          TCS off-campus is open, apply fast
        </div>
        <div className="mt-[12px] rounded-[8px] bg-white px-[10px] py-[8px]">
          <div className="text-[9.5px] font-semibold text-navy">
            TCS · Systems Engineer
          </div>
          <div className="mt-[3px] text-[9px] text-grey">careers.tcs.com</div>
        </div>
      </div>
      <Lines widths={[180, 210]} top={162} />
    </>
  );
}

function CareersSource({ showFields }: { showFields: boolean }) {
  const FIELDS = [
    ["Deadline", "18 Aug"],
    ["Eligibility", "CGPA 7.0+"],
    ["Stipend", "₹18–22 LPA"],
  ];

  return (
    <>
      <UrlBar text="careers.adobe.com" />
      <div className="absolute left-[20px] top-[62px] h-[30px] w-[30px] rounded-[9px] bg-brand-light" />
      <div className="absolute left-[58px] top-[64px] text-[13px] font-semibold text-navy">
        Adobe
      </div>
      <div className="absolute left-[58px] top-[81px] text-[10px] text-grey">
        UI/UX Designer · Bengaluru
      </div>
      <Lines widths={[255, 232, 248, 210]} top={108} />

      {/* what the scan pulled out, arriving one at a time */}
      {FIELDS.map(([k, v], i) => (
        <motion.div
          key={k}
          initial={{ opacity: 0, y: 6 }}
          animate={showFields ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.3, delay: showFields ? i * 0.22 : 0 }}
          className="absolute left-[20px] flex h-[30px] w-[265px] items-center rounded-[8px] bg-brand-light px-[10px]"
          style={{ top: 178 + i * 34 }}
        >
          <span className="flex-1 text-[9.5px] font-medium text-brand">{k}</span>
          <span className="text-[9.5px] font-semibold text-navy">{v}</span>
        </motion.div>
      ))}
    </>
  );
}
