import Link from "next/link";
import { NEXT_UP } from "@/lib/data";

/** The blue "next up" card. Brand blue is the accent, so nothing
 *  inside it needs a second hue — white carries the primary action. */
export function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-brand px-[20px] py-[18px]">
      {/* document watermark, bleeding off the right edge */}
      <svg
        className="pointer-events-none absolute right-[-34px] top-[42px] opacity-[0.16]"
        width="150"
        height="150"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"
          stroke="#fff"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="8"
          y="2"
          width="8"
          height="4"
          rx="1"
          stroke="#fff"
          strokeWidth="1.1"
        />
        <path
          d="M8 11h8M8 15h5"
          stroke="#fff"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative flex items-center gap-[10px]">
        <span className="flex-1 text-[10.5px] font-bold tracking-[0.14em] text-white/70">
          {NEXT_UP.eyebrow}
        </span>
        <span className="rounded-full bg-brand-raised px-[11px] py-[5px] text-[11.5px] font-semibold text-white">
          {NEXT_UP.countdown}
        </span>
      </div>

      <h2 className="relative mt-[12px] text-[27px] font-extrabold leading-[32px] tracking-[-0.01em] text-white">
        {NEXT_UP.title}
      </h2>

      <p className="relative mt-[5px] text-[13px] font-medium text-white/80">
        {NEXT_UP.meta}
      </p>

      <div className="relative mt-[16px] flex items-center gap-[10px]">
        <Link
          href="/job/swiggy"
          className="rounded-[12px] bg-white px-[20px] py-[13px] text-[14px] font-semibold text-brand"
        >
          {NEXT_UP.primary}
        </Link>
        <Link
          href="/job/swiggy"
          className="rounded-[12px] px-[16px] py-[13px] text-[14px] font-semibold text-white"
        >
          {NEXT_UP.secondary}
        </Link>
      </div>
    </div>
  );
}
