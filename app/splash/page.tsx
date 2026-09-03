"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { ArtCapture, ArtAutomatic, ArtReady } from "@/components/splash/Art";

const SLIDES = [
  {
    eyebrow: "PLACEMENTS",
    title: "Your placement journey,\ntracked by itself.",
    body: "Screenshot a job posting. We read it, file it, and follow every update from your inbox.",
    Art: ArtCapture,
  },
  {
    eyebrow: "AUTOMATIC",
    title: "Every reply,\nread and filed.",
    body: "Connect the inbox you apply from. Shortlists, assessments and offers update on their own.",
    Art: ArtAutomatic,
  },
  {
    eyebrow: "READY",
    title: "Know what needs\nyou today.",
    body: "Deadlines, clashes and the right resume - surfaced before you have to ask.",
    Art: ArtReady,
  },
];

export default function SplashPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];
  const Art = slide.Art;

  const next = () => (last ? router.push("/inbox") : setI(i + 1));

  return (
    <div className="flex h-full flex-col bg-offwhite">
      {/* Blue stage */}
      <div className="relative shrink-0 overflow-hidden rounded-b-[36px] bg-brand pb-[24px]">
        {/* soft depth shapes */}
        <div className="pointer-events-none absolute -right-[70px] -top-[90px] h-[280px] w-[280px] rounded-full bg-white/[0.07]" />
        <div className="pointer-events-none absolute -bottom-[120px] -left-[60px] h-[260px] w-[260px] rounded-full bg-white/[0.05]" />

        <StatusBar tone="light" />

        <div className="px-[20px]">
          <Wordmark className="text-[22px]" tone="light" />
        </div>

        <div className="mt-[14px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Art />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col px-[20px]">
        <div className="flex justify-center gap-[6px] pt-[26px]">
          {SLIDES.map((_, k) => (
            <button
              key={k}
              aria-label={`Go to slide ${k + 1}`}
              onClick={() => setI(k)}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                k === i ? "w-[22px] bg-brand" : "w-[6px] bg-strong"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="pt-[28px]"
          >
            <div className="text-[10.5px] font-bold tracking-[0.14em] text-brand">
              {slide.eyebrow}
            </div>
            <h1 className="mt-[10px] whitespace-pre-line text-[27px] font-extrabold leading-[33px] tracking-[-0.01em] text-navy">
              {slide.title}
            </h1>
            <p className="mt-[12px] text-[13.5px] leading-[20px] text-grey">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Actions - reserved height keeps the button at one position
          across all three slides, with or without the skip link. */}
      <ScreenFooter
        secondary={
          !last && (
            <button
              onClick={() => router.push("/inbox")}
              className="text-[12.5px] font-semibold text-grey"
            >
              Skip for now
            </button>
          )
        }
      >
        <Button onClick={next}>
          {last ? "Continue with Email" : "Next →"}
        </Button>
      </ScreenFooter>
    </div>
  );
}
