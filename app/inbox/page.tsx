"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { Button } from "@/components/ui/Button";
import { ScreenFooter } from "@/components/ui/ScreenFooter";

export default function InboxPage() {
  const router = useRouter();
  const [choice, setChoice] = useState<"one" | "two">("one");
  const [notify, setNotify] = useState(true);

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[28px]">
        <div className="text-[10.5px] font-bold tracking-[0.14em] text-grey">
          STEP 1 OF 2
        </div>
        <h1 className="mt-[8px] text-[22px] font-extrabold leading-[28px] tracking-[-0.01em] text-navy">
          Connect your Gmail
        </h1>
        <p className="mt-[8px] text-[12.5px] leading-[18px] text-grey">
          We&apos;ll watch only that inbox - for shortlists, assessments,
          interviews and offers. Nothing else is read.
        </p>

        <div className="mt-[22px] space-y-[10px]">
          <Option
            selected={choice === "one"}
            onClick={() => setChoice("one")}
            title="Email"
            body="The address you use to apply for jobs"
          />
          <Option
            selected={choice === "two"}
            onClick={() => setChoice("two")}
            title="I use two emails"
            body="We'll watch both"
          />
        </div>

        <div className="my-[22px] h-px bg-hairline" />

        <div className="text-[10.5px] font-bold tracking-[0.14em] text-grey">
          NOTIFICATION PERMISSIONS
        </div>

        <div className="mt-[12px] rounded-[14px] border border-hairline bg-white p-[16px]">
          <div className="flex items-start justify-between">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-brand-light">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6"
                  stroke="#1B4FD8"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 20a2 2 0 004 0"
                  stroke="#1B4FD8"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <button
              role="switch"
              aria-checked={notify}
              aria-label="Track updates from other apps"
              onClick={() => setNotify(!notify)}
              className={`relative h-[24px] w-[40px] rounded-full transition-colors duration-200 ${
                notify ? "bg-brand" : "bg-strong"
              }`}
            >
              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all duration-200 ${
                  notify ? "left-[19px]" : "left-[3px]"
                }`}
              />
            </button>
          </div>

          <div className="mt-[14px] text-[14px] font-bold text-navy">
            Track updates from other apps
          </div>
          <div className="mt-[3px] text-[12.5px] leading-[17px] text-grey">
            Stay updated on jobs, even outside your inbox.
          </div>
        </div>

      </div>

      <ScreenFooter>
        <Button
          onClick={() =>
            // "I use two emails" isn't a dead option - it routes through
            // a second inbox step before connecting either one
            router.push(
              choice === "two" ? "/inbox/second" : "/connecting?count=1",
            )
          }
        >
          Continue
        </Button>
      </ScreenFooter>
    </div>
  );
}

function Option({
  selected,
  onClick,
  title,
  body,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[14px] border px-[16px] py-[15px] text-left transition-colors duration-150 ${
        selected
          ? "border-blueline bg-brand-light"
          : "border-hairline bg-white"
      }`}
    >
      <div>
        <div
          className={`text-[14.5px] font-bold ${
            selected ? "text-navy" : "text-navy"
          }`}
        >
          {title}
        </div>
        <div
          className={`mt-[2px] text-[12.5px] ${
            selected ? "text-brand" : "text-grey"
          }`}
        >
          {body}
        </div>
      </div>
      <span
        className={`ml-[12px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          selected ? "border-brand" : "border-strong"
        }`}
      >
        {selected && <span className="h-[11px] w-[11px] rounded-full bg-brand" />}
      </span>
    </button>
  );
}
