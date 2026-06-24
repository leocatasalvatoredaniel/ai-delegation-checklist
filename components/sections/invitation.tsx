"use client";

import { motion } from "motion/react";
import { Sparkles } from "@/components/ui/sparkles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function Invitation() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-24 sm:px-12 md:px-24">
      <Sparkles />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-gold"
      >
        // sei ufficialmente convocato
      </motion.p>

      <h2 className="relative z-10 text-[clamp(68px,19vw,240px)] font-bold leading-[0.84] tracking-[-0.04em]">
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-stroke-ink blend block"
        >
          SEI
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="block text-gold"
        >
          INVITATO.
        </motion.span>
      </h2>

      <p className="relative z-10 ml-[clamp(0px,4vw,60px)] mt-9 max-w-[460px] text-[clamp(14px,1.8vw,20px)] font-light leading-[1.75] text-dim">
        <TextGenerateEffect words="A festeggiare la fine di un viaggio lungo tre anni — e l'inizio di tutto il resto." />
      </p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-10 ml-[clamp(0px,4vw,60px)] mt-5 max-w-[460px] text-[clamp(13px,1.6vw,17px)] font-light italic leading-[1.7] text-dim-2"
      >
        (E a non chiedere cosa fa, di preciso, un ingegnere informatico.)
      </motion.p>
    </section>
  );
}
