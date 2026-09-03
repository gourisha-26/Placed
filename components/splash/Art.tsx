"use client";

import { motion } from "motion/react";

const ease = [0.22, 0.61, 0.36, 1] as const;

/* ---------------------------------------------------------------
   1 - Capture: a job posting inside scan brackets, with the
   floating widget button sitting over it.
   --------------------------------------------------------------- */
export function ArtCapture() {
  return (
    <div className="relative h-[300px] w-full">
      {/* scan brackets */}
      <motion.svg
        className="absolute left-[26px] top-[8px] z-10"
        width="270"
        height="230"
        viewBox="0 0 270 230"
        fill="none"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease, delay: 0.15 }}
      >
        <path
          d="M2 40V10a8 8 0 018-8h30"
          stroke="#FF7900"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M230 2h30a8 8 0 018 8v30"
          stroke="#FF7900"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M2 190v30a8 8 0 008 8h30"
          stroke="#FF7900"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* the posting */}
      <motion.div
        className="absolute left-[44px] top-[28px] w-[232px] rounded-[16px] bg-white p-[18px] shadow-[0_12px_32px_rgba(9,18,45,0.18)]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex items-center gap-[10px]">
          <div className="h-[26px] w-[26px] rounded-[8px] bg-brand-light" />
          <div>
            <div className="text-[13px] font-bold leading-none text-navy">
              Adobe
            </div>
            <div className="mt-[4px] text-[10px] text-grey">
              UI/UX Designer · Bengaluru
            </div>
          </div>
        </div>
        <div className="mt-[14px] space-y-[7px]">
          <div className="h-[7px] w-full rounded-full bg-strong/70" />
          <div className="h-[6px] w-full rounded-full bg-hairline" />
          <div className="h-[6px] w-[88%] rounded-full bg-hairline" />
          <div className="h-[6px] w-[60%] rounded-full bg-hairline" />
        </div>
        <div className="mt-[16px] h-[22px] w-[86px] rounded-[7px] bg-offwhite" />
      </motion.div>

      {/* floating widget */}
      <motion.div
        className="absolute left-[236px] top-[168px] z-20 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-orange shadow-[0_10px_26px_rgba(255,121,0,0.45)]"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease, delay: 0.35 }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8V5.5A2.5 2.5 0 015.5 3H8M16 3h2.5A2.5 2.5 0 0121 5.5V8M21 16v2.5a2.5 2.5 0 01-2.5 2.5H16M8 21H5.5A2.5 2.5 0 013 18.5V16"
            stroke="#fff"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.9" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2 - Automatic: an email arrives, dots travel, the timeline
   advances to Shortlisted on its own.
   --------------------------------------------------------------- */
export function ArtAutomatic() {
  return (
    <div className="relative h-[300px] w-full">
      {/* the reply */}
      <motion.div
        className="absolute left-[22px] top-[62px] w-[118px] rounded-[14px] bg-white p-[16px] text-center shadow-[0_10px_28px_rgba(9,18,45,0.16)]"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="absolute right-[-5px] top-[-5px] h-[13px] w-[13px] rounded-full bg-orange" />
        <svg
          className="mx-auto"
          width="42"
          height="26"
          viewBox="0 0 42 26"
          fill="none"
        >
          <path
            d="M4 4l17 15L38 4"
            stroke="#1B4FD8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-[10px] text-[11px] text-grey">Adobe replied</div>
      </motion.div>

      {/* travelling dots */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute top-[126px] h-[7px] w-[7px] rounded-full bg-white"
          style={{ left: 152 + i * 14 }}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.18,
          }}
        />
      ))}

      {/* timeline */}
      <motion.div
        className="absolute left-[196px] top-[10px] w-[150px] rounded-[16px] bg-white p-[18px] shadow-[0_12px_32px_rgba(9,18,45,0.18)]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.12 }}
      >
        <Step label="Applied" meta="13 Aug" state="done" />
        <Rail />
        <Step label="Shortlisted" meta="just now" state="active" />
        <Rail />
        <Step label="Interview" meta="-" state="todo" />
      </motion.div>
    </div>
  );
}

function Step({
  label,
  meta,
  state,
}: {
  label: string;
  meta: string;
  state: "done" | "active" | "todo";
}) {
  const dot =
    state === "active"
      ? "bg-orange"
      : state === "done"
        ? "bg-strong"
        : "bg-hairline";
  const title =
    state === "todo" ? "text-strong" : state === "active" ? "text-navy" : "text-grey";
  return (
    <div className="flex items-start gap-[10px]">
      <div className={`mt-[4px] h-[9px] w-[9px] shrink-0 rounded-full ${dot}`} />
      <div>
        <div className={`text-[12px] font-semibold leading-tight ${title}`}>
          {label}
        </div>
        <div className="mt-[2px] text-[10px] text-grey">{meta}</div>
      </div>
    </div>
  );
}

function Rail() {
  return <div className="ml-[4px] h-[16px] w-[1.5px] bg-hairline" />;
}

/* ---------------------------------------------------------------
   3 - Ready: the Friday clash, two events overlapping.
   --------------------------------------------------------------- */
export function ArtReady() {
  const days = ["M", "T", "W", "T", "F"];
  return (
    <div className="relative h-[300px] w-full">
      <motion.div
        className="absolute left-[38px] top-[24px] w-[278px] rounded-[18px] bg-white p-[20px] shadow-[0_14px_36px_rgba(9,18,45,0.2)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="text-[16px] font-bold text-navy">Friday 19</div>
        <div className="mt-[2px] text-[11.5px] text-grey">Two things overlap</div>

        <div className="mt-[14px] flex gap-[8px]">
          {days.map((d, i) => (
            <div
              key={i}
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-[11.5px] font-semibold ${
                i === 4
                  ? "bg-orange text-white"
                  : "bg-offwhite text-grey"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="relative mt-[16px] h-[76px]">
          <motion.div
            className="absolute left-0 top-0 w-[196px] rounded-[10px] bg-brand px-[12px] py-[9px]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.25 }}
          >
            <div className="text-[11.5px] font-semibold text-white">
              Deloitte · final round
            </div>
            <div className="text-[10.5px] text-white/75">11:00 – 11:45</div>
          </motion.div>

          <motion.div
            className="absolute left-[44px] top-[32px] w-[196px] rounded-[10px] bg-orange px-[12px] py-[9px]"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.4 }}
          >
            <div className="text-[11.5px] font-semibold text-white">
              Infosys · round 1
            </div>
            <div className="text-[10.5px] text-white/80">11:30 – 13:00</div>
          </motion.div>

          <motion.div
            className="absolute right-[-14px] top-[18px] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(9,18,45,0.2)]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease, delay: 0.6 }}
          >
            <span className="text-[14px] font-bold text-orange-text">!</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
