"use client";

import { useDefaultResume } from "@/lib/useDefaultResume";

/** Only shown on the version that is actually the default. */
export function DefaultChip({ version }: { version: string }) {
  const def = useDefaultResume();
  if (def !== version) return null;

  return (
    <span className="shrink-0 rounded-full bg-brand-light px-[10px] py-[5px] text-[11.5px] font-semibold text-brand">
      Default
    </span>
  );
}
