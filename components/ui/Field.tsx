"use client";

/**
 * Text and select fields sharing one shell so errors, focus rings and
 * spacing stay identical between them.
 */

const shell =
  "w-full rounded-[11px] border bg-white px-[14px] py-[13px] text-[13.5px] " +
  "text-navy outline-none transition-colors duration-150 placeholder:text-grey";

function ring(error?: string) {
  return error
    ? "border-error focus:border-error focus:ring-[3px] focus:ring-error/15"
    : "border-strong focus:border-brand focus:ring-[3px] focus:ring-brand/15";
}

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  full,
  inputMode,
  maxLength,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  full?: boolean;
  inputMode?: "numeric" | "tel" | "decimal" | "text";
  maxLength?: number;
  type?: string;
}) {
  return (
    <div className={full ? "w-full" : "flex-1 min-w-0"}>
      <input
        aria-label={label}
        aria-invalid={!!error}
        placeholder={label}
        value={value}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${shell} ${ring(error)}`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "w-full" : "flex-1 min-w-0"}>
      <div className="relative">
        <select
          aria-label={label}
          aria-invalid={!!error}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${shell} ${ring(error)} appearance-none pr-[36px] ${
            value ? "text-navy" : "text-grey"
          }`}
        >
          <option value="">{label}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="#687286"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[5px] flex items-start gap-[5px] px-[2px]">
      <svg
        className="mt-[1px] shrink-0"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="#C0392B" strokeWidth="2" />
        <path
          d="M12 7.5v5"
          stroke="#C0392B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="0.9" fill="#C0392B" />
      </svg>
      <span className="text-[11.5px] leading-[15px] text-error">{children}</span>
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-[10px]">{children}</div>;
}
