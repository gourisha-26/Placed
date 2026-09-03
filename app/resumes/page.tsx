"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { RESUMES } from "@/lib/resumes";
import { setDefaultResume, useDefaultResume } from "@/lib/useDefaultResume";

export default function ResumesPage() {
  const router = useRouter();
  const def = useDefaultResume();

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[40px]">
        {/* header */}
        <div className="flex items-center gap-[12px] pt-[6px]">
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

          <h1 className="flex-1 text-[22px] font-bold tracking-[-0.01em] text-navy">
            Resumes
          </h1>

          <button
            aria-label="Upload new resume"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-navy"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M4 19h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-[4px] text-[13px] text-grey">
          Entered once, reused on every application.
        </p>

        <div className="mt-[18px] space-y-[9px]">
          {RESUMES.map((r) => {
            const isDefault = r.version === def;
            return (
              <div
                key={r.version}
                className={`rounded-[14px] p-[15px] ${
                  isDefault ? "bg-brand-light" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-[12px]">
                  <span
                    className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] ${
                      isDefault ? "bg-white" : "bg-offwhite"
                    }`}
                  >
                    <DocIcon />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-[8px]">
                      <span className="flex-1 truncate text-[15px] font-bold text-navy">
                        Resume {r.version}
                      </span>

                      {isDefault ? (
                        <span className="flex shrink-0 items-center gap-[6px]">
                          <span className="rounded-[7px] bg-white px-[9px] py-[3px] text-[11px] font-semibold text-brand">
                            Default
                          </span>
                          <Star filled />
                        </span>
                      ) : (
                        // the star is how a version becomes the default
                        <button
                          onClick={() => setDefaultResume(r.version)}
                          aria-label={`Make Resume ${r.version} the default`}
                          className="shrink-0"
                        >
                          <Star />
                        </button>
                      )}
                    </span>

                    <span className="mt-[3px] block truncate text-[12px] text-grey">
                      {r.focus} · {r.updated}
                    </span>
                  </span>
                </div>

                <div
                  className={`my-[10px] h-px ${
                    isDefault ? "bg-blueline" : "bg-hairline"
                  }`}
                />

                <div className="flex items-center">
                  <Link
                    href={`/resumes/${r.version}`}
                    className="flex flex-1 items-center gap-[6px] text-[12px] font-semibold text-brand"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"
                        stroke="#1B4FD8"
                        strokeWidth="1.9"
                      />
                      <circle cx="12" cy="12" r="2.6" stroke="#1B4FD8" strokeWidth="1.9" />
                    </svg>
                    Preview
                  </Link>

                  {/* the default cannot be deleted - something has to be attached */}
                  {!isDefault && (
                    <button className="flex items-center gap-[6px] text-[12px] font-semibold text-brand">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"
                          stroke="#1B4FD8"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"
        stroke="#1B4FD8"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3v4.5h4.5" stroke="#1B4FD8" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 3.5 2.7 5.6 6.1.85-4.4 4.3 1.05 6.1L12 17.5l-5.45 2.85L7.6 14.25l-4.4-4.3 6.1-.85z"
        stroke="#1B4FD8"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={filled ? "#1B4FD8" : "none"}
      />
    </svg>
  );
}
