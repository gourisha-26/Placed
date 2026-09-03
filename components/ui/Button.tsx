"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onBlue";

const base =
  "inline-flex w-full items-center justify-center gap-2 rounded-[14px] " +
  "text-[14px] font-semibold transition-[transform,opacity] duration-150 " +
  "active:scale-[0.985] disabled:opacity-40 py-[15px]";

const styles: Record<Variant, string> = {
  primary: "bg-navy text-white",
  secondary: "bg-white text-navy border border-hairline",
  ghost: "bg-transparent text-grey",
  onBlue: "bg-white text-brand",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = `${base} ${styles[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
