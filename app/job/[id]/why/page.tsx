"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BackButton } from "@/components/app/BackButton";
import { INFERENCE } from "@/lib/inference";
import { useApplications } from "@/lib/useApplications";
import { setJobState } from "@/lib/useJobState";

/**
 * E3 - placED shows its working. The quoted phrase is highlighted inside
 * the real message, so the reasoning can be checked against the source
 * rather than taken on trust.
 */
export default function WhyChangedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { applications } = useApplications();
  const app = applications.find((a) => a.id === id);

  const decide = (decision: "kept" | "corrected") => {
    setJobState(id, { decision });
    router.push(`/job/${id}`);
  };

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[20px]">
        <div className="pt-[6px]">
          <BackButton />
        </div>

        <div className="mt-[16px] flex items-start gap-[13px]">
          <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] bg-brand-light text-[15.5px] font-bold text-brand">
            {app?.company[0] ?? "A"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-[9px]">
              <span className="text-[20px] font-bold text-navy">
                {app?.company ?? "Adobe"}
              </span>
              <span className="rounded-[7px] bg-brand-light px-[9px] py-[3px] text-[11.5px] font-semibold text-brand">
                {INFERENCE.status}
              </span>
            </span>
            <span className="mt-[1px] block text-[13px] text-grey">
              UI/UX designer
            </span>
          </span>
        </div>

        <h1 className="mt-[16px] text-[22px] font-extrabold tracking-[-0.01em] text-navy">
          Why this changed
        </h1>

        {/* the chain of reasoning, one step per line */}
        <div className="mt-[12px] rounded-[18px] bg-white p-[16px]">
          <Step label="ADOBE EMAILED YOU">
            <span className="text-[13px] text-grey">
              {INFERENCE.from} · {INFERENCE.date}
            </span>
          </Step>

          <Step label="THEY WROTE">
            <span className="mt-[2px] block rounded-[10px] bg-brand-light p-[13px] text-[13.5px] leading-[20px] text-navy">
              “<span className="font-bold text-brand">{INFERENCE.phrase}</span>{" "}
              for review”
            </span>
          </Step>

          <Step label="SO WE SET IT TO" last>
            <span className="mt-[2px] inline-block rounded-[8px] bg-brand-light px-[11px] py-[6px] text-[13px] font-semibold text-brand">
              {INFERENCE.status}
            </span>
          </Step>
        </div>

        {/* the source, so the quote can be checked */}
        <div className="mb-[8px] mt-[18px] text-[12px] font-semibold text-grey">
          The message
        </div>
        <div className="rounded-[18px] border border-hairline bg-white p-[15px]">
          <div className="flex items-start gap-[11px]">
            <span className="mt-[2px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-offwhite">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#687286" strokeWidth="1.8" />
                <path d="m3.5 7 8.5 6 8.5-6" stroke="#687286" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-navy">
                {INFERENCE.subject}
              </span>
              <span className="mt-[2px] block truncate text-[12.5px] text-grey">
                {INFERENCE.from} · {INFERENCE.date}
              </span>
            </span>
          </div>

          <p className="mt-[13px] text-[13.5px] text-navy">{INFERENCE.greeting}</p>
          <p className="mt-[8px] text-[13.5px] leading-[20px] text-navy">
            Thank you for your interest in the UI/UX Designer role. We&apos;re{" "}
            <mark className="bg-brand-light font-semibold text-brand">
              moving your profile forward
            </mark>{" "}
            for review.
          </p>
          <p className="mt-[10px] border-t border-hairline pt-[10px] text-[12.5px] text-grey">
            {INFERENCE.sender}
          </p>

          <a
            href="https://mail.google.com/mail/u/0/#search/from%3Acareers-noreply%40adobe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[12px] flex items-center gap-[9px] text-[13px] font-semibold text-brand"
          >
            <svg width="16" height="12" viewBox="0 0 24 18" fill="none" aria-hidden>
              <path d="M2 3.5 12 11l10-7.5" stroke="#EA4335" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="2" y="2" width="20" height="14" rx="2.5" stroke="#EA4335" strokeWidth="2" />
            </svg>
            <span className="flex-1">Open in Gmail</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M14 4h6v6M20 4l-9 9" stroke="#1B4FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="#1B4FD8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* nothing here is irreversible, and it helps to say so */}
        <div className="mt-[16px] rounded-[14px] bg-brand-light p-[14px]">
          <div className="flex items-center gap-[8px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 12a8 8 0 1 0 2.3-5.6" stroke="#1B4FD8" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 4v4h4" stroke="#1B4FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px] font-semibold text-brand">
              You can change this any time
            </span>
          </div>
          <p className="mt-[5px] text-[12.5px] leading-[17px] text-brand">
            Nothing is sent to Adobe. This only changes your own record.
          </p>
        </div>
      </div>

      <div className="footer-inset shrink-0 px-[20px] pt-[12px]">
        <button
          onClick={() => decide("kept")}
          className="h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
        >
          That&apos;s right - keep it
        </button>
        <button
          onClick={() => decide("corrected")}
          className="mt-[10px] h-[52px] w-full rounded-full border border-hairline bg-white text-[14px] font-semibold text-navy"
        >
          That&apos;s not a shortlist
        </button>
      </div>
    </div>
  );
}

/** One rung of the reasoning, with the connector running through it. */
function Step({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="flex gap-[12px]">
      <span className="flex w-[11px] shrink-0 flex-col items-center">
        <span
          className={`h-[11px] w-[11px] rounded-full ${
            last ? "bg-brand" : "bg-hairline"
          }`}
        />
        {!last && <span className="w-[2px] flex-1 bg-hairline" />}
      </span>
      <span className={`min-w-0 flex-1 ${last ? "" : "pb-[16px]"}`}>
        <span className="block text-[10.5px] font-bold tracking-[0.08em] text-grey">
          {label}
        </span>
        {children}
      </span>
    </div>
  );
}
