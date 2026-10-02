"use client";

import { useEffect, type RefObject } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Shows the screenshot at progress p (0 = top of the page, 1 = bottom) and updates the % pill. */
function setShot(frame: HTMLElement, img: HTMLElement, p: number) {
  const travel = Math.max(0, img.offsetHeight - frame.clientHeight);
  img.style.transform = `translate3d(0, ${(-p * travel).toFixed(1)}px, 0)`;
  frame.style.setProperty("--ssp", p.toFixed(4));
  const pct = frame.querySelector<HTMLElement>(".hs-pct");
  const label = `${Math.round(p * 100)}%`;
  if (pct && pct.textContent !== label) pct.textContent = label;
}

/**
 * Website screenshots that scroll on hover, like the home page's Featured projects: every `.hs-frame`
 * under `root` holding an `img.hs-img`. Frames whose image is taller than the frame get `data-long`
 * (the CSS shows the "Hover to scroll · 0%" pill only then). Mouse: hovering scrolls the screenshot to
 * the bottom at a steady reading speed (~420px/s), leaving scrolls it back three times faster.
 * Touch (when `touchScroll` is on): the screenshot scrolls with the page as the frame crosses the screen.
 * `deps` re-binds the frames after the list changes (filters, pages).
 */
export function useHoverScroll(root: RefObject<HTMLElement | null>, deps: unknown[] = [], touchScroll = false) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const frames = Array.from(el.querySelectorAll<HTMLElement>(".hs-frame"));
    const pairs = frames
      .map((frame) => ({ frame, img: frame.querySelector<HTMLImageElement>(".hs-img") }))
      .filter((x): x is { frame: HTMLElement; img: HTMLImageElement } => !!x.img);

    const measure = () =>
      pairs.forEach(({ frame, img }) => {
        if (!img.offsetHeight) return;
        frame.toggleAttribute("data-long", img.offsetHeight - frame.clientHeight > 8);
      });
    measure();
    pairs.forEach(({ img }) => img.addEventListener("load", measure));
    const ro = new ResizeObserver(measure);
    pairs.forEach(({ frame }) => ro.observe(frame));

    const offs: Array<() => void> = [];
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (mouse) {
      pairs.forEach(({ frame, img }) => {
        let p = 0, target = 0, raf = 0, last = 0;
        const tick = (now: number) => {
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
          last = now;
          const travel = Math.max(1, img.offsetHeight - frame.clientHeight);
          const step = ((target > p ? 420 : 1260) / travel) * dt;
          p = target > p ? Math.min(target, p + step) : Math.max(target, p - step);
          const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          setShot(frame, img, eased);
          raf = p === target ? 0 : requestAnimationFrame(tick);
          if (!raf) last = 0;
        };
        const go = (t: number) => {
          if (!frame.hasAttribute("data-long")) return;
          target = t;
          if (!raf) raf = requestAnimationFrame(tick);
        };
        // The whole card (or block) the frame sits in counts as the hover area
        const area = frame.closest<HTMLElement>("[data-hs-area]") ?? frame;
        const on = () => go(1);
        const off = () => go(0);
        area.addEventListener("pointerenter", on);
        area.addEventListener("pointerleave", off);
        offs.push(() => {
          area.removeEventListener("pointerenter", on);
          area.removeEventListener("pointerleave", off);
          cancelAnimationFrame(raf);
        });
      });
    } else if (touchScroll) {
      let raf = 0;
      const update = () => {
        raf = 0;
        const vh = window.innerHeight;
        pairs.forEach(({ frame, img }) => {
          if (!frame.hasAttribute("data-long")) return;
          const r = frame.getBoundingClientRect();
          setShot(frame, img, clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        });
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      offs.push(() => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      });
    }

    return () => {
      pairs.forEach(({ img }) => img.removeEventListener("load", measure));
      ro.disconnect();
      offs.forEach((off) => off());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, touchScroll, ...deps]);
}
