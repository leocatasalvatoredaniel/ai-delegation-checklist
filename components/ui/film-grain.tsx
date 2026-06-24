"use client";

import { useEffect, useRef } from "react";

/** Fixed full-screen film-grain overlay generated once on the client. */
export function FilmGrain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 200;
    const ctx = c.getContext("2d");
    if (!ctx || !ref.current) return;
    const id = ctx.createImageData(200, 200);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 20;
    }
    ctx.putImageData(id, 0, 0);
    ref.current.style.backgroundImage = `url(${c.toDataURL()})`;
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9990] bg-repeat opacity-[0.05] mix-blend-screen"
      style={{ backgroundSize: "180px" }}
    />
  );
}
