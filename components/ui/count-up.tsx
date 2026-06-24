"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Counts from 0 to a numeric value when scrolled into view, formatted it-IT
 * (so 1400 → "1.400"). Non-numeric values (e.g. "∞") render unchanged.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const numeric = parseInt(value.replace(/\./g, ""), 10);
  const isNum = !Number.isNaN(numeric) && /^[\d.]+$/.test(value);
  const [display, setDisplay] = useState(isNum ? "0" : value);

  useEffect(() => {
    if (!inView || !isNum) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(numeric.toLocaleString("it-IT"));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(numeric * eased).toLocaleString("it-IT"));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNum, numeric]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {isNum ? display : value}
    </span>
  );
}
