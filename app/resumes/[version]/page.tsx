import { notFound } from "next/navigation";
import { StatusBar } from "@/components/ui/StatusBar";
import { BackButton } from "@/components/app/BackButton";
import { DefaultChip } from "@/components/app/DefaultChip";
import { STUDENT } from "@/lib/student";
import {
  EDUCATION,
  EXPERIENCE,
  RESUMES,
  fileName,
  getResume,
} from "@/lib/resumes";

export function generateStaticParams() {
  return RESUMES.map((r) => ({ version: r.version }));
}

function maskPhone(p: string) {
  return `+91 ${p.slice(0, 2)}••• ••${p.slice(-3)}`;
}

export default async function ResumePreviewPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const resume = getResume(version);
  if (!resume) notFound();

  return (
    <div className="flex h-full flex-col bg-offwhite">
      <StatusBar />

      <div className="screen-scroll flex-1 px-[20px] pb-[40px]">
        {/* header */}
        <div className="flex items-center gap-[12px] pt-[6px]">
          <BackButton />
          <h1 className="flex-1 text-[17px] font-bold text-navy">
            Resume · {resume.version}
          </h1>
          <DefaultChip version={resume.version} />
        </div>

        {/* the file itself */}
        <div className="mt-[16px] flex items-center gap-[12px] rounded-[14px] bg-white p-[13px]">
          <span className="flex h-[38px] w-[38px] shrink-0 flex-col items-center justify-center rounded-[8px] bg-[#E5382B]">
            <span className="text-[9.5px] font-bold leading-none text-white">
              PDF
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold text-navy">
              {fileName(resume.version)}
            </span>
            <span className="mt-[3px] block text-[11.5px] text-grey">
              PDF · 1 page · {resume.size}
            </span>
          </span>
        </div>

        {/* the rendered document */}
        <div className="mt-[12px] rounded-[14px] bg-white px-[22px] py-[24px]">
          <div className="text-[19px] font-bold text-navy">
            {STUDENT.fullName}
          </div>
          <div className="mt-[3px] text-[11.5px] text-grey">
            {resume.role}  ·  {STUDENT.email}  ·  {maskPhone(STUDENT.phone)}
          </div>

          <DocHeading>SKILLS</DocHeading>
          <div className="mt-[9px] flex flex-wrap gap-[6px]">
            {resume.skills.map((s) => (
              <span
                key={s}
                className="rounded-[8px] bg-brand-light px-[10px] py-[5px] text-[11px] font-semibold text-brand"
              >
                {s}
              </span>
            ))}
          </div>

          <DocHeading>EXPERIENCE</DocHeading>
          {EXPERIENCE.map((e, i) => (
            <div key={e.title} className={i === 0 ? "mt-[9px]" : "mt-[18px]"}>
              <div className="text-[13.5px] font-semibold text-navy">
                {e.title}
              </div>
              <div className="mt-[1px] text-[11.5px] text-grey">{e.meta}</div>
              <p className="mt-[6px] text-[12.5px] leading-[18px] text-navy">
                {e.body}
              </p>
            </div>
          ))}

          <DocHeading>EDUCATION</DocHeading>
          <div className="mt-[9px] text-[13.5px] font-semibold text-navy">
            {EDUCATION.title}
          </div>
          <div className="mt-[1px] text-[11.5px] text-grey">{EDUCATION.meta}</div>
        </div>

        <p className="mt-[20px] text-[11.5px] leading-[16px] text-grey">
          This is a preview render. Formatting may differ slightly from the
          original file.
        </p>
      </div>
    </div>
  );
}

function DocHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-[22px] text-[10.5px] font-bold tracking-[0.06em] text-brand">
        {children}
      </div>
      <div className="mt-[4px] h-px bg-hairline" />
    </>
  );
}
