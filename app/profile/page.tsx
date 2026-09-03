"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/app/BottomNav";
import { STUDENT } from "@/lib/student";
import { RESUMES } from "@/lib/resumes";
import { useDefaultResume } from "@/lib/useDefaultResume";

/** +91 98••• ••210 - enough to recognise, not enough to read out. */
function maskPhone(p: string) {
  return `+91 ${p.slice(0, 2)}••• ••${p.slice(-3)}`;
}

export default function ProfilePage() {
  const defaultResume = useDefaultResume();
  const [settings, setSettings] = useState({
    reminders: true,
    detect: true,
    ask: true,
    weekly: false,
  });
  const toggle = (k: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="relative flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[150px]">
        <h1 className="pt-[6px] text-[28px] font-extrabold tracking-[-0.01em] text-navy">
          Profile
        </h1>

        {/* identity */}
        <div className="mt-[16px] flex items-center gap-[14px] rounded-[16px] bg-white p-[16px]">
          <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[11px] bg-brand-light text-[16px] font-bold text-brand">
            {STUDENT.initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[17px] font-bold text-navy">
              {STUDENT.fullName}
            </span>
            <span className="mt-[3px] block truncate text-[12.5px] text-grey">
              {STUDENT.degree} {STUDENT.branch} · {STUDENT.graduating}
            </span>
            <span className="mt-[2px] block truncate text-[12.5px] text-grey">
              {STUDENT.rollNo} · {STUDENT.college}
            </span>
          </span>
        </div>

        {/* details */}
        <div className="mt-[22px] flex items-center">
          <span className="flex-1 text-[10.5px] font-bold tracking-[0.08em] text-grey">
            PROFILE DETAILS
          </span>
          <Link
            href="/details"
            className="flex items-center gap-[5px] text-[12.5px] font-semibold text-brand"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 20h4L20 8l-4-4L4 16z"
                stroke="#1B4FD8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </Link>
        </div>

        <Card className="mt-[9px]">
          <DetailRow label="Branch" value={`${STUDENT.degree} · ${STUDENT.branchShort}`} />
          <DetailRow label="CGPA" value={STUDENT.cgpa} />
          <DetailRow label="Backlogs" value={STUDENT.backlogs} />
          <DetailRow label="Graduation year" value={STUDENT.graduating} />
          <DetailRow label="Phone" value={maskPhone(STUDENT.phone)} muted />
        </Card>

        <p className="mt-[9px] text-[12px] text-grey">
          Entered once, reused on every application.
        </p>

        {/* resumes */}
        <div className="mt-[22px] rounded-[16px] bg-brand-light p-[16px]">
          <Link href="/resumes" className="flex items-center gap-[13px]">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"
                  stroke="#1B4FD8"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M14 3v4.5h4.5" stroke="#1B4FD8" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-bold text-navy">Resumes</span>
              <span className="mt-[3px] block truncate text-[12.5px] text-grey">
                {RESUMES.length} versions · {defaultResume} is your default
              </span>
            </span>
            <Chevron />
          </Link>

          {/* a summary of what exists, not a control - the default is
              changed inside Resumes, through the chevron above */}
          <div className="mt-[13px] flex gap-[8px]">
            {RESUMES.map((r) => {
              const on = r.version === defaultResume;
              return (
                <span
                  key={r.version}
                  className={`flex h-[27px] flex-1 items-center justify-center rounded-[8px] text-[12px] font-semibold ${
                    on ? "bg-brand text-white" : "bg-white text-grey"
                  }`}
                >
                  {r.version}
                </span>
              );
            })}
          </div>

          <button className="mt-[10px] flex h-[38px] w-full items-center justify-center gap-[8px] rounded-[10px] bg-navy text-[13.5px] font-semibold text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M4 19h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Upload new resume
          </button>
        </div>

        {/* inbox */}
        <Label>INBOX</Label>
        <Card>
          <DetailRow label="Connected email" value="Gmail" muted />
        </Card>

        {/* settings */}
        <Label>SETTINGS</Label>
        <Card>
          <SettingRow
            label="Deadline reminders"
            on={settings.reminders}
            onChange={() => toggle("reminders")}
          />
          <SettingRow
            label="Detect status from email"
            on={settings.detect}
            onChange={() => toggle("detect")}
          />
          <SettingRow
            label="Ask before changing a status"
            on={settings.ask}
            onChange={() => toggle("ask")}
          />
          <SettingRow
            label="Weekly summary"
            on={settings.weekly}
            onChange={() => toggle("weekly")}
          />
        </Card>
        <p className="mt-[9px] text-[12px] text-grey">
          Placed only reads emails from companies you have applied to.
        </p>

        {/* how it works */}
        <Label>HOW PLACED WORKS</Label>
        <Card>
          <HowRow
            href="/how-capture"
            title="How capture works"
            sub="Save a job from any app, in 20 seconds"
            icon={
              <>
                <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="#1B4FD8" strokeWidth="1.8" />
                <circle cx="12" cy="13" r="3.2" stroke="#1B4FD8" strokeWidth="1.8" />
                <path d="M9 6l1.5-2h3L15 6" stroke="#1B4FD8" strokeWidth="1.8" strokeLinejoin="round" />
              </>
            }
          />
          <HowRow
            href="/how-upload"
            title="How resume upload works"
            sub="Attach the right version from the file picker"
            icon={
              <>
                <path
                  d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"
                  stroke="#1B4FD8"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M14 3v4.5h4.5" stroke="#1B4FD8" strokeWidth="1.8" strokeLinejoin="round" />
              </>
            }
          />
        </Card>

        {/* help */}
        <Label>HELP AND ACCOUNT</Label>
        <Card>
          <LinkRow label="What the colours mean" />
          <LinkRow label="Privacy and data" />
          <div className="flex h-[42px] items-center px-[15px]">
            <button className="text-[13.5px] font-medium text-error">Sign out</button>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

/* ---------- pieces ---------- */

/** A white group. Children are separated by a hairline, never the last one. */
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] bg-white [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-hairline ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[9px] mt-[22px] text-[10.5px] font-bold tracking-[0.08em] text-grey">
      {children}
    </div>
  );
}

function Chevron() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 5 7 7-7 7"
        stroke="#C7CDD9"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex h-[42px] items-center gap-[10px] px-[15px]">
      <span className="flex-1 text-[13.5px] font-medium text-navy">{label}</span>
      <span
        className={`text-[13.5px] font-semibold ${muted ? "text-grey" : "text-navy"}`}
      >
        {value}
      </span>
      <Chevron />
    </div>
  );
}

function SettingRow({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex h-[50px] items-center gap-[10px] px-[15px]">
      <span className="flex-1 text-[13.5px] font-medium text-navy">{label}</span>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onChange}
        className={`relative h-[24px] w-[40px] shrink-0 rounded-full transition-colors duration-200 ${
          on ? "bg-brand" : "bg-strong"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all duration-200 ${
            on ? "left-[19px]" : "left-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

function HowRow({
  href,
  title,
  sub,
  icon,
}: {
  href: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="flex h-[60px] w-full items-center gap-[12px] px-[14px] text-left">
      <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-brand-light">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          {icon}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold text-navy">
          {title}
        </span>
        <span className="mt-[2px] block truncate text-[12px] text-grey">{sub}</span>
      </span>
      <Chevron />
    </Link>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <button className="flex h-[42px] w-full items-center gap-[10px] px-[15px] text-left">
      <span className="flex-1 text-[13.5px] font-medium text-navy">{label}</span>
      <Chevron />
    </button>
  );
}
