"use client";

import { useEffect, useState } from "react";

/**
 * Presenter view for showing placED to people one after another: the
 * real app runs in a phone-sized frame, and each button on the left wipes
 * the demo's saved state and restarts one task flow from its first screen.
 */
const FLOWS = [
  { n: 1, title: "Connect your inbox", line: "Welcome, choose inbox, Gmail consent", start: "/splash" },
  { n: 2, title: "Capture a job", line: "Tap the widget on a posting, review the fields", start: "/capture" },
  { n: 3, title: "Choose a resume and apply", line: "Suggested resume, open the portal, mark applied", start: "/job/adobe" },
  { n: 4, title: "Trust an automatic update", line: "A shortlist read from email, and why it changed", start: "/notification" },
  { n: 5, title: "Resolve a schedule clash", line: "Two rounds on Friday, pick what moves", start: "/calendar/2026-08-19" },
];

const DEVICE_W = 393;
const DEVICE_H = 852;

function clearDemoState() {
  // every key the app writes is prefixed "placed:"; in-memory state
  // (captures, applied jobs) resets when the frame reloads
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      Object.keys(store).filter((k) => k.startsWith("placed:")).forEach((k) => store.removeItem(k));
    } catch {}
  }
}

export default function Present() {
  const [src, setSrc] = useState("/splash");
  const [active, setActive] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => setScale(Math.min(1, (window.innerHeight - 48) / (DEVICE_H + 40)));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const start = (path: string, n: number | null) => {
    clearDemoState();
    setActive(n);
    setSrc(path);
    setRun((r) => r + 1); // new key remounts the frame even for the same flow
  };

  return (
    <div className="min-h-dvh bg-offwhite text-navy flex flex-col md:flex-row items-center md:items-center justify-center gap-6 md:gap-10 p-6">
      <aside className="w-full max-w-sm md:w-80 flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-grey">placED · demo</p>
        <h1 className="text-2xl font-extrabold mb-2">Pick a flow</h1>
        {FLOWS.map((f) => (
          <button
            key={f.n}
            onClick={() => start(f.start, f.n)}
            className={`text-left rounded-2xl border px-4 py-3 transition-colors ${
              active === f.n
                ? "bg-brand text-white border-brand"
                : "bg-white border-hairline hover:border-blueline"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`grid place-items-center size-7 shrink-0 rounded-full text-sm font-bold ${
                  active === f.n ? "bg-white/20" : "bg-brand-light text-brand"
                }`}
              >
                {f.n}
              </span>
              <span>
                <span className="block font-semibold">{f.title}</span>
                <span className={`block text-sm ${active === f.n ? "text-white/80" : "text-grey"}`}>{f.line}</span>
              </span>
            </span>
            {active === f.n && <span className="block mt-2 text-xs font-semibold text-white/80">Tap again to restart</span>}
          </button>
        ))}
        <button
          onClick={() => start("/splash", null)}
          className="mt-2 rounded-2xl px-4 py-3 text-sm font-semibold text-orange-text bg-orange-tint"
        >
          Reset everything
        </button>
      </aside>

      <div style={{ width: (DEVICE_W + 24) * scale, height: (DEVICE_H + 40) * scale }} className="shrink-0">
        <div
          style={{ width: DEVICE_W + 24, height: DEVICE_H + 40, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="rounded-[54px] bg-navy pt-7 px-3 pb-3 shadow-2xl"
        >
          <iframe
            key={run}
            src={src}
            title="placED app"
            style={{ width: DEVICE_W, height: DEVICE_H }}
            className="rounded-[40px] bg-offwhite"
          />
        </div>
      </div>
    </div>
  );
}
