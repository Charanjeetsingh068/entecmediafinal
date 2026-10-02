"use client";

import { useEffect, useRef } from "react";

/**
 * Dark "Our focus" backdrop (home Services + service detail "What's included"): a canvas that reads
 * like a looping video but downloads nothing — a flowing particle wave, dotted sonar ripples, a rotating
 * dotted orbit with a bright comet and drifting sparkles. Pinned to the screen while its section
 * scrolls over it. Place it as the first child of a `.svd` section.
 */
export default function SvdBackdrop() {
  const dotsRef = useRef<HTMLCanvasElement>(null);

  // Canvas backdrop that reads like a looping video but downloads nothing: a flowing particle
  // wave, dotted sonar ripples, a rotating dotted orbit with a bright comet, and drifting sparkles.
  // Runs only while the section is on screen and the tab is visible, capped at 30fps.
  useEffect(() => {
    const canvas = dotsRef.current;
    const section = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;

    const MAX_A = 0.5;
    // Pre-built shades so no colour strings are created while drawing
    const shades = Array.from({ length: 26 }, (_, i) => `rgba(165, 185, 255, ${((i / 25) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(25, Math.round((a / MAX_A) * 25)))];
    const ACCENT = "rgba(79, 140, 255, 0.95)";

    let w = 0, h = 0, cols = 0, rows = 0, small = false;
    let raf = 0, last = 0, t = 0, inView = false;
    let sparks: { x: number; y: number; v: number; p: number }[] = [];

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 810;
      cols = small ? 44 : 88;
      rows = small ? 18 : 28;
      sparks = Array.from({ length: small ? 22 : 44 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: 6 + Math.random() * 14,
        p: Math.random() * Math.PI * 2,
      }));
    };

    // A circle drawn as dots, `gap` px apart
    const dotRing = (cx: number, cy: number, r: number, alpha: number, gap: number, size: number, rot = 0) => {
      if (alpha <= 0.01 || r <= 0) return;
      ctx.fillStyle = shade(alpha);
      const n = Math.max(12, Math.floor((Math.PI * 2 * r) / gap));
      for (let i = 0; i < n; i++) {
        const a = rot + (i / n) * Math.PI * 2;
        ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, size, size);
      }
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      ctx.clearRect(0, 0, w, h);

      // 1. Particle wave along the bottom
      for (let r = 0; r < rows; r++) {
        const z = r / (rows - 1);
        const baseY = h * 0.42 + z * z * h * 0.7;
        const spread = w * (0.7 + z * 1.3);
        const amp = 10 + z * 50;
        const size = 0.8 + z * 1.6;
        for (let c = 0; c < cols; c++) {
          const x = c / (cols - 1) - 0.5;
          const wave = Math.sin(x * 7 + t * 2.2 + z * 3.2) * 0.6 + Math.sin(x * 2.6 - t * 1.3 + z * 5.5) * 0.4;
          const alpha = (0.06 + z * 0.34) * (0.5 + 0.5 * wave);
          if (alpha < 0.02) continue;
          ctx.fillStyle = shade(alpha);
          ctx.fillRect(w / 2 + x * spread, baseY + wave * amp, size, size);
        }
      }

      // 2. Sonar ripples from behind the list
      const cx = small ? w * 0.5 : w * 0.68;
      const cy = small ? h * 0.35 : h * 0.42;
      const maxR = Math.max(w, h) * (small ? 0.7 : 0.55);
      const period = 4.2;
      for (let k = 0; k < 3; k++) {
        const phase = ((t * 2.2) / period + k / 3) % 1; // 0 → 1
        dotRing(cx, cy, phase * maxR, (1 - phase) * 0.34, 9, 1.4);
      }

      // 3. Rotating dotted orbit with a comet
      const orbitR = Math.min(w, h) * (small ? 0.3 : 0.26);
      const rot = t * 0.9;
      dotRing(cx, cy, orbitR, 0.22, 7, 1.2, rot);
      dotRing(cx, cy, orbitR * 0.55, 0.14, 8, 1.1, -rot * 1.4);
      const head = t * 3.2;
      for (let i = 0; i < 14; i++) {
        const a = head - i * 0.045;
        const px = cx + Math.cos(a) * orbitR;
        const py = cy + Math.sin(a) * orbitR;
        if (i === 0) {
          ctx.fillStyle = ACCENT;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        } else {
          ctx.fillStyle = shade(0.45 * (1 - i / 14));
          ctx.fillRect(px - 1, py - 1, 2, 2);
        }
      }

      // 4. Drifting sparkles
      for (const s of sparks) {
        s.y -= s.v * dt * 0.001;
        if (s.y < -4) {
          s.y = h + 4;
          s.x = Math.random() * w;
        }
        const a = 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(t * 6 + s.p));
        ctx.fillStyle = shade(a);
        ctx.fillRect(s.x, s.y, 1.6, 1.6);
      }
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      const dt = time - last;
      if (dt < 33) return; // ~30fps is plenty for a slow backdrop
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
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="svd-bg" aria-hidden="true">
      <div className="svd-bg-sticky">
        <canvas className="svd-dots" ref={dotsRef} />
      </div>
    </div>
  );
}
