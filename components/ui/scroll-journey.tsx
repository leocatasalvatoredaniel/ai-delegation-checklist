"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useMotionValue,
  useTransform,
} from "motion/react";

// next/image doesn't prefix basePath for plain string src when images.unoptimized
// is set (that rewrite only happens for statically-imported images), so it's added here.
const BASE_PATH = process.env.NODE_ENV === "production" ? "/ai-delegation-checklist" : "";
const IMG_SICILIA = `${BASE_PATH}/img/journey-sicilia.png`;
const IMG_TORINO = `${BASE_PATH}/img/journey-torino.png`;

const PATH_D = "M 78 74 Q 50 8 22 24";

function PlaneIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 3 3 10.5l6.5 2 2 6.5L21 3Z"
        fill="var(--gold)"
        stroke="var(--gold)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function JourneyScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeX = useMotionValue(0);
  const planeY = useMotionValue(0);
  const [pathLen, setPathLen] = useState(0);

  // Driven by a plain scroll listener (getBoundingClientRect), matching the
  // rest of graduation.tsx's parallax: Motion's useScroll(target, offset)
  // resolves the target's absolute position by walking the offsetParent
  // chain up to document.scrollingElement, which is unreliable this deep
  // into a layout with many positioned ancestors (sticky nav, negative
  // section margins, etc.) and silently produced a wrong scroll range.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : 0;
      scrollYProgress.set(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollYProgress]);

  const img1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [1, 1, 0, 0]);
  const img2Opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 0, 1, 1]);
  const arcOpacity = useTransform(scrollYProgress, [0.06, 0.16, 0.78, 0.9], [0, 1, 1, 0]);
  const dashOffset = useTransform(scrollYProgress, [0.1, 0.76], [1, 0]);
  const caption1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.22], [1, 1, 0]);
  const caption2Opacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const path = pathRef.current;
    if (!path || !pathLen) return;
    const t = Math.min(1, Math.max(0, (v - 0.08) / (0.78 - 0.08)));
    const pt = path.getPointAtLength(t * pathLen);
    planeX.set(pt.x);
    planeY.set(pt.y);
  });

  return (
    <div className="journey-wrap" ref={sectionRef}>
      <div className="journey-sticky">
        <motion.div className="journey-layer" style={{ opacity: img1Opacity }}>
          <Image src={IMG_SICILIA} alt="Decollo dalla Sicilia" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </motion.div>
        <motion.div className="journey-layer" style={{ opacity: img2Opacity }}>
          <Image src={IMG_TORINO} alt="Arrivo a Torino" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </motion.div>

        <div className="journey-vignette" aria-hidden="true" />

        <motion.svg
          className="journey-arc"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: arcOpacity }}
          aria-hidden="true"
        >
          <motion.path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: 1, pathOffset: dashOffset }}
          />
        </motion.svg>

        <motion.div
          className="journey-plane"
          style={{
            opacity: arcOpacity,
            left: useTransform(planeX, (x: number) => `${x}%`),
            top: useTransform(planeY, (y: number) => `${y}%`),
          }}
        >
          <PlaneIcon />
        </motion.div>

        <motion.div className="journey-caption journey-caption-start" style={{ opacity: caption1Opacity }}>
          <span className="journey-tag">// il viaggio</span>
          <h3>Da Biancavilla, Sicilia</h3>
        </motion.div>

        <motion.div className="journey-caption journey-caption-end" style={{ opacity: caption2Opacity }}>
          <span className="journey-tag">// destinazione</span>
          <h3>A Torino, Politecnico</h3>
        </motion.div>
      </div>
    </div>
  );
}

function JourneyStatic() {
  return (
    <div className="journey-static">
      <div className="journey-static-frame">
        <Image src={IMG_SICILIA} alt="Decollo dalla Sicilia" width={800} height={533} />
        <div className="journey-caption-static">
          <span className="journey-tag">// il viaggio</span>
          <h3>Da Biancavilla, Sicilia</h3>
        </div>
      </div>
      <div className="journey-static-frame">
        <Image src={IMG_TORINO} alt="Arrivo a Torino" width={800} height={533} />
        <div className="journey-caption-static">
          <span className="journey-tag">// destinazione</span>
          <h3>A Torino, Politecnico</h3>
        </div>
      </div>
    </div>
  );
}

export function ScrollJourney() {
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  useEffect(() => {
    setReduceMotion(matchMedia("(prefers-reduced-motion:reduce)").matches);
  }, []);

  if (reduceMotion === null) return null;
  return reduceMotion ? <JourneyStatic /> : <JourneyScene />;
}
