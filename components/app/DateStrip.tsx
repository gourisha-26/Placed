"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MONTH_LABEL, TODAY, clashOn, monthDays } from "@/lib/data";
import { useApplications } from "@/lib/useApplications";

/**
 * The month as a scrolling strip. It opens centred on today rather than
 * at the 1st, since the days that matter are the ones ahead.
 */
export function DateStrip({ selected = TODAY }: { selected?: string } = {}) {
  const { events } = useApplications();
  const days = monthDays(events);
  const scroller = useRef<HTMLDivElement>(null);
  const today = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const centreOnToday = (smooth = false) => {
    const el = scroller.current;
    const t = today.current;
    if (!el || !t) return;
    // offsetLeft, not a rect: the laptop preview scales the phone, and a
    // rect measured in scaled pixels would be written back unscaled
    const left = t.offsetLeft - el.clientWidth / 2 + t.offsetWidth / 2;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const measure = () => {
      setEdges({
        left: el.scrollLeft > 4,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    };

    centreOnToday();
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      {/* month row - the Today pill lives here because it drives the strip */}
      <div className="flex items-center">
        <span className="flex flex-1 items-center gap-[7px]">
          <span className="text-[19px] font-extrabold tracking-[-0.01em] text-navy">
            {MONTH_LABEL}
          </span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m5 8 7 8 7-8z" fill="#687286" />
          </svg>
        </span>
        <button
          onClick={() => centreOnToday(true)}
          className="rounded-full bg-white px-[14px] py-[7px] text-[12.5px] font-bold text-navy"
        >
          Today
        </button>
      </div>

    <div className="relative -mx-[20px] mt-[12px]">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x gap-[6px] overflow-x-auto px-[20px]"
      >
        {days.map((d) => (
          <SelectedCell
            key={d.date}
            day={d}
            selected={d.date === selected}
            clash={Boolean(clashOn(d.date, events))}
            innerRef={d.date === selected ? today : undefined}
          />
        ))}
      </div>

      <Fade side="left" show={edges.left} />
      <Fade side="right" show={edges.right} />
    </div>
    </>
  );
}

/**
 * A day in the strip. The selected day fills in - red when that day has
 * a clash on it, so the problem reads from the strip alone.
 */
function SelectedCell({
  day: d,
  selected,
  clash,
  innerRef,
}: {
  day: ReturnType<typeof monthDays>[number];
  selected: boolean;
  clash: boolean;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <Link
      href={`/calendar/${d.date}`}
      scroll={false}
      aria-current={selected ? "date" : undefined}
      className="shrink-0 snap-start"
    >
      <div
        ref={innerRef}
        className={`flex w-[48px] flex-col items-center rounded-[16px] py-[10px] ${
          selected ? (clash ? "bg-error" : "bg-navy") : "bg-white"
        }`}
      >
        <span
          className={`text-[11px] font-semibold ${
            selected ? "text-white/70" : "text-grey"
          }`}
        >
          {d.letter}
        </span>
        <span
          className={`mt-[3px] text-[15px] font-bold tabular-nums ${
            selected ? "text-white" : d.past ? "text-strong" : "text-navy"
          }`}
        >
          {d.day}
        </span>

        {/* always rendered, so every cell keeps the same height */}
        <span className="mt-[4px] flex h-[5px] items-center gap-[3px]">
          {d.dots.map((tone, i) => (
            <span
              key={i}
              className={`h-[5px] w-[5px] rounded-full ${
                selected
                  ? "bg-white"
                  : tone === "urgent"
                    ? "bg-orange"
                    : "bg-brand"
              }`}
            />
          ))}
        </span>
      </div>
    </Link>
  );
}

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
