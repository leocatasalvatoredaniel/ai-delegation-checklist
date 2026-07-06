"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Stylised satellite map of the Mediterranean — curved planet horizon,
 * soft low-poly landmasses, faint graticule and a gold Sicilia → Torino
 * route. Pure SVG, sized to bleed behind the hero content.
 *
 * viewBox is 1000x700; preserveAspectRatio keeps the planet anchored to the
 * bottom edge and crops the sides on narrow screens, so the route (x≈400-590)
 * stays visible even at 390px-wide viewports.
 */

const TORINO = { x: 400, y: 255 };
const SICILIA = { x: 590, y: 602 };

export function GlobeMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setRevealed(true)),
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`gmap-wrap${revealed ? " in" : ""}`} ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient
            id="gmapSea"
            gradientUnits="userSpaceOnUse"
            cx="500"
            cy="130"
            r="800"
          >
            <stop offset="0%" stopColor="#1D4A8C" />
            <stop offset="30%" stopColor="#143767" />
            <stop offset="60%" stopColor="#0C2347" />
            <stop offset="100%" stopColor="#07122A" />
          </radialGradient>
          <linearGradient id="gmapAtmo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(96,165,250,.7)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0)" />
          </linearGradient>
          {/* planet disc: big circle whose top arc is the horizon */}
          <clipPath id="gmapClip">
            <circle cx="500" cy="1700" r="1560" />
          </clipPath>
        </defs>

        {/* atmosphere glow hugging the horizon */}
        <circle cx="500" cy="1700" r="1568" fill="none" stroke="url(#gmapAtmo)" strokeWidth="18" opacity=".55" />

        <g clipPath="url(#gmapClip)">
          {/* ocean */}
          <circle cx="500" cy="1700" r="1560" fill="url(#gmapSea)" />

          {/* graticule — gentle latitude/longitude hints */}
          <g className="gmap-grid">
            <path d="M0,255 Q500,178 1000,255" />
            <path d="M0,385 Q500,326 1000,385" />
            <path d="M0,525 Q500,480 1000,525" />
            <path d="M0,665 Q500,634 1000,665" />
            <path d="M175,208 Q152,450 115,700" />
            <path d="M385,168 Q380,430 365,700" />
            <path d="M615,168 Q622,430 640,700" />
            <path d="M825,208 Q858,450 895,700" />
          </g>

          {/* landmasses — softened low-poly Mediterranean */}
          <g className="gmap-land">
            {/* southern France + western Alps coast */}
            <path d="M212,246 Q262,222 330,218 Q374,224 398,238 Q382,262 344,270 Q296,268 252,278 Q224,268 212,246 Z" />
            {/* Italy — the boot, Piemonte down to Calabria */}
            <path d="M383,229 Q400,238 407,252 Q413,272 421,292 Q432,318 447,344 Q463,372 481,398 Q499,424 519,448 Q537,468 555,486 Q567,497 577,505 Q583,520 577,537 L589,530 Q600,522 610,512 L595,500 Q583,492 571,481 Q551,462 533,440 Q515,417 499,392 Q483,366 469,340 Q455,313 445,290 Q436,268 428,252 Q415,238 400,232 Z" />
            {/* Sicilia */}
            <path d="M556,592 Q574,584 596,586 Q614,588 622,600 Q612,614 592,618 Q570,618 556,606 Z" />
            {/* Sardegna */}
            <path d="M370,428 Q382,420 390,428 Q396,452 392,486 Q386,504 374,506 Q366,482 366,452 Z" />
            {/* Corsica */}
            <path d="M382,366 Q394,358 402,368 Q408,390 400,410 Q388,414 380,398 Z" />
            {/* Balkan / Adriatic coast */}
            <path d="M598,286 Q664,292 722,326 Q772,368 812,424 Q830,452 822,462 Q788,432 738,392 Q684,352 618,316 Q602,300 598,286 Z" />
            {/* North Africa */}
            <path d="M0,668 Q160,640 330,634 Q470,646 560,668 Q620,682 660,694 L1000,698 L1000,700 L0,700 Z" />
          </g>

          {/* Sicilia → Torino route */}
          <line
            className="gmap-route"
            x1={SICILIA.x}
            y1={SICILIA.y}
            x2={TORINO.x}
            y2={TORINO.y}
            pathLength={1}
          />
          <g className="gmap-marker gmap-marker-start">
            <circle cx={SICILIA.x} cy={SICILIA.y} r="7" className="m-pulse" />
            <circle cx={SICILIA.x} cy={SICILIA.y} r="5.5" className="m-core gold" />
          </g>
          <g className="gmap-marker gmap-marker-end">
            <circle cx={TORINO.x} cy={TORINO.y} r="8" className="m-pulse blue" />
            <circle cx={TORINO.x} cy={TORINO.y} r="6" className="m-ring" />
          </g>
        </g>
      </svg>
    </div>
  );
}
