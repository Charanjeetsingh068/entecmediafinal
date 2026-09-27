/**
 * The home-page wave video comes in two cuts, both made from the 4K master (kept in git history):
 * - homebanner.mp4 — 1920×1080 landscape, ~1.2 MB (desktops, laptops, landscape tablets)
 * - homebanner-mobile.mp4 — 720×1280 portrait crop, ~0.5 MB (phones and portrait tablets), so tall
 *   screens get a sharp picture instead of a stretched landscape one, at less than half the size.
 * The hero and the "Why choose us" card use the same pick, so the second one plays from the cache.
 */
export function bannerVideoSrc(): string {
  const portrait = window.matchMedia("(orientation: portrait) and (max-width: 1199px)").matches;
  return portrait ? "/images/homebanner-mobile.mp4" : "/images/homebanner.mp4";
}
