/**
 * Calls `update` once per frame while the page scrolls or resizes — but only while `el` is on or near
 * the screen (within `margin`), plus once when it leaves so it settles in its end state.
 * Scroll-linked effects measure layout (getBoundingClientRect…) on every frame; with a dozen of them
 * on a page all running at once, even for sections far off screen, scrolling stuttered. Returns a
 * cleanup function.
 */
export function onScrollNear(el: Element | null | undefined, update: () => void, margin = "50% 0px"): () => void {
  let raf = 0;
  let near = !el; // without an element to watch, behave like a plain scroll listener
  const run = () => {
    raf = 0;
    update();
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(run);
  };
  const onScroll = () => {
    if (near) request();
  };
  const io = el
    ? new IntersectionObserver(
        ([entry]) => {
          near = entry.isIntersecting;
          request(); // entering: catch up; leaving: settle at the end state
        },
        { rootMargin: margin },
      )
    : null;
  if (el) io?.observe(el);
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", request);
  return () => {
    io?.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", request);
    cancelAnimationFrame(raf);
  };
}
