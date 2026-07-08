"use client";

import { useEffect, useRef, useState } from "react";

export interface StickyItem {
  /** Big number / kicker shown above the title (e.g. "1.847", "∞"). */
  num?: string;
  title: string;
  description: string;
  /** Optional image path (under /public). When set, it replaces the emoji. */
  img?: string;
  /** Optional video path (under /public). Takes priority over img/emoji;
   *  plays muted+looped only while this slide is the active one. */
  video?: string;
  /** Poster frame shown before the video starts playing. */
  videoPoster?: string;
  /** Fallback visual when neither img nor video is provided. */
  emoji?: string;
  /** CSS background for the sticky/visual card. */
  gradient?: string;
}

const DEFAULT_GRADIENT = "linear-gradient(160deg,#1A3A6B 0%,#0F2347 60%,#0A1628 100%)";

function Visual({ item, active }: { item: StickyItem; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  if (item.video) {
    return (
      <video
        ref={videoRef}
        src={item.video}
        poster={item.videoPoster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={item.title}
      />
    );
  }
  if (item.img) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.img} alt={item.title} />;
  }
  return (
    <span className="ss-emoji" aria-hidden="true">
      {item.emoji}
    </span>
  );
}

/**
 * Full-screen sticky scroll: the wrapper is content.length * 100svh tall,
 * a 100svh pin stays fixed while the page scrolls past, and the active
 * slide is derived from the wrapper's position (plain rect math — Motion's
 * useScroll(target) proved unreliable in this layout). Runs on every
 * screen size; only prefers-reduced-motion swaps it for a static stack.
 */
export function StickyScroll({ content }: { content: StickyItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState<boolean | null>(null);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPinned(!rm.matches);
    update();
    rm.addEventListener("change", update);
    return () => rm.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const el = wrapRef.current;
    if (!el) return;
    const n = content.length;
    let ticking = false;
    const measure = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      // per-slide scroll distance = the wrapper's own height / n (each slide
      // is 100svh). Deriving the denominator from the wrapper — NOT
      // window.innerHeight — keeps the active index stable while the mobile
      // URL bar collapses (innerHeight swings between svh and lvh, which
      // otherwise flip-flops the index at a boundary and makes the crossfade
      // shudder). rAF-throttled so scroll never forces synchronous layout.
      const seg = r.height / n;
      const total = r.height - seg;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setActive(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, content.length]);

  if (pinned === null) return null;

  if (!pinned) {
    return (
      <div className="ss-inline">
        {content.map((item, i) => (
          <div className="ss-block" key={item.title + i}>
            {item.num && <div className="ss-num">{item.num}</div>}
            <h3 className="ss-title">{item.title}</h3>
            <p className="ss-desc">{item.description}</p>
            <div className="ss-inline-visual" style={{ background: item.gradient || DEFAULT_GRADIENT }}>
              {/* this branch only renders under prefers-reduced-motion: keep
                  the video on its poster frame, never autoplay it */}
              <Visual item={item} active={false} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ss-wrap" ref={wrapRef} style={{ height: `${content.length * 100}svh` }}>
      <div className="ss-pin">
        <div className="ss-stage">
          <div className="ss-left">
            {content.map((item, i) => (
              <div className={`ss-slide${i === active ? " active" : ""}`} key={item.title + i}>
                {item.num && <div className="ss-num">{item.num}</div>}
                <h3 className="ss-title">{item.title}</h3>
                <p className="ss-desc">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="ss-visual-side">
            {content.map((item, i) => (
              <div
                className={`ss-visual-slide${i === active ? " active" : ""}`}
                key={"v" + i}
                style={{ background: item.gradient || DEFAULT_GRADIENT }}
              >
                <Visual item={item} active={i === active} />
              </div>
            ))}
          </div>
        </div>
        <div className="ss-dots" aria-hidden="true">
          {content.map((_, i) => (
            <span className={i === active ? "on" : ""} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
