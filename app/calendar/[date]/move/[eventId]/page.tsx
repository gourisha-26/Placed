"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BackButton } from "@/components/app/BackButton";
import { Wordmark } from "@/components/ui/Wordmark";
import { STUDENT } from "@/lib/student";
import { clashOn, eventCompany } from "@/lib/data";
import { useApplications } from "@/lib/useApplications";
import { requestReschedule } from "@/lib/useReschedule";

/**
 * F2b / F2c - the request, drafted. Testing showed people wanted to see
 * and change the wording before it went out, so the message is editable
 * rather than only previewable.
 */
export default function MoveEventPage({
  params,
}: {
  params: Promise<{ date: string; eventId: string }>;
}) {
  const { date, eventId } = use(params);
  const router = useRouter();
  const { events, applications } = useApplications();

  const clash = clashOn(date, events);
  const moving = [clash?.first, clash?.second].find((e) => e?.id === eventId);
  const keeping = [clash?.first, clash?.second].find((e) => e?.id !== eventId);

  const movingApp = moving ? eventCompany(moving, applications) : null;
  const keepingApp = keeping ? eventCompany(keeping, applications) : null;

  const subject = moving?.draft?.subject ?? "";

  const [body, setBody] = useState(() =>
    (moving?.draft?.body ?? "")
      .replace("{name}", STUDENT.fullName)
      .replace("{roll}", STUDENT.rollNo),
  );
  const [editing, setEditing] = useState(false);

  if (!moving || !movingApp || !keepingApp) {
    return (
      <div className="flex h-full flex-col bg-offwhite">
        <StatusBar />
        <div className="flex-1 px-[20px] pt-[6px]">
          <BackButton />
          <p className="mt-[24px] text-[14px] text-grey">
            Nothing to reschedule on this day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[20px]">
        <div className="pt-[6px]">
          <BackButton />
        </div>

        <h1 className="mt-[16px] text-[27px] font-extrabold tracking-[-0.01em] text-navy">
          Ask for a new time
        </h1>
        <p className="mt-[8px] text-[13.5px] leading-[19px] text-grey">
          Keeping {keeping!.keptAs}. Asking {movingApp.company} for another
          slot.
        </p>

        <Field label="To" value={moving.contact ?? ""} />
        <Field label="Subject" value={subject} />

        <div className="mt-[16px] rounded-[18px] border border-hairline bg-white p-[15px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex-1 text-[11px] font-semibold text-grey">
              Message
            </span>
            <button
              onClick={() => setEditing((e) => !e)}
              className="flex items-center gap-[6px] rounded-full bg-brand-light px-[11px] py-[5px] text-[12px] font-semibold text-brand"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 20h4L20 8l-4-4L4 16z"
                  stroke="#1B4FD8"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {editing ? "Done" : "Edit"}
            </button>
          </div>

          {editing ? (
            <textarea
              autoFocus
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-label="Message"
              rows={12}
              className="mt-[12px] w-full resize-none rounded-[10px] bg-offwhite p-[12px] text-[13px] leading-[20px] text-navy outline-none"
            />
          ) : (
            <p className="mt-[12px] whitespace-pre-wrap text-[13px] leading-[20px] text-navy">
              {body}
            </p>
          )}
        </div>

        <p className="mt-[10px] text-[12px] leading-[17px] text-grey">
          <Wordmark tone="dark" dot={false} className="text-[12px]" /> wrote this draft.
          Change anything before you send it.
        </p>
      </div>

      <div className="footer-inset shrink-0 px-[20px] pt-[12px]">
        <button
          onClick={() => {
            requestReschedule(moving.id);
            router.push("/calendar");
          }}
          className="h-[52px] w-full rounded-full bg-navy text-[14px] font-semibold text-white"
        >
          Send request
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-[16px]">
      <div className="text-[11px] font-semibold text-grey">{label}</div>
      <div className="mt-[4px] text-[14px] text-navy">{value}</div>
    </div>
  );
}
