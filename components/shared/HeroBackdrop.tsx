"use client";

import { useEffect, useRef } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Quiet animated backdrop for the dark page heroes (services listing + service detail), in the same
 * dotted family as the About hero but calmer: a dot matrix that slow light waves roll over, a particle
 * wave along the bottom and a few rising sparkles. Dots near the pointer brighten slightly.
 * Also (like the About hero):
 *  - writes --hp (0…1, how far the page body has slid over the pinned hero) on the hero section
 *  - hides the site's dashed column guides over the hero
 * Draws only while the hero is visible and the tab is open, capped at 30fps.
 */
export default function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const MAX_A = 0.4;
    const shades = Array.from({ length: 21 }, (_, i) => `rgba(165, 185, 255, ${((i / 20) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(20, Math.round((a / MAX_A) * 20)))];

    let w = 0, h = 0, small = false;
    let raf = 0, last = 0, t = 0, inView = true;
    let tx = 0.5, ty = 0.5, mx = 0.5, my = 0.5, hasPointer = false;
    let sparks: { x: number; y: number; v: number; p: number }[] = [];

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 1200;
      sparks = Array.from({ length: small ? 24 : 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: 5 + Math.random() * 10,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      ctx.clearRect(0, 0, w, h);

      // Dot matrix with rolling light waves
      const gap = small ? 24 : 30;
      const px = mx * w;
      const py = my * h;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const wv = Math.sin(x * 0.005 - y * 0.004 - t * 2.2) * 0.5 + Math.sin(x * 0.009 + y * 0.006 + t * 1.4) * 0.5;
          const near = hasPointer ? Math.max(0, 1 - Math.hypot(x - px, y - py) / 240) : 0;
          const a = 0.025 + Math.max(0, wv) * 0.07 + near * 0.06;
          ctx.fillStyle = shade(a);
          const size = 1.1 + Math.max(0, wv) * 0.4;
          ctx.fillRect(x, y, size, size);
        }
      }

      // Particle wave along the bottom
      const cols = small ? 44 : 90;
      const rows = small ? 12 : 18;
      for (let r = 0; r < rows; r++) {
        const z = r / (rows - 1);
        const baseY = h * 0.62 + z * z * h * 0.34;
        const spread = w * (1.1 + z * 0.9);
        const amp = 8 + z * 34;
        const size = 1 + z * 1.4;
        for (let c = 0; c < cols; c++) {
          const x = c / (cols - 1) - 0.5;
          const wave = Math.sin(x * 6 - t * 2 + z * 3) * 0.6 + Math.sin(x * 2.4 + t * 1.2 + z * 5) * 0.4;
          const alpha = (0.025 + z * 0.12) * (0.5 + 0.5 * wave);
          if (alpha < 0.02) continue;
          ctx.fillStyle = shade(alpha);
          ctx.fillRect(w / 2 + x * spread, baseY + wave * amp, size, size);
        }
      }

      // Rising sparkles
      for (const sp of sparks) {
        sp.y -= sp.v * dt * 0.001;
        if (sp.y < -4) {
          sp.y = h + 4;
          sp.x = Math.random() * w;
        }
        ctx.fillStyle = shade(0.04 + 0.1 * (0.5 + 0.5 * Math.sin(t * 6 + sp.p)));
        ctx.fillRect(sp.x, sp.y, 1.6, 1.6);
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

    // --hp drives the copy easing up as the body slides over the pinned hero
    let hpRaf = 0;
    const updateHp = () => {
      hpRaf = 0;
      // The hero is the first thing on the page, so scrollY is how far the body has slid over it
      hero.style.setProperty("--hp", clamp01(window.scrollY / (hero.offsetHeight || 1)).toFixed(4));
    };
    const onScroll = () => {
      const next = window.scrollY < hero.offsetHeight;
      if (next !== inView) {
        inView = next;
        if (inView) start();
        else stop();
      }
      if (!hpRaf) hpRaf = requestAnimationFrame(updateHp);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = clamp01((e.clientX - r.left) / r.width);
      ty = clamp01((e.clientY - r.top) / r.height);
      hasPointer = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    hero.addEventListener("pointermove", onMove);
    onScroll();
    start();

    // Hide the dashed column guides over the hero so no lines cross the backdrop
    const guides = document.querySelector<HTMLElement>(".k-guides");
    const maskGuides = () => {
      // A pinned hero taller than the screen sticks with a negative top, so its bottom is seen first
      hero.style.top = getComputedStyle(hero).position === "sticky" ? `${Math.min(0, window.innerHeight - hero.offsetHeight)}px` : "";
      if (!guides) return;
      const mask = `linear-gradient(to bottom, transparent ${hero.offsetHeight}px, #000 ${hero.offsetHeight}px)`;
      guides.style.setProperty("-webkit-mask-image", mask);
      guides.style.setProperty("mask-image", mask);
    };
    maskGuides();
    const heroRo = new ResizeObserver(maskGuides);
    heroRo.observe(hero);
    window.addEventListener("resize", maskGuides);

    return () => {
      stop();
      cancelAnimationFrame(hpRaf);
      ro.disconnect();
      heroRo.disconnect();
      window.removeEventListener("resize", maskGuides);
      hero.style.top = "";
      guides?.style.removeProperty("-webkit-mask-image");
      guides?.style.removeProperty("mask-image");
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      hero.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="hb-bg" aria-hidden="true">
      <canvas className="hb-canvas" ref={canvasRef} />
      <span className="hb-glow hb-glow-a" />
      <span className="hb-glow hb-glow-b" />
    </div>
  );
}
