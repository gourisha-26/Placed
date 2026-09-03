"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, Row } from "@/components/ui/Field";
import { markProfileComplete, markSetupFinished } from "@/lib/useProfileStatus";
import {
  STUDENT,
  DEGREES,
  BRANCHES,
  GRAD_YEARS,
  BACKLOG_COUNTS,
  BACKLOG_HISTORY,
} from "@/lib/student";

type Form = {
  fullName: string;
  phone: string;
  dob: string;
  degree: string;
  graduating: string;
  branch: string;
  cgpa: string;
  backlogs: string;
  class12: string;
  class10: string;
  backlogHistory: string;
};

type Errors = Partial<Record<keyof Form, string>>;

/** Prefilled so the flow is quick to walk through and demo. */
const PREFILLED: Form = {
  fullName: STUDENT.fullName,
  phone: STUDENT.phone,
  dob: STUDENT.dob,
  degree: STUDENT.degree,
  graduating: STUDENT.graduating,
  branch: STUDENT.branch,
  cgpa: STUDENT.cgpa,
  backlogs: STUDENT.backlogs,
  class12: STUDENT.class12,
  class10: STUDENT.class10,
  backlogHistory: STUDENT.backlogHistory,
};

function validate(f: Form): Errors {
  const e: Errors = {};

  if (!f.fullName.trim()) e.fullName = "Enter your full name";
  else if (f.fullName.trim().length < 3) e.fullName = "That looks too short";

  if (!f.phone.trim()) e.phone = "Enter your phone number";
  else if (!/^[6-9]\d{9}$/.test(f.phone.trim()))
    e.phone = "Enter a valid 10-digit number";

  if (!f.dob) e.dob = "Enter your date of birth";
  else {
    const year = new Date(f.dob).getFullYear();
    const age = new Date().getFullYear() - year;
    if (age < 16 || age > 60) e.dob = "Check this date";
  }

  if (!f.degree) e.degree = "Pick your degree";
  if (!f.graduating) e.graduating = "Pick your year";
  if (!f.branch) e.branch = "Pick your branch";

  if (!f.cgpa.trim()) e.cgpa = "Enter your CGPA";
  else {
    const n = Number(f.cgpa);
    if (Number.isNaN(n)) e.cgpa = "Numbers only";
    else if (n < 0 || n > 10) e.cgpa = "Must be between 0 and 10";
  }

  if (!f.backlogs) e.backlogs = "Pick one";

  for (const k of ["class12", "class10"] as const) {
    const v = f[k];
    const nice = k === "class12" ? "Class 12" : "Class 10";
    if (!v.trim()) e[k] = `Enter ${nice} %`;
    else {
      const n = Number(v);
      if (Number.isNaN(n)) e[k] = "Numbers only";
      else if (n < 0 || n > 100) e[k] = "Must be 0-100";
    }
  }

  if (!f.backlogHistory) e.backlogHistory = "Pick one";

  return e;
}

export default function DetailsPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(PREFILLED);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<keyof Form>>(new Set());

  const set = (k: keyof Form) => (v: string) => {
    const next = { ...form, [k]: v };
    setForm(next);
    // once a field has been corrected, clear its error as they type
    if (errors[k]) setErrors(validate(next));
  };

  const blur = (k: keyof Form) => () => {
    setTouched((t) => new Set(t).add(k));
    const all = validate(form);
    setErrors((prev) => ({ ...prev, [k]: all[k] }));
  };

  const err = (k: keyof Form) =>
    touched.has(k) || errors[k] ? errors[k] : undefined;

  const submit = () => {
    const all = validate(form);
    setErrors(all);
    setTouched(new Set(Object.keys(form) as (keyof Form)[]));
    if (Object.keys(all).length === 0) {
      markProfileComplete();
      markSetupFinished();
      router.push("/home");
      return;
    }
    // bring the first problem into view
    const first = document.querySelector('[aria-invalid="true"]');
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const problems = Object.keys(errors).filter(
    (k) => errors[k as keyof Form],
  ).length;

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[130px]">
        <div className="text-[10.5px] font-bold tracking-[0.14em] text-grey">
          STEP 2 OF 2
        </div>
        <h1 className="mt-[8px] text-[24px] font-extrabold tracking-[-0.01em] text-navy">
          Personal information
        </h1>
        <p className="mt-[8px] text-[12.5px] leading-[18px] text-grey">
          Filled in from your college record. Check it once - every application
          reuses this.
        </p>

        <Section icon title="About you">
          <TextField
            label="Full name"
            full
            value={form.fullName}
            onChange={set("fullName")}
            onBlur={blur("fullName")}
            error={err("fullName")}
          />
          <Row>
            <TextField
              label="Phone"
              value={form.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              error={err("phone")}
              inputMode="numeric"
              maxLength={10}
            />
            <TextField
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={set("dob")}
              onBlur={blur("dob")}
              error={err("dob")}
            />
          </Row>
        </Section>

        <Section title="Programme">
          <Row>
            <SelectField
              label="Degree"
              options={DEGREES}
              value={form.degree}
              onChange={set("degree")}
              onBlur={blur("degree")}
              error={err("degree")}
            />
            <SelectField
              label="Graduating"
              options={GRAD_YEARS}
              value={form.graduating}
              onChange={set("graduating")}
              onBlur={blur("graduating")}
              error={err("graduating")}
            />
          </Row>
          <SelectField
            label="Branch"
            full
            options={BRANCHES}
            value={form.branch}
            onChange={set("branch")}
            onBlur={blur("branch")}
            error={err("branch")}
          />
        </Section>

        <Section
          title="Academics"
          note={'These decide the "You qualify" check on every job you capture.'}
        >
          <Row>
            <TextField
              label="Current CGPA"
              value={form.cgpa}
              onChange={set("cgpa")}
              onBlur={blur("cgpa")}
              error={err("cgpa")}
              inputMode="decimal"
              maxLength={4}
            />
            <SelectField
              label="Active backlogs"
              options={BACKLOG_COUNTS}
              value={form.backlogs}
              onChange={set("backlogs")}
              onBlur={blur("backlogs")}
              error={err("backlogs")}
            />
          </Row>
          <Row>
            <TextField
              label="Class 12 %"
              value={form.class12}
              onChange={set("class12")}
              onBlur={blur("class12")}
              error={err("class12")}
              inputMode="numeric"
              maxLength={3}
            />
            <TextField
              label="Class 10 %"
              value={form.class10}
              onChange={set("class10")}
              onBlur={blur("class10")}
              error={err("class10")}
              inputMode="numeric"
              maxLength={3}
            />
          </Row>
          <SelectField
            label="Any backlog history"
            full
            options={BACKLOG_HISTORY}
            value={form.backlogHistory}
            onChange={set("backlogHistory")}
            onBlur={blur("backlogHistory")}
            error={err("backlogHistory")}
          />
        </Section>

        <EligibilityBanner cgpa={form.cgpa} backlogs={form.backlogs} />

        <div className="mt-[24px]">
          <h2 className="text-[16px] font-bold text-navy">Documents</h2>
          <p className="mt-[6px] text-[12.5px] leading-[17px] text-grey">
            Attach later from Profile if you&apos;d rather.
          </p>
          <div className="mt-[12px] rounded-[16px] border border-hairline bg-white p-[14px]">
            <DocRow
              title="Resume"
              sub="Not added yet - becomes V1"
              dashed
            />
            <div className="my-[12px] h-px bg-hairline" />
            <DocRow title="Class 10 & 12 marksheets" sub="Optional" />
            <div className="my-[12px] h-px bg-hairline" />
            <DocRow title="Photo ID" sub="Optional" />
          </div>
        </div>

        <p className="mt-[14px] text-[12px] leading-[17px] text-grey">
          Self-entered and unverified - your placement cell may ask for proof
          separately.
        </p>
      </div>

      <div className="footer-inset absolute inset-x-0 bottom-0 border-t border-hairline bg-offwhite/95 px-[20px] pt-[16px] backdrop-blur">
        {problems > 0 && (
          <div className="mb-[10px] text-center text-[11.5px] font-semibold text-error">
            {problems} {problems === 1 ? "field needs" : "fields need"} a look
          </div>
        )}
        <Button onClick={submit}>Save and continue</Button>
      </div>
    </div>
  );
}

/**
 * Reacts to what is actually entered rather than stating a fixed
 * result: 7.0+ with no active backlogs clears most campus drives,
 * so anything below that is worth flagging before they rely on it.
 */
function EligibilityBanner({
  cgpa,
  backlogs,
}: {
  cgpa: string;
  backlogs: string;
}) {
  const n = Number(cgpa);
  if (!cgpa.trim() || Number.isNaN(n) || !backlogs) return null;

  const clean = n >= 7 && backlogs === "None";

  return (
    <div
      className={`mt-[18px] flex items-start gap-[11px] rounded-[14px] p-[15px] ${
        clean
          ? "bg-success-tint"
          : "border border-orangeline bg-orange-tint"
      }`}
    >
      <span className="mt-[1px] shrink-0">
        {clean ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6 9 17l-5-5"
              stroke="#0E7A4E"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4.5"
              stroke="#B35400"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="1" fill="#B35400" />
            <path
              d="M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
              stroke="#B35400"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <div>
        <div
          className={`text-[13.5px] font-bold ${
            clean ? "text-success" : "text-orange-text"
          }`}
        >
          {clean
            ? "You meet the usual campus cut-off"
            : "Some drives may not accept this"}
        </div>
        <div
          className={`mt-[3px] text-[12.5px] leading-[17px] ${
            clean ? "text-success" : "text-orange-text"
          }`}
        >
          {clean
            ? "CGPA 7.0+ with no active backlogs covers most drives at your college."
            : "Most drives ask for CGPA 7.0+ and no active backlogs. You can still apply - we'll flag the ones that won't accept it."}
        </div>
      </div>
    </div>
  );
}

function DocRow({
  title,
  sub,
  dashed,
}: {
  title: string;
  sub: string;
  dashed?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-[11px] px-[13px] py-[12px] text-left ${
        dashed ? "border border-dashed border-strong" : ""
      }`}
    >
      <span>
        <span className="block text-[13.5px] font-bold text-navy">{title}</span>
        <span className="mt-[2px] block text-[12px] text-grey">{sub}</span>
      </span>
      <span className="ml-[12px] flex h-[26px] w-[26px] shrink-0 items-center justify-center">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12h14"
            stroke="#1B4FD8"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
}

function Section({
  title,
  note,
  icon,
  children,
}: {
  title: string;
  note?: string;
  icon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-[24px]">
      <div className="flex items-center gap-[10px]">
        {icon && (
          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[9px] bg-brand-light">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#1B4FD8" strokeWidth="2" />
              <path
                d="M4 21c0-4 3.6-6 8-6s8 2 8 6"
                stroke="#1B4FD8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        <h2 className="text-[16px] font-bold text-navy">{title}</h2>
      </div>
      {note && (
        <p className="mt-[6px] text-[12.5px] leading-[17px] text-grey">{note}</p>
      )}
      <div className="mt-[12px] space-y-[10px] rounded-[16px] border border-hairline bg-white p-[14px]">
        {children}
      </div>
    </div>
  );
}
