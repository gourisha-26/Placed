"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { HeroCard } from "@/components/app/HeroCard";
import { JobCard } from "@/components/app/JobCard";
import { ClashBanner } from "@/components/app/ClashBanner";
import { Mascot } from "@/components/app/Mascot";
import { Wordmark } from "@/components/ui/Wordmark";
import { STUDENT } from "@/lib/student";
import { POSTING, CAPTURE_SOURCE } from "@/lib/capture";
import { INFERENCE } from "@/lib/inference";
import { suggestedMatch } from "@/lib/match";
import { APPLICATIONS, journeySections } from "@/lib/data";

/**
 * A self-playing walkthrough of the six things placED does, timed to
 * exactly 40 seconds and looping - built so it can be screen-recorded
 * directly for a demo video, with real components and real data at
 * every beat rather than staged copies that could drift from the app.
 *
 * Nothing here waits for a tap: a `TapDot` marks where a real finger
 * would land and the scene advances itself on the same clock a video
 * would run on.
 */
const BEATS = [
  { key: "splash", at: 0 },
  { key: "home", at: 4000 },
  { key: "posting", at: 7000 },
  { key: "review", at: 9500 },
  { key: "journey", at: 11000 },
  { key: "resume", at: 18000 },
  { key: "notification", at: 25000 },
  { key: "why", at: 28500 },
  { key: "clash", at: 32000 },
  { key: "outro", at: 37000 },
] as const;

const TOTAL = 40000;

export default function DemoPage() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      setElapsed((now - start) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scene = [...BEATS].reverse().find((b) => elapsed >= b.at)!.key;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-offwhite">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex h-full flex-col"
        >
          {scene === "splash" && <SplashScene />}
          {scene === "home" && <HomeScene />}
          {scene === "posting" && <PostingScene />}
          {scene === "review" && <ReviewScene />}
          {scene === "journey" && <JourneyScene />}
          {scene === "resume" && <ResumeScene />}
          {scene === "notification" && <NotificationScene />}
          {scene === "why" && <WhyScene />}
          {scene === "clash" && <ClashScene />}
          {scene === "outro" && <OutroScene />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- a real finger, landing somewhere ---------- */

function TapDot({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute z-50 h-[46px] w-[46px] rounded-full border-2 border-brand"
      style={{ left: x - 23, top: y - 23 }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: [0.4, 1.1, 0.9], opacity: [0, 0.9, 0] }}
      transition={{ duration: 0.7, delay, times: [0, 0.4, 1] }}
    />
  );
}

/* ---------- 0:00 - the mark ---------- */

function SplashScene() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[18px] bg-brand">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <Mascot size={96} />
      </motion.div>
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Wordmark tone="light" className="text-[34px]" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-[13.5px] text-white/75"
      >
        Your placement journey, tracked by itself.
      </motion.p>
    </div>
  );
}

/* ---------- 0:04 - Home, tapping the widget ---------- */

function HomeScene() {
  return (
    <div className="relative flex flex-1 flex-col">
      <StatusBar />
      <div className="flex-1 overflow-hidden px-[20px]">
        <div className="text-[13.5px] text-grey">Good morning,</div>
        <h1 className="mt-[2px] text-[27px] font-extrabold text-navy">
          {STUDENT.firstName}
        </h1>
        <div className="mt-[16px]">
          <HeroCard />
        </div>
        <h2 className="mt-[20px] text-[18px] font-extrabold text-navy">
          Needs attention
        </h2>
        <div className="mt-[10px] space-y-[9px]">
          {APPLICATIONS.filter((a) => a.needsAttention)
            .slice(0, 2)
            .map((a) => (
              <JobCard key={a.id} app={a} />
            ))}
        </div>
      </div>
      {/* the floating widget, exactly where /capture puts it */}
      <div className="pointer-events-none absolute bottom-[92px] right-[23px] z-30 flex h-[60px] items-center gap-[10px] rounded-full bg-navy pl-[12px] pr-[20px] shadow-[0_10px_28px_rgba(17,24,43,0.35)]">
        <Mascot size={40} />
        <span className="text-[13px] font-semibold text-white">Capture</span>
      </div>
      <TapDot x={286} y={708} delay={1.4} />
      <BottomNav />
    </div>
  );
}

/* ---------- 0:07 - a real posting, mid-scan ---------- */

function PostingScene() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
      <StatusBar />
      <div className="flex h-[50px] shrink-0 items-center gap-[10px] bg-[#F6F7F9] px-[14px]">
        <div className="flex h-[32px] flex-1 items-center rounded-full bg-white px-[12px] text-[11.5px] text-[#202124]">
          {CAPTURE_SOURCE.fullUrl}
        </div>
      </div>
      <div className="flex-1 px-[20px]">
        <h1 className="mt-[24px] text-[19px] font-bold text-navy">
          {POSTING.company}
        </h1>
        <p className="mt-[5px] text-[13px] text-grey">{POSTING.role}</p>
        <div className="mt-[16px] rounded-[14px] bg-offwhite p-[13px]">
          {POSTING.facts.slice(0, 2).map(([k, v]) => (
            <div key={k} className="flex justify-between py-[6px] text-[12.5px]">
              <span className="text-grey">{k}</span>
              <span className="font-bold text-navy">{v}</span>
            </div>
          ))}
        </div>
      </div>
      {/* the sweep */}
      <motion.div
        initial={{ top: 106, opacity: 1 }}
        animate={{ top: 500 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-x-[14px] h-[3px] bg-brand shadow-[0_0_18px_4px_rgba(27,79,216,0.35)]"
      />
      <div className="pointer-events-none absolute inset-x-[14px] top-[92px] bottom-[80px] rounded-[14px] border-2 border-brand/60" />
    </div>
  );
}

/* ---------- 0:09.5 - what it read ---------- */

function ReviewScene() {
  return (
    <div className="flex flex-1 flex-col bg-offwhite">
      <StatusBar />
      <div className="flex-1 px-[20px]">
        <h1 className="pt-[6px] text-[24px] font-extrabold text-navy">
          Review capture
        </h1>
        <div className="mt-[16px] flex items-center gap-[10px] rounded-[16px] bg-white p-[15px]">
          <span className="flex-1 text-[13px] font-semibold text-navy">
            8 of 9 fields read confidently
          </span>
          <span className="rounded-full bg-orange-tint px-[10px] py-[5px] text-[11px] font-semibold text-orange-text">
            1 to check
          </span>
        </div>
        <div className="mt-[16px] space-y-[10px]">
          {[
            ["Company", POSTING.company],
            ["Deadline", "18 Aug"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[11px] text-grey">{k}</div>
              <div className="mt-[5px] rounded-[12px] border border-hairline bg-white px-[14px] py-[12px] text-[14px] text-navy">
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 0:11 - the journey, sorted ---------- */

function JourneyScene() {
  const sections = journeySections().filter((s) => s.title !== "Needs action");
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-offwhite">
      <StatusBar />
      <div className="flex-1 px-[20px]">
        <h1 className="pt-[6px] text-[27px] font-extrabold text-navy">Journey</h1>
        <p className="mt-[4px] text-[12.5px] text-grey">
          {APPLICATIONS.length} tracked · sorted by what needs you
        </p>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -420 }}
          transition={{ duration: 6, ease: "easeInOut", delay: 0.6 }}
          className="mt-[16px]"
        >
          {sections.map((s) => (
            <div key={s.title} className="mt-[16px]">
              <h2 className="text-[16px] font-bold text-navy">{s.title}</h2>
              <div className="mt-[9px] space-y-[9px]">
                {s.items.map((a) => (
                  <JobCard key={a.id} app={a} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ---------- 0:18 - which resume fits ---------- */

function ResumeScene() {
  const match = suggestedMatch();
  return (
    <div className="flex flex-1 flex-col bg-offwhite">
      <StatusBar />
      <div className="flex-1 px-[20px]">
        <h1 className="pt-[6px] text-[22px] font-extrabold text-navy">
          {POSTING.company}
        </h1>
        <p className="mt-[3px] text-[13px] text-grey">{POSTING.role}</p>

        <h2 className="mt-[22px] text-[18px] font-extrabold text-navy">
          Resume match
        </h2>
        <div className="mt-[10px] rounded-[18px] bg-brand-light p-[18px]">
          <div className="flex items-center gap-[9px]">
            <motion.span
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[26px] font-extrabold text-brand"
            >
              {match.version} · {match.score}% match
            </motion.span>
          </div>
          <span className="mt-[3px] inline-block rounded-full bg-white px-[10px] py-[4px] text-[11px] font-semibold text-brand">
            Suggested
          </span>
          <p className="mt-[10px] text-[12.5px] leading-[18px] text-brand">
            Matched on {match.matched.join(", ").toLowerCase()}
          </p>
          <div className="mt-[14px] h-[42px] rounded-[12px] border border-blueline bg-white/60" />
        </div>
      </div>
    </div>
  );
}

/* ---------- 0:25 - a status changes on its own ---------- */

function NotificationScene() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#2B2540] via-[#221E33] to-[#171426]">
      <div className="mt-[36px] text-center text-white">
        <div className="text-[15px] text-white/85">16 August</div>
        <div className="mt-[10px] text-[62px] font-semibold leading-none">
          9:41
        </div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mx-[16px] mt-auto mb-[60px] rounded-[20px] bg-white/12 p-[15px] backdrop-blur-xl"
      >
        <div className="flex items-center gap-[8px]">
          <span className="flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-[6px] bg-brand-light">
            <Mascot size={18} />
          </span>
          <span className="flex-1 text-[11px] font-semibold tracking-[0.06em] text-white/70">
            PLACED
          </span>
        </div>
        <div className="mt-[9px] text-[15px] font-bold text-white">
          Adobe shortlisted you
        </div>
        <div className="mt-[2px] text-[13px] text-white/70">
          UI/UX designer · from your inbox
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- 0:28.5 - shown its working ---------- */

function WhyScene() {
  return (
    <div className="flex flex-1 flex-col bg-offwhite">
      <StatusBar />
      <div className="flex-1 px-[20px]">
        <h1 className="pt-[10px] text-[20px] font-extrabold text-navy">
          Why this changed
        </h1>
        <div className="mt-[14px] rounded-[16px] bg-white p-[15px]">
          <div className="text-[10.5px] font-bold tracking-[0.08em] text-grey">
            THEY WROTE
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-[8px] rounded-[10px] bg-brand-light p-[13px] text-[13.5px] leading-[20px] text-navy"
          >
            &ldquo;<span className="font-bold text-brand">{INFERENCE.phrase}</span> for
            review&rdquo;
          </motion.p>
          <div className="mt-[12px] text-[10.5px] font-bold tracking-[0.08em] text-grey">
            SO WE SET IT TO
          </div>
          <span className="mt-[6px] inline-block rounded-[8px] bg-brand-light px-[11px] py-[6px] text-[13px] font-semibold text-brand">
            {INFERENCE.status}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 0:32 - caught before it's a problem ---------- */

function ClashScene() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-offwhite">
      <StatusBar />
      <div className="flex-1 px-[20px]">
        <h1 className="pt-[6px] text-[27px] font-extrabold text-navy">
          Good morning,
        </h1>
        <h1 className="text-[27px] font-extrabold text-navy">Gourisha</h1>
        <ClashBanner />
      </div>
    </div>
  );
}

/* ---------- 0:37 - close on the mark ---------- */

function OutroScene() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[10px] bg-brand">
      <Wordmark tone="light" className="text-[30px]" />
      <p className="text-[13px] text-white/75">Placement, tracked by itself.</p>
    </div>
  );
}
