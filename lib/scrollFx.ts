/**
 * Scroll-linked "transform on view" effect, matching Framer's Scroll → Transform (trigger: "Layer in view")
 * used all over Kudos:
 *   progress = 0 when the element's top meets the viewport bottom, 1 when its bottom meets the viewport bottom
 *   value    = from → identity by progress, smoothed with a spring (stiffness 200, damping 60, mass 1)
 * It is fully scroll-linked, so scrolling back up plays it in reverse — exactly like Kudos.
 * Effects run for everyone, including visitors with the OS "reduce motion" setting on — the site owner
 * reviews on such a machine and expects to see them. Movement is small (≤120px) and spring-damped.
 */

export interface FxFrom {
  x?: number;
  y?: number;
  opacity?: number;
}

interface Channel {
  from: number;
  rest: number;
  value: number;
  velocity: number;
}

interface Item {
  el: HTMLElement;
  x: Channel;
  y: Channel;
  opacity: Channel;
  /** Class added once the element has started to come into view (for CSS-driven child animations) */
  inClass?: string;
}

const STIFFNESS = 200;
const DAMPING = 60;
const MASS = 1;
const STEP = 1 / 240; // fixed sub-step keeps the stiff spring stable at any frame rate

const items = new Map<HTMLElement, Item>();
let frame = 0;
let lastTime = 0;
let listening = false;

const channel = (from: number, rest: number): Channel => ({ from, rest, value: from, velocity: 0 });

/** Parses "y:48;opacity:0" (the data-kfx attribute format). */
export function parseFx(spec: string | undefined): FxFrom {
  const out: FxFrom = {};
  (spec ?? "").split(/[;,]/).forEach((part) => {
    const [k, v] = part.split(":").map((s) => s.trim());
    const n = Number(v);
    if ((k === "x" || k === "y" || k === "opacity") && !Number.isNaN(n)) out[k] = n;
  });
  return out;
}

function progressOf(item: Item, vh: number) {
  const rect = item.el.getBoundingClientRect();
  // Measure the untransformed box: remove the translate we applied ourselves
  const top = rect.top - item.y.value;
  const height = rect.height || 1;
  return Math.min(1, Math.max(0, (vh - top) / height));
}

function stepChannel(c: Channel, target: number, dt: number) {
  let t = dt;
  while (t > 0) {
    const h = Math.min(STEP, t);
    const accel = (-STIFFNESS * (c.value - target) - DAMPING * c.velocity) / MASS;
    c.velocity += accel * h;
    c.value += c.velocity * h;
    t -= h;
  }
  if (Math.abs(c.value - target) < 0.01 && Math.abs(c.velocity) < 0.01) {
    c.value = target;
    c.velocity = 0;
    return true;
  }
  return false;
}

function apply(item: Item) {
  const { el, x, y, opacity } = item;
  el.style.transform = x.value || y.value ? `translate3d(${x.value.toFixed(2)}px, ${y.value.toFixed(2)}px, 0)` : "";
  el.style.opacity = opacity.value === 1 ? "" : opacity.value.toFixed(3);
}

function tick(time: number) {
  frame = 0;
  const dt = lastTime ? Math.min((time - lastTime) / 1000, 1 / 20) : 1 / 60;
  lastTime = time;
  const vh = window.innerHeight;

  // Read all layout first, then write, so the browser never has to re-layout mid-loop
  const targets = Array.from(items.values(), (item) => ({ item, p: progressOf(item, vh) }));

  let moving = false;
  for (const { item, p } of targets) {
    if (item.inClass && p > 0) item.el.classList.add(item.inClass);
    let settled = true;
    for (const c of [item.x, item.y, item.opacity]) {
      if (c.from === c.rest) continue;
      const target = c.from + (c.rest - c.from) * p;
      if (!stepChannel(c, target, dt)) settled = false;
    }
    apply(item);
    if (!settled) moving = true;
  }

  if (moving) frame = requestAnimationFrame(tick);
  else lastTime = 0;
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function unlisten() {
  if (!listening || items.size) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  cancelAnimationFrame(frame);
  frame = 0;
  lastTime = 0;
}

/** Registers an element. Returns a cleanup that restores its inline styles. */
export function registerFx(el: HTMLElement, from: FxFrom, inClass?: string): () => void {
  listen();
  const item: Item = {
    el,
    x: channel(from.x ?? 0, 0),
    y: channel(from.y ?? 0, 0),
    opacity: channel(from.opacity ?? 1, 1),
    inClass,
  };
  items.set(el, item);

  // Start already at the value for the current scroll position (no jump on load)
  const p = progressOf(item, window.innerHeight);
  for (const c of [item.x, item.y, item.opacity]) c.value = c.from + (c.rest - c.from) * p;
  apply(item);
  if (inClass && p > 0) el.classList.add(inClass);
  schedule();

  return () => {
    items.delete(el);
    el.style.transform = "";
    el.style.opacity = "";
    unlisten();
  };
}
