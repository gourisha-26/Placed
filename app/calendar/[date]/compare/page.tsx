"use client";

import { use } from "react";
import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { BackButton } from "@/components/app/BackButton";
import {
  clashOn,
  eventCompany,
  formatTime,
  type Application,
  type CalEvent,
} from "@/lib/data";
import { useApplications } from "@/lib/useApplications";

/**
 * F2 - the two commitments side by side. The facts that decide which is
 * easier to move (how far along, who set it) are the whole content.
 */
export default function ComparePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const { events, applications } = useApplications();
  const clash = clashOn(date, events);

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[30px]">
        <div className="pt-[6px]">
          <BackButton />
        </div>

        <h1 className="mt-[16px] text-[27px] font-extrabold tracking-[-0.01em] text-navy">
          Which one moves?
        </h1>
        <p className="mt-[8px] text-[13.5px] leading-[19px] text-grey">
          Both are on Friday morning. Keep one where it is and ask the other
          for a new time.
        </p>

        {clash ? (
          <div className="mt-[18px] space-y-[12px]">
            <Option event={clash.first} apps={applications} date={date} />
            <Option event={clash.second} apps={applications} date={date} />
          </div>
        ) : (
          <p className="mt-[20px] rounded-[16px] bg-white py-[24px] text-center text-[13px] text-grey">
            Nothing clashes on this day.
          </p>
        )}
      </div>
    </div>
  );
}

function Option({
  event,
  apps,
  date,
}: {
  event: CalEvent;
  apps: Application[];
  date: string;
}) {
  const app = eventCompany(event, apps);
  const warm = event.kind === "assessment";
  const tile = warm ? "bg-orange-tint" : "bg-brand-light";
  const ink = warm ? "text-orange-text" : "text-brand";

  return (
    <div className="rounded-[18px] border border-hairline bg-white p-[15px]">
      <div className="flex items-start gap-[13px]">
        <span
          className={`flex w-[62px] shrink-0 flex-col items-center rounded-[10px] py-[9px] ${tile}`}
        >
          <span className={`text-[15px] font-bold tabular-nums ${ink}`}>
            {event.startMin != null ? formatTime(event.startMin, false) : event.time}
          </span>
          <span className={`text-[11px] font-semibold opacity-80 ${ink}`}>
            {event.duration}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-bold text-navy">
            {app.company}
          </span>
          <span className="mt-[2px] block text-[12.5px] text-grey">
            {event.sub}
          </span>
        </span>
      </div>

      {/* the facts you actually weigh */}
      <div className="mt-[12px] rounded-[10px] bg-offwhite px-[13px]">
        {(event.rows ?? []).map(([k, v], i) => (
          <div
            key={k}
            className={`flex items-center gap-[10px] py-[11px] ${
              i > 0 ? "border-t border-hairline" : ""
            }`}
          >
            <span className="flex-1 text-[12.5px] text-grey">{k}</span>
            <span className="text-[12.5px] font-bold text-navy">{v}</span>
          </div>
        ))}
      </div>

      <Link
        href={`/calendar/${date}/move/${event.id}`}
        className={`mt-[12px] flex items-center gap-[10px] rounded-[10px] px-[14px] py-[12px] ${tile}`}
      >
        <span className={`flex-1 text-[13.5px] font-semibold ${ink}`}>
          Ask {app.company} to move this
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12h13M12 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ink}
          />
        </svg>
      </Link>
    </div>
  );
}
