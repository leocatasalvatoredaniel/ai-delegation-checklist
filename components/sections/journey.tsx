"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Sparkles } from "@/components/ui/sparkles";
import { JOURNEY } from "@/lib/config";

/** Renders a journey line with its key word highlighted in gold. */
function Line({ text, strong }: { text: string; strong?: string }) {
  if (!strong || !text.includes(strong)) return <>{text}</>;
  const [before, after] = text.split(strong);
  return (
    <>
      {before}
      <strong className="font-bold text-gold">{strong}</strong>
      {after}
    </>
  );
}

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(-1);
  const N = JOURNEY.length;

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(p <= 0.01 ? -1 : Math.min(N - 1, Math.floor(p * N)));
  });

  return (
    <div ref={ref} style={{ height: `${N * 58}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 sm:px-12 md:px-24">
        <Sparkles />
        <motion.p
          animate={{ opacity: active >= 0 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-10 font-mono text-[10px] uppercase tracking-[0.22em] text-gold"
        >
          // la traversata
        </motion.p>
        {JOURNEY.map((l, i) => {
          const isActive = active === i;
          const isPast = active > i;
          const targetOpacity = l.aside
            ? isActive
              ? 0.55
              : isPast
                ? 0.22
                : 0.07
            : isActive
              ? 1
              : isPast
                ? 0.22
                : 0.07;
          return (
            <motion.p
              key={i}
              animate={{ opacity: targetOpacity, x: active >= i ? 0 : -18 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={
                l.aside
                  ? "relative z-10 mt-2 text-[clamp(14px,2vw,28px)] font-light italic text-dim"
                  : "relative z-10 mb-[0.08em] text-[clamp(26px,5.2vw,68px)] font-bold leading-[1.1]"
              }
            >
              <Line text={l.text} strong={l.strong} />
            </motion.p>
          );
        })}
      </div>
    </div>
  );
}
