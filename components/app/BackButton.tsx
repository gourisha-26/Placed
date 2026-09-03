"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Back"
      className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 5l-7 7 7 7"
          stroke="#11182B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
