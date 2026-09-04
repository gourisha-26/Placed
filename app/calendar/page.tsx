"use client";

import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { HeroCard } from "@/components/app/HeroCard";
import { ClashBanner } from "@/components/app/ClashBanner";
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
  thisWeek,
  type Application,
  type CalEvent,
} from "@/lib/data";
import { useApplications } from "@/lib/useApplications";

export default function CalendarPage() {
  // captured deadlines land here too, which is what the capture screen
  // promises when you save
  const { events, applications } = useApplications();
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

        <ClashBanner />

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
