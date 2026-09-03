"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { JobCard } from "@/components/app/JobCard";
import { SectionHeading, PriorityLegend } from "@/components/app/Bits";
import {
  FILTERS,
  filterApplications,
  journeySections,
  type FilterId,
} from "@/lib/data";
import { useApplications } from "@/lib/useApplications";
import { useJobState } from "@/lib/useJobState";

export default function JourneyPage() {
  return (
    <Suspense fallback={<JourneyShell filter="all" onFilter={() => {}} />}>
      <JourneyInner />
    </Suspense>
  );
}

function JourneyInner() {
  const params = useSearchParams();
  const appliedId = params.get("applied");
  const initial = (params.get("f") as FilterId) ?? "all";
  const [filter, setFilter] = useState<FilterId>(
    FILTERS.some((f) => f.id === initial) ? initial : "all",
  );
  return (
    <JourneyShell filter={filter} onFilter={setFilter} appliedId={appliedId} />
  );
}

function JourneyShell({
  filter,
  onFilter,
  appliedId,
}: {
  filter: FilterId;
  onFilter: (f: FilterId) => void;
  appliedId?: string | null;
}) {
  const { applications, counts, needsAttention } = useApplications();
  const isAll = filter === "all";
  const sections = journeySections(applications);
  const filtered = filterApplications(filter, applications);
  const activeLabel = FILTERS.find((f) => f.id === filter)?.label ?? "All";

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[120px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="flex-1 text-[27px] font-extrabold tracking-[-0.01em] text-navy">
            Journey
          </h1>
          <button
            aria-label="Search applications"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-hairline bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#11182B" strokeWidth="2" />
              <path
                d="m20 20-3.5-3.5"
                stroke="#11182B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {appliedId && <AppliedBanner jobId={appliedId} />}

        <p className="mt-[4px] text-[12.5px] text-grey">
          {isAll
            ? `${counts.total} tracked · ${needsAttention.length} need your attention`
            : `${filtered.length} of ${counts.total} · ${activeLabel}`}
        </p>

        <FilterRow value={filter} onChange={onFilter} />

        <div className="mt-[12px]">
          <PriorityLegend />
        </div>

        {isAll ? (
          sections.map((s) => (
            <div key={s.title} className="mt-[20px]">
              <SectionHeading title={s.title} count={s.items.length} size="sm" />
              <div className="mt-[10px] space-y-[9px]">
                {s.items.map((a) => (
                  <JobCard key={a.id} app={a} />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* a filter is already the grouping - sections inside one would
             be two competing groupings on the same screen */
          <div className="mt-[16px] space-y-[9px]">
            {filtered.length > 0 ? (
              filtered.map((a) => <JobCard key={a.id} app={a} />)
            ) : (
              <p className="pt-[30px] text-center text-[13px] text-grey">
                Nothing here yet.
              </p>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

/** D8 - confirms what just happened, and that nothing more is needed. */
function AppliedBanner({ jobId }: { jobId: string }) {
  const { applications } = useApplications();
  const job = useJobState(jobId);
  const app = applications.find((a) => a.id === jobId);
  if (!app || !job.applied) return null;

  return (
    <div className="mt-[10px] rounded-[14px] bg-brand-light px-[14px] py-[11px]">
      <div className="text-[13px] font-semibold text-brand">
        Applied to {app.company} with {job.appliedWith}
      </div>
      <div className="mt-[3px] text-[12.5px] text-brand/85">
        Status will update on its own from now on
      </div>
    </div>
  );
}

/**
 * Six pills don't fit 393px, so the row scrolls. Without an affordance
 * the last pill is invisible and the row reads as if it ends at "Offer".
 * A fade on whichever edge has more content, plus a nudge into view for
 * the selected pill, makes the overflow legible.
 */
function FilterRow({
  value,
  onChange,
}: {
  value: FilterId;
  onChange: (f: FilterId) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = () => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    measure();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // keep the active pill visible when arriving via a deep link
  useEffect(() => {
    scroller.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    measure();
  }, [value]);

  return (
    <div className="relative -mx-[20px] mt-[16px]">
      <div
        ref={scroller}
        className="screen-scroll flex gap-[5px] overflow-x-auto px-[20px]"
      >
        {FILTERS.map((f) => {
          const on = f.id === value;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              aria-pressed={on}
              className={`shrink-0 rounded-full px-[8px] py-[7px] text-[11.5px] font-semibold transition-colors duration-150 ${
                on
                  ? "bg-navy text-white"
                  : "border border-hairline bg-white text-navy"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <Fade side="left" show={edges.left} />
      <Fade side="right" show={edges.right} />
    </div>
  );
}

function Fade({ side, show }: { side: "left" | "right"; show: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 w-[36px] transition-opacity duration-200 ${
        side === "left"
          ? "left-0 bg-gradient-to-r"
          : "right-0 bg-gradient-to-l"
      } from-offwhite to-transparent ${show ? "opacity-100" : "opacity-0"}`}
    />
  );
}
