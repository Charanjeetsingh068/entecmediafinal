"use client";

import { useEffect, useRef } from "react";

/**
 * Quiet background (full-page menu, About hero): a low 3D wire terrain of thin brand-blue ridge lines that
 * drifts very slowly towards the viewer. Lines further back are hidden behind nearer ridges (each ridge
 * is filled with the background colour before it is stroked), the sides rise into soft hills and the
 * middle stays a quiet valley. Deliberately faint and slow: it should be felt behind the menu, never
 * looked at. The pointer only nudges the lines under it slightly. Only draws while `active` and on screen.
 * `bg` must match the colour of the section behind it (ridges are filled with it to hide lines behind).
 */
export default function LineTerrain({
  active = true,
  bg = "#090a18",
  className = "nav-web",
}: {
  active?: boolean;
  bg?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !active) return;

    const BG = bg;
    const FAR = [42, 39, 216]; // --k-accent
    const NEAR = [31, 136, 245]; // --k-accent-2

    let w = 0, h = 0, raf = 0, last = 0, t = 0, flow = 0;
    let lines = 30, cols = 90;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, k: 0, on: false };
    let stars: { x: number; y: number; r: number; v: number; ph: number }[] = [];

    const onMove = (e: PointerEvent) => {
      if (mouse.k < 0.05) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.on = e.pointerType === "mouse" || e.pointerType === "pen";
    };
    const onLeave = () => (mouse.on = false);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 768;
      lines = mobile ? 22 : 32;
      cols = mobile ? 56 : 96;
      stars = Array.from({ length: mobile ? 18 : 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.45,
        r: 0.6 + Math.random() * 1.1,
        v: 3 + Math.random() * 6,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    // Smooth rolling height field; sides rise into hills, the middle stays a valley
    const height = (x: number, z: number) => {
      const n =
        Math.sin(x * 1.6 + z * 0.8 + t * 0.25) * 0.5 +
        Math.sin(x * 3.2 - z * 1.25 + t * 0.18) * 0.28 +
        Math.sin(x * 6.1 + z * 2.3 - t * 0.12) * 0.12 +
        Math.sin(z * 0.55 - t * 0.1) * 0.2;
      const valley = 0.18 + Math.min(1.25, x * x * 0.9);
      return (n + 1.1) * 0.5 * valley;
    };

    const draw = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt * 0.5;
      flow += dt * 0.12;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      mouse.k += ((mouse.on ? 1 : 0) - mouse.k) * 0.03;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      // Faint points drifting above the horizon
      for (const s of stars) {
        s.x -= s.v * dt;
        if (s.x < -4) s.x = w + 4;
        const a = 0.05 + 0.04 * Math.sin(t * 1.4 + s.ph);
        ctx.fillStyle = `rgba(${NEAR.join(",")}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const horizon = h * (w < 768 ? 0.58 : 0.5);
      const reach = (h - horizon) * 0.92;
      const spread = w * 0.62;
      const amp = h * 0.14;
      const frac = flow % 1;
      const R = 220;

      // Far to near, so nearer ridges cover the ones behind them
      for (let i = lines; i >= 0; i--) {
        const depth = i - frac; // screen depth slot (moves towards the viewer)
        if (depth < 0) continue;
        const z = 1 + depth * 0.3; // 1 = nearest
        const worldZ = (i + Math.floor(flow)) * 0.3; // terrain coordinate, fixed to the ridge
        const p = 1 - depth / lines; // 0 far .. 1 near
        const baseY = horizon + reach / z;

        ctx.beginPath();
        let lit = 0;
        for (let c = 0; c <= cols; c++) {
          const x = -1.6 + (3.2 * c) / cols;
          const sx = w / 2 + (x * spread) / z;
          let sy = baseY - (height(x, worldZ) * amp) / z;
          if (mouse.k > 0.01) {
            const d2 = (sx - mouse.x) ** 2 + (baseY - mouse.y) ** 2;
            const lift = Math.exp(-d2 / (2 * R * R)) * mouse.k;
            sy -= (lift * 18) / Math.sqrt(z);
            lit = Math.max(lit, lift);
          }
          if (c === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.lineTo(w + 20, h + 20);
        ctx.lineTo(-20, h + 20);
        ctx.closePath();
        ctx.fillStyle = BG;
        ctx.fill();

        const fadeIn = Math.min(1, (lines - depth) / 4); // new ridges appear softly at the back
        const col = FAR.map((f, k) => Math.round(f + (NEAR[k] - f) * p)).join(",");
        const a = (0.035 + 0.075 * p * p + lit * 0.03) * fadeIn;
        // Quieter in the middle, where the links sit
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${col}, ${a.toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(${col}, ${(a * 0.35).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${col}, ${a.toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7 + p * 0.4;
        ctx.stroke();
      }

      if (raf) raf = requestAnimationFrame(draw);
    };

    resize();
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [active, bg]);

  return <canvas className={className} ref={ref} aria-hidden="true" />;
}
