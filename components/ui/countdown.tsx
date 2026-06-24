"use client";

import { useEffect, useState } from "react";

const UNITS: [string, number][] = [
  ["giorni", 86400000],
  ["ore", 3600000],
  ["min", 60000],
  ["sec", 1000],
];

/**
 * Live countdown to `target`. Renders nothing time-dependent until mounted
 * on the client, which keeps the static export hydration-safe.
 */
export function Countdown({ target, done }: { target: string; done: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return <div className="mt-1.5 min-h-[58px] border-t border-white/[0.07] pt-4" aria-hidden />;
  }

  const diff = new Date(target).getTime() - now;
  if (diff <= 0) {
    return (
      <div className="mt-1.5 border-t border-white/[0.07] pt-4">
        <span className="font-mono text-sm text-gold">{done}</span>
      </div>
    );
  }

  let rest = diff;
  const parts = UNITS.map(([label, ms]) => {
    const v = Math.floor(rest / ms);
    rest -= v * ms;
    return { label, v };
  });

  return (
    <div className="mt-1.5 flex flex-wrap gap-4 border-t border-white/[0.07] pt-4">
      {parts.map(({ label, v }) => (
        <div key={label} className="min-w-[46px] text-center">
          <span
            className="block text-[clamp(22px,3.4vw,40px)] font-bold leading-none text-ink"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(v).padStart(2, "0")}
          </span>
          <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-dim-2">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
