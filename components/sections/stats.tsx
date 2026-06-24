"use client";

import { motion } from "motion/react";
import { Sparkles } from "@/components/ui/sparkles";
import { CountUp } from "@/components/ui/count-up";
import { STATS } from "@/lib/config";

export function Stats() {
  return (
    <section className="relative overflow-hidden py-[clamp(40px,8vh,90px)]">
      <Sparkles />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center border-b border-white/[0.08] px-6 py-10 last:border-b-0 md:border-b-0 md:border-r md:px-[clamp(24px,5vw,72px)] md:last:border-r-0"
          >
            <CountUp
              value={s.n}
              className="text-[clamp(60px,12vw,170px)] font-bold leading-none tracking-[-0.05em] text-gold"
            />
            <div className="my-3 text-[clamp(22px,3.5vw,44px)]">{s.emoji}</div>
            <div className="text-[clamp(12px,1.4vw,15px)] leading-[1.7] text-dim">
              {s.desc}
              <span className="mt-1.5 block font-mono text-[10px] tracking-[0.04em] text-gold opacity-70">
                {s.note}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
