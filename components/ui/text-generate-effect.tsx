"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

/** Aceternity-style staggered word reveal — each word fades + unblurs in. */
export function TextGenerateEffect({
  words,
  className,
  delay = 0,
  stagger = 0.07,
}: {
  words: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const tokens = words.split(" ");

  return (
    <span ref={ref} className={cn("inline", className)}>
      {tokens.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {w}
          {i < tokens.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
