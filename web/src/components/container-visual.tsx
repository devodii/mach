"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";

/** Corrugation ribs, drawn as a technical elevation rather than a 3/4 render. */
const RIB_COUNT = 46;
const RIB_START = 196;
const RIB_WIDTH = 15.2;

interface ContainerVisualProps {
  /**
   * Optional photographic override. Drop a grayscale container photograph at
   * `web/public/hero.jpg` and it replaces the procedural elevation while
   * keeping the beam, the vignette and the frame identical.
   */
  photograph?: string | null;
  className?: string;
}

export function ContainerVisual({ photograph, className }: ContainerVisualProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative w-full overflow-hidden bg-ink", className)}>
      {photograph ? (
        <div className="relative aspect-[1200/620] w-full">
          <Image
            src={photograph}
            alt="Industrial shipping container under a Stellar settlement beam"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover grayscale contrast-125"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/70" />
        </div>
      ) : (
        <svg
          viewBox="0 0 1200 620"
          className="block w-full"
          role="img"
          aria-label="A steel shipping container beneath a descending Stellar settlement beam, rendered as a technical elevation."
        >
          <defs>
            {/* Every fill below is a pure gray ramp — no hue anywhere. */}
            <linearGradient id="mach-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3a3a" />
              <stop offset="42%" stopColor="#222222" />
              <stop offset="100%" stopColor="#0d0d0d" />
            </linearGradient>

            <linearGradient id="mach-rail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4d4d4d" />
              <stop offset="100%" stopColor="#1b1b1b" />
            </linearGradient>

            <linearGradient id="mach-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="mach-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="mach-pool" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <filter id="mach-bloom" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>

            <filter id="mach-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>

            {/* The beam is clipped to itself so the scan line cannot escape it. */}
            <clipPath id="mach-beam-clip">
              <path d="M588 92 L612 92 L742 556 L458 556 Z" />
            </clipPath>
          </defs>

          {/* ---- Ground plane hairlines ---- */}
          <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1">
            <line x1="0" y1="556" x2="1200" y2="556" />
            <line x1="0" y1="580" x2="1200" y2="580" strokeOpacity="0.045" />
            <line x1="0" y1="600" x2="1200" y2="600" strokeOpacity="0.03" />
          </g>

          {/* ---- Beam ---- */}
          <motion.g
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M588 92 L612 92 L742 556 L458 556 Z"
              fill="url(#mach-beam)"
              filter="url(#mach-soft)"
            />
            <path
              d="M596 92 L604 92 L664 556 L536 556 Z"
              fill="url(#mach-beam)"
              opacity="0.7"
            />
          </motion.g>

          {/* A single photon of light crawling down the beam. */}
          {!reduceMotion && (
            <g clipPath="url(#mach-beam-clip)">
              <motion.rect
                x="440"
                width="320"
                height="140"
                fill="url(#mach-pool)"
                opacity="0.35"
                initial={{ y: 60 }}
                animate={{ y: 520 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
            </g>
          )}

          {/* ---- Beacon mark ----
              A neutral geometric beacon stands in for the Stellar mark. Drop the
              official brand SVG at public/stellar-mark.svg to swap it in. */}
          <g transform="translate(600 80)">
            <circle r="72" fill="url(#mach-halo)" filter="url(#mach-bloom)" />
            <motion.g
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            >
              <ellipse
                rx="36"
                ry="13"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.85"
                strokeWidth="2"
                transform="rotate(-26)"
              />
              <ellipse
                rx="36"
                ry="13"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.5"
                strokeWidth="2"
                transform="rotate(26)"
              />
            </motion.g>
            <circle r="7.5" fill="#ffffff" />
          </g>

          {/* ---- Container ---- */}
          <g>
            {/* Contact shadow */}
            <ellipse cx="600" cy="558" rx="430" ry="12" fill="#000000" opacity="0.9" />

            {/* Body */}
            <rect x="180" y="380" width="840" height="176" fill="url(#mach-body)" />

            {/* Corrugation */}
            <g>
              {Array.from({ length: RIB_COUNT }).map((_, i) => {
                const x = RIB_START + i * RIB_WIDTH;
                if (x > 880) return null;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={398}
                      width={RIB_WIDTH / 2}
                      height={140}
                      fill="#ffffff"
                      opacity={0.055}
                    />
                    <rect
                      x={x + RIB_WIDTH / 2}
                      y={398}
                      width={RIB_WIDTH / 2}
                      height={140}
                      fill="#000000"
                      opacity={0.35}
                    />
                  </g>
                );
              })}
            </g>

            {/* Top and bottom rails */}
            <rect x="180" y="380" width="840" height="18" fill="url(#mach-rail)" />
            <rect x="180" y="538" width="840" height="18" fill="url(#mach-rail)" />

            {/* Light pooling on the top rail where the beam lands */}
            <ellipse cx="600" cy="389" rx="210" ry="16" fill="url(#mach-pool)" />

            {/* Door end with locking bars */}
            <rect x="884" y="398" width="132" height="140" fill="#161616" />
            <g fill="#ffffff" opacity="0.16">
              {[900, 928, 956, 984].map((x) => (
                <rect key={x} x={x} y={402} width="6" height="132" />
              ))}
            </g>
            <rect
              x="884"
              y="398"
              width="132"
              height="140"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.14"
            />

            {/* Corner castings */}
            <g fill="#3f3f3f">
              <rect x="180" y="380" width="30" height="18" />
              <rect x="990" y="380" width="30" height="18" />
              <rect x="180" y="538" width="30" height="18" />
              <rect x="990" y="538" width="30" height="18" />
            </g>

            {/* Stencilling */}
            <text
              x="228"
              y="470"
              fill="#ffffff"
              fillOpacity="0.82"
              fontSize="52"
              fontWeight="700"
              letterSpacing="10"
              fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            >
              MACH
            </text>
            <text
              x="232"
              y="502"
              fill="#ffffff"
              fillOpacity="0.34"
              fontSize="14"
              letterSpacing="4"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            >
              SEP 59 · 38 · 45 · 56
            </text>

            {/* Outer hairline, drawn last so it reads as a drawn edge */}
            <rect
              x="180"
              y="380"
              width="840"
              height="176"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.16"
            />
          </g>

          {/* Vignette back to pure black at the frame edges */}
          <rect x="0" y="0" width="1200" height="620" fill="url(#mach-vignette)" />
          <defs>
            <radialGradient id="mach-vignette" cx="50%" cy="55%" r="72%">
              <stop offset="55%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </radialGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}
