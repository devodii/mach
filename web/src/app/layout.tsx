import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

const DESCRIPTION =
  "Bridging the visibility gap between global banking rails and smart contract execution using SEP-59 Proof-of-Payment Oracles.";

export const metadata: Metadata = {
  title: {
    default: "MACH Protocol: The Fiat-to-Soroban Settlement Layer.",
    template: "%s | MACH Protocol",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "MACH Protocol: The Fiat-to-Soroban Settlement Layer.",
    description: DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MACH Protocol: The Fiat-to-Soroban Settlement Layer.",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Framer Motion serialises its initial state as inline `opacity: 0`.
          Without JS that style is never cleared and the page renders blank, so
          the reveal is overridden outright when scripting is unavailable. A
          stylesheet !important beats a non-important inline style.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-ink text-paper">{children}</body>
    </html>
  );
}
