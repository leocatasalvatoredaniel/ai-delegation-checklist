"use client";

import { useEffect, useRef, useState } from "react";

/** Sicilia → Torino, plotted as two points inside a 100x100 globe viewBox. */
const PATH_D = "M 82 78 Q 50 18 20 24";

export function DigitalGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRevealed(true)),
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`globe-wrap${revealed ? " in" : ""}`} ref={wrapRef} aria-hidden="true">
      <div className="globe-glow" />
      <div className="globe-sphere">
        <svg className="globe-grid" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="48" ry="12" />
          <ellipse cx="50" cy="50" rx="48" ry="26" />
          <ellipse cx="50" cy="50" rx="48" ry="40" />
          <ellipse cx="50" cy="50" rx="12" ry="48" />
          <ellipse cx="50" cy="50" rx="26" ry="48" />
          <ellipse cx="50" cy="50" rx="40" ry="48" />
          <circle cx="50" cy="50" r="48" className="globe-outline" />
        </svg>
      </div>
      <svg className="globe-arc" viewBox="0 0 100 100">
        <path d={PATH_D} className="globe-path" pathLength={1} />
        <circle cx="82" cy="78" r="1.8" className="globe-dot dot-start" />
        <circle cx="20" cy="24" r="1.8" className="globe-dot dot-end" />
      </svg>
    </div>
  );
}
