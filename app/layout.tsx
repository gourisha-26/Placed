import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PhoneShell } from "@/components/ui/PhoneShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "placED",
  description: "Your placement journey, tracked by itself.",
  appleWebApp: {
    capable: true,
    title: "placED",
    statusBarStyle: "default",
  },
  // This Next.js version's `appleWebApp.capable` only emits the modern
  // unprefixed `mobile-web-app-capable` tag - not the legacy
  // `apple-mobile-web-app-capable` one, which iOS Safari has required
  // for standalone (chrome-free) launch since long before the modern
  // tag existed. Without it, "Add to Home Screen" still opens inside
  // Safari's own toolbar instead of fullscreen. Added explicitly here.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F9FC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <PhoneShell>{children}</PhoneShell>
      </body>
    </html>
  );
}
