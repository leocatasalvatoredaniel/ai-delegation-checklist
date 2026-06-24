"use client";

import { motion, type Variants } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight";
import { Sparkles } from "@/components/ui/sparkles";
import { SITE } from "@/lib/config";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-7 sm:px-12 md:px-20">
      <Sparkles />
      <Spotlight className="-top-40 left-0 md:-top-24 md:left-60" fill="#F5C842" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,17,31,0.72)_100%)]"
      />

      <header className="relative z-10 flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
        <span>{SITE.tag}</span>
        <span>PoliTo · 2026</span>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-1 flex-col justify-center"
      >
        <motion.p
          variants={line}
          className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-gold"
        >
          // avviso agli amici
        </motion.p>
        <h1 className="text-[clamp(68px,20vw,260px)] font-bold leading-[0.86] tracking-[-0.036em]">
          <motion.span variants={line} className="blend block">
            IL
          </motion.span>
          <motion.span variants={line} className="blend ml-[6vw] block">
            GRANDE
          </motion.span>
          <motion.span variants={line} className="text-stroke-gold ml-[2.5vw] block">
            GIORNO.
          </motion.span>
        </h1>
        <motion.p
          variants={line}
          className="mt-7 text-[clamp(13px,1.7vw,16px)] font-light tracking-[0.07em] text-dim"
        >
          <strong className="font-medium text-ink">{SITE.name}</strong> — {SITE.degree},{" "}
          {SITE.university}
        </motion.p>
      </motion.div>

      <footer className="relative z-10 flex items-end justify-between font-mono text-[10px] tracking-[0.12em] text-dim-2">
        <span>Anno accademico {SITE.years} (ish)</span>
        <span className="animate-nudge">scroll ↓</span>
        <span>{SITE.place}</span>
      </footer>
    </section>
  );
}
