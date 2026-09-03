"use client";

import { use } from "react";
import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { DateStrip } from "@/components/app/DateStrip";
import {
  clashOn,
  eventCompany,
  eventsOn,
  formatDayLong,
  formatRange,
  formatTime,
  type CalEvent,
  type Application,
} from "@/lib/data";
import { useApplications } from "@/lib/useApplications";
import { useRescheduled } from "@/lib/useReschedule";

/**
 * F1 - one day, laid out on its clock. Two events that run over each
 * other are drawn in their real slots with the overlap called out
 * between them, so the problem is visible before it is described.
 */
export default function DayViewPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const { events, applications } = useApplications();

  const day = eventsOn(date, events);
  const clash = clashOn(date, events);
  const requested = useRescheduled();

  // the app's calendar has 1 August on a Monday, so the weekday has to
  // come from there rather than from a real Date
  const label = formatDayLong(date);

  return (
    <div className="relative flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[130px]">
        {/* same header as the calendar it came from */}
        <div className="flex items-start gap-[12px]">
          <h1 className="flex-1 text-[27px] font-extrabold tracking-[-0.01em] text-navy">
            Calendar
          </h1>
          <button
            aria-label="Calendar options"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[14px] bg-brand-light"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="1.8" fill="#1B4FD8" />
              <circle cx="12" cy="12" r="1.8" fill="#1B4FD8" />
              <circle cx="19" cy="12" r="1.8" fill="#1B4FD8" />
            </svg>
          </button>
        </div>

        <div className="mt-[14px]">
          <DateStrip selected={date} />
        </div>

        <div className="mb-[14px] mt-[22px] flex items-baseline gap-[10px]">
          <h2 className="flex-1 text-[19px] font-extrabold tracking-[-0.01em] text-navy">
            {label}
          </h2>
          <span className="text-[12.5px] text-grey">
            {day.length} event{day.length === 1 ? "" : "s"}
          </span>
        </div>

        {day.length === 0 ? (
          <p className="rounded-[16px] bg-white py-[24px] text-center text-[13px] text-grey">
            Nothing scheduled.
          </p>
        ) : (
          <div className="space-y-[10px]">
            {day.map((e, i) => (
              <div key={e.id}>
                <Slot event={e} apps={applications} />

                {/* the overlap sits between the two it belongs to */}
                {clash && e.id === clash.first.id && (
                  <div className="mt-[10px] rounded-[10px] bg-error-tint px-[14px] py-[9px] text-[12.5px] font-semibold text-error">
                    {clash.minutes} minutes overlap
                  </div>
                )}
                {i === day.length - 1 && null}
              </div>
            ))}
          </div>
        )}

        {/* once the request is out there is nothing left to decide here */}
        {clash && requested && (
          <div className="mt-[18px] rounded-[18px] border border-orangeline bg-orange-tint p-[15px]">
            <div className="flex items-center gap-[9px]">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-orange">
                <span className="text-[12px] font-bold leading-none text-white">!</span>
              </span>
              <span className="text-[14.5px] font-bold text-orange-text">
                Reschedule requested from{" "}
                {eventCompany(
                  [clash.first, clash.second].find((e) => e.id === requested) ?? clash.first,
                  applications,
                ).company}
              </span>
            </div>
            <p className="mt-[7px] text-[13px] leading-[18px] text-orange-text">
              Waiting on a reply. The slot below stays until they answer.
            </p>
          </div>
        )}

        {/* the decision this screen exists for */}
        {clash && !requested && (
          <div className="mt-[18px] rounded-[18px] bg-white p-[16px]">
            <div className="text-[15px] font-bold text-navy">
              Only one can stay. Which do you move?
            </div>

            <div className="mt-[12px] space-y-[9px]">
              <MoveOption
                event={clash.first}
                apps={applications}
                note="Final round · recruiter set it"
                date={date}
              />
              <MoveOption
                event={clash.second}
                apps={applications}
                note="Round 1 of 4 · placement cell slot"
                date={date}
              />
            </div>

            <Link
              href={`/calendar/${date}/compare`}
              className="mt-[14px] flex items-center justify-center gap-[6px] text-[13px] font-semibold text-brand"
            >
              Compare them side by side →
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

/** One event drawn against its start time. */
function Slot({ event, apps }: { event: CalEvent; apps: Application[] }) {
  const app = eventCompany(event, apps);
  const clashing = Boolean(event.clashesWith);
  const tone = clashing && event.kind === "assessment";

  return (
    <div className="flex gap-[12px]">
      <span className="w-[42px] shrink-0 pt-[13px] text-right text-[12px] tabular-nums text-grey">
        {event.startMin != null ? formatTime(event.startMin, false) : event.time}
      </span>

      <div
        className={`min-w-0 flex-1 rounded-[12px] p-[13px] ${
          tone ? "bg-orange-tint" : "bg-brand-light"
        }`}
      >
        <div
          className={`text-[15px] font-bold ${
            tone ? "text-orange-text" : "text-brand"
          }`}
        >
          {app.company}
        </div>
        <div
          className={`mt-[3px] text-[12.5px] ${
            tone ? "text-orange-text" : "text-brand"
          }`}
        >
          {event.sub ?? event.detail}
        </div>
        <div
          className={`mt-[2px] text-[12.5px] ${
            tone ? "text-orange-text" : "text-brand"
          }`}
        >
          {event.startMin != null && event.endMin != null
            ? formatRange(event.startMin, event.endMin)
            : event.time}
          {event.where ? ` · ${event.where}` : ""}
        </div>
      </div>
    </div>
  );
}

function MoveOption({
  event,
  apps,
  note,
  date,
}: {
  event: CalEvent;
  apps: Application[];
  note: string;
  date: string;
}) {
  const app = eventCompany(event, apps);
  return (
    <Link
      href={`/calendar/${date}/move/${event.id}`}
      className="flex items-center gap-[12px] rounded-[12px] bg-offwhite p-[13px]"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold text-navy">
          Move {app.company}
        </span>
        <span className="mt-[2px] block truncate text-[12.5px] text-grey">
          {note}
        </span>
      </span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h13M12 5l7 7-7 7"
          stroke="#687286"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
