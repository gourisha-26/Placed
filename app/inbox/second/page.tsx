"use client";

import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { Button } from "@/components/ui/Button";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { STUDENT } from "@/lib/student";

/**
 * The branch "I use two emails" on the previous screen was choosing
 * into - the first inbox is already settled by the time you land here,
 * so this step only has to add the second one and say so plainly.
 */
export default function SecondInboxPage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[28px]">
        <div className="text-[10.5px] font-bold tracking-[0.14em] text-grey">
          STEP 1 OF 2
        </div>
        <h1 className="mt-[8px] text-[22px] font-extrabold leading-[28px] tracking-[-0.01em] text-navy">
          Add your second inbox
        </h1>
        <p className="mt-[8px] text-[12.5px] leading-[18px] text-grey">
          We&apos;ll watch both for shortlists, assessments, interviews and
          offers - the college address included, since some placement cells
          reply there instead.
        </p>

        <div className="mt-[22px] space-y-[10px]">
          {/* the first inbox, already settled - shown so nothing here
              reads as replacing it */}
          <div className="flex items-center gap-[13px] rounded-[14px] border border-hairline bg-white px-[16px] py-[14px]">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-success-tint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="#0E7A4E"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-navy">
                {STUDENT.gmail}
              </span>
              <span className="mt-[1px] block text-[12px] text-grey">
                First inbox · ready to connect
              </span>
            </span>
          </div>

          {/* the second one this screen exists to add */}
          <div className="flex items-center gap-[13px] rounded-[14px] border border-blueline bg-brand-light px-[16px] py-[14px]">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16v12H4z"
                  stroke="#1B4FD8"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="m4 7 8 6 8-6" stroke="#1B4FD8" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-navy">
                {STUDENT.email}
              </span>
              <span className="mt-[1px] block text-[12px] text-brand">
                Second inbox · your college address
              </span>
            </span>
          </div>
        </div>
      </div>

      <ScreenFooter
        secondary={
          <button
            onClick={() => router.push("/connecting?count=1")}
            className="text-[12.5px] font-semibold text-grey"
          >
            Just use one for now
          </button>
        }
      >
        <Button onClick={() => router.push("/connecting?count=2")}>
          Connect both
        </Button>
      </ScreenFooter>
    </div>
  );
}
