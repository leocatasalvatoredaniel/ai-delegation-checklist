"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

export interface StickyItem {
  /** Big number / kicker shown above the title (e.g. "1.847", "∞"). */
  num?: string;
  title: string;
  description: string;
  /** Optional image path (under /public). When set, it replaces the emoji. */
  img?: string;
  /** Fallback visual when no image is provided. */
  emoji?: string;
  /** CSS background for the sticky/visual card. */
  gradient?: string;
}

const DEFAULT_GRADIENT = "linear-gradient(160deg,#1A3A6B 0%,#0F2347 60%,#0A1628 100%)";

function Visual({ item }: { item: StickyItem }) {
  return (
    <div className="ss-visual" style={{ background: item.gradient || DEFAULT_GRADIENT }}>
      {item.img ? (
        <img src={item.img} alt={item.title} />
      ) : (
        <span className="ss-emoji" aria-hidden="true">
          {item.emoji}
        </span>
      )}
    </div>
  );
}

export function StickyScroll({ content }: { content: StickyItem[] }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = content.map((_, i) => i / cardLength);
    const closest = breakpoints.reduce((acc, bp, i) => {
      return Math.abs(latest - bp) < Math.abs(latest - breakpoints[acc]) ? i : acc;
    }, 0);
    setActive(closest);
  });

  // keep the sticky card gradient in sync with the active block
  const [gradient, setGradient] = useState(content[0]?.gradient || DEFAULT_GRADIENT);
  useEffect(() => {
    setGradient(content[active]?.gradient || DEFAULT_GRADIENT);
  }, [active, content]);

  return (
    <div className="ss-wrap" ref={ref}>
      <div className="ss-left">
        {content.map((item, i) => (
          <div className="ss-block" key={item.title + i}>
            {item.num && (
              <motion.div className="ss-num" animate={{ opacity: active === i ? 1 : 0.28 }}>
                {item.num}
              </motion.div>
            )}
            <motion.h3 className="ss-title" animate={{ opacity: active === i ? 1 : 0.28 }}>
              {item.title}
            </motion.h3>
            <motion.p className="ss-desc" animate={{ opacity: active === i ? 1 : 0.28 }}>
              {item.description}
            </motion.p>
            {/* inline visual on small screens (sticky card is hidden there) */}
            <div className="ss-mobile-visual">
              <Visual item={item} />
            </div>
          </div>
        ))}
        <div style={{ height: "40px" }} />
      </div>

      <div className="ss-sticky" style={{ background: gradient }}>
        <Visual item={content[active]} />
      </div>
    </div>
  );
}
