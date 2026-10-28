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

// Inside the frame the app thinks it is on a real phone and hides its
// drawn status bar; turn it back on, with signal, wifi and battery.
const ICONS =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="68" height="13" viewBox="0 0 68 13" fill="#11182b">' +
      '<rect x="0" y="9" width="3" height="4" rx="1"/><rect x="4.5" y="6.5" width="3" height="6.5" rx="1"/>' +
      '<rect x="9" y="4" width="3" height="9" rx="1"/><rect x="13.5" y="1" width="3" height="12" rx="1"/>' +
      '<path d="M29 3.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 29 1.4a10.3 10.3 0 0 0-7.2 2.9L23 5.6a8.5 8.5 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3a6.7 6.7 0 0 0-9.2 0l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5-2.1 2.2L29 13l2.1-1.5-2.1-1.2Z"/>' +
      '<rect x="41.5" y="1" width="23" height="11" rx="3.2" fill="none" stroke="#11182b" stroke-opacity=".4"/>' +
      '<rect x="43.5" y="3" width="19" height="7" rx="1.8"/><rect x="65.5" y="4.5" width="1.6" height="4" rx=".8" fill-opacity=".4"/>' +
      "</svg>",
  );
const FRAME_CSS = `.status-bar-mock{display:flex!important}
.status-bar-mock::after{content:"";position:absolute;right:22px;top:19px;width:68px;height:13px;background:url("${ICONS}") no-repeat}`;

function showStatusBar(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument;
  if (!doc || doc.getElementById("present-css")) return;
  const style = doc.createElement("style");
  style.id = "present-css";
  style.textContent = FRAME_CSS;
  doc.head.appendChild(style);
}
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
    const measure = () => setScale(Math.min(1, (window.innerHeight - 48) / (DEVICE_H + 24)));
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
                ? "bg-brand-light border-blueline"
                : "bg-white border-hairline hover:border-blueline"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`grid place-items-center size-7 shrink-0 rounded-full text-sm font-bold ${
                  active === f.n ? "bg-brand text-white" : "bg-brand-light text-brand"
                }`}
              >
                {f.n}
              </span>
              <span>
                <span className="block font-semibold">{f.title}</span>
                <span className={`block text-sm ${"text-grey"}`}>{f.line}</span>
              </span>
            </span>
            {active === f.n && <span className="block mt-2 text-xs font-semibold text-brand">Tap again to restart</span>}
          </button>
        ))}
        <button
          onClick={() => start("/splash", null)}
          className="mt-2 rounded-2xl px-4 py-3 text-sm font-semibold text-orange-text bg-orange-tint"
        >
          Reset everything
        </button>
      </aside>

      <div style={{ width: (DEVICE_W + 24) * scale, height: (DEVICE_H + 24) * scale }} className="shrink-0">
        <div
          style={{ width: DEVICE_W + 24, height: DEVICE_H + 24, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="rounded-[54px] bg-navy p-3 shadow-2xl"
        >
          <iframe
            key={run}
            src={src}
            title="placED app"
            onLoad={(e) => showStatusBar(e.currentTarget)}
            style={{ width: DEVICE_W, height: DEVICE_H }}
            className="rounded-[40px] bg-offwhite"
          />
        </div>
      </div>
    </div>
  );
}
