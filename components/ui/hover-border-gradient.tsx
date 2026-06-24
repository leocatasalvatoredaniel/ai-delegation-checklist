"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const MOVING: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, #FFD877 0%, rgba(255,216,119,0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, #FFD877 0%, rgba(255,216,119,0) 100%)",
  BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, #FFD877 0%, rgba(255,216,119,0) 100%)",
  RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, #FFD877 0%, rgba(255,216,119,0) 100%)",
};

const HIGHLIGHT =
  "radial-gradient(75% 181% at 50% 50%, #F5C842 0%, rgba(245,200,66,0) 100%)";

/**
 * Aceternity HoverBorderGradient — an animated conic-ish border that rotates
 * around the element and brightens on hover. Rendered as a <button>.
 */
export function HoverBorderGradient({
  children,
  className,
  containerClassName,
  duration = 1.4,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");
  const order = useRef<Direction[]>(["TOP", "LEFT", "BOTTOM", "RIGHT"]);

  const rotate = useCallback(() => {
    const dirs = order.current;
    const next = dirs[(dirs.indexOf(direction) + 1) % dirs.length];
    return next;
  }, [direction]);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setDirection(rotate()), duration * 1000);
    return () => clearInterval(id);
  }, [hovered, rotate, duration]);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex w-fit items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 p-px transition-transform duration-150 active:scale-[0.97]",
        containerClassName,
      )}
      {...props}
    >
      <span
        className={cn(
          "z-10 rounded-[inherit] bg-navy-2 px-9 py-3.5 text-sm font-bold tracking-wide text-ink",
          className,
        )}
      >
        {children}
      </span>
      <motion.span
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{ filter: "blur(2px)" }}
        initial={{ background: MOVING[direction] }}
        animate={{ background: hovered ? [MOVING[direction], HIGHLIGHT] : MOVING[direction] }}
        transition={{ ease: "linear", duration }}
      />
    </button>
  );
}
