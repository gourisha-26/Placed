"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/app/Mascot";

type Tab = { href: string; label: string; icon: React.ReactNode };

const icon = (d: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {d}
  </svg>
);

const TABS: Tab[] = [
  {
    href: "/home",
    label: "Home",
    icon: icon(
      <>
        <path
          d="M3 10.5 12 3l9 7.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>,
    ),
  },
  {
    href: "/journey",
    label: "Journey",
    icon: icon(
      <>
        <path
          d="M4 7h10M4 12h7M4 17h13"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="15" cy="12" r="2" stroke="currentColor" strokeWidth="1.9" />
      </>,
    ),
  },
  {
    href: "/capture",
    label: "Capture",
    icon: icon(
      <>
        <path
          d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.9" />
      </>,
    ),
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: icon(
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.9"
        />
        <path
          d="M3 10h18M8 3v4M16 3v4"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </>,
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: icon(
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.9" />
        <path
          d="M4 21c0-4 3.6-6 8-6s8 2 8 6"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </>,
    ),
  },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-[22px]">
      {/* Content scrolls under the bar, so it has to fade out before it
          reaches the mascot - otherwise a heading collides with the
          companion's head and both become unreadable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-[linear-gradient(to_top,var(--color-offwhite)_0px,var(--color-offwhite)_104px,transparent_190px)]"
      />

      {/* The companion is part of the Bottom Nav component in Figma:
          100px wide, centred on the bar and clipped to its top 70px so it
          sits flush on the bar's edge. Every variant carries it except
          Capture. */}
      {path !== "/capture" && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[86px] left-1/2 h-[70px] w-[100px] -translate-x-1/2 overflow-hidden"
        >
          <Mascot state="idle" size={100} />
        </div>
      )}

      <div className="pointer-events-auto relative flex h-[64px] w-[353px] items-center justify-between rounded-full bg-navy px-[14px]">
        {TABS.map((t) => {
          const active = path === t.href || path.startsWith(t.href + "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-[42px] items-center justify-center gap-[8px] rounded-full transition-colors duration-200 ${
                active ? "bg-brand-light px-[16px]" : "w-[42px]"
              }`}
            >
              <span className={active ? "text-brand" : "text-white"}>
                {t.icon}
              </span>
              {active && (
                <span className="text-[13.5px] font-semibold text-brand">
                  {t.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
