import Link from "next/link";
import type { Application, Priority } from "@/lib/data";

/**
 * Priority drives the avatar tint, the dot and the meta text together,
 * so one colour decision reads across the whole card.
 */
const TONE: Record<
  Priority,
  { tile: string; letter: string; dot: string; meta: string }
> = {
  high: {
    tile: "bg-orange-tint",
    letter: "text-orange",
    dot: "bg-orange",
    meta: "text-orange-text",
  },
  medium: {
    tile: "bg-brand-light",
    letter: "text-brand-deep",
    dot: "bg-brand-deep",
    meta: "text-brand-deep",
  },
  low: {
    tile: "bg-offwhite",
    letter: "text-grey",
    dot: "bg-strong",
    meta: "text-grey",
  },
};

export function JobCard({
  app,
  variant = "next",
}: {
  app: Application;
  /** "next" shows what happens next; "recent" shows what just changed. */
  variant?: "next" | "recent";
}) {
  const showRecent = variant === "recent" && app.recent;
  const meta = showRecent ? app.recent!.meta : app.meta;
  const tone = TONE[showRecent ? app.recent!.priority : app.priority];

  return (
    <Link
      href={`/job/${app.id}`}
      className="flex items-start gap-[13px] rounded-[14px] border border-hairline bg-white px-[14px] py-[14px] transition-[transform,box-shadow] duration-150 active:scale-[0.995]"
    >
      <span
        className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] ${tone.tile}`}
      >
        <span className={`text-[15.5px] font-bold ${tone.letter}`}>
          {app.company[0]}
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-[8px]">
          <span className="min-w-0 flex-1 truncate text-[15.5px] font-bold text-navy">
            {app.company}
          </span>
          <span className="shrink-0 rounded-[7px] border border-hairline bg-offwhite px-[9px] py-[4px] text-[11.5px] font-semibold text-grey">
            {app.stage}
          </span>
        </span>

        <span className="mt-[2px] block truncate text-[12.5px] text-grey">
          {app.role}
        </span>

        <span className="mt-[7px] flex items-center gap-[7px]">
          <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${tone.dot}`} />
          <span className={`text-[12.5px] font-semibold ${tone.meta}`}>
            {meta}
          </span>
        </span>
      </span>
    </Link>
  );
}
