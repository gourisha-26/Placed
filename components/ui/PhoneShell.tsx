"use client";

import { useEffect, useRef, useState } from "react";

const DEVICE_H = 852;
const CHROME = 64; // breathing room around the device on desktop

/**
 * Locks the device to iPhone 16's 393x852 on desktop. When the browser
 * window is shorter than the device, the whole phone scales down to fit
 * rather than being cropped — a scale factor can't be derived from
 * viewport units in CSS alone, so it's measured here.
 *
 * On a real phone (<480px) nothing is scaled: the device IS the viewport.
 */
export function PhoneShell({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (window.innerWidth < 480) {
        setScale(1);
        return;
      }
      const available = window.innerHeight - CHROME;
      setScale(Math.min(1, available / DEVICE_H));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="phone-viewport">
      {/* reserves the post-scale height so the stage stays centred */}
      <div
        style={
          {
            "--phone-scale": scale,
            height: scale < 1 ? DEVICE_H * scale : undefined,
          } as React.CSSProperties
        }
        className="flex items-center"
      >
        <div ref={stage} className="phone-stage">
          <div className="phone-frame">{children}</div>
        </div>
      </div>
    </div>
  );
}
