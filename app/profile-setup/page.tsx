"use client";

import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { Button } from "@/components/ui/Button";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { markProfileIncomplete } from "@/lib/useProfileStatus";

export default function ProfileSetupPage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[28px]">
        <div className="text-[10.5px] font-bold tracking-[0.14em] text-grey">
          STEP 2 OF 2
        </div>

        <div className="mt-[22px] flex h-[64px] w-[64px] items-center justify-center rounded-[18px] bg-brand-light">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#1B4FD8" strokeWidth="1.9" />
            <path
              d="M4 21c0-4 3.6-6 8-6s8 2 8 6"
              stroke="#1B4FD8"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="mt-[20px] text-[22px] font-extrabold leading-[28px] tracking-[-0.01em] text-navy">
          Add your personal
          <br />
          information
        </h1>

        <div className="mt-[22px] rounded-[16px] border border-hairline bg-white p-[18px]">
          <div className="text-[15px] font-bold text-navy">What it turns on</div>
          <div className="mt-[12px] flex flex-wrap gap-[8px]">
            {['"You qualify" checks', "Faster applications", "Eligibility warnings"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-[8px] bg-brand-light px-[11px] py-[6px] text-[11.5px] font-semibold text-brand"
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>

      </div>

      <ScreenFooter
        secondary={
          <button
            onClick={() => {
              markProfileIncomplete();
              router.push("/home");
            }}
            className="text-[12.5px] font-semibold text-grey"
          >
            Later - take me home
          </button>
        }
      >
        <Button onClick={() => router.push("/details")}>Add my details</Button>
      </ScreenFooter>
    </div>
  );
}
