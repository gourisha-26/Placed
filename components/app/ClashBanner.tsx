"use client";

import Link from "next/link";
import { eventCompany, formatDay, formatTime, scheduleClash } from "@/lib/data";
import { useApplications } from "@/lib/useApplications";
import { useRescheduled } from "@/lib/useReschedule";

/**
 * F0 - the clash surfaced on Home, not only on Calendar. Task 5's script
 * has the student notice something's wrong from Home itself ("Home
 * alert -> Friday 19"); before this, the only place the clash showed was
 * the Calendar screen, which nothing pointed to - so there was no way to
 * spot it the way the task assumes.
 *
 * Same banner Calendar renders (F3a once a request is out, the plain
 * clash otherwise) - one component now, so the two can't drift.
 */
export function ClashBanner() {
  const { applications } = useApplications();
  const requested = useRescheduled();
  const clash = scheduleClash();

  if (!clash) return null;

  if (requested) {
    const kept = [clash.a, clash.b].find((e) => e.id !== requested) ?? clash.b;
    return (
      <div className="mt-[14px] rounded-[18px] border border-orangeline bg-orange-tint p-[15px]">
        <div className="flex items-center gap-[9px]">
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-orange">
            <span className="text-[12px] font-bold leading-none text-white">
              !
            </span>
          </span>
          <span className="text-[14.5px] font-bold text-orange-text">
            Reschedule requested from{" "}
            {eventCompany(
              [clash.a, clash.b].find((e) => e.id === requested) ?? clash.a,
              applications,
            ).company}
          </span>
        </div>
        <p className="mt-[7px] text-[13px] leading-[18px] text-orange-text">
          {eventCompany(kept, applications).company} stays at{" "}
          {kept.startMin != null ? formatTime(kept.startMin) : kept.time}. We&apos;ll
          update the calendar when they reply.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-[14px] rounded-[18px] border border-orangeline bg-orange-tint p-[15px]">
      <div className="flex items-center gap-[9px]">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 4.5 21 20H3z"
            stroke="#B35400"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <path d="M12 10v4.2" stroke="#B35400" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.05" fill="#B35400" />
        </svg>
        <span className="text-[14.5px] font-bold text-orange-text">
          Two things clash on {formatDay(clash.date)}
        </span>
      </div>

      <p className="mt-[7px] text-[13px] leading-[18px] text-orange-text">
        {eventCompany(clash.a, applications).company} interview {clash.a.time} AM
        overlaps {eventCompany(clash.b, applications).company} assessment{" "}
        {clash.b.time} AM.
      </p>

      <div className="mt-[13px] flex gap-[9px]">
        <Link
          href={`/calendar/${clash.date}`}
          className="flex flex-[1.7] items-center justify-center rounded-[12px] bg-navy py-[13px] text-[13.5px] font-semibold text-white"
        >
          Fix the clash
        </Link>
        <Link
          href={`/calendar/${clash.date}/compare`}
          className="flex flex-1 items-center justify-center rounded-[12px] border border-orangeline bg-white py-[13px] text-[13.5px] font-bold text-orange-text"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}
