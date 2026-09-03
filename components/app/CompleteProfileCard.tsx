"use client";

import Link from "next/link";
import { useProfileStatus } from "@/lib/useProfileStatus";

/**
 * Shown on Home only when the student skipped the details step during
 * setup. Orange because it is the one thing on the screen asking for a
 * decision — it disappears once the details are filled in.
 */
export function CompleteProfileCard() {
  const complete = useProfileStatus();

  // null while reading storage, so it never flashes in on hydration
  if (complete !== false) return null;

  return (
    <div className="rounded-[22px] bg-orange-tint p-[15px]">
      <div className="flex items-center gap-[9px]">
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-orange-text">
          <span className="text-[11px] font-bold leading-none text-white">!</span>
        </span>
        <span className="text-[13px] font-semibold text-orange-text">
          Complete your profile
        </span>
      </div>

      <p className="mt-[6px] text-[12.5px] leading-[17px] text-orange-text">
        Add your details to get better placement updates and recommendations.
      </p>

      <Link
        href="/details"
        className="mt-[10px] flex items-center justify-between rounded-[14px] bg-white px-[14px] py-[10px]"
      >
        <span className="text-[13px] font-semibold text-orange-text">
          Complete now
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12h13M12 5l7 7-7 7"
            stroke="#B35400"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
