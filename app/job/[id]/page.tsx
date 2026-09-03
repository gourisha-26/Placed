"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BackButton } from "@/components/app/BackButton";
import { DidYouApplySheet } from "@/components/app/DidYouApplySheet";
import { CAPTURE_SOURCE } from "@/lib/capture";
import { INFERENCE, TIMELINE } from "@/lib/inference";
import { fileName } from "@/lib/resumes";
import { Wordmark } from "@/components/ui/Wordmark";
import { matchFor } from "@/lib/match";
import { useApplications } from "@/lib/useApplications";
import { setJobState, useJobState } from "@/lib/useJobState";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const asking = useSearchParams().get("ask") === "1";

  const { applications } = useApplications();
  const app = applications.find((a) => a.id === id);
  const job = useJobState(id);
  const match = matchFor(job.resume);
  const [zoomed, setZoomed] = useState(false);
  const [renaming, setRenaming] = useState(false);

  const shownFileName = job.fileName ?? fileName(job.resume);

  if (!app) {
    return (
      <div className="flex h-full flex-col bg-offwhite">
        <StatusBar />
        <div className="flex-1 px-[20px]">
          <BackButton />
          <p className="mt-[24px] text-[14px] text-grey">
            That application is no longer in your journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[40px]">
        <div className="flex items-center gap-[12px] pt-[6px]">
          <BackButton />
          <span className="flex-1" />
          <span className="rounded-[8px] border border-hairline bg-white px-[10px] py-[4px] text-[11.5px] font-semibold text-grey">
            {app.stage}
          </span>
        </div>

        {/* E4 / E5 - what was decided about the inferred status */}
        {job.inferred && job.decision === "kept" && (
          <div className="mt-[14px] rounded-[16px] bg-brand-light p-[14px]">
            <div className="text-[13.5px] font-bold text-brand">
              Status kept as {INFERENCE.status}
            </div>
            <p className="mt-[3px] text-[12.5px] leading-[17px] text-brand">
              You checked this one. You can change it any time.
            </p>
          </div>
        )}
        {job.inferred && job.decision === "corrected" && (
          <div className="mt-[14px] rounded-[16px] bg-orange-tint p-[14px]">
            <div className="text-[13.5px] font-bold text-orange-text">
              Set back to {INFERENCE.fallback}
            </div>
            <p className="mt-[3px] text-[12.5px] leading-[17px] text-orange-text">
              The email stays on your record. We just won&apos;t read it as a
              shortlist.
            </p>
          </div>
        )}

        {/* identity */}
        <div className="mt-[18px] flex items-start gap-[13px]">
          <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] bg-brand-light text-[15.5px] font-bold text-brand">
            {app.company[0]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[24px] font-extrabold tracking-[-0.01em] text-navy">
              {app.company}
            </span>
            <span className="mt-[1px] block text-[14px] text-grey">
              {app.role.split(" · ")[0]}
            </span>
          </span>
        </div>
        <p className="mt-[12px] text-[12.5px] text-grey">
          Bengaluru · Full time · ₹18–22 LPA
        </p>

        {/* timeline */}
        <SectionHeading icon={<TimelineIcon />}>
          Application timeline
        </SectionHeading>
        <div className="rounded-[16px] bg-white p-[15px]">
          {job.inferred ? (
            <>
              {TIMELINE.map((t) => (
                <TimelineRow key={t.title} title={t.title} meta={t.meta} />
              ))}

              {job.decision === "corrected" ? (
                <TimelineRow
                  title={`Email from ${app.company}`}
                  meta={`${INFERENCE.date} · kept on file, status unchanged`}
                  last
                  footer={
                    <div className="mt-[8px] flex items-center gap-[10px]">
                      <Link
                        href={`/job/${id}/why`}
                        className="flex flex-1 items-center gap-[7px] text-[12.5px] font-semibold text-brand"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#1B4FD8" strokeWidth="1.8" />
                          <path d="m3.5 7 8.5 6 8.5-6" stroke="#1B4FD8" strokeWidth="1.8" />
                        </svg>
                        View the email
                      </Link>
                      <Link
                        href={`/job/${id}/why`}
                        className="text-[12.5px] font-semibold text-brand"
                      >
                        Change
                      </Link>
                    </div>
                  }
                />
              ) : (
                <TimelineRow
                  title={INFERENCE.status}
                  meta={`${INFERENCE.date} · from ${app.company}`}
                  tone="brand"
                  last
                  footer={
                    job.decision === "kept" ? (
                      <div className="mt-[8px] flex items-center gap-[10px]">
                        <span className="flex-1 text-[12.5px] text-grey">
                          You checked this on {INFERENCE.date}
                        </span>
                        <Link
                          href={`/job/${id}/why`}
                          className="text-[12.5px] font-semibold text-brand"
                        >
                          Change
                        </Link>
                      </div>
                    ) : (
                      // E2 - not reviewed yet, so it says who set it
                      <div className="mt-[10px] rounded-[12px] bg-brand-light p-[12px]">
                        <div className="text-[12.5px] font-semibold text-brand">
                          <Wordmark tone="dark" dot={false} className="text-[12.5px]" /> set
                          this for you
                        </div>
                        <p className="mt-[3px] text-[12.5px] leading-[17px] text-brand">
                          Based on an email {app.company} sent on {INFERENCE.date}.
                        </p>
                        <Link
                          href={`/job/${id}/why`}
                          className="mt-[9px] inline-block text-[12.5px] font-bold text-brand"
                        >
                          See why →
                        </Link>
                      </div>
                    )
                  }
                />
              )}
            </>
          ) : (
            <>
              <TimelineRow
                title="Captured"
                meta={`${CAPTURE_SOURCE.at.split(",")[0]} · from the Adobe careers page`}
                last={!job.applied}
              />
              {job.applied && (
                <TimelineRow
                  title={`Applied with ${job.appliedWith}`}
                  meta="Watching your inbox for a reply"
                  tone="brand"
                  last
                />
              )}
            </>
          )}
        </div>

        {/* details */}
        <SectionHeading icon={<BriefcaseIcon />}>Job details</SectionHeading>
        <div className="rounded-[16px] bg-white px-[15px]">
          {[
            ["Application deadline", "18 Aug"],
            ["Eligibility", "CGPA 7.0+ · You qualify"],
            ["Location", "Bengaluru · Hybrid"],
            ["Employment", "Full time + 6mo internship"],
            ["Stipend / CTC", "₹18–22 LPA"],
            ["Job ID", "ADB-2026-UX-114"],
          ].map(([k, v], i) => (
            <div
              key={k}
              className={`flex items-center gap-[12px] py-[14px] ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="flex-1 text-[13px] text-grey">{k}</span>
              <span className="text-right text-[13px] font-semibold text-navy">
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* resume match */}
        <SectionHeading icon={<DocIcon />}>Resume match</SectionHeading>
        <div className="rounded-[18px] bg-brand-light p-[16px]">
          <div className="flex items-center gap-[9px]">
            <span className="flex-1 text-[18px] font-bold text-brand">
              {match?.version} · {match?.score}% match
            </span>
            {match?.version === "V5" && (
              <span className="rounded-full bg-white px-[10px] py-[4px] text-[11px] font-semibold text-brand">
                Suggested
              </span>
            )}
          </div>

          <p className="mt-[8px] text-[12.5px] leading-[17px] text-brand">
            {match && match.matched.length > 0
              ? `Matched on ${match.matched.join(", ").toLowerCase()}`
              : "None of the listed skills matched"}
          </p>

          <Link
            href={`/resumes/${job.resume}`}
            className="mt-[10px] flex items-center justify-end gap-[6px] text-[12px] font-semibold text-brand"
          >
            <EyeIcon />
            Preview
          </Link>

          <Link
            href={`/job/${id}/resumes`}
            className="mt-[10px] flex h-[42px] items-center justify-center rounded-[12px] border border-blueline text-[13px] font-semibold text-brand"
          >
            Compare all 5
          </Link>
        </div>

        {/* the file that will be sent */}
        <div className="mt-[18px] rounded-[16px] bg-white p-[15px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex-1 text-[10.5px] font-semibold tracking-[0.06em] text-grey">
              FILE NAME
            </span>
            <button
              onClick={() => setRenaming(true)}
              className="text-[12.5px] font-semibold text-brand"
            >
              Rename
            </button>
          </div>
          <div className="mt-[6px] truncate text-[13px] text-navy">
            {shownFileName}
          </div>
        </div>

        {/* the capture it came from - a saved screenshot, not a live page */}
        <SectionHeading icon={<PageIcon />}>Original posting</SectionHeading>
        <button
          onClick={() => setZoomed(true)}
          className="flex w-full items-center gap-[13px] rounded-[16px] border border-dashed border-strong p-[13px] text-left"
        >
          <img
            src="/captured-posting.png"
            alt=""
            className="h-[54px] w-[40px] shrink-0 rounded-[6px] border border-hairline bg-white object-cover object-top"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] text-grey">
              Captured {CAPTURE_SOURCE.at.split(",")[0]} · full page
            </span>
            <span className="mt-[2px] block text-[12.5px] text-grey">
              Tap to zoom
            </span>
          </span>
        </button>

        <button className="mt-[16px] text-[13px] font-semibold text-grey">
          + Add a note
        </button>
      </div>

      {/* the portal is the next step, so it sits in the footer */}
      {!job.applied && (
        <div className="footer-inset shrink-0 px-[20px] pt-[12px]">
          <button
            onClick={() => router.push(`/job/${id}/how-to-attach`)}
            className="h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
          >
            Open portal to apply
          </button>
        </div>
      )}

      {asking && <DidYouApplySheet jobId={id} company={app.company} />}

      {zoomed && (
        <PostingZoom onClose={() => setZoomed(false)} at={CAPTURE_SOURCE.at} />
      )}

      {renaming && (
        <RenameDialog
          current={shownFileName}
          onCancel={() => setRenaming(false)}
          onSave={(name) => {
            setJobState(id, { fileName: name });
            setRenaming(false);
          }}
        />
      )}
    </div>
  );
}

/** One entry in the application timeline. */
function TimelineRow({
  title,
  meta,
  tone = "muted",
  last = false,
  footer,
}: {
  title: string;
  meta: string;
  tone?: "muted" | "brand";
  last?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex gap-[11px]">
      <span className="flex w-[11px] shrink-0 flex-col items-center">
        <span
          className={`mt-[3px] h-[11px] w-[11px] rounded-full ${
            tone === "brand" ? "bg-brand" : "bg-hairline"
          }`}
        />
        {!last && <span className="w-[2px] flex-1 bg-hairline" />}
      </span>
      <span className={`min-w-0 flex-1 ${last ? "" : "pb-[16px]"}`}>
        <span className="block text-[13px] font-semibold text-navy">{title}</span>
        <span className="mt-[3px] block text-[12.5px] text-grey">{meta}</span>
        {footer}
      </span>
    </div>
  );
}

/** D1r - rename the file that gets attached. The extension is fixed. */
function RenameDialog({
  current,
  onCancel,
  onSave,
}: {
  current: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [base, setBase] = useState(current.replace(/\.pdf$/i, ""));
  const clean = base.trim().replace(/[\\/:*?"<>|]/g, "");
  const valid = clean.length > 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-navy/35 px-[30px]">
      <div className="w-full rounded-[18px] bg-white p-[20px]">
        <div className="text-[16px] font-bold text-navy">Rename file</div>

        <div className="mt-[14px] flex items-center rounded-[10px] border-2 border-brand px-[12px] py-[11px]">
          <input
            autoFocus
            value={base}
            onChange={(e) => setBase(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && valid) onSave(`${clean}.pdf`);
              if (e.key === "Escape") onCancel();
            }}
            aria-label="File name"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-navy outline-none"
          />
          <span className="shrink-0 text-[13.5px] text-grey">.pdf</span>
        </div>

        <div className="mt-[16px] flex gap-[10px]">
          <button
            onClick={onCancel}
            className="h-[44px] flex-1 rounded-[10px] border border-hairline text-[13.5px] font-semibold text-navy"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(`${clean}.pdf`)}
            disabled={!valid}
            className="h-[44px] flex-1 rounded-[10px] bg-navy text-[13.5px] font-semibold text-white disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * The saved screenshot, full size. It is an image of the page as it was
 * when captured - opening it must not start the capture flow again.
 */
function PostingZoom({ onClose, at }: { onClose: () => void; at: string }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-navy/85">
      {/* clears the status bar, which the overlay covers */}
      <div className="flex items-center gap-[12px] px-[20px] pb-[12px] pt-[62px]">
        <span className="flex-1 text-[13px] font-semibold text-white">
          Captured {at}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/15"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="screen-scroll flex-1 px-[16px] pb-[24px]">
        <img
          src="/captured-posting.png"
          alt="Screenshot of the Adobe UI/UX Designer posting as it was captured"
          className="w-full rounded-[12px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
        />
      </div>
    </div>
  );
}

/* ---------- bits ---------- */

function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[11px] mt-[24px] flex items-center gap-[10px]">
      <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[8px] bg-brand-light">
        {icon}
      </span>
      <h2 className="text-[18px] font-extrabold tracking-[-0.01em] text-navy">
        {children}
      </h2>
    </div>
  );
}

const stroke = { stroke: "#1B4FD8", strokeWidth: 1.8, fill: "none" } as const;

function TimelineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path d="M4 7h9M4 17h13" {...stroke} strokeLinecap="round" />
      <circle cx="17" cy="7" r="2.4" {...stroke} />
      <circle cx="7" cy="17" r="2.4" {...stroke} />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2.5" {...stroke} />
      <path d="M9 7V5h6v2" {...stroke} strokeLinejoin="round" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path
        d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path d="M14 3v4.5h4.5" {...stroke} strokeLinejoin="round" />
    </svg>
  );
}
function PageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2.5" {...stroke} />
      <path d="M8 9h8M8 13h5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" {...stroke} />
      <circle cx="12" cy="12" r="2.6" {...stroke} />
    </svg>
  );
}
