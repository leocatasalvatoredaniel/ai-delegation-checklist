"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// next/image doesn't prefix basePath for plain string src when
// images.unoptimized is set, so it's added here.
const BASE_PATH = process.env.NODE_ENV === "production" ? "/ai-delegation-checklist" : "";

/**
 * Photoreal globe under the hero copy. The photo already contains a faint
 * route track; the SVG overlay redraws it in glowing gold on reveal and adds
 * pulsing markers. Overlay coordinates were pixel-measured on the source
 * image (1672x941), so the container must keep the image's aspect ratio.
 */
const TORINO = { x: 752, y: 349 };
const SICILIA = { x: 1244, y: 700 };

export function GlobeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRevealed(true)),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`ghero${revealed ? " in" : ""}`} aria-hidden="true">
      <div className="ghero-frame" ref={ref}>
        <div className="ghero-zoom">
          <Image
            src={`${BASE_PATH}/img/globe-med.jpg`}
            alt=""
            width={1672}
            height={941}
            priority
            sizes="100vw"
          />
          <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
            {/* quadratic fit of the faint track baked into the photo, so the
                glowing redraw covers it exactly (it has a ~12px sag) */}
            <path
              className="ghero-route"
              d={`M${SICILIA.x},${SICILIA.y} Q1000,498 ${TORINO.x},${TORINO.y}`}
              fill="none"
              pathLength={1}
            />
            <g className="ghero-marker ghero-marker-start">
              <circle cx={SICILIA.x} cy={SICILIA.y} r="16" className="gh-pulse gold" />
            </g>
            <g className="ghero-marker ghero-marker-end">
              <circle cx={TORINO.x} cy={TORINO.y} r="18" className="gh-pulse blue" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
