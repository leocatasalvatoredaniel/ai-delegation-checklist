"use client";

import { useEffect, useRef, useState } from "react";

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
  return item.img ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.img} alt={item.title} />
  ) : (
    <span className="ss-emoji" aria-hidden="true">
      {item.emoji}
    </span>
  );
}

/** Simple stacked layout for small screens and reduced motion. */
function InlineList({ content }: { content: StickyItem[] }) {
  return (
    <div className="ss-inline">
      {content.map((item, i) => (
        <div className="ss-block" key={item.title + i}>
          {item.num && <div className="ss-num">{item.num}</div>}
          <h3 className="ss-title">{item.title}</h3>
          <p className="ss-desc">{item.description}</p>
          <div className="ss-inline-visual" style={{ background: item.gradient || DEFAULT_GRADIENT }}>
            <Visual item={item} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-screen sticky scroll: the wrapper is content.length * 100vh tall,
 * a 100svh pin stays fixed while the page scrolls past, and the active
 * slide is derived from the wrapper's position (plain rect math —
 * Motion's useScroll(target) proved unreliable in this layout).
 */
export function StickyScroll({ content }: { content: StickyItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = matchMedia("(min-width: 900px)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPinned(mq.matches && !rm.matches);
    update();
    mq.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const el = wrapRef.current;
    if (!el) return;
    const n = content.length;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setActive(Math.min(n - 1, Math.floor(p * n)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, content.length]);

  if (pinned === null) return null;
  if (!pinned) return <InlineList content={content} />;

  return (
    <div className="ss-wrap" ref={wrapRef} style={{ height: `${content.length * 100}vh` }}>
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
                <Visual item={item} />
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
