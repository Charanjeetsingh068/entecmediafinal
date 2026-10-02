"use client";

import { useEffect, useRef } from "react";

/**
 * Calm animated background for light sections (same family as the About overview): a dot grid whose
 * dots twinkle softly, each on its own rhythm, a slow diagonal band of light that keeps sweeping across
 * it, dots near the pointer brightening a little, and two slow brand-blue blobs. The layer is one screen
 * tall and sticky, so it stays behind the content all the way down the section.
 * Draws only while the section is on screen and the tab is open, capped at 30fps.
 * Place it as the first child of a `position: relative` section.
 * tone="dark" draws light-blue dots (resting a little brighter, so they show on navy) for dark sections.
 */
export default function DotBackdrop({ tone = "light" }: { tone?: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;

    const MAX_A = 0.4;
    // Dark sections: light brand blue, with a higher resting level so the dots read on navy without a hover
    const [rgb, base, grow] = tone === "dark" ? ["143, 194, 255", 0.16, 0.5] : ["42, 39, 216", 0.06, 0];
    const shades = Array.from({ length: 21 }, (_, i) => `rgba(${rgb}, ${((i / 20) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(20, Math.round((a / MAX_A) * 20)))];

    let w = 0, h = 0, gap = 28;
    let raf = 0, last = 0, t = 0, inView = false;
    let px = -9999, py = -9999;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 810 ? 24 : 28;
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      ctx.clearRect(0, 0, w, h);
      // The light band travels diagonally across the section, then starts again
      const span = w + h;
      const band = ((t * 0.18) % 1) * (span + 600) - 300;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const phase = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const tw = 0.5 + 0.5 * Math.sin(t * 3 + (phase - Math.floor(phase)) * Math.PI * 2);
          const sweep = Math.max(0, 1 - Math.abs(x + y - band) / 260);
          const near = Math.max(0, 1 - Math.hypot(x - px, y - py) / 220);
          ctx.fillStyle = shade(base + tw * 0.12 + sweep * 0.12 + near * 0.14);
          const size = 1.3 + grow + tw * 0.6 + sweep * 0.5 + near * 0.8;
          ctx.fillRect(x, y, size, size);
        }
      }
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      const dt = time - last;
      if (dt < 33) return;
      last = time;
      frame(Math.min(dt, 100));
    };
    const start = () => {
      if (!raf && inView && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    frame(0);
    const ro = new ResizeObserver(() => {
      resize();
      frame(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(section);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = () => {
      px = py = -9999;
    };
    document.addEventListener("visibilitychange", onVisibility);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [tone]);

  return (
    <div className="db-bg" aria-hidden="true">
      <div className="db-sticky">
        <canvas className="db-canvas" ref={canvasRef} />
        <span className="db-blob db-blob-a" />
        <span className="db-blob db-blob-b" />
      </div>
    </div>
  );
}
