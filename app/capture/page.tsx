"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { HomeContent } from "@/components/app/HomeContent";
import { Mascot } from "@/components/app/Mascot";

/**
 * 03 - Capture (widget on). Home with the widget switched on: a live
 * toast, the floating button, and a coach mark pointing at it.
 */
export default function CapturePage() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-offwhite">
      <StatusBar />
      <HomeContent />

      {/* the widget is running */}
      <div className="absolute inset-x-[20px] top-[62px] z-30 flex h-[42px] items-center gap-[10px] rounded-[14px] bg-white px-[15px] shadow-[0_6px_20px_rgba(17,24,43,0.10)]">
        <span className="relative flex h-[18px] w-[18px] items-center justify-center">
          <motion.span
            animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            className="absolute h-[10px] w-[10px] rounded-full bg-success"
          />
          <span className="h-[8px] w-[8px] rounded-full bg-success" />
        </span>
        <span className="flex-1 text-[13px] font-semibold text-navy">
          Capture widget is live
        </span>
        <Link href="/how-capture" className="text-[12.5px] font-semibold text-brand">
          How it works
        </Link>
      </div>

      {/* what to do with it */}
      <div className="pointer-events-none absolute left-[122px] top-[692px] z-40 flex h-[33px] items-center rounded-[12px] bg-navy px-[13px]">
        <span className="text-[12.5px] font-semibold text-white">
          Tap this on any job page
        </span>
      </div>

      {/* the floating button - tapping it runs the scan. Above the nav's
          scrim, which would otherwise wash it out. */}
      <div className="absolute left-[305px] top-[676px] z-40 h-[64px] w-[64px]">
        <motion.span
          animate={{ scale: [1, 1.7], opacity: [0.28, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute left-[-4px] top-[-4px] h-[72px] w-[72px] rounded-full bg-brand"
        />
        <button
          onClick={() => router.push("/capture/posting")}
          aria-label="Open a job posting to try capture"
          className="absolute left-[-4px] top-[-4px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(17,24,43,0.18)]"
        >
          <Mascot state="idle" size={55} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
