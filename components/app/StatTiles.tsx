"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApplications } from "@/lib/useApplications";

/**
 * The bucket counts. All five fit on the strip now that it scrolls, so
 * the tiles add up to the tracked total rather than stopping at the four
 * that happened to fit the width.
 */
const BUCKETS = [
  { label: "Saved", filter: "saved" },
  { label: "Waiting", filter: "waiting" },
  { label: "In process", filter: "inprocess" },
  { label: "Offer", filter: "offer" },
  { label: "Closed", filter: "closed" },
] as const;

export function StatTiles() {
  const { counts } = useApplications();
  const tiles = BUCKETS.map((b) => ({ ...b, value: counts[b.filter] }));

  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const measure = () => {
      setEdges({
        left: el.scrollLeft > 4,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    };

    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    // bleeds to the screen edges so the strip reads as continuing past them
    <div className="relative -mx-[20px]">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-[8px] overflow-x-auto scroll-px-[20px] px-[20px]"
      >
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={`/journey?f=${t.filter}`}
            className="flex w-[86px] shrink-0 snap-start flex-col items-center rounded-[14px] bg-brand-light py-[11px]"
          >
            <span className="text-[20px] font-bold leading-[24px] text-brand">
              {t.value}
            </span>
            <span className="mt-[1px] text-[11px] font-semibold text-brand/75">
              {t.label}
            </span>
          </Link>
        ))}
      </div>

      <Fade side="left" show={edges.left} />
      <Fade side="right" show={edges.right} />
    </div>
  );
}

/** Tells you there is more strip past the edge. */
function Fade({ side, show }: { side: "left" | "right"; show: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 w-[26px] transition-opacity duration-200 ${
        side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"
      } from-offwhite to-transparent ${show ? "opacity-100" : "opacity-0"}`}
    />
  );
}
