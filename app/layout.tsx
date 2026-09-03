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
