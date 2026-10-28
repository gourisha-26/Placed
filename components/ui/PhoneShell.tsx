"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
const DEVICE_W = 393;

export function PhoneShell({ children }: { children: React.ReactNode }) {
  // the presenter page draws its own phone around an iframe of the app
  if (usePathname()?.startsWith("/present")) return <>{children}</>;
  return <Shell>{children}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  // on a phone the 393px canvas is scaled to whatever width the device
  // actually has, so the layout is proportionally identical everywhere
  const [mobileScale, setMobileScale] = useState(1);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (window.innerWidth < 480) {
        setScale(1);
        setMobileScale(window.innerWidth / DEVICE_W);
        return;
      }
      setMobileScale(1);
      const available = window.innerHeight - CHROME;
      setScale(Math.min(1, available / DEVICE_H));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    // `resize` alone is not enough: iOS collapsing its address bar and
    // Android split-screen both change the usable size without firing it
    // reliably, which would leave the canvas scaled to the old width.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="phone-viewport">
      {/* reserves the post-scale height so the stage stays centred */}
      <div
        style={
          {
            "--phone-scale": scale,
            "--mobile-scale": mobileScale,
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
