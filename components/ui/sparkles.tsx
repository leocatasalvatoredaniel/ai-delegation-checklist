"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

/**
 * Lightweight canvas sparkle field with a slow drifting wave band.
 * Self-throttling (idles when off-screen via IntersectionObserver) and
 * honours prefers-reduced-motion by drawing a single static frame.
 */
export function Sparkles({
  className,
  color = "245,200,66",
  maxSpeed = 0.22,
}: {
  className?: string;
  color?: string;
  maxSpeed?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let phase = Math.random() * Math.PI * 2;
    let raf = 0;
    let visible = true;

    const W = () => cv.clientWidth;
    const H = () => cv.clientHeight;

    const resize = () => {
      cv.width = W() * dpr;
      cv.height = H() * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(70, Math.round((W() * H()) / 24000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W(),
        y: Math.random() * H(),
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * maxSpeed,
        vy: (Math.random() - 0.5) * maxSpeed,
        a: Math.random() * 0.5 + 0.12,
      }));
    };
    resize();

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const y = h * 0.5 + Math.sin(x * 0.006 + phase) * h * 0.1;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${color},0.05)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(${color},${p.a})`;
        ctx.fill();
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      draw();
    } else {
      const loop = () => {
        if (visible) {
          phase += 0.004;
          draw();
        }
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(cv);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [color, maxSpeed]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
