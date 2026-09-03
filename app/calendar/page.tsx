"use client";

import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { HeroCard } from "@/components/app/HeroCard";
import { DateStrip } from "@/components/app/DateStrip";
import {
  TODAY,
  TOMORROW,
  closingSoon,
  daysUntil,
  eventCompany,
  eventsOn,
  formatDay,
  formatTime,
  isUrgent,
  scheduleClash,
  thisWeek,
  type Application,
  type CalEvent,
} from "@/lib/data";
import { useApplications } from "@/lib/useApplications";
import { useRescheduled } from "@/lib/useReschedule";

export default function CalendarPage() {
  // captured deadlines land here too, which is what the capture screen
  // promises when you save
  const { events, applications } = useApplications();
  const requested = useRescheduled();
  const clash = scheduleClash();
  const today = eventsOn(TODAY, events);
  const tomorrow = eventsOn(TOMORROW, events);
  const week = thisWeek(events);
  const soon = closingSoon(events);

  return (
    <div className="relative flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[130px]">
        {/* header */}
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

        {/* month label, Today pill and the scrolling date strip */}
        <div className="mt-[14px]">
          <DateStrip />
        </div>

        {/* F3a - once a request is out, the clash stops being a decision
            and becomes a thing you are waiting on */}
        {clash && requested && (
          <div className="mt-[16px] rounded-[18px] border border-orangeline bg-orange-tint p-[15px]">
            <div className="flex items-center gap-[9px]">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-orange">
                <span className="text-[12px] font-bold leading-none text-white">!</span>
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
              {eventCompany(
                [clash.a, clash.b].find((e) => e.id !== requested) ?? clash.b,
                applications,
              ).company}{" "}
              stays at{" "}
              {(() => {
                const kept = [clash.a, clash.b].find((e) => e.id !== requested) ?? clash.b;
                return kept.startMin != null ? formatTime(kept.startMin) : kept.time;
              })()}
              . We&apos;ll update the calendar when they reply.
            </p>
          </div>
        )}

        {/* the one thing that needs a decision */}
        {clash && !requested && (
          <div className="mt-[16px] rounded-[18px] border border-orangeline bg-orange-tint p-[15px]">
            <div className="flex items-center gap-[9px]">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 4.5 21 20H3z"
                  stroke="#B35400"
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10v4.2"
                  stroke="#B35400"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1.05" fill="#B35400" />
              </svg>
              <span className="text-[14.5px] font-bold text-orange-text">
                Two things clash on {formatDay(clash.date)}
              </span>
            </div>

            <p className="mt-[7px] text-[13px] leading-[18px] text-orange-text">
              {eventCompany(clash.a, applications).company} interview {clash.a.time} AM overlaps{" "}
              {eventCompany(clash.b, applications).company} assessment {clash.b.time} AM.
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
        )}

        {/* today - the same hero the home screen leads with */}
        <Heading label={`Today · ${formatDay(TODAY)}`} n={today.length} />
        <HeroCard />

        {/* tomorrow */}
        <Heading label={`Tomorrow · ${formatDay(TOMORROW)}`} n={tomorrow.length} />
        <div className="space-y-[9px]">
          {tomorrow.map((e) => (
            <EventRow key={e.id} event={e} apps={applications} />
          ))}
        </div>

        {/* rest of the week */}
        <Heading label="This week" n={week.length} />
        <div className="space-y-[9px]">
          {week.map((e) => (
            <EventRow key={e.id} event={e} showDate apps={applications} />
          ))}
        </div>

        {/* deadlines worth watching */}
        <Heading label="Closing soon" n={soon.length} unit="deadline" />
        <div>
          {soon.map((e) => {
            const app = eventCompany(e, applications);
            const days = daysUntil(e.date);
            const urgent = days <= 7;
            return (
              <Link
                key={e.id}
                href={`/job/${app.id}`}
                className="flex items-center gap-[10px] py-[13px]"
              >
                <span className="flex-1 truncate text-[14px] text-navy">
                  {app.company} · {app.role.split(" · ")[0]}
                </span>
                <span
                  className={`shrink-0 rounded-full px-[11px] py-[5px] text-[11.5px] font-bold ${
                    urgent
                      ? "bg-error-tint text-error"
                      : "bg-offwhite text-grey"
                  }`}
                >
                  in {days} days
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function Heading({
  label,
  n,
  unit = "event",
}: {
  label: string;
  n: number;
  unit?: string;
}) {
  return (
    <div className="mb-[11px] mt-[22px] flex items-center gap-[10px]">
      <h2 className="flex-1 text-[19px] font-extrabold tracking-[-0.01em] text-navy">
        {label}
      </h2>
      <span className="text-[12.5px] text-grey">
        {n} {unit}
        {n === 1 ? "" : "s"}
      </span>
    </div>
  );
}

function EventRow({
  event,
  showDate = false,
  apps,
}: {
  event: CalEvent;
  showDate?: boolean;
  apps?: Application[];
}) {
  const app = eventCompany(event, apps);
  const urgent = isUrgent(event);
  const chip = urgent ? "bg-orange-tint text-orange-text" : "bg-brand-light text-brand";
  const line = urgent ? "text-orange-text" : "text-brand";

  return (
    <Link
      href={`/job/${app.id}`}
      className="flex items-center gap-[13px] rounded-[16px] border border-hairline bg-white p-[13px]"
    >
      <span
        className={`flex w-[72px] shrink-0 items-center justify-center rounded-[12px] py-[11px] text-[13.5px] font-bold tabular-nums ${chip}`}
      >
        {event.time}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15.5px] font-bold text-navy">
          {app.company}
        </span>
        <span className={`mt-[2px] block text-[13px] font-semibold leading-[17px] ${line}`}>
          {showDate ? `${formatDay(event.date)} · ` : ""}
          {event.detail}
        </span>
      </span>
    </Link>
  );
}
