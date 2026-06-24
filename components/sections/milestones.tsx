"use client";

import { motion } from "motion/react";
import { Sparkles } from "@/components/ui/sparkles";
import { Countdown } from "@/components/ui/countdown";
import { MILESTONES } from "@/lib/config";

export function Milestones() {
  return (
    <section className="relative overflow-hidden px-6 pb-[clamp(60px,8vh,90px)] pt-[clamp(80px,12vh,120px)] sm:px-12 md:px-24">
      <Sparkles />
      <div className="relative z-10">
        <div className="mb-[clamp(36px,6vh,64px)] flex flex-wrap items-baseline gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">// quando &amp; dove</p>
          <h2 className="text-[clamp(34px,7vw,92px)] font-bold tracking-[-0.03em]">Due tappe.</h2>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(20px,3vw,40px)] md:grid-cols-2">
          {MILESTONES.map((m, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3.5 rounded-[18px] border border-white/10 bg-white/[0.02] p-[clamp(22px,3vw,34px)] transition-colors duration-200 hover:border-gold/30"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{m.tag}</span>
              <div className="text-[clamp(38px,6vw,76px)] font-bold leading-[0.92] tracking-[-0.03em] text-ink">
                {m.day} <span className="text-gold">{m.month}</span>
              </div>
              <div>
                <div className="text-[clamp(16px,2.2vw,22px)] font-medium">{m.venue}</div>
                <div className="font-mono text-xs leading-[1.9] tracking-[0.06em] text-dim">
                  {m.meta.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={m.maps}
                target="_blank"
                rel="noopener"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 px-4 py-2 font-mono text-[11px] tracking-[0.08em] text-gold transition-all duration-150 hover:border-gold hover:bg-gold/10 active:scale-[0.97]"
              >
                ↳ Apri in Maps
              </a>
              <Countdown target={m.target} done={m.done} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
