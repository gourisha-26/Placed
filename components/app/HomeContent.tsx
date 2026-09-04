"use client";

import Link from "next/link";
import { HeroCard } from "@/components/app/HeroCard";
import { JobCard } from "@/components/app/JobCard";
import { PriorityLegend } from "@/components/app/Bits";
import { CompleteProfileCard } from "@/components/app/CompleteProfileCard";
import { ClashBanner } from "@/components/app/ClashBanner";
import { StatTiles } from "@/components/app/StatTiles";
import { STUDENT } from "@/lib/student";
import { useApplications } from "@/lib/useApplications";

/**
 * Home's scrolling content. Shared so the capture screen can show the
 * real Home underneath its widget instead of a copy that would drift.
 */
export function HomeContent() {
  const { counts, needsAttention, recent } = useApplications();

  return (
  <div className="screen-scroll flex-1 px-[20px] pb-[120px]">
    {/* greeting */}
    <div className="flex items-start gap-[12px]">
      <div className="flex-1">
        <div className="text-[13.5px] text-grey">Good morning,</div>
        <h1 className="mt-[2px] text-[27px] font-extrabold leading-[32px] tracking-[-0.01em] text-navy">
          {STUDENT.firstName}
        </h1>
      </div>
      <Link
        href="/profile"
        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[13px] bg-brand-light text-[15.5px] font-bold text-brand"
        aria-label="Profile"
      >
        {STUDENT.initial}
      </Link>
    </div>

    <p className="mt-[6px] text-[12.5px] text-grey">
      {counts.total} tracked · {needsAttention.length} need your attention
    </p>

    {/* only rendered when the details step was skipped */}
    <div className="mt-[14px] empty:mt-0">
      <CompleteProfileCard />
    </div>

    {/* buckets - counts come from the dataset, never hand-typed */}
    <div className="mt-[16px]">
      <StatTiles />
    </div>

    {/* F0 - the one thing that needs a decision, if there is one */}
    <ClashBanner />

    <div className="mt-[14px]">
      <HeroCard />
    </div>

    {/* needs attention */}
    <div className="mt-[22px] flex items-center gap-[8px]">
      <h2 className="text-[20px] font-extrabold tracking-[-0.01em] text-navy">
        Needs attention
      </h2>
      <CountBadge n={needsAttention.length} />
    </div>
    <div className="mt-[10px]">
      <PriorityLegend />
    </div>

    <div className="mt-[11px] space-y-[9px]">
      {needsAttention.map((a) => (
        <JobCard key={a.id} app={a} />
      ))}
    </div>

    {/* since yesterday */}
    <div className="mt-[22px] flex items-center gap-[8px]">
      <h2 className="flex-1 text-[20px] font-extrabold tracking-[-0.01em] text-navy">
        Since yesterday
      </h2>
      <Link
        href="/journey"
        className="text-[12.5px] font-semibold text-grey"
      >
        See all
      </Link>
    </div>

    <div className="mt-[11px] space-y-[9px]">
      {recent.map((a) => (
        <JobCard key={a.id} app={a} variant="recent" />
      ))}
    </div>
  </div>
  );
}

function CountBadge({ n }: { n: number }) {
  return (
    <span className="rounded-full border border-hairline bg-offwhite px-[8px] py-[3px] text-[11.5px] font-semibold text-grey">
      {n}
    </span>
  );
}
